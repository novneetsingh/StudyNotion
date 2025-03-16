const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const { uploadToCloudinary } = require("../utils/CloudinaryUploader");
const Lecture = require("../models/Lecture");

// Function to create a new course
exports.createCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseName, courseDescription, price, category } = req.body;

    // Handle file upload; assuming `req.files` contains the uploaded files
    const thumbnail = req.files?.thumbnailImage;

    // Check for missing or invalid fields
    if (
      !courseName ||
      !courseDescription ||
      !price ||
      !category ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      });
    }

    // Check if the category exists
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      });
    }

    // Upload the Thumbnail to Cloudinary
    const thumbnailImage = await uploadToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // Create a new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: userId,
      price,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    // Add the new course to the instructor's courses
    await User.findByIdAndUpdate(userId, { $push: { courses: newCourse._id } });

    // Add the new course to the category
    await Category.findByIdAndUpdate(category, {
      $push: { courses: newCourse._id },
    });

    res.status(200).json({
      success: true,
      data: newCourse,
      message: "Course Created Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

// Function to get the details of a course
exports.getCourseDetails = async (req, res) => {
  try {
    // Extract courseId from the request body
    const { courseId } = req.params;

    // Find the course details by courseId
    const courseDetails = await Course.findById(courseId)
      // Populate instructor details and nested additionalDetails
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      });

    // If course details are not found, return an error response
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
    }

    // Send success response with course details and total duration
    return res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (error) {
    // If an error occurs during execution, send error response
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Function to get the full details of a course
exports.getFullCourseDetails = async (req, res) => {
  try {
    // Extract the courseId from the request body and userId from the request user object
    const { courseId } = req.params;

    // Fetch course details from the database, populating necessary fields
    const courseDetails = await Course.findOne({ _id: courseId }).populate(
      "courseContent"
    ); // Populate course content with lectures

    // If no course details are found, return an error response
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
    }

    // Return the course details and total duration in the response
    return res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (error) {
    // Catch and return any errors that occur during the process
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id;

    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 });

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
    });
  }
};

// Delete the Course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Perform all updates and deletions in parallel
    await Promise.all([
      // Unenroll all students at once
      User.updateMany(
        { _id: { $in: course.studentsEnrolled } },
        { $pull: { courses: courseId } }
      ),

      // Remove course from category
      Category.findByIdAndUpdate(course.category, {
        $pull: { courses: courseId },
      }),

      // Remove course from instructor
      User.findByIdAndUpdate(course.instructor, {
        $pull: { courses: courseId },
      }),

      // Delete all lectures at once
      Lecture.deleteMany({ _id: { $in: course.courseContent } }),

      // Delete the course
      Course.findByIdAndDelete(courseId),
    ]);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Could not delete course",
    });
  }
};
