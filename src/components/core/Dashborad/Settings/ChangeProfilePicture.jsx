import { useRef } from "react";
import { FiUpload } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import IconBtn from "../../../Common/IconBtn";
import { setUser } from "../../../../redux-toolkit/slices/profileSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { setLoading } from "../../../../redux-toolkit/slices/profileSlice";

export default function ChangeProfilePicture() {
  const { user, loading } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Function to open file picker
  const handleClick = () => {
    fileInputRef.current.click();
  };

  // Handle file selection & upload immediately
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("displayPicture", file);

    const toastId = toast.loading("Updating Display Picture...");

    try {
      dispatch(setLoading(true));
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/profile/updateDisplayPicture`,
        formData,
        {
          withCredentials: true,
        }
      );

      toast.success("Display Picture Updated Successfully", { id: toastId });
      navigate("/dashboard/my-profile");
      dispatch(setUser(res.data.data));
    } catch (error) {
      console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error);
      toast.error("Could Not Update Display Picture", { id: toastId });
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex items-center justify-between rounded-md border border-richblack-700 bg-richblack-800 p-8 px-12 text-richblack-5">
      <div className="flex items-center gap-x-4">
        {/* ✅ Keep Profile Image, No Preview of Selected File */}
        <img
          src={user?.image} // Shows the current profile picture from Redux
          className="aspect-square w-[78px] rounded-full object-cover"
        />

        <div className="space-y-2">
          <p>Change Profile Picture</p>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange} // Calls API after selection
            className="hidden"
            accept="image/*"
          />

          {/* ✅ Single Button to Select & Upload */}
          <IconBtn
            text={loading ? "Uploading..." : "Select & Upload"}
            onclick={handleClick} // Opens file picker, upload happens automatically
          >
            <FiUpload className="text-lg text-richblack-900" />
          </IconBtn>
        </div>
      </div>
    </div>
  );
}
