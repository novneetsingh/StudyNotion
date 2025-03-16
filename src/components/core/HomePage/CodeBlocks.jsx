import React from "react";
import CTAButton from "./Button";
import { TypeAnimation } from "react-type-animation";
import { FaArrowRight } from "react-icons/fa";

const CodeBlocks = ({
  position,
  heading,
  subheading,
  ctabtn1,
  ctabtn2,
  codeblock,
  codeColor,
}) => {


  return (
    <div
      className={`flex ${position} my-20 justify-between flex-col lg:gap-10 gap-10`}
    >
      {/* Content Section */}
      <div className="w-full lg:w-1/2 flex flex-col gap-8">
        {heading}

        {/* Subheading */}
        <div className="text-richblack-300 text-base font-bold w-[85%] mt-3">
          {subheading}
        </div>

         {/* Button Group */}
        <div className="flex gap-7 mt-7">
          <CTAButton active={ctabtn1.active} linkto={ctabtn1.link}>
            <div className="flex items-center gap-2">
              {ctabtn1.btnText}
              <FaArrowRight />
            </div>
          </CTAButton>
          <CTAButton active={ctabtn2.active} linkto={ctabtn2.link}>
            {ctabtn2.btnText}
          </CTAButton>
        </div> 
      </div>

      {/* Code Display Section */}
      <div className="h-fit code-border flex flex-row py-3 text-xs sm:text-sm leading-6 relative w-full lg:w-[470px]">
        {/* Line Numbers */}
        <div className="text-center flex flex-col w-10 select-none text-richblack-400 font-bold">
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
          <p>5</p>
          <p>6</p>
          <p>7</p>
          <p>8</p>
          <p>9</p>
          <p>10</p>
          <p>11</p>
        </div>

        {/* Code Content */}
        <div
          className={`flex-1 flex flex-col gap-2 font-bold font-mono ${codeColor} pr-1`}
        >
          <TypeAnimation
            sequence={[codeblock, 2000, ""]}
            cursor={true}
            repeat={Infinity}
            style={{ whiteSpace: "pre-line" }}
            omitDeletionAnimation={true}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeBlocks;
