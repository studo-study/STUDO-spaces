import { Outlet } from "react-router-dom";
import Header from "../components/header/Header.jsx";
import useSWR from "swr";
import { getById } from "../api/index.js";
import { useTranslation } from "react-i18next";

export default function Layout() {
  const {
    data: headerData = {},
    isLoading: isLoadingHeader,
    error: errorHeader
  } = useSWR("users/me/headers");


  return (
    <div
      className="w-full min-h-screen text-studodarkblue  scroll-hidden dark:text-white scroll-hidden bg-blue-50 dark:bg-gray-800">
      <Header headerData={headerData} />
      <div>
        <Outlet />
      </div>

    </div>
  );
}