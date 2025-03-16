import React from "react";
import CTAButton from "../components/core/HomePage/Button";

// Error component to display a 404 Not Found message
const Error = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-800 text-white">
      {/* Error message displayed with responsive text sizing */}
      <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
        Error - 404 Page Not Found
      </p>
      {/* Subtext to offer a clearer explanation or additional info */}
      <p className="text-md sm:text-lg md:text-xl my-4">
        Sorry, the page you are looking for does not exist.
      </p>
      {/* Navigation link to guide users back to a safe location, such as the home page */}
      <CTAButton active={true} linkto={"/"}>
        Go to Home
      </CTAButton>
    </div>
  );
};

export default Error;
