import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { setUser } from "../redux-toolkit/slices/profileSlice";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const toastId = toast.loading("Logging in...");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        data,
        {
          withCredentials: true,
        }
      );

      dispatch(setUser(response.data.user));

      toast.success("Login successful!", { id: toastId });
      navigate("/dashboard/my-profile");
    } catch (error) {
      toast.error("Login failed", { id: toastId });
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center mt-16">
      <div className="w-11/12 max-w-[450px] p-6 bg-richblack-900 rounded-lg shadow-lg">
        <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5 text-center">
          Welcome Back
        </h1>
        <p className="mt-4 text-[1.125rem] leading-[1.625rem] text-center">
          <span className="text-richblack-100">
            Build skills for today, tomorrow, and beyond.
          </span>{" "}
          <span className="font-edu-sa font-bold italic text-blue-100">
            Education to future-proof your career.
          </span>
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex w-full flex-col gap-y-4"
        >
          {/* Email input field */}
          <label className="w-full">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Email Address <sup className="text-pink-200">*</sup>
            </p>
            <input
              type="text"
              placeholder="Enter email address"
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-pink-200 text-sm">{errors.email.message}</p>
            )}
          </label>
          {/* Password input field */}
          <label className="relative">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", { required: "Password is required" })}
              placeholder="Enter Password"
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-12 text-richblack-5"
            />
            {errors.password && (
              <p className="text-pink-200 text-sm">{errors.password.message}</p>
            )}
            {/* Toggle password visibility */}
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
          </label>
          {/* Submit button */}
          <button
            type="submit"
            className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
