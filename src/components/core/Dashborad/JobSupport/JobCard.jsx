import React from "react";
import { FaMapMarkerAlt, FaBuilding } from "react-icons/fa";

const JobCard = ({ job }) => {
  return (
    <div className="bg-richblack-800 shadow-md rounded-xl overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl flex flex-col h-full border border-richblack-700">
      <div className="p-5 flex-grow space-y-2">
        <h2 className="text-xl font-bold text-richblack-5">{job.title}</h2>
        <p className="text-sm text-richblack-300 flex items-center gap-1">
          <FaBuilding className="text-yellow-500" /> {job.companyName}
        </p>
        <p className="text-sm text-richblack-300 flex items-center gap-1">
          <FaMapMarkerAlt className="text-yellow-500" /> {job.location}
        </p>
        <p className="text-sm text-yellow-400 font-medium">{job.salary}</p>
      </div>

      <div className="p-4 border-t border-richblack-700 bg-richblack-900">
        <a
          href={job.jobLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-block text-center bg-yellow-400 text-richblack-900 font-bold py-2 px-4 rounded-md hover:bg-yellow-200 transition-all duration-200"
        >
          Apply Now
        </a>
      </div>
    </div>
  );
};

export default JobCard;
