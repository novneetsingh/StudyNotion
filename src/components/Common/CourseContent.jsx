import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

export const mobileCourseData = [
  {
    sectionName: "Introduction to Mobile Development",
    subSections: [
      { title: "Course Overview" },
      { title: "Mobile Development Landscape" },
      { title: "Native vs Cross-Platform Development" },
    ],
  },
  {
    sectionName: "Fundamentals of React Native",
    subSections: [
      { title: "Setting up Development Environment" },
      { title: "React Native Basics" },
      { title: "Components and Props" },
      { title: "State Management" },
    ],
  },
  {
    sectionName: "UI Development",
    subSections: [
      { title: "Layouts and Flexbox" },
      { title: "Styling in React Native" },
      { title: "Building Custom Components" },
      { title: "Navigation and Routing" },
    ],
  },
  {
    sectionName: "Advanced Features",
    subSections: [
      { title: "Working with APIs" },
      { title: "Device Features Integration" },
      { title: "Push Notifications" },
      { title: "Data Storage and AsyncStorage" },
    ],
  },
  {
    sectionName: "App Deployment",
    subSections: [
      { title: "Testing and Debugging" },
      { title: "App Store Guidelines" },
      { title: "Building for Production" },
      { title: "Publishing Your App" },
    ],
  },
];

const CourseContent = () => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (sectionIndex) => {
    setActiveSection(activeSection === sectionIndex ? null : sectionIndex);
  };

  return (
    <div className="mx-auto box-content w-full max-w-[1260px] px-4 py-12 text-white">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold">Course Content</h2>
        <p className="mt-2 text-richblack-200">
          {mobileCourseData.length} sections •{" "}
          {mobileCourseData.reduce(
            (acc, section) => acc + section.subSections.length,
            0
          )}{" "}
          lectures
        </p>
      </div>

      {/* Course Sections Accordion */}
      <div className="flex flex-col gap-2">
        {mobileCourseData.map((section, index) => (
          <div
            key={index}
            className="border border-richblack-600 bg-richblack-700 text-richblack-5"
          >
            {/* Section Header */}
            <button
              className="flex w-full items-center justify-between px-6 py-4"
              onClick={() => toggleSection(index)}
            >
              <div className="flex items-center gap-2">
                <IoIosArrowDown
                  className={`transition-transform duration-200 ${
                    activeSection === index ? "rotate-180" : ""
                  }`}
                />
                <p className="font-semibold">{section.sectionName}</p>
              </div>
              <p className="text-yellow-50">
                {section.subSections.length} lectures
              </p>
            </button>

            {/* Section Content */}
            {activeSection === index && (
              <div className="border-t border-richblack-600">
                {section.subSections.map((lecture, lectureIndex) => (
                  <div
                    key={lectureIndex}
                    className="flex items-center justify-between px-6 py-3"
                  >
                    <p className="text-richblack-50">{lecture.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseContent;
