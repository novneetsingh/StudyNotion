const express = require("express");
const router = express.Router();

// Import controllers and middleware functions
const {
  login,
  signUp,
  sendOTP,
  changePassword,
  logout,
} = require("../controllers/Auth");
const { auth } = require("../middlewares/auth");

// Authentication Routes
router.post("/login", login); // User login route
router.post("/signup", signUp); // User signup route
router.post("/sendotp", sendOTP); // Route for sending OTP to user's email
router.put("/changepassword", auth, changePassword); // Route for changing password
router.post("/logout", logout); // Route for user logout

module.exports = router;
