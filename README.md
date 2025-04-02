# StudyNotion - Learning Management System

## Live Demo

[StudyNotion](https://studynotion-2agy.onrender.com)

## GitHub Repository

[GitHub Repo](https://github.com/novneetsingh/StudyNotion)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Routes](#api-routes)
- [Installation and Setup](#installation-and-setup)
- [Future Enhancements](#future-enhancements)

## Overview

StudyNotion is a full-fledged Learning Management System (LMS) designed to connect instructors and students. It enables seamless course creation, enrollment, content consumption, payments, and job support. The platform offers role-specific functionalities with dedicated dashboards for students and instructors.

## Features

### For Students

- **User Authentication**: Register, login, and manage profiles.
- **Course Discovery**: Browse courses by category and use search functionality.
- **Course Enrollment**: Purchase courses via an integrated payment gateway.
- **Learning Environment**: Watch video lectures, take notes, and track progress.
- **Notes Management**: Create, edit, and delete personal voice notes which contain transcribed text of voice audio files, notes content, and images.
- **Job Support**: Access job listings scraped from various platforms (updated every 12 hours via Node Cron).
- **AI Chat Assistant**: Ask questions related to text, images, and PDFs for instant assistance.

### For Instructors

- **Course Management**: Create, edit, and delete courses.
- **Content Upload**: Add lectures, videos, and course materials.

### General Features

- **Secure Authentication**: Cookie-based session management with 1-hour expiration.
- **AI Chat Assistant**: Supports answering questions based on text, images, and PDFs.
- **User Profiles**: Customize profiles with personal information.
- **Real-time Communication**: Uses Socket.io for real time chat through ChatBot.
- **Job Scraping Automation**: Uses Node Cron to update job listings every 12 hours.

## Tech Stack

### Frontend

- **Framework**: React.js
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form
- **API Communication**: Axios
- **Notifications**: React Hot Toast
- **Real-time Communication**: Socket.io Client
- **Animations**: React Type Animation

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, Bcrypt, Cookie-Parser (1-hour session)
- **File Storage**: Cloudinary
- **Payment Processing**: Razorpay
- **Email Service**: Nodemailer
- **Real-time Communication**: Socket.io
- **Web Scraping**: Cheerio, Axios
- **AI Integration**: LangChain with Google GenAI
- **Caching**: Redis
- **Job Scraping Automation**: Node Cron (runs every 12 hours)

## Project Structure

```
StudyNotion/
│
├── src/                  # Frontend source code
│   ├── assets/           # Static assets (images, icons)
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Main application pages
│   ├── redux-toolkit/    # Redux state management
│   ├── services/         # API service functions
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main application component
│   ├── index.css         # Global CSS styles
│   └── main.jsx          # Application entry point
│
├── server/               # Backend source code
│   ├── config/           # Configuration files
│   ├── controllers/      # API controllers
│   ├── middlewares/      # Express middlewares
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── services/         # Backend services
│   ├── utils/            # Utility functions
│   ├── jobScrapper.js    # Automated job scraping script
│   └── index.js          # Server entry point
│
├── public/               # Public assets
├── .env                  # Environment variables
├── package.json          # Project dependencies
└── README.md             # Project documentation
```

## API Routes

### Authentication (`/auth`)

- **POST** `/signup` - Register a new user
- **POST** `/login` - Authenticate user (creates a session cookie with 1-hour expiry)
- **POST** `/sendotp` - Send OTP for verification
- **POST** `/changepassword` - Change account password
- **GET** `/logout` - Clear authentication cookie

### Profile (`/profile`)

- **GET** `/getUserDetails` - Fetch user profile details
- **PUT** `/updateProfile` - Update user profile
- **DELETE** `/deleteAccount` - Delete user account
- **PUT** `/updateDisplayPicture` - Update profile picture

### Course Management (`/course`)

- **POST** `/createCourse` - Create a new course
- **GET** `/getAllCourses` - Fetch all courses
- **GET** `/getCourseDetails/:courseId` - Fetch specific course details
- **POST** `/updateCourse` - Update course details
- **DELETE** `/deleteCourse` - Delete a course
- **POST** `/getEnrolledCourses` - Fetch courses user is enrolled in
- **GET** `/getFullCourseDetails/:courseId` - Fetch complete course content
- **POST** `/createCategory` - Create course category
- **GET** `/showAllCategories` - Fetch all categories
- **GET** `/getCategoryPageDetails/:categoryId` - Fetch category details

### Payment Processing (`/payment`)

- **POST** `/capturePayment` - Process payment
- **POST** `/verifyPayment` - Verify payment status
- **POST** `/sendPaymentSuccessEmail` - Send payment confirmation

### Notes Management (`/notes`)

- **POST** `/createNote` - Create a new voice note
- **GET** `/getNotes` - Fetch user's notes
- **PUT** `/updateNote/:noteId` - Update a note
- **DELETE** `/deleteNote/:noteId` - Delete a note

### Job Listings (`/jobs`)

- **GET** `/getJobs` - Fetch available job listings (updated every 12 hours)

## Installation and Setup

### Prerequisites

- Node.js and npm
- MongoDB
- Cloudinary account
- Razorpay account
- Redis account

### Environment Variables

Create `.env` files in both root and server directories.

#### Root `.env`

```
VITE_BACKEND_URL=http://localhost:3000
```

#### Server `.env`

```
PORT=3000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
MAIL_HOST=your_mail_host
MAIL_USER=your_mail_user
MAIL_PASS=your_mail_password
RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
REDIS_USERNAME=default
REDIS_PASSWORD=your_redis_password
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
GOOGLE_API_KEY=your_google_ai_api_key
```

### Installation Steps

1. Clone the repository
2. Install dependencies (`npm install` for frontend & backend)
3. Start the development server: `npm run start`

## Future Enhancements

- **Mobile App** (Android & iOS)
- **Advanced Analytics** for instructors
- **Community Forums**
- **Multi-language Support**
- **Advanced Assessments (Quizzes, Assignments)**
- **Live Lecture Support**
