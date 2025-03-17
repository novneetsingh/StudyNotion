const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String, // For text notes OR audio transcriptions
    trim: true,
  },
  audio: {
    type: String, // Cloudinary URL for audio message
  },
  transcribedText: {
    type: String, // Store transcribed text separately
    trim: true,
  },
  images: {
    type: [String], // Array of Cloudinary URLs for image files
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Note", noteSchema);
