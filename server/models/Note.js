const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String, // For text notes OR audio transcriptions
    },
    audio: {
      type: String, // Cloudinary URL for audio message
    },
    transcribedText: {
      type: String, // Store transcribed text separately
    },
    images: {
      type: [String], // Array of Cloudinary URLs for image files
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("Note", noteSchema);
