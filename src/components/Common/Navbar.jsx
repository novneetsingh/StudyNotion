import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BsChevronDown } from "react-icons/bs";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import axios from "axios";
import { setLoading } from "../../redux-toolkit/slices/profileSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, loading } = useSelector((state) => state.profile);
  const [subLinks, setSubLinks] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      dispatch(setLoading(true));
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/course/showAllCategories`
        );
        setSubLinks(res.data.data);
      } catch (error) {
        console.log("Could not fetch Categories.", error);
      }
      dispatch(setLoading(false));
    };

    fetchCategories();
  }, []);

  const matchRoute = (route) => route === location.pathname;

  return (
    <div className="flex h-16 items-center justify-center border-b border-b-richblack-700 bg-richblack-900 shadow-lg">
      <div className="flex w-full max-w-maxContent items-center justify-between">
        <Link to="/">
          <img
            src={logo}
            alt="Logo"
            width={160}
            height={32}
            loading="lazy"
            className="hover:opacity-90 transition-opacity"
          />
        </Link>

        <nav className="flex justify-center mr-28">
          <ul className="flex gap-12 text-richblack-25 font-semibold">
            {NavbarLinks.map((link, index) => (
              <li key={index} className="relative group">
                {link.title === "Catalog" ? (
                  <div
                    className={`flex items-center gap-1 ${
                      matchRoute("/catalog/:catalogName")
                        ? "text-yellow-25"
                        : "text-richblack-25"
                    } hover:text-yellow-50 transition-colors`}
                  >
                    <p>{link.title}</p>
                    <BsChevronDown />
                    <div className="absolute left-1/2 top-full z-50 mt-2 hidden w-48 transform -translate-x-1/2 flex-col rounded-lg bg-richblack-800 p-4 text-richblack-100 group-hover:flex group-hover:opacity-100 lg:w-64">
                      <div className="absolute left-1/2 top-0 h-6 w-6 transform -translate-x-1/2 -translate-y-1/2 rotate-45 bg-richblack-800"></div>
                      {loading ? (
                        <p className="text-center">Loading...</p>
                      ) : subLinks.length ? (
                        subLinks
                          .filter((subLink) => subLink?.courses?.length >= 0)
                          .map((subLink, i) => (
                            <Link
                              to={`/catalog/${subLink.name
                                .split(" ")
                                .join("-")
                                .toLowerCase()}`}
                              className="rounded-lg py-2 pl-4 hover:bg-richblack-700 transition-colors"
                              key={i}
                            >
                              {subLink.name}
                            </Link>
                          ))
                      ) : (
                        <p className="text-center">No Courses Found</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={link?.path}
                    className={`${
                      matchRoute(link?.path)
                        ? "text-yellow-25"
                        : "text-richblack-25"
                    } hover:text-yellow-50 transition-colors`}
                  >
                    {link.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-x-4">
          {user === null ? (
            <>
              <Link to="/login">
                <button className="rounded-lg border border-richblack-700 bg-richblack-800 px-4 py-2 text-richblack-100 transition-all hover:bg-richblack-700 hover:border-yellow-50">
                  Log in
                </button>
              </Link>
              <Link to="/signup">
                <button className="rounded-lg border border-richblack-700 bg-richblack-800 px-4 py-2 text-richblack-100 transition-all hover:bg-richblack-700 hover:border-yellow-50">
                  Sign up
                </button>
              </Link>
            </>
          ) : (
            <Link to="/dashboard/my-profile">
              <img
                src={user?.image}
                className="h-8 w-8 rounded-full object-cover border-2 border-yellow-50"
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
