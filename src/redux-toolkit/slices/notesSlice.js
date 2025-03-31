import { createSlice } from "@reduxjs/toolkit";

// Define the initial state of the course management section of the application
const initialState = {
  notes: [], // state to store notes data
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    // Set the current step in a multi-step form or process
    setNotes: (state, action) => {
      state.notes = action.payload;
    },
  },
});

// Export actions to be used in components for dispatching changes to the state
export const { setNotes } = notesSlice.actions;

// Default export of the reducer to be included in the store
export default notesSlice.reducer;
