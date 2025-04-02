import { useEffect } from "react";
import NotesCard from "./NotesCard";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../../redux-toolkit/slices/profileSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { setNotes } from "../../../../redux-toolkit/slices/notesSlice";

const AllNotes = () => {
  const dispatch = useDispatch();
  const { notes } = useSelector((state) => state.notes);
  const { loading } = useSelector((state) => state.profile);

  useEffect(() => {
    const fetchNotes = async () => {
      // Avoid fetching if notes are already present
      if (notes.length > 0) return;

      try {
        dispatch(setLoading(true));
        const response = await axios.get(`/notes/all-notes`);
        dispatch(setNotes(response.data.notes));
      } catch (error) {
        console.error("Error fetching notes:", error);
        toast.error("Failed to fetch notes");
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchNotes();
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
          My Notes
        </h1>
      </div>

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h2 className="text-xl font-semibold text-richblack-5 mb-2">
            No notes yet
          </h2>
          <p className="text-richblack-300 max-w-md">
            Start adding notes by using the voice recorder below. Your notes
            will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {notes.map((note) => (
            <NotesCard key={note._id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllNotes;
