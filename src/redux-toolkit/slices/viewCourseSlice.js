import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courseName: "",
  courseContent: [], // Array to store course content (lectures)
};

const viewCourseSlice = createSlice({
  name: "viewCourse",
  initialState,
  reducers: {
    // Sets the course name
    setCourseName: (state, action) => {
      state.courseName = action.payload;
    },
    // Sets the course content (lectures)
    setCourseContent: (state, action) => {
      state.courseContent = action.payload;
    },
  },
});

export const { setCourseName, setCourseContent } = viewCourseSlice.actions;
export default viewCourseSlice.reducer;
