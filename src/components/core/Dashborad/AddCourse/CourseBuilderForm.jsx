import { useForm } from "react-hook-form";
import { MdNavigateNext } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { resetCourseState } from "../../../../redux-toolkit/slices/courseSlice";
import IconBtn from "../../../Common/IconBtn";
import { Link } from "react-router-dom";
import { setLoading } from "../../../../redux-toolkit/slices/profileSlice";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CourseBuilderForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { course } = useSelector((state) => state.course);
  const { loading } = useSelector((state) => state.profile);

  // Handle form submission to create a new lecture
  const onSubmit = async (data) => {
    // add course id to the data
    data.courseId = course._id;
    data.video = data.video[0];
    
    try {
      dispatch(setLoading(true));

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/course/addLecture`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      toast.success("Lecture added successfully");
    } catch (error) {
      console.error("Error creating lecture:", error);
      toast.error("Error creating lecture:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSave = () => {
    toast.success("Course created Successfully");
    dispatch(resetCourseState());
    navigate("/dashboard/my-courses");
  };

  return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Lecture Title */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="title">
            Lecture Title <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="title"
            placeholder="Enter Lecture Title"
            {...register("title", { required: true })}
            className="form-style w-full"
          />
          {errors.title && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Lecture title is required
            </span>
          )}
        </div>

        {/* Lecture Video */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="video">
            Lecture Video <sup className="text-pink-200">*</sup>
          </label>
          <input
            type="file"
            id="video"
            {...register("video", { required: true })}
            className="form-style w-full"
            accept="video/*"
          />
          {errors.video && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Lecture Video is required
            </span>
          )}
        </div>
        {/* Submit Button */}
        <div className="flex justify-end">
          <IconBtn
            type="submit"
            disabled={loading}
            text={loading ? "Loading..." : "Add Lecture"}
          />
        </div>
      </form>

      {/* Next Button */}
      <Link
        to={"/dashboard/my-courses"}
        className="flex justify-end gap-x-3"
        onClick={handleSave} // Dispatch action outside rendering cycle
      >
        <IconBtn disabled={loading} text="Save">
          <MdNavigateNext />
        </IconBtn>
      </Link>
    </div>
  );
}
