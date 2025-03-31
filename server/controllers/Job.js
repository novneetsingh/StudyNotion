const { redisClient } = require("../config/redis");
const Job = require("../models/Job");

// Get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    // Check if the jobs are cached in Redis
    const cachedJobs = await redisClient.get("jobs");

    if (cachedJobs) {
      return res.status(200).json({
        success: true,
        message: "Jobs fetched successfully from cache",
        data: JSON.parse(cachedJobs),
      });
    }

    const jobs = await Job.find();

    // Cache the jobs in Redis for 10 minutes
    await redisClient.setEx("jobs", 600, JSON.stringify(jobs));

    res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
