import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Main = () => {
  return (
    <div className="w-full flex">
      <Sidebar />
      <div className="w-full p-3">
        <Outlet />
      </div>
    </div>
  );
};

export default Main;
