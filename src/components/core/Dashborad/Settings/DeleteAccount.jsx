import { FiTrash2 } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../../Common/ConfirmationModal";
import { useState } from "react";
import axios from "axios";
import { logout } from "../../../../utils/Logout";
import { toast } from "react-hot-toast";

export default function DeleteAccount() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirmationModal, setConfirmationModal] = useState(null);

  // Function to handle account deletion
  async function handleDeleteAccount() {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/profile/deleteProfile`,
        {
          withCredentials: true,
        }
      );

      toast.success("Profile Deleted Successfully");
      dispatch(logout(navigate));
    } catch (error) {
      console.log("DELETE PROFILE API ERROR............", error);
      toast.error("Could Not Delete Profile");
    }
  }

  return (
    <>
      {/* Main container */}
      <div className="my-10 flex flex-row gap-x-5 rounded-md border-[1px] border-pink-700 bg-pink-900 p-8 px-12">
        {/* Trash icon */}
        <div className="flex aspect-square h-14 w-14 items-center justify-center rounded-full bg-pink-700">
          <FiTrash2 className="text-3xl text-pink-200" />
        </div>

        {/* Text content */}
        <div className="flex flex-col space-y-2">
          <h2 className="text-lg font-semibold text-richblack-5">
            Delete Account
          </h2>
          <div className="w-3/5 text-pink-25">
            <p>Would you like to delete your account?</p>
            <p>
              This account may contain Paid Courses. Deleting your account is
              permanent and will remove all the content associated with it.
            </p>
          </div>

          {/* Button to trigger confirmation modal */}
          <button
            className="w-fit cursor-pointer italic text-pink-300"
            onClick={() =>
              setConfirmationModal({
                text1: "Are you sure?",
                text2: "Your account will be deleted permanently.",
                btn1Text: "Delete",
                btn2Text: "Cancel",
                btn1Handler: handleDeleteAccount,
                btn2Handler: () => setConfirmationModal(null),
              })
            }
          >
            I want to delete my account.
          </button>
        </div>
      </div>

      {/* Confirmation modal */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}
