import { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { formatDate } from "../../../../utils/formatDate";
import ConfirmationModal from "../../../Common/ConfirmationModal";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Table from "rc-table";
import { setUserCourses } from "../../../../redux-toolkit/slices/viewCourseSlice";

export default function CoursesTable() {
  const dispatch = useDispatch();

  const { userCourses } = useSelector((state) => state.viewCourse);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const { loading } = useSelector((state) => state.profile);

  // Function to handle course deletion
  const handleCourseDelete = async (courseId) => {
    try {
      await axios.delete(`/course/deleteCourse/${courseId}`);

      toast.success("Course Deleted Successfully");
      setConfirmationModal(null);

      dispatch(
        setUserCourses(userCourses.filter((course) => course._id !== courseId))
      );
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Error deleting course");
    }
  };

  // Define columns for rc-table
  const columns = [
    {
      title: "COURSES",
      dataIndex: "course",
      key: "course",
      width: 700,
      className:
        "bg-richblack-900 text-richblack-100 px-6 py-4 text-sm font-medium outline outline-richblack-700",
      render: (_, record) => (
        <div className="flex items-center gap-4">
          {/* Course Thumbnail */}
          <img
            src={record.thumbnail}
            alt={record.courseName}
            className="max-h-[120px] max-w-[150px] object-cover rounded-lg shadow-md"
          />
          <div className="flex flex-col gap-1">
            {/* Course Name */}
            <p className="text-lg font-semibold text-richblack-5">
              {record.courseName}
            </p>
            {/* Truncated Course Description */}
            <p className="text-sm text-richblack-300 line-clamp-2">
              {record.courseDescription}
            </p>
            {/* Creation Date */}
            <p className="text-xs text-richblack-100">
              Created: {formatDate(record.createdAt)}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "LECTURES",
      dataIndex: "lectureCount",
      key: "lectureCount",
      width: 150,
      className:
        "bg-richblack-900 text-richblack-100 text-center py-4 text-sm font-medium outline outline-richblack-700",
      render: (_, record) => <span>{record.courseContent.length}</span>,
    },
    {
      title: "PRICE",
      dataIndex: "price",
      key: "price",
      width: 150,
      className:
        "bg-richblack-900 text-richblack-100 text-center py-4 text-sm font-medium outline outline-richblack-700",
      render: (_, record) => (
        <span className="font-semibold">₹{record.price}</span>
      ),
    },
    {
      title: "ACTIONS",
      dataIndex: "actions",
      key: "actions",
      width: 100,
      className:
        "bg-richblack-900 text-richblack-100 text-center py-4 text-sm font-medium outline outline-richblack-700",
      render: (_, record) => (
        <div className="flex justify-center">
          <button
            disabled={loading}
            onClick={() => {
              setConfirmationModal({
                text1: "Do you want to delete this course?",
                text2: "All data related to this course will be deleted.",
                btn1Text: !loading ? "Delete" : "Loading...",
                btn2Text: "Cancel",
                btn1Handler: !loading
                  ? () => handleCourseDelete(record._id)
                  : () => {},
                btn2Handler: () => setConfirmationModal(null),
              });
            }}
            title="Delete"
            className="transition-all duration-200 hover:scale-110 hover:text-red-500"
          >
            <RiDeleteBin6Line size={22} />
          </button>
        </div>
      ),
    },
  ];

  // Custom empty render function
  const emptyRenderer = () => (
    <div className="py-10 text-center text-lg font-medium text-richblack-100 bg-richblack-900">
      No courses found
    </div>
  );

  return (
    <>
      <div className="mt-4 bg-richblack-800 rounded-lg shadow-md">
        <Table
          columns={columns}
          data={userCourses}
          rowKey="_id"
          emptyText={emptyRenderer}
          className="w-full text-richblack-100"
        />
      </div>

      {/* Confirmation Modal */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}
