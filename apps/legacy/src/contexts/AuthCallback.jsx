import { useEffect } from "react";
import { JWT_TOKEN_KEY } from "./auth";

export default function AuthCallback() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const refreshToken = urlParams.get("refresh");

    if (token && token.trim() !== "") {
      localStorage.removeItem(JWT_TOKEN_KEY);
      localStorage.removeItem("refreshToken");

      localStorage.setItem(JWT_TOKEN_KEY, token);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      setTimeout(() => {
        window.location.replace("/home");
      }, 100);
    } else {
      setTimeout(() => {
        window.location.replace("/login");
      }, 1000);
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 dark:bg-gray-800">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Processing your login...
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
          Please wait, you will be redirected shortly.
        </p>
      </div>
    </div>
  );
}
