const express = require("express");

const router = express.Router();

// import middlewares
const { auth } = require("../middlewares/auth");

// Importing controller function from notesController
const {
  getAllUsersNotes,
  createNote,
  updateNote,
  deleteNote,
} = require("../controllers/Notes");

// Defining routes

// get all user notes
router.get("/all-notes", auth, getAllUsersNotes);

// create a note
router.post("/create-note", auth, createNote);

// update a note
router.put("/update-note/:id", auth, updateNote);

// delete a note
router.delete("/delete-note/:id", auth, deleteNote);

module.exports = router;
