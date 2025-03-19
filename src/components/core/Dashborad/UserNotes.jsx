import VoiceNoteRecorder from "./Notes/VoiceNoteRecorder";
import AllNotes from "./Notes/AllNotes";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../redux-toolkit/slices/profileSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";

const UserNotes = () => {
  const dispatch = useDispatch();
  const [notes, setNotes] = useState([]);

  // Fetch all notes
  const fetchNotes = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/notes/all-notes`,
        {
          withCredentials: true,
        }
      );
      setNotes(response.data.notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error("Failed to fetch notes");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-richblack-900">
      <div className="flex-1 overflow-y-auto pb-20">
        <AllNotes fetchNotes={fetchNotes} notes={notes} />
      </div>
      <VoiceNoteRecorder fetchNotes={fetchNotes} />
    </div>
  );
};

export default UserNotes;
