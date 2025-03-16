import { createSlice } from "@reduxjs/toolkit";

// Define the initial state using values from localStorage if available
const initialState = {
  user: null,
  loading: false, // Track loading state for profile operations
};

const profileSlice = createSlice({
  name: "profile", // Naming the slice for accessing and debugging
  initialState,
  reducers: {
    // Action to set the user data in the state
    setUser(state, value) {
      state.user = value.payload; // Update the user state with payload
    },
    // Action to toggle the loading state during API calls
    setLoading(state, value) {
      state.loading = value.payload; // Set the loading state true/false
    },
  },
});

// Export the actions to be used elsewhere in the application
export const { setUser, setLoading } = profileSlice.actions;

// Default export of the reducer to be incorporated into the store
export default profileSlice.reducer;
