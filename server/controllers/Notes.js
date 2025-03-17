const User = require("../models/User");
const Note = require("../models/Note");
const { uploadToCloudinary } = require("../utils/cloudinaryUploader");

// create a note for a user
exports.createNote = async (req, res) => {
  try {
    const { title, transcribedText } = req.body;

    const { audio } = req.files;

    const user = await User.findById(req.user.id);

    if (!title || !audio || !transcribedText) {
      return res
        .status(400)
        .json({ message: "Please provide title, audio, and transcribedText" });
    }

    // upload audio to cloudinary
    const audioFile = await uploadToCloudinary(audio, process.env.FOLDER_NAME);

    const newNote = await Note.create({
      user: req.user.id,
      title,
      audio: audioFile.secure_url,
      transcribedText,
    });

    // add note to user's notes array
    user.notes.push(newNote._id);

    await user.save();

    res.status(201).json({
      message: "Note created successfully",
      newNote,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// fetch all current notes user notes
exports.getAllUsersNotes = async (req, res) => {
  try {
    const userId = req.user.id;

    // find all notes of user and sort them by createdAt in descending order
    const user = await User.findById(userId).populate("notes").sort({
      createdAt: -1,
    });

    res.status(200).json({
      message: "Notes fetched successfully",
      notes: user.notes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update a note
exports.updateNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const { title, content } = req.body;

    let note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (title) note.title = title;

    if (content) note.content = content;

    if (req.files?.images) {
      const images = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      // Create an empty array to store image URLs
      let imageUrls = [];

      // Upload each image to Cloudinary
      for (let i = 0; i < images.length; i++) {
        const result = await uploadToCloudinary(
          images[i],
          process.env.FOLDER_NAME
        );

        imageUrls.push(result.secure_url); // Push the image URL to the array
      }

      // Update the note.images field
      note.images = [...note.images, ...imageUrls];
    }

    // Save the updated note
    await note.save();

    res.status(200).json({
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete a note
exports.deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;

    if (!noteId) {
      return res.status(404).json({ message: "Note not found" });
    }

    // find note and delete
    await Note.findByIdAndDelete(noteId);

    // also delete note from user's notes array
    await User.updateOne({ _id: req.user.id }, { $pull: { notes: noteId } });

    res.status(200).json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
