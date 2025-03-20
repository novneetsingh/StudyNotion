const express = require("express");
const router = express.Router();

// controllers
const { getAllJobs } = require("../controllers/Job");

// middlewares
const { auth, isStudent } = require("../middlewares/auth");

router.get("/", auth, isStudent, getAllJobs);

module.exports = router;
