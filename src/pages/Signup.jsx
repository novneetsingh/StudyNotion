import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const accountTypes = ["Student", "Instructor"];

function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState("Student");

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const sendOtp = async () => {
    const email = getValues("email");
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }

    const toastId = toast.loading("Sending OTP...");
    try {
      await axios.post(`/auth/sendotp`, {
        email,
      });

      toast.success("OTP sent to your email", { id: toastId });
    } catch (error) {
      toast.error("Failed to send OTP", { id: toastId });
      console.log(error);
    }
  };

  const onSubmit = async (data) => {
    const toastId = toast.loading("Signing up...");
    try {
      await axios.post(`/auth/signup`, {
        ...data,
        accountType,
      });

      toast.success("Signup successful!", { id: toastId });

      navigate("/login");
    } catch (error) {
      toast.error("Signup failed", { id: toastId });
      console.log(error);
    }
  };

  return (
    <div className=" w-11/12  bg-richblack-900 rounded-lg shadow-lg flex justify-center">
      <div className="w-11/12 max-w-[400px] mt-20 mr-16">
        <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5 text-center">
          Join the millions learning to code with StudyNotion for free
        </h1>
        <p className="mt-4 text-[1.125rem] leading-[1.625rem] text-center">
          <span className="text-richblack-100">
            Build skills for today, tomorrow, and beyond.
          </span>{" "}
          <span className="font-edu-sa font-bold italic text-blue-100">
            Education to future-proof your career.
          </span>
        </p>
      </div>
      <div>
        <div className="flex bg-richblack-800 p-1 gap-x-1 my-6 rounded-full max-w-max ">
          {accountTypes.map((type) => (
            <button
              key={type}
              onClick={() => setAccountType(type)}
              className={`${
                accountType === type
                  ? "bg-richblack-900 text-richblack-5"
                  : "bg-transparent text-richblack-200"
              } py-2 px-5 rounded-full transition-all duration-200`}
            >
              {type}
            </button>
          ))}
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex w-full flex-col gap-y-4"
        >
          <label className="w-full">
            <p className="text-richblack-5">
              First Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              type="text"
              placeholder="Enter first name"
              {...register("firstName", {
                required: "First Name is required",
              })}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
            />
            {errors.firstName && (
              <p className="text-pink-200 text-sm">
                {errors.firstName.message}
              </p>
            )}
          </label>
          <label className="w-full">
            <p className="text-richblack-5">
              Last Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              type="text"
              placeholder="Enter last name"
              {...register("lastName", { required: "Last Name is required" })}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
            />
            {errors.lastName && (
              <p className="text-pink-200 text-sm">{errors.lastName.message}</p>
            )}
          </label>

          <label className="w-full">
            <p className="text-richblack-5">
              Email Address <sup className="text-pink-200">*</sup>
            </p>
            <input
              type="email"
              placeholder="Enter email address"
              {...register("email", { required: "Email is required" })}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
            />
            {errors.email && (
              <p className="text-pink-200 text-sm">{errors.email.message}</p>
            )}
          </label>

          <div className="flex gap-x-4 items-center">
            <label>
              <p className="text-richblack-5">
                Email OTP <sup className="text-pink-200">*</sup>
              </p>
              <input
                type="text"
                placeholder="Enter OTP"
                {...register("otp", { required: "OTP is required" })}
                className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
              />
              {errors.otp && (
                <p className="text-pink-200 text-sm">{errors.otp.message}</p>
              )}
            </label>
            <button
              type="button"
              onClick={sendOtp}
              className="bg-yellow-50 text-richblack-900 mt-5 px-5 py-3 rounded-md text-[12px] font-semibold"
            >
              Get OTP
            </button>
          </div>

          <label className="relative w-full">
            <p className="text-richblack-5">
              Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              {...register("password", { required: "Password is required" })}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
            {errors.password && (
              <p className="text-pink-200 text-sm">{errors.password.message}</p>
            )}
          </label>
          <button
            type="submit"
            className="mt-6 rounded bg-yellow-50 py-2 px-4 font-medium text-richblack-900"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
