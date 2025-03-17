import React from "react";
import CTAButton from "../components/core/HomePage/Button";

const Error = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-800 text-white">
      <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
        Error - 404 Page Not Found
      </p>

      <p className="text-md sm:text-lg md:text-xl my-4">
        Sorry, the page you are looking for does not exist.
      </p>

      <CTAButton active={true} linkto={"/"}>
        Go to Home
      </CTAButton>
    </div>
  );
};

export default Error;
