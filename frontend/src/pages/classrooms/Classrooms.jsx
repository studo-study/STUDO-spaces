import {useTranslation} from 'react-i18next';
import Navbar from './navbar/Navbar.jsx';
import { Outlet } from 'react-router-dom';
export default function Classrooms() {
  const { t, i18n } = useTranslation();
  return(
    <div className="w-full h-screen flex flex-col items-center justify-baseline pt-35">
      <div className="flex w-3/5 flex-col items-center justify-center gap-3">
        <span className="w-full text-4xl flex flex-col justify-center items-baseline font-semibold
      text-studodarkblue font-atrament dark:text-white">{t("YOUR CLASSROOMS")}
        </span>
        <Navbar />
        <Outlet />
      </div>
    </div>);
}