const express = require("express");
const app = express();
require("dotenv").config(); // Load environment variables from .env file
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const http = require("http");
const server = http.createServer(app);
const helmet = require("helmet");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss");

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

// Middleware to secure the headers
app.use(helmet());

// Middleware to prevent parameter pollution
app.use(hpp());

// Middleware to sanitize the data
app.use((req, res, next) => {
  req.body = mongoSanitize.sanitize(req.body); // Sanitize only req.body
  next();
});

// Middleware to sanitize the data from xss attacks
app.use((req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      req.body[key] = xss(req.body[key]); // Sanitizing each body field
    }
  }

  if (req.query) {
    for (const key in req.query) {
      req.query[key] = xss(req.query[key]); // Sanitizing each query param
    }
  }

  next();
});

// Middleware to limit the number of requests
app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);

require("./config/database").dbconnect(); // Connect to database
require("./config/cloudinary").cloudinaryConnect(); // Connect to cloudinary
require("./utils/jobScrapper").jobScraper(); // Connect to job scraper
require("./utils/socket").initializeSocket(server); // Initialize socket

// Route setup
app.use("/auth", userRoutes); // User authentication routes
app.use("/profile", profileRoutes); // User profile routes
app.use("/course", courseRoutes); // Course routes
app.use("/payment", paymentRoutes); // Payment routes
app.use("/notes", notesRoutes); // Notes routes
app.use("/jobs", jobRoutes); // Job routes

// Default route
app.get("/", (req, res) => {
  res.send("<h1>Hello from StudyNotion Api</h1>");
});

// Activate server
server.listen(PORT, () => {
  console.log("Server is running on port", PORT); // Log server activation
});
