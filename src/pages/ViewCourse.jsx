import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar";
import {
  setCourseContent,
  setCourseName,
} from "../redux-toolkit/slices/viewCourseSlice";
import axios from "axios";

export default function ViewCourse() {
  // Get the courseId from the URL parameters
  const { courseId } = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
    // Function to fetch course details
    const fetchCourseDetails = async () => {
      try {
        const res = await axios.get(`/course/getFullCourseDetails/${courseId}`);

        dispatch(setCourseContent(res.data.data.courseContent));
        dispatch(setCourseName(res.data.data.courseName));
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)]">
      <VideoDetailsSidebar />
      <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
        <div className="mx-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
