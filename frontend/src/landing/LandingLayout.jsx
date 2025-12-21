import { Outlet } from "react-router-dom";
import LandingHeader from "./components/header/LandingHeader.jsx";
import LandingFooter from "./components/footer/LandingFooter.jsx";

export default function LandingLayout() {
  return (
    <div className="w-full min-h-screen text-studodarkblue dark:text-white bg-blue-50 dark:bg-gray-800 flex flex-col">
      <LandingHeader />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <LandingFooter />
    </div>
  );
}