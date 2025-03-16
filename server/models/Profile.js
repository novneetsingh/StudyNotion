const mongoose = require("mongoose");

// Define the Profile schema
const profileSchema = new mongoose.Schema({
  gender: {
    type: String,
    default: "",
  },
  dateOfBirth: {
    type: String,
    default: "",
  },
  about: {
    type: String,
    default: "",
  },
  contactNumber: {
    type: Number,
  },
});

// Export the Profile model
module.exports = mongoose.model("Profile", profileSchema);
