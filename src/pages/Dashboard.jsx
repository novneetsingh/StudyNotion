import { Outlet } from "react-router-dom";
import Sidebar from "../components/core/Dashborad/Sidebar";
import FloatingChatBot from "../components/core/Dashborad/FloatingChatBot";

function Dashboard() {
  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] ">
      <Sidebar />
      <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
        <div className="mx-auto w-11/12 max-w-[1000px] py-10">
          <Outlet />
        </div>
      </div>
      <FloatingChatBot />
    </div>
  );
}

export default Dashboard;
