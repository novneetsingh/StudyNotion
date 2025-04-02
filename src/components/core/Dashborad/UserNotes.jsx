import VoiceNoteRecorder from "./Notes/VoiceNoteRecorder";
import AllNotes from "./Notes/AllNotes";

const UserNotes = () => {
  return (
    <div className="flex-1 flex flex-col bg-richblack-900">
      <div className="flex-1 overflow-y-auto pb-20">
        <AllNotes />
      </div>
      <VoiceNoteRecorder />
    </div>
  );
};

export default UserNotes;
