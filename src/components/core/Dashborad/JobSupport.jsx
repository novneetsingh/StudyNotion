import React from "react";
import JobCard from "./JobSupport/JobCard";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../redux-toolkit/slices/profileSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

const JobSupport = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.profile);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        dispatch(setLoading(true));
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/jobs`,
          {
            withCredentials: true,
          }
        );

        setJobs(response.data.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to fetch jobs");
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-richblack-900">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-medium text-richblack-5">
          Fresher Jobs
        </h1>
      </div>

      {/* Notes Grid */}
      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h2 className="text-xl font-semibold text-richblack-5 mb-2">
            No jobs yet
          </h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobSupport;
