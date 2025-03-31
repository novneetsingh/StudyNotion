import axios from "axios";
import { setUser } from "../redux-toolkit/slices/profileSlice";

// Function to logout user
export function logout(navigate) {
  return async (dispatch) => {
    try {
      await axios.post(`/auth/logout`, {});

      dispatch(setUser(null));
      navigate("/login");
    } catch (error) {
      console.log("Logout Error:", error);
    }
  };
}
