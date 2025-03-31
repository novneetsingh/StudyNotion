import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Table from "rc-table";

export default function StudentEnrolledCourses() {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState(null);

  useEffect(() => {
    const getEnrolledCourses = async () => {
      try {
        const res = await axios.get(`/profile/getEnrolledCourses`);

        setEnrolledCourses(res.data.data);
      } catch (error) {
        console.error("Could not fetch enrolled courses.", error);
      }
    };

    getEnrolledCourses();
  }, []);

  const columns = [
    {
      title: "COURSES",
      dataIndex: "courseName",
      key: "courseName",
      width: 500,
      className:
        "bg-richblack-900 text-richblack-100 px-6 py-4 text-sm font-medium outline outline-richblack-700",
      render: (_, course) => (
        <div
          className="flex items-center gap-4 cursor-pointer"
          onClick={() =>
            navigate(
              `/view-course/${course._id}/lecture/${course.courseContent?.[0]?._id}`
            )
          }
        >
          <img
            src={course.thumbnail}
            alt="course thumbnail"
            className="h-14 w-14 rounded-lg object-cover"
          />
          <span className="font-semibold">{course.courseName}</span>
        </div>
      ),
    },
    {
      title: "DURATION",
      dataIndex: "totalDuration",
      key: "duration",
      width: 150,
      className:
        "bg-richblack-900 text-richblack-100 text-center py-4 text-sm font-medium outline outline-richblack-700",
      render: (_, course) => <span>{course.totalDuration}</span>,
    },
    {
      title: "LECTURES",
      dataIndex: "courseContent",
      key: "lectures",
      width: 150,
      className:
        "bg-richblack-900 text-richblack-100 text-center py-4 text-sm font-medium outline outline-richblack-700",
      render: (_, course) => <span>{course.courseContent.length}</span>,
    },
  ];

  // Show loading spinner if courses are not fetched yet
  if (!enrolledCourses) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  // If no courses are enrolled
  if (enrolledCourses.length === 0) {
    return (
      <p className="py-10 text-center text-lg font-medium text-richblack-100 bg-richblack-900">
        You have not enrolled in any course yet.
      </p>
    );
  }

  return (
    <>
      <div className="mb-14 flex items-center justify-between">
        <h1 className="text-3xl font-medium text-richblack-5">
          Enrolled Courses
        </h1>
      </div>

      <Table columns={columns} data={enrolledCourses} rowKey="_id" />
    </>
  );
}
