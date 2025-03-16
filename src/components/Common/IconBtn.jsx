export default function IconBtn({
  text, // The text to display on the button
  onclick, // The function to call when the button is clicked
  children, // Any additional child elements to render inside the button
  disabled, // Boolean to indicate if the button should be disabled
  outline = false, // Boolean to determine if the button should have an outline style
  customClasses, // Additional custom classes for styling the button
  type, // The type attribute for the button element (e.g., "button", "submit")
}) {
  return (
    <button
      disabled={disabled} // Disable the button if the disabled prop is true
      onClick={onclick} // Set the onclick handler for the button
      className={`flex items-center ${
        outline ? "border border-yellow-50 bg-transparent" : "bg-yellow-50"
      } cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 ${customClasses}`}
      type={type} // Set the type attribute for the button
    >
      {children ? ( // If children are provided, render them along with the text
        <>
          <span className={`${outline && "text-yellow-50"}`}>{text}</span>
          {children}
        </>
      ) : (
        // Otherwise, just render the text
        text
      )}
    </button>
  );
}
