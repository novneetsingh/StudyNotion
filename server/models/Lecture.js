const mongoose = require("mongoose");

// Define the Section schema
const lectureSchema = new mongoose.Schema({
  title: { type: String },
  timeDuration: { type: String },
  videoUrl: { type: String },
});

// Export the Section model
module.exports = mongoose.model("Lecture", lectureSchema);
