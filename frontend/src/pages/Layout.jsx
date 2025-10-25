import { Outlet } from 'react-router-dom';
import Header from './header/Header.jsx';

export default function Layout() {
  return (
    <div className="w-full min-h-screen text-studodarkblue dark:text-white bg-blue-50 dark:bg-gray-800">
      <Header/>
      <div>
        <Outlet />
      </div>
    </div>
  );
}