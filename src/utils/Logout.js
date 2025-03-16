import axios from "axios";
import { setUser } from "../redux-toolkit/slices/profileSlice";

// Function to logout user
export function logout(navigate) {
  return async (dispatch) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/logout`,
        {},
        { withCredentials: true } // Ensures the cookie is deleted
      );

      dispatch(setUser(null));
      navigate("/login");
    } catch (error) {
      console.log("Logout Error:", error);
    }
  };
}
