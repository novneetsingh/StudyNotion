import * as Icons from "react-icons/vsc";
import { useDispatch } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { resetCourseState } from "../../../redux-toolkit/slices/courseSlice";

export default function SidebarLink({ link, iconName }) {
  const Icon = Icons[iconName];
  const location = useLocation();
  const dispatch = useDispatch();

  // Function to check if the current route matches the link's path
  const matchRoute = (route) => {
    return route === location.pathname;
  };

  return (
    <NavLink
      to={link.path}
      onClick={() => dispatch(resetCourseState())} 
      className={`relative px-8 py-2 text-md font-medium ${
        matchRoute(link.path)
          ? "bg-yellow-800 text-yellow-50" 
          : "bg-opacity-0 text-richblack-300" 
      } transition-all duration-200`} 
    >
      <div className="flex items-center gap-x-2">
        {/* Render the dynamically selected icon */}
        <Icon className="text-lg" />
        <span>{link.name}</span>
      </div>
    </NavLink>
  );
}
