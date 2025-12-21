import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/auth";

export default function PrivateRoute() {
  const { ready, isAuthed } = useAuth();
  const { pathname } = useLocation();

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1>Loading...</h1>
        <p>
          Please wait while we are checking your credentials and loading the
          application.
        </p>
      </div>
    );
  }

  if (isAuthed) {
    return <Outlet />;
  }

  return <Navigate replace to={`/login?redirect=${pathname}`} />;
}