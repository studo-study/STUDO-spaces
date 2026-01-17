import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import './i18n';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from './i18n';
import { SWRConfig } from "swr";
import { HelmetProvider } from "react-helmet-async";

import { AuthProvider } from "./contexts/Auth.context.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Layout from "./pages/Layout.jsx";
import LandingLayout from "./landing/LandingLayout.jsx";
import LanguageWrapper from "./components/LanguageWrapper.jsx";

import Login from "./pages/login/Login.jsx";
import Register from "./pages/register/Register.jsx";
import Logout from "./pages/logout/Logout.jsx";
import Studysets from "./pages/studysets/Studysets.jsx";
import Studyset from "./pages/studyset/Studyset.jsx";
import Folders from "./pages/folders/Folders.jsx";
import CreateOrEditSet from "./pages/create-set/CreateOrEditSet.jsx";
import CreateFolder from "./pages/create-folder/CreateFolder.jsx";
import Account from "./pages/account/Account.jsx";
import Classrooms from "./pages/classrooms/Classrooms.jsx";
import Classroom from "./pages/classroom/Classroom.jsx";
import StartingPagina from "./pages/startpagina/Startpagina.jsx";
import Course from "./pages/studysets/navbar/courses/Course.jsx";
import StudysetsPage from "./pages/studysets/navbar/studysets/StudysetsPage.jsx";
import FoldersPage from "./pages/studysets/navbar/folders/FoldersPage.jsx";
import CoursesPage from "./pages/studysets/navbar/courses/CoursesPage.jsx";
import Streak from "./pages/streak/Streak.jsx";
import Error from "./pages/error/Error.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Privacy from "./pages/privacy/Privacy.jsx";
import CreateOrEditVisualset from "./pages/create-visualset/CreateOrEditVisualset.jsx";
import Visualsets from "./pages/profile/visualsets/Visualsets.jsx";
import Sets from "./pages/profile/studysets/Sets.jsx";
import Visualset from "./pages/visualset/Visualset.jsx";
import Learn from "./pages/studysetmethods/learn/Learn.jsx";
import Flashcards from "./pages/studysetmethods/flashcards/Flashcards.jsx";
import Speedy from "./pages/studysetmethods/speedy/Speedy.jsx";
import Search from "./pages/search/Search.jsx";
import Welcome from "./landing/pages/welcome/Welcome.jsx";
import AboutUs from "./landing/pages/aboutus/AboutUs.jsx";
import AI from "./landing/pages/ai/AI.jsx";
import AboutFlashcards from "./landing/pages/flashcards/AboutFlashcards.jsx";
import AboutPin from "./landing/pages/identify/AboutPin.jsx";
import AboutPoint from "./landing/pages/point/AboutPoint.jsx";
import AboutSpeedy from "./landing/pages/speedy/AboutSpeedy.jsx";
import AboutVisualsets from "./landing/pages/visualsets/AboutVisualsets.jsx";
import AboutStudysets from "./landing/pages/studysets/AboutStudysets.jsx";
import AboutLearn from "./landing/pages/learn/AboutLearn.jsx";
import AuthCallback from "./contexts/AuthCallback.jsx";
import { getById } from "./api/index.js";
import ClassPage from "./pages/classroom/Class.jsx";
import Point from "./pages/visualsetmethods/point/Point.jsx";
import Identify from "./pages/visualsetmethods/identify/Identify.jsx";

