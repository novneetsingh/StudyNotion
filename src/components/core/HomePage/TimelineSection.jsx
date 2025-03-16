import React from "react";
import TimeLineImage from "../../../assets/Images/TimelineImage.png";
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg";
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg";
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg";
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg";

const TimeLine = [
  {
    Logo: Logo1,
    Heading: "Leadership",
    Description: "Fully committed to the success of the company",
  },
  {
    Logo: Logo2,
    Heading: "Responsibility",
    Description: "Students will always be our top priority",
  },
  {
    Logo: Logo3,
    Heading: "Flexibility",
    Description: "The ability to switch is an important skill",
  },
  {
    Logo: Logo4,
    Heading: "Problem Solving",
    Description: "Code your way to a solution",
  },
];

const TimelineSection = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-20 mb-20 items-center">
      {/* Timeline */}
      <div className="lg:w-[45%] flex flex-col gap-14 lg:gap-3">
        {TimeLine.map((ele, idx) => {
          return (
            <div className="flex flex-col lg:gap-3" key={idx}>
              {/* Timeline Item */}
              <div className="flex gap-6">
                {/* Logo */}
                <div className="w-[52px] h-[52px] bg-black rounded-full flex justify-center items-center">
                  <img src={ele.Logo} alt="" />
                </div>
                {/* Text Content */}
                <div>
                  <h2 className="font-semibold text-[18px]">{ele.Heading}</h2>
                  <p className="text-base">{ele.Description}</p>
                </div>
              </div>
              {/* Dotted Line */}
              <div
                className={`hidden ${
                  TimeLine.length - 1 === idx ? "hidden" : "lg:block"
                }  h-14 border-dotted border-r border-black w-[26px]`}
              ></div>
            </div>
          );
        })}
      </div>

      {/* Timeline Image */}
      <div className="relative w-fit h-fit ">
        <img
          src={TimeLineImage}
          alt="Timeline Image"
          className="rounded-3xl shadow-[0_0_50px_0] shadow-blue-200"
        />

        {/* Statistics */}
        <div className="absolute lg:left-[50%] lg:bottom-0 lg:translate-x-[-50%] lg:translate-y-[50%] bg-caribbeangreen-700 flex lg:flex-row flex-col text-white uppercase py-5 gap-4 lg:gap-0 lg:py-10 ">
          {/* Section 1 */}
          <div className="flex gap-5 items-center lg:border-r border-caribbeangreen-300 px-7 lg:px-14">
            <p className="text-3xl font-bold w-[75px]">10</p>
            <p className="text-caribbeangreen-300 text-sm w-[75px]">
              Years of experience
            </p>
          </div>

          {/* Section 2 */}
          <div className="flex gap-5 items-center lg:px-14 px-7">
            <h1 className="text-3xl font-bold w-[75px]">250</h1>
            <h1 className="text-caribbeangreen-300 text-sm w-[75px]">
              Types of courses
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineSection;
