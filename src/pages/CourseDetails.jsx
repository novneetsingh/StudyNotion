import React, { useEffect, useState } from "react";
import { BiInfoCircle } from "react-icons/bi";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmationModal from "../components/Common/ConfirmationModal";
import Footer from "../components/Common/Footer";
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard";
import { formatDate } from "../utils/formatDate";
import axios from "axios";
import { buyCourse } from "../services/coursePayment";
import { toast } from "react-hot-toast";
import { ACCOUNT_TYPE } from "../utils/constants";
import CourseContent from "../components/Common/CourseContent";

function CourseDetails() {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  // Get courseId from URL parameters
  const { courseId } = useParams();

  // State to store course details and manage confirmation modal
  const [course, setCourse] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);

  useEffect(() => {
    // Fetch course details when courseId changes
    const fetchDetails = async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/course/getCourseDetails/${courseId}`
        );

        setCourse(res.data.data);
      } catch (error) {
        console.log("Could not fetch Course Details", error);
        toast.error("Could not fetch Course Details");
      }
    };

    fetchDetails();
  }, [courseId]);

  // Handle course purchase
  const handleBuyCourse = () => {
    if (user) {
      // if user is instructor
      if (user.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
        toast.error("Instructors cannot purchase courses");
        return;
      }

      buyCourse(courseId, user, navigate);
    } else {
      setConfirmationModal({
        text1: "You are not logged in!",
        text2: "Please login to purchase the course.",
        btn1Text: "Login",
        btn2Text: "Cancel",
        btn1Handler: () => navigate("/login"),
        btn2Handler: () => setConfirmationModal(null),
      });
    }
  };

  // Handle loading states
  if (!course) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  // Destructure course details
  const {
    courseName,
    courseDescription,
    price,
    instructor,
    studentsEnrolled,
    createdAt,
  } = course;

  return (
    <>
      <div className="relative w-full bg-richblack-800">
        {/* Hero Section */}
        <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative">
          <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
            <div className="z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5">
              <div>
                <p className="text-3xl font-semibold text-richblack-5">
                  {courseName}
                </p>
              </div>
              <p className="text-richblack-200">{courseDescription}</p>
              <div className="text-md flex flex-wrap items-center gap-2">
                <span>{`Students Enrolled : ${studentsEnrolled.length}`}</span>
              </div>
              <div>
                <p>
                  Created By {`${instructor.firstName} ${instructor.lastName}`}
                </p>
              </div>
              <div className="flex flex-wrap gap-5 text-lg">
                <p className="flex items-center gap-2">
                  <BiInfoCircle /> Created at {formatDate(createdAt)}
                </p>
                <p className="flex items-center gap-2">
                  <HiOutlineGlobeAlt /> English
                </p>
              </div>
            </div>
            <div className="flex w-full flex-col gap-4 border-y border-y-richblack-500 py-4 lg:hidden">
              <p className="space-x-3 pb-4 text-3xl font-semibold text-richblack-5">
                Rs. {price}
              </p>
              <button className="yellowButton" onClick={handleBuyCourse}>
                Buy Now
              </button>
            </div>
          </div>

          {/* Course Details Card */}
          <div className="right-[1rem] top-[120px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute lg:block">
            <CourseDetailsCard
              course={course}
              setConfirmationModal={setConfirmationModal}
              handleBuyCourse={handleBuyCourse}
            />
          </div>
        </div>
      </div>
      <div className="mx-auto box-content px-4 py-20 text-start text-richblack-5 lg:w-[1260px]"></div>

      {/* Course Content */}
      <CourseContent />

      <Footer />

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}

export default CourseDetails;
