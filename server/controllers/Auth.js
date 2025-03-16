const bcrypt = require("bcrypt");
const User = require("../models/User");
const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const Profile = require("../models/Profile");

// Send OTP For Email Verification
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user is already present
    const checkUserPresent = await User.findOne({ email });

    // If user found with provided email
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: `User is Already Registered`,
      });
    }

    // create a 4 digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000);

    // Create OTP document in the database
    await OTP.create({ email, otp });

    // send otp to user email
    await mailSender(
      email,
      "Verification Email from StudyNotion",
      `Use this OTP to verify your account:${otp}`
    );

    // Send success response with OTP
    return res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
      otp,
    });
  } catch (error) {
    // Handle errors
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Signup Controller for Registering Users
exports.signUp = async (req, res) => {
  try {
    // Destructure fields from the request body
    const { firstName, lastName, email, password, accountType, otp } = req.body;

    // Check if all required fields are present
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !accountType ||
      !otp
    ) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      });
    }

    // Find the most recent OTP for the email
    const checkOTP = await OTP.findOne({ email: email, otp: otp });

    // Check if there's no recent OTP
    if (!checkOTP) {
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the Additional Profile For User
    const profileDetails = await Profile.create({});

    // Create user record
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    return res.status(200).json({
      success: true,
      user,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    });
  }
};

// Login controller for authenticating users
exports.login = async (req, res) => {
  try {
    // Get email and password from request body
    const { email, password } = req.body;

    // Check if email or password is missing
    if (!email || !password) {
      // Return 400 Bad Request status code with error message
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      });
    }

    // Find user with provided email then populate additional fields and notes fields
    const user = await User.findOne({ email })
      .populate("additionalDetails")
      .populate("notes");

    // If user not found with provided email
    if (!user) {
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us. Please SignUp to Continue`,
      });
    }

    // Compare provided password with hashed password stored in the database
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: `Incorrect Password`,
      });
    }

    // If password matches, generate JWT token
    const token = jwt.sign(
      { id: user._id, accountType: user.accountType }, // payload containing user ID and account type
      process.env.JWT_SECRET, // Secret key for signing JWT token
      {
        expiresIn: "1h", // Token expiration time
      }
    );

    // Save token to user document in database
    user.password = undefined; // Remove password from user object

    // Set options for cookie (optional)
    const options = {
      maxAge: 60 * 60 * 1000, // 1 hour
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Fix for local development
      path: "/", // Cookie path
    };

    // Set cookie for token and return success response
    return res.cookie("token", token, options).status(200).json({
      success: true,
      message: `User Login Success`,
      user,
    });
  } catch (error) {
    // If any error occurs during the process, return error response
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Controller for Changing Password
exports.changePassword = async (req, res) => {
  try {
    // Get user data from req.user
    const userDetails = await User.findById(req.user.id);

    // Get old password, new password, and confirm new password from req.body
    const { oldPassword, newPassword } = req.body;

    // Validate old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );

    if (!isPasswordMatch) {
      // If old password does not match, return a 401 (Unauthorized) error
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" });
    }

    // Update password
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.user.id, { password: encryptedPassword });

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    });
  }
};

// logout controller for logging out users
exports.logout = async (req, res) => {
  try {
    // Clear the token cookie properly
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Must match cookie settings
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/", // Ensures cookie is removed from all routes
    });

    return res.status(200).json({
      success: true,
      message: "User Logged Out Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
