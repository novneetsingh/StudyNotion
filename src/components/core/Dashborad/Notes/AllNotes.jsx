import { useEffect } from "react";
import NotesCard from "./NotesCard";
import { FileText } from "lucide-react";
import { useSelector } from "react-redux";

const AllNotes = ({ fetchNotes, notes }) => {
  const { loading } = useSelector((state) => state.profile);

  useEffect(() => {
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
          <div className="bg-richblack-700 p-5 rounded-full mb-4">
            <FileText className="w-10 h-10 text-yellow-50" />
          </div>
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
            <NotesCard key={note._id} note={note} fetchNotes={fetchNotes} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllNotes;
