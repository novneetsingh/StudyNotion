import { useEffect, useState } from "react";
import CoursesTable from "./InstructorCourses/CoursesTable";
import axios from "axios";
import { setLoading } from "../../../redux-toolkit/slices/profileSlice";
import { useDispatch, useSelector } from "react-redux";

export default function MyCourses() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.profile);

  // State to store the list of courses
  const [courses, setCourses] = useState([]);

  // Fetch the instructor's courses when the component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        dispatch(setLoading(true));
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/course/getInstructorCourses`,
          {
            withCredentials: true,
          }
        );

        setCourses(res.data.data);
      } catch (error) {
        console.log("Could not fetch Courses.", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-richblack-900">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {/* Header section with title and Add Course button */}
      <div className="mb-14 flex items-center justify-between">
        <h1 className="text-3xl font-medium text-richblack-5">My Courses</h1>
      </div>
      {courses && <CoursesTable courses={courses} setCourses={setCourses} />}
    </>
  );
}
