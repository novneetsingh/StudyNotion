const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const crypto = require("crypto");

// Capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide Course ID" });
    }

    const courseDetails = await Course.findById(courseId);

    if (!courseDetails) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Configure payment options
    const options = {
      amount: courseDetails.price * 100, // Amount in smallest currency unit (e.g., paise for INR)
      currency: "INR",
    };

    // Initiate the payment using Razorpay
    const paymentResponse = await instance.orders.create(options);

    // Send success response with payment data
    res.status(200).json({
      success: true,
      data: paymentResponse,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Could not initiate order." });
  }
};

// Verify the payment and enroll the user in course
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
    } = req.body;

    const userId = req.user.id;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !courseId
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment information",
      });
    }

    // Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    }

    // Enroll user in the course
    // 1. Add student to course's studentsEnrolled array
    await Course.findByIdAndUpdate(courseId, {
      $push: { studentsEnrolled: userId },
    });

    // 2. Add course to user's courses array
    await User.findByIdAndUpdate(userId, { $push: { courses: courseId } });

    // Send success response
    res.status(200).json({
      success: true,
      message: "Payment verified and course enrolled successfully",
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      success: false,
      message: " Enrollment failed",
    });
  }
};
