import { useState } from "react";
import { AiOutlineCopy, AiOutlineCalendar } from "react-icons/ai";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { formatDate } from "../../../../utils/formatDate";
import { copyToClipboard } from "../../../../utils/copyToClipboard";
import EditNoteModal from "./EditNoteModal";
import { setNotes } from "../../../../redux-toolkit/slices/notesSlice";
import { useDispatch, useSelector } from "react-redux";

const NotesCard = ({ note }) => {
  const dispatch = useDispatch();
  const { notes } = useSelector((state) => state.notes); // Get the current notes from the Redux store
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await axios.delete(`/notes/delete-note/${note._id}`);

      // Filter out the deleted note from current notes
      dispatch(setNotes(notes.filter((n) => n._id !== note._id))); // Dispatch the new array directly
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  return (
    <div className="bg-richblack-800 text-richblack-5 rounded-xl border border-richblack-700 shadow-md hover:shadow-lg transition-all flex flex-col justify-between h-[220px] relative overflow-hidden">
      {/* Accent color top border */}
      <div className="h-1 w-full bg-yellow-50"></div>

      <div className="p-4 flex-1 flex flex-col">
        {/* Header with Date */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center text-xs text-richblack-300">
            <AiOutlineCalendar className="w-3 h-3 mr-1" />
            <span>{formatDate(note.createdAt)}</span>
          </div>
        </div>

        {/* Note Content */}
        <div className="flex-1 overflow-hidden">
          <h3 className="font-bold text-lg text-yellow-50 truncate mb-1">
            {note.title}
          </h3>
          <p className="text-richblack-100 text-sm line-clamp-3 leading-relaxed">
            {note.content}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-2 justify-end">
          <button
            onClick={() => copyToClipboard(note.content)}
            className="p-2 bg-richblack-700 hover:bg-richblack-600 rounded-lg transition-colors"
            title="Copy to clipboard"
          >
            <AiOutlineCopy className="w-4 h-4 text-yellow-50" />
          </button>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="p-2 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
            title="Edit note"
          >
            <FaRegEdit className="w-4 h-4 text-richblack-900" />
          </button>

          <button
            onClick={handleDelete}
            className="p-2 bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors"
            title="Delete note"
          >
            <FaRegTrashAlt className="w-4 h-4 text-richblack-5" />
          </button>
        </div>
      </div>
      {isEditModalOpen && (
        <EditNoteModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          note={note}
        />
      )}
    </div>
  );
};

export default NotesCard;
