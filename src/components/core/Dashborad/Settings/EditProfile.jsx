import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import IconBtn from "../../../Common/IconBtn";
import axios from "axios";
import { setUser } from "../../../../redux-toolkit/slices/profileSlice";
import toast from "react-hot-toast";

// List of genders
const genders = ["Male", "Female", "Prefer not to say"];

export default function EditProfile() {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      // Set default form values from user data
      firstName: user?.firstName,
      lastName: user?.lastName,
      dateOfBirth: user?.additionalDetails?.dateOfBirth,
      gender: user?.additionalDetails?.gender,
      contactNumber: user?.additionalDetails?.contactNumber,
      about: user?.additionalDetails?.about,
    },
  });

  // Function to handle form submission
  const submitProfileForm = async (data) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/profile/updateProfile`,
        data,
        {
          withCredentials: true,
        }
      );

      toast.success("Profile Updated Successfully");
      dispatch(setUser(res.data.data));
      navigate("/dashboard/my-profile");
    } catch (error) {
      console.log("UPDATE_PROFILE_API API ERROR............", error);
      toast.error("Could Not Update Profile");
    }
  };

  return (
    <form onSubmit={handleSubmit(submitProfileForm)}>
      <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
        <h2 className="text-lg font-semibold text-richblack-5">
          Profile Information
        </h2>
        <div className="flex flex-col gap-5 lg:flex-row">
          {/* First Name Field */}
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="firstName" className="lable-style">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              placeholder="Enter first name"
              className="form-style"
              {...register("firstName", { required: "First name is required" })}
            />
            {errors.firstName && (
              <span className="text-[12px] text-yellow-100">
                {errors.firstName.message}
              </span>
            )}
          </div>
          {/* Last Name Field */}
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="lastName" className="lable-style">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              placeholder="Enter last name"
              className="form-style"
              {...register("lastName", { required: "Last name is required" })}
            />
            {errors.lastName && (
              <span className="text-[12px] text-yellow-100">
                {errors.lastName.message}
              </span>
            )}
          </div>
        </div>

        {/* Date of Birth and Gender Fields */}
        <div className="flex flex-col gap-5 lg:flex-row">
          {/* Date of Birth Field */}
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="dateOfBirth" className="lable-style">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              className="form-style"
              {...register("dateOfBirth", {
                required: "Date of Birth is required",
                max: {
                  value: new Date().toISOString().split("T")[0],
                  message: "Date of Birth cannot be in the future.",
                },
              })}
            />
            {errors.dateOfBirth && (
              <span className="text-[12px] text-yellow-100">
                {errors.dateOfBirth.message}
              </span>
            )}
          </div>
          {/* Gender Field */}
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="gender" className="lable-style">
              Gender
            </label>
            <select
              id="gender"
              className="form-style"
              {...register("gender", { required: "Please select a gender" })}
            >
              <option value="" disabled>
                Select a gender
              </option>
              {genders.map((gender, i) => (
                <option key={i} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
            {errors.gender && (
              <span className="text-[12px] text-yellow-100">
                {errors.gender.message}
              </span>
            )}
          </div>
        </div>

        {/* Contact Number and About Fields */}
        <div className="flex flex-col gap-5 lg:flex-row">
          {/* Contact Number Field */}
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="contactNumber" className="lable-style">
              Contact Number
            </label>
            <input
              type="tel"
              id="contactNumber"
              placeholder="Enter Contact Number"
              className="form-style"
              {...register("contactNumber", {
                required: "Contact Number is required",
                minLength: { value: 10, message: "Invalid Contact Number" },
                maxLength: { value: 12, message: "Invalid Contact Number" },
              })}
            />
            {errors.contactNumber && (
              <span className="text-[12px] text-yellow-100">
                {errors.contactNumber.message}
              </span>
            )}
          </div>
          {/* About Field */}
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="about" className="lable-style">
              About
            </label>
            <input
              type="text"
              id="about"
              placeholder="Enter Bio Details"
              className="form-style"
              {...register("about", { required: "Bio is required" })}
            />
            {errors.about && (
              <span className="text-[12px] text-yellow-100">
                {errors.about.message}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Save and Cancel Buttons */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => navigate("/dashboard/my-profile")}
          className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
        >
          Cancel
        </button>
        <IconBtn type="submit" text="Save" />
      </div>
    </form>
  );
}
