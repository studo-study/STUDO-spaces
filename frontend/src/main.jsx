import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import {createBrowserRouter, RouterProvider, Navigate} from 'react-router-dom';
import './i18n.js';

//pages
import Login from './pages/login/Login.jsx';
import Register from './pages/register/Register.jsx';
import Studysets from './pages/studysets/Studysets.jsx';
import Studyset from './pages/studyset/Studyset.jsx';
import Folders from './pages/folders/Folders.jsx';
import Folder from './pages/folder/Folder.jsx';
import CreateSet from './pages/create-set/CreateSet.jsx';
import CreateFolder from './pages/create-folder/CreateFolder.jsx';
import Account from './pages/account/Account.jsx';
import Classrooms from './pages/classrooms/Classrooms.jsx';
import Classroom from './pages/classroom/Classroom.jsx';
import StartingPagina from './pages/startpagina/Startpagina.jsx';
import Layout from './pages/Layout.jsx';
import Courses from './pages/courses/Courses.jsx';
import Course from './pages/course/Course.jsx';
import StudysetsPage from './pages/studysets/navbar/studysets/StudysetsPage.jsx';
import FoldersPage from './pages/studysets/navbar/folders/FoldersPage.jsx';
import CoursesPage from './pages/studysets/navbar/courses/CoursesPage.jsx';
import Streak from './pages/streak/Streak.jsx';
import Error from './pages/error/Error.jsx';
import Profile from './pages/profile/Profile.jsx';
import Privacy from './pages/privacy/Privacy.jsx';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Navigate replace to='/home' />,
      },
      {
        path: '/home',
        element: <StartingPagina />,
      },
      {path: '/login', element: <Login />}, {path: '/privacy', element: <Privacy />},
      {path: '/register', element: <Register />},
      {
        path: '',
        element: <Studysets />,
        children: [
          {
            path: 'studysets',
            element: <StudysetsPage />,
          },
          {
            path: 'folder',
            element: <FoldersPage />,
          },
          {
            path: 'courses',
            element: <CoursesPage />,
          },
        ],
      },
      {path: '/studyset/:id', element: <Studyset />},
      {path: '/folder', element: <Folders />},
      {path: '/folder', element: <Folder />},
      {path: '/create-set', element: <CreateSet />},
      {path: '/create-folder', element: <CreateFolder />},
      {path: '/account', element: <Account />},
      {
        path: '/classrooms',
        element: <Classrooms />,
        children: [
          {
            path: ':id',
            element: <Classroom />,
          },
        ],
      },
      {path: '/courses', element: <Courses />},
      {path: 'courses/:id', element: <Course />},
      {path: '/streak', element: <Streak />},
      {path: '/profile/:id', element: <Profile />},
      { path: '*', element: <Error/> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
);