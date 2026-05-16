import { Outlet } from "react-router-dom";
import LandingHeader from "./components/header/LandingHeader.jsx";
import LandingFooter from "./components/footer/LandingFooter.jsx";
import { Helmet } from "react-helmet-async";

export default function LandingLayout() {
  return (
    <>
      <Helmet>
        <link
          rel="icon"
          href="/favicon_light.ico"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          href="/favicon_dark.ico"
          media="(prefers-color-scheme: dark)"
        />
        <link rel="icon" href="/favicon.ico" />
      </Helmet>
      <div className="w-full min-h-screen text-studodarkblue dark:text-white bg-blue-50 dark:bg-gray-800 flex flex-col">
        <LandingHeader />

        <Outlet />
        <div className="flex flex-col w-full h-fit z-[9999]">
          <LandingFooter />
        </div>
      </div>
    </>
  );
}
