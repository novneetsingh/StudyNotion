import { useEffect, useState } from "react";
import OtpInput from "react-otp-input"; // Import OTP input component
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, signUp } from "../services/operations/authAPI";
import { useNavigate } from "react-router-dom";

function VerifyEmail() {
  // State for OTP input
  const [otp, setOtp] = useState("");
  // Get signup data and loading state from Redux store
  const { signupData, loading } = useSelector((state) => state.auth);
  // Initialize dispatch function
  const dispatch = useDispatch();
  // Initialize navigate function from react-router-dom
  const navigate = useNavigate();

  useEffect(() => {
    // Only allow access to this route when user has filled the signup form
    if (!signupData) {
      navigate("/signup");
    }
  }, []); // Dependency array to run effect only once on component mount

  // Handle verification and signup
  const handleVerifyAndSignup = (e) => {
    e.preventDefault();
    const {
      accountType,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = signupData;

    // Dispatch sign up action with user data and OTP
    dispatch(
      signUp(
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
        navigate
      )
    );
  };

  return (
    <div className="flex flex-1 justify-center items-center">
      {loading ? ( // Show loading spinner if loading is true
        <div>
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="max-w-[500px] p-4 lg:p-8">
          <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]">
            Verify Email
          </h1>
          <p className="text-[1.125rem] leading-[1.625rem] my-4 text-richblack-100">
            A verification code has been sent to you. Enter the code below
          </p>
          <form onSubmit={handleVerifyAndSignup}>
            {/* OTP input field */}
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder="-"
                  style={{
                    boxShadow: "",
                  }}
                  className="w-[48px] lg:w-[60px] bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:outline-yellow-50 "
                />
              )}
              containerStyle={{
                justifyContent: "space-between",
                gap: "0 6px",
              }}
            />
            {/* Verify Email button */}
            <button
              type="submit"
              className="w-full bg-yellow-50 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900"
            >
              Verify Email
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between">
            {/* Back to Signup link */}
            <Link to="/signup">
              <p className="text-richblack-5 flex items-center gap-x-2">
                <BiArrowBack /> Back To Signup
              </p>
            </Link>
            {/* Resend OTP button */}
            <button
              className="flex items-center text-blue-100 gap-x-2"
              onClick={() => dispatch(sendOtp(signupData.email))}
            >
              <RxCountdownTimer />
              Resend it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifyEmail;