// Private routes (no language prefix needed - users are logged in)
const privateRoutes = [
  {
    path: "home",
    element: <StartingPagina />
  },
  {
    path: "privacy",
    element: <Privacy />
  },
  {
    path: "studysets",
    element: <Studysets />,
    children: [{ index: true, element: <StudysetsPage /> }]
  },
  {
    path: "folders",
    element: <Studysets />,
    children: [{ index: true, element: <FoldersPage /> }]
  },
  {
    path: "folders/:id",
    element: <Studysets />,
    children: [{ index: true, element: <Folders /> }]
  },
  {
    path: "courses",
    element: <Studysets />,
    children: [{ index: true, element: <CoursesPage /> }]
  },
  {
    path: "courses/:id",
    element: <Studysets />,
    children: [{ index: true, element: <Course /> }]
  },
  {
    path: "search",
    element: <Search />
  },
  {
    path: "studoset/:id",
    element: <Studyset />
  },
  {
    path: "learn/:id",
    element: <Learn />
  },
  {
    path: "identify/:id",
    element: <Identify />
  },
  {
    path: "point/:id",
    element: <Point />
  },
  {
    path: "flashcards/:id",
    element: <Flashcards />
  },
  {
    path: "speedy/:id",
    element: <Speedy />
  },
  {
    path: "((visualset))/:id",
    element: <Visualset />
  },
  {
    path: "create-set",
    element: <CreateOrEditSet />
  },
  {
    path: "create-set/:id",
    element: <CreateOrEditSet />
  },
  {
    path: "create-folder",
    element: <CreateFolder />
  },
  {
    path: "create-((visualset))",
    element: <CreateOrEditVisualset />
  },
  {
    path: "account",
    element: <Account />
  },
  {
    path: "classroom/:id",
    element: <ClassPage />
  },
  {
    path: "classrooms",
    element: <Classrooms />,
    children: [{ path: ":id", element: <Classroom /> }]
  },
  {
    path: "streak",
    element: <Streak />
  },
  {
    path: "profile/:id",
    element: <Profile />,
    children: [
      { index: true, element: <Navigate to="studysets" replace /> },
      { path: "studysets", element: <Sets /> },
      { path: "visualsets", element: <Visualsets /> }
    ]
  }
];

// Landing pages (public, need language prefixes for SEO)
const landingRoutes = [
  { path: "welcome", element: <Welcome /> },
  { path: "about-us", element: <AboutUs /> },
  { path: "about-ai", element: <AI /> },
  { path: "flashcards", element: <AboutFlashcards /> },
  { path: "learn", element: <AboutLearn /> },
  { path: "identify", element: <AboutPin /> },
  { path: "point", element: <AboutPoint /> },
  { path: "speedy", element: <AboutSpeedy /> },
  { path: "about-studosets", element: <AboutStudysets /> },
  { path: "about-visualsets", element: <AboutVisualsets /> },
];

// Auth pages
const authRoutes = [
  { path: "login", element: <Login /> },
  { path: "register", element: <Register /> },
  { path: "logout", element: <Logout /> },
];

// Generate language-prefixed routes for marketing pages
const generateLangRoutes = (routes, layout) => {
  const langCodes = SUPPORTED_LANGUAGES.map(l => l.code).filter(c => c !== DEFAULT_LANGUAGE);

  return langCodes.map(lang => ({
    path: lang,
    element: <LanguageWrapper lang={lang}>{layout}</LanguageWrapper>,
    children: [
      // Redirect /nl → /nl/welcome
      { index: true, element: <Navigate to={`/${lang}/welcome`} replace /> },
      ...routes
    ]
  }));
};

const router = createBrowserRouter([
  // App routes (private)
  {
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />
      },
      {
        element: <PrivateRoute />,
        children: privateRoutes
      },
      {
        path: "*",
        element: <PrivateRoute />,
        children: [{ index: true, element: <Error /> }]
      }
    ]
  },

  // Landing pages - default language (no prefix)
  {
    element: <LandingLayout />,
    children: landingRoutes
  },

  // Landing pages - with language prefix (/nl/welcome, /de/welcome, etc.)
  ...generateLangRoutes(landingRoutes, <LandingLayout />),

  // Auth pages - default language
  ...authRoutes,

  // Auth pages - with language prefix
  ...SUPPORTED_LANGUAGES
    .filter(l => l.code !== DEFAULT_LANGUAGE)
    .flatMap(lang =>
      authRoutes.map(route => ({
        path: `${lang.code}/${route.path}`,
        element: <LanguageWrapper lang={lang.code}>{route.element}</LanguageWrapper>
      }))
    ),

  // Auth callback (no language prefix needed)
  {
    path: "/auth/callback",
    element: <AuthCallback />
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense fallback={<div className="w-screen h-screen flex items-center justify-center">Loading...</div>}>
      <HelmetProvider>
        <AuthProvider>
          <SWRConfig
            value={{
              fetcher: (url) => getById(url),
              revalidateOnFocus: false,
              revalidateOnReconnect: false,
              shouldRetryOnError: false,
              dedupingInterval: 60_000
            }}
          >
            <RouterProvider router={router} />
          </SWRConfig>
        </AuthProvider>
      </HelmetProvider>
    </Suspense>
  </StrictMode>
);