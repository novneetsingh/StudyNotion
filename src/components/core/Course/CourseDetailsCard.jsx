import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function CourseDetailsCard({ course, handleBuyCourse }) {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  const { thumbnail, price, studentsEnrolled, courseName } = course;

  // Check if the user is enrolled in the course
  const isEnrolled = user && studentsEnrolled.includes(user._id);

  return (
    <div className="flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5">
      {/* Course Image */}
      <img
        src={thumbnail}
        alt={courseName}
        className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
      />
      <div className="px-4">
        <div className="space-x-3 pb-4 text-3xl font-semibold">Rs. {price}</div>
        <div className="flex flex-col gap-4">
          <button
            className="yellowButton"
            onClick={
              isEnrolled
                ? () => navigate("/dashboard/enrolled-courses")
                : handleBuyCourse
            }
          >
            {isEnrolled ? "Go To Course" : "Buy Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CourseDetailsCard;
