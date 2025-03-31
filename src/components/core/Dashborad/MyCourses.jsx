import { useEffect } from "react";
import CoursesTable from "./InstructorCourses/CoursesTable";
import axios from "axios";
import { setLoading } from "../../../redux-toolkit/slices/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import { setUserCourses } from "../../../redux-toolkit/slices/viewCourseSlice";

export default function MyCourses() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.profile);
  const { userCourses } = useSelector((state) => state.viewCourse);

  // Fetch the instructor's courses when the component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      // check if data is already present in the store
      if (userCourses.length > 0) return;

      try {
        dispatch(setLoading(true));
        const res = await axios.get(`/course/getInstructorCourses`);

        dispatch(setUserCourses(res.data.data));
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
      {userCourses && <CoursesTable />}
    </>
  );
}
