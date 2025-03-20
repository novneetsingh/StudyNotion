import { ACCOUNT_TYPE } from "../utils/constants";

export const sidebarLinks = [
  {
    id: 1,
    name: "My Profile",
    path: "/dashboard/my-profile",
    icon: "VscAccount",
  },
  {
    id: 2,
    name: "My Courses",
    path: "/dashboard/my-courses",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscVm",
  },
  {
    id: 3,
    name: "Add Course",
    path: "/dashboard/add-course",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscAdd",
  },
  {
    id: 4,
    name: "Enrolled Courses",
    path: "/dashboard/enrolled-courses",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscMortarBoard",
  },
  {
    id: 5,
    name: "My Notes",
    path: "/dashboard/my-notes",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscNotebook",
  },
  {
    id: 6,
    name: "Job Support",
    path: "/dashboard/job-support",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscBriefcase",
  },
  {
    id: 7,
    name: "ChatBot",
    path: "/dashboard/chatbot",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscHubot",
  },
];
