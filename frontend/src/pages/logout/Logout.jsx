// src/pages/Logout.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/auth";

export default function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate("/welcome", { replace: true });
    /*
    setTimeout(() => {
      navigate("/welcome", { replace: true });
    }, 500);*/
  }, [logout, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold dark:text-white">Logging out...</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          You will be redirected shortly.
        </p>
      </div>
    </div>
  );
}