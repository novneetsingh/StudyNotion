const express = require("express");
const router = express.Router();

const { auth, isStudent } = require("../middlewares/auth");

const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
} = require("../controllers/profile");

// Profile Routes
router.put("/updateProfile", auth, updateProfile); // Route for updating user profile
router.get("/getUserDetails", auth, getAllUserDetails); // Route for getting user details
router.put("/updateDisplayPicture", auth, updateDisplayPicture); // Route for updating display picture
router.delete("/deleteProfile", auth, deleteAccount); // Route for deleting user account
router.get("/getEnrolledCourses", auth, isStudent, getEnrolledCourses); // Route for getting enrolled courses

module.exports = router; // Export the router for use in the main application
