import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { MdNavigateNext } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setCourse, setStep } from "../../../../redux-toolkit/slices/courseSlice";
import IconBtn from "../../../Common/IconBtn";
import axios from "axios";
import { setLoading } from "../../../../redux-toolkit/slices/profileSlice";
import { toast } from "react-hot-toast";

export default function CourseInformationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.profile);
  const [courseCategories, setCourseCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const categories = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/course/showAllCategories`
        );

        setCourseCategories(categories.data.data);
      } catch (error) {
        console.log("Error fetching categories:", error);
        toast.error("Error fetching categories:", error);
      }
    };

    getCategories();
  }, []);

  const onSubmit = async (data) => {
    try {
      dispatch(setLoading(true));

      data.thumbnailImage = data.thumbnailImage[0];

      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/course/createCourse`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      dispatch(setStep(2)); // Update step to 2 in Redux state
      dispatch(setCourse(result.data.data)); // Save course data in Redux state
    } catch (error) {
      console.error("Error adding course details:", error);
      toast.error("Error adding course details");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">
        Course Information
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Course Title */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="courseName">
            Course Title <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="courseName"
            placeholder="Enter Course Title"
            {...register("courseName", { required: true })}
            className="form-style w-full"
          />
          {errors.courseName && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Course title is required
            </span>
          )}
        </div>

        {/* Course Short Description */}
        <div className="flex flex-col space-y-2">
          <label
            className="text-sm text-richblack-5"
            htmlFor="courseDescription"
          >
            Course Short Description <sup className="text-pink-200">*</sup>
          </label>
          <textarea
            id="courseDescription"
            placeholder="Enter Description"
            {...register("courseDescription", { required: true })}
            className="form-style resize-x-none min-h-[130px] w-full"
          />
          {errors.courseDescription && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Course Description is required
            </span>
          )}
        </div>

        {/* Course Price */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="price">
            Course Price <sup className="text-pink-200">*</sup>
          </label>
          <div className="relative">
            <input
              id="price"
              placeholder="Enter Course Price"
              type="number"
              {...register("price", {
                required: true,
                valueAsNumber: true,
                pattern: {
                  value: /^(0|[1-9]\d*)(\.\d+)?$/,
                },
              })}
              className="form-style w-full !pl-12"
            />
            <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
          </div>
          {errors.price && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Course Price is required
            </span>
          )}
        </div>

        {/* Course Category */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="category">
            Course Category <sup className="text-pink-200">*</sup>
          </label>
          <select
            {...register("category", { required: true })}
            defaultValue=""
            id="category"
            className="form-style w-full"
          >
            <option value="" disabled>
              Choose a Category
            </option>
            {courseCategories?.map((category, indx) => (
              <option key={indx} value={category?._id}>
                {category?.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Course Category is required
            </span>
          )}
        </div>

        {/* Course Thumbnail Image */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="thumbnailImage">
            Course Thumbnail <sup className="text-pink-200">*</sup>
          </label>
          <input
            type="file"
            id="thumbnailImage"
            {...register("thumbnailImage", { required: true })}
            className="form-style w-full"
            accept="image/*"
          />
          {errors.thumbnailImage && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Course Thumbnail is required
            </span>
          )}
        </div>

        {/* Next Button */}
        <div className="flex justify-end gap-x-2">
          <IconBtn
            type="submit"
            disabled={loading}
            text={loading ? "Loading..." : "Next"}
          >
            <MdNavigateNext />
          </IconBtn>
        </div>
      </form>
    </div>
  );
}
