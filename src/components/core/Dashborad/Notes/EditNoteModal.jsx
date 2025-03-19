import React, { useState } from "react";
import { Save, Image } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "../../../../redux-toolkit/slices/profileSlice";

const EditNoteModal = ({ note, isOpen, onClose, fetchNotes }) => {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      title: note?.title || "",
      content: note?.content || "",
    },
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const { loading } = useSelector((state) => state.profile);

  // Handle file selection for images
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages((prevImages) => [...prevImages, ...files]);
  };

  const onSubmit = async (data) => {
    dispatch(setLoading(true));

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    selectedImages.forEach((image) => {
      formData.append("images", image);
    });

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/notes/update-note/${note._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      onClose();
      fetchNotes();
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // If the modal is not open, return null
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-richblack-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-medium text-richblack-5">Edit Note</h2>
        </div>

        <div className="space-y-6 mb-6">
          {/* Audio Player */}
          {note?.audio && (
            <div className="bg-richblack-700 p-4 rounded-lg">
              <h3 className="text-richblack-5 mb-2">Audio Recording</h3>
              <audio controls className="w-full" src={note.audio}>
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {/* Transcribed Text */}
          {note?.transcribedText && (
            <div className="bg-richblack-700 p-4 rounded-lg">
              <h3 className="text-richblack-5 mb-2">Transcribed Text</h3>
              <p className="text-richblack-200 whitespace-pre-wrap">
                {note.transcribedText}
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-richblack-5 mb-2">Title</label>
            <input
              type="text"
              {...register("title")}
              className="w-full px-4 py-2 rounded-lg bg-richblack-700 text-richblack-5 border border-richblack-600 focus:outline-none focus:ring-1 focus:ring-yellow-50"
              placeholder="Enter note title"
            />
          </div>

          {/* Content Textarea */}
          <div>
            <label className="block text-richblack-5 mb-2">Content</label>
            <textarea
              {...register("content")}
              className="w-full px-4 py-2 rounded-lg bg-richblack-700 text-richblack-5 border border-richblack-600 focus:outline-none focus:ring-1 focus:ring-yellow-50 min-h-[100px]"
              placeholder="Enter note content"
            />
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <Image className="h-5 w-5" />
                <span className="text-sm">Add Images</span>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  multiple
                />
              </label>
              {selectedImages.length > 0 && (
                <span className="text-sm text-gray-500">
                  {selectedImages.length} image(s) selected
                </span>
              )}
            </div>

            {/*current images*/}
            <div className="grid grid-cols-4 gap-4 mt-4">
              {note?.images?.map((image, index) => (
                <a key={index} href={image} target="_blank">
                  <img
                    src={image}
                    alt={`Note image ${index + 1}`}
                    className="rounded-lg w-full h-24 object-cover cursor-pointer"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-richblack-700 text-richblack-5 rounded-lg hover:bg-richblack-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-caribbeangreen-500 text-richblack-900 rounded-lg hover:bg-caribbeangreen-600 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNoteModal;
