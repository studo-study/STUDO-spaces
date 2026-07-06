import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/home/Home.tsx";
import About from "./pages/About";
import "./index.css";
import Lucide from "./pages/icons/Lucide.tsx";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      {
        path: "icons",
        element: <Lucide />,
      },
    ],
  },
]);
