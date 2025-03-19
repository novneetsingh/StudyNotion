import * as Icons from "react-icons/vsc"; // Import all icons from react-icons/vsc
import { useDispatch } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { resetCourseState } from "../../../redux-toolkit/slices/courseSlice";

export default function SidebarLink({ link, iconName }) {
  // Dynamically select the icon component based on the iconName prop
  const Icon = Icons[iconName];
  const location = useLocation(); // Get the current location
  const dispatch = useDispatch();

  // Function to check if the current route matches the link's path
  const matchRoute = (route) => {
    return route === location.pathname;
  };

  return (
    <NavLink
      to={link.path}
      onClick={() => dispatch(resetCourseState())} // Dispatch resetCourseState action on click
      className={`relative px-8 py-2 text-md font-medium ${
        matchRoute(link.path)
          ? "bg-yellow-800 text-yellow-50" // Active link styles
          : "bg-opacity-0 text-richblack-300" // Inactive link styles
      } transition-all duration-200`} // Transition for smooth style changes
    >
      <div className="flex items-center gap-x-2">
        {/* Render the dynamically selected icon */}
        <Icon className="text-lg" />
        <span>{link.name}</span>
      </div>
    </NavLink>
  );
}
