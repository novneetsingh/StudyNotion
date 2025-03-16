import IconBtn from "./IconBtn";

// ConfirmationModal component definition
export default function ConfirmationModal({ modalData }) {
  return (
    // Modal overlay
    <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      {/* Modal container */}
      <div className="w-11/12 max-w-[350px] rounded-lg border border-richblack-400 bg-richblack-800 p-6">
        {/* Modal title */}
        <p className="text-2xl font-semibold text-richblack-5">
          {modalData?.text1}
        </p>
        {/* Modal description */}
        <p className="mt-3 mb-5 leading-6 text-richblack-200">
          {modalData?.text2}
        </p>
        {/* Modal buttons */}
        <div className="flex items-center gap-x-4">
          {/* Icon button for the primary action */}
          <IconBtn
            onclick={modalData?.btn1Handler}
            text={modalData?.btn1Text}
          />
          {/* Secondary button for the cancel action */}
          <button
            className="cursor-pointer rounded-md bg-richblack-200 py-[8px] px-[20px] font-semibold text-richblack-900"
            onClick={modalData?.btn2Handler}
          >
            {modalData?.btn2Text}
          </button>
        </div>
      </div>
    </div>
  );
}
