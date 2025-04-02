import React from "react";
import { useForm } from "react-hook-form";
import {
  AiOutlineAudio,
  AiOutlineAudioMuted,
  AiOutlineSend,
  AiOutlineClose,
} from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import { useVoiceRecorder } from "react-audio-transcriber-hook";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "../../../../redux-toolkit/slices/profileSlice";
import { setNotes } from "../../../../redux-toolkit/slices/notesSlice";

const VoiceNoteRecorder = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm();
  const { loading } = useSelector((state) => state.profile);
  const { notes } = useSelector((state) => state.notes);

  const {
    isRecording,
    audioBlob,
    transcribedText,
    startRecording,
    stopRecording,
    resetRecorder,
  } = useVoiceRecorder();

  const onSubmit = async (data) => {
    if (!data.title) {
      toast.error("Please enter a title");
      return;
    }

    if (!audioBlob) {
      toast.error("Please record some audio first");
      return;
    }

    try {
      dispatch(setLoading(true));
      // Create a FormData object
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("transcribedText", transcribedText || "");
      formData.append("audio", audioBlob, "recording.webm");

      const res = await axios.post(`/notes/create-note`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      handleReset(); // Reset the recorder and form
      // add the new note to the Redux store
      dispatch(setNotes([...notes, res.data.newNote]));
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Failed to create note");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleReset = () => {
    resetRecorder();
    reset();
  };

  return (
    <div className="fixed bottom-6 left-0 right-0 z-10 flex justify-end">
      <div className="bg-richblack-800 border border-richblack-700 rounded-full shadow-xl transition-all duration-300 w-auto max-w-3xl mx-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-center gap-3 px-4 py-2"
        >
          {/* Title Input */}
          <input
            type="text"
            {...register("title")}
            placeholder="Note title..."
            className="flex-1 min-w-[200px] px-4 py-2 rounded-full bg-richblack-700 text-richblack-5 placeholder-richblack-300 focus:outline-none focus:ring-1 focus:ring-yellow-50 border-none"
          />

          {/* Recording Button */}
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-3 rounded-full transition-all duration-200 ${
              isRecording
                ? "bg-pink-600 hover:bg-pink-700"
                : "bg-yellow-50 hover:bg-yellow-100 text-richblack-900"
            }`}
            title={isRecording ? "Stop Recording" : "Start Recording"}
            disabled={loading}
          >
            {isRecording ? (
              <AiOutlineAudioMuted className="w-5 h-5 text-white" />
            ) : (
              <AiOutlineAudio className="w-5 h-5" />
            )}
          </button>

          {/* Clear Button */}
          {(audioBlob || transcribedText) && (
            <button
              type="button"
              onClick={handleReset}
              className="p-3 rounded-full bg-richblack-700 hover:bg-richblack-600 transition-colors"
              title="Clear"
              disabled={loading}
            >
              <AiOutlineClose className="w-5 h-5 text-pink-200" />
            </button>
          )}

          {/* Save Button */}
          <button
            type="submit"
            disabled={!audioBlob || loading}
            className={`p-3 rounded-full transition-colors ${
              audioBlob && !loading
                ? "bg-caribbeangreen-500 hover:bg-caribbeangreen-600 text-richblack-900"
                : "bg-richblack-700 text-richblack-400 cursor-not-allowed"
            }`}
            title="Save Note"
          >
            <AiOutlineSend className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default VoiceNoteRecorder;
