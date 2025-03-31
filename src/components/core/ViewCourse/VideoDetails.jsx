import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const VideoDetails = () => {
  const { lectureId } = useParams();
  const { courseContent } = useSelector((state) => state.viewCourse);
  const [videoData, setVideoData] = useState(null);

  useEffect(() => {
    if (courseContent && courseContent.length > 0) {
      const lecture = courseContent.find(
        (lecture) => lecture._id === lectureId
      );
      setVideoData(lecture);
    }
  }, [lectureId, courseContent]);

  return (
    <div className="flex flex-col gap-5 text-white">
      {!courseContent || courseContent.length === 0 ? (
        // Message when there is no course content
        <div className="flex items-center justify-center w-full aspect-video bg-richblack-800 rounded-md">
          <div className="text-xl text-richblack-100">
            No course content available. Please check back later.
          </div>
        </div>
      ) : videoData ? (
        <div className="video-container w-full aspect-video bg-richblack-800 rounded-md overflow-hidden">
          <video
            className="w-full h-full object-cover"
            src={videoData.videoUrl}
            controls
            autoPlay={false}
          ></video>
        </div>
      ) : (
        // Show a loading message while videoData is being fetched
        <div className="flex items-center justify-center w-full aspect-video bg-richblack-800 rounded-md">
          <div className="animate-pulse text-xl text-richblack-100">
            Loading video...
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoDetails;
