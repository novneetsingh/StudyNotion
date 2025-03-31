import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userCourses: [], // Array to store user courses (student or instructor)
  courseName: "",
  courseContent: [], // Array to store course content (lectures)
};

const viewCourseSlice = createSlice({
  name: "viewCourse",
  initialState,
  reducers: {
    // Sets the user courses (student or instructor)
    setUserCourses: (state, action) => {
      state.userCourses = action.payload;
    },
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

export const { setUserCourses, setCourseName, setCourseContent } =
  viewCourseSlice.actions;
export default viewCourseSlice.reducer;
