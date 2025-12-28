import { Outlet } from "react-router-dom";
import LandingHeader from "./components/header/LandingHeader.jsx";
import LandingFooter from "./components/footer/LandingFooter.jsx";

export default function LandingLayout() {
  return (
    <div className="w-full min-h-screen text-studodarkblue dark:text-white bg-blue-50 dark:bg-gray-800 flex flex-col">
      <LandingHeader />


        <Outlet />
		<div className="flex flex-col w-full h-fit z-[9999]">
			<LandingFooter />
		</div>

    </div>
  );
}