import React from "react";
import CTAButton from "../../../components/core/HomePage/Button";
import { FaArrowRight } from "react-icons/fa";
import Instructor from "../../../assets/Images/Instructor.jpg";
import HighlightText from "./HighlightText";

const InstructorSection = () => {
  return (
    <div className="flex flex-col gap-20 lg:flex-row lg:gap-48 items-center">
      <div className="lg:w-[50%]">
        <img
          src={Instructor}
          alt=""
          className="rounded-3xl shadow-[0_0_30px_0] shadow-blue-200"
        />
      </div>
      <div className="lg:w-[50%] flex gap-10 flex-col">
        <h1 className="lg:w-[50%] text-4xl font-semibold ">
          Become an
          <HighlightText text={"instructor"} />
        </h1>

        <p className="font-medium text-[16px] text-justify w-[90%] text-richblack-300">
          Instructors from around the world teach millions of students on
          CodePlay. We provide the tools and skills to teach what you love.
        </p>

        <div className="w-fit">
          <CTAButton active={true} linkto={"/signup"}>
            <div className="flex items-center gap-3">
              Start Teaching Today
              <FaArrowRight />
            </div>
          </CTAButton>
        </div>
      </div>
    </div>
  );
};

export default InstructorSection;
