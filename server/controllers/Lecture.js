const Course = require("../models/Course");
const Lecture = require("../models/Lecture");
const { uploadToCloudinary } = require("../utils/CloudinaryUploader");

// Create a new lecture and add it to a course
exports.createLecture = async (req, res) => {
  try {
    // Extract necessary information from the request body
    const { title, courseId } = req.body;
    const video = req.files.video;

    // Check if all necessary fields are provided
    if (!title || !video || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Title, Video file, and Course ID are required",
      });
    }

    // Upload the video file to Cloudinary
    const uploadDetails = await uploadToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    // Create a new lecture with the necessary information
    const newLecture = await Lecture.create({
      title: title,
      timeDuration: uploadDetails.duration,
      videoUrl: uploadDetails.secure_url,
    });

    // Add the lecture to the course's courseContent array
    await Course.findByIdAndUpdate(
      courseId,
      { $push: { courseContent: newLecture._id } },
      { new: true }
    ).populate("courseContent");

    // Return the updated course data along with the created lecture
    return res.status(200).json({
      success: true,
      message: "Lecture created and added to the course successfully",
    });
  } catch (error) {
    // Handle any errors that may occur during the process
    console.error("Error creating new lecture:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
