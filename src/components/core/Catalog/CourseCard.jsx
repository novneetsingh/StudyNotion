import React from "react";
import { Link } from "react-router-dom";

function CourseCard({ course }) {
  return (
    <Link to={`/courses/${course._id}`} className="group">
      <div className="rounded-lg overflow-hidden shadow-lg bg-richblack-700 transform transition duration-300 hover:scale-105 hover:shadow-2xl max-w-xs mx-auto">
        {/* Course thumbnail */}
        <div className="relative h-48 w-full">
          <img
            src={course?.thumbnail}
            alt="course thumbnail"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-25 transition-opacity duration-300 group-hover:bg-opacity-0"></div>
        </div>
        {/* Course details */}
        <div className="p-4">
          {/* Course title */}
          <h3 className="text-lg font-semibold text-richblack-5 mb-2 truncate">
            {course?.courseName}
          </h3>
          {/* Instructor name */}
          <p className="text-sm text-richblack-50 mb-2">
            {course?.instructor?.firstName} {course?.instructor?.lastName}
          </p>
          {/* Course price */}
          <p className="text-lg font-semibold text-yellow-500">
            Rs. {course?.price}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default CourseCard;
