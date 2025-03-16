// Import combineReducers utility from Redux Toolkit
import { combineReducers } from "@reduxjs/toolkit";
// Import each slice reducer

import courseReducer from "../slices/courseSlice";
import profileReducer from "../slices/profileSlice";
import viewCourseReducer from "../slices/viewCourseSlice";

// Combine all the slice reducers into a single root reducer
export const rootReducer = combineReducers({
  // Assign the profileReducer to manage the 'profile' slice of the state
  profile: profileReducer,
  // Assign the courseReducer to manage the 'course' slice of the state
  course: courseReducer,
  // Assign the viewCourseReducer to manage the 'viewCourse' slice of the state
  viewCourse: viewCourseReducer,
});
