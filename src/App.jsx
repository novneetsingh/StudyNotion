import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Common/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Error from "./pages/Error";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/Common/PrivateRoute";
import MyProfile from "./components/core/Dashborad/MyProfile";
import Settings from "./components/core/Dashborad/Settings/Settings";
import { ACCOUNT_TYPE } from "./utils/constants";
import { useDispatch, useSelector } from "react-redux";
import StudentEnrolledCourses from "./components/core/Dashborad/StudentEnrolledCourses";
import AddCourse from "./components/core/Dashborad/AddCourse/AddCourse";
import MyCourses from "./components/core/Dashborad/MyCourses";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import axios from "axios";
import { setUser } from "./redux-toolkit/slices/profileSlice";
import { logout } from "./utils/Logout";
import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import UserNotes from "./components/core/Dashborad/UserNotes";
import JobSupport from "./components/core/Dashborad/JobSupport";
import ChatBot from "./components/core/Dashborad/ChatBot";
import FloatingChatBot from "./components/Common/FloatingChatBot";

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/profile/getUserDetails`,
          {
            withCredentials: true,
          }
        );

        dispatch(setUser(res.data.data));
      } catch (error) {
        dispatch(logout(navigate));
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-richblack-900">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-richblack-900 font-poppins">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="catalog/:catalogName" element={<Catalog />} />

        <Route path="courses/:courseId" element={<CourseDetails />} />

        {/* Open routes accessible to everyone */}
        <Route
          path="/signup"
          element={user ? <Navigate to="/dashboard/my-profile" /> : <Signup />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard/my-profile" /> : <Login />}
        />

        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          {/* Route for all users */}
          <Route path="dashboard/my-profile" element={<MyProfile />} />

          <Route path="dashboard/Settings" element={<Settings />} />

          {/* Route only for Instructors */}
          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="dashboard/my-courses" element={<MyCourses />} />

              <Route path="dashboard/add-course" element={<AddCourse />} />
            </>
          )}

          {/* Route only for Students */}
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="dashboard/enrolled-courses"
                element={<StudentEnrolledCourses />}
              />

              <Route path="dashboard/my-notes" element={<UserNotes />} />

              <Route path="dashboard/job-support" element={<JobSupport />} />

              <Route path="dashboard/chatbot" element={<ChatBot />} />
            </>
          )}
        </Route>

        <Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="view-course/:courseId/lecture/:lectureId"
                element={<VideoDetails />}
              />
            </>
          )}
        </Route>

        <Route path="*" element={<Error />} />
      </Routes>

      {user ? <FloatingChatBot /> : null}
    </div>
  );
};

export default App;
