const express = require("express");
const app = express();
require("dotenv").config(); // Load environment variables from .env file
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

// Import routes
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payments");
const notesRoutes = require("./routes/Notes");
const jobRoutes = require("./routes/Job");

// Define port number
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(cookieParser()); // Parse cookies
app.use(express.json()); // Parse JSON requests

// Enable CORS for all routes with credentials
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// File upload middleware setup
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/", // Temporary directory for file uploads
  })
);

require("./config/database").dbconnect(); // Connect to database
require("./config/cloudinary").cloudinaryConnect(); // Connect to cloudinary
require("./utils/jobScrapper").jobScraper(); // Connect to job scraper

// Route setup
app.use("/auth", userRoutes); // User authentication routes
app.use("/profile", profileRoutes); // User profile routes
app.use("/course", courseRoutes); // Course routes
app.use("/payment", paymentRoutes); // Payment routes
app.use("/notes", notesRoutes); // Notes routes
app.use("/jobs", jobRoutes); // Job routes

// Default route
app.get("/", (req, res) => {
  res.send("<h1>Hello Hi Bye</h1>"); // Simple response for root route
});

// Activate server
app.listen(PORT, () => {
  console.log("Server is running on port", PORT); // Log server activation
});
