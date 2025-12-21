import Home from "../../../../public/assets/icons/home.svg";
import List from "../../../../public/assets/icons/list.svg";
import Folder from "../../../../public/assets/icons/folder.svg";
import Courses from "../../../../public/assets/icons/course.svg";
import Class from "../../../../public/assets/icons/classroom.svg";
import Account from "../../../../public/assets/icons/profile.svg";
import MenuPart from "./MenuPart.jsx";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Searchpart from "./Searchpart.jsx";

export default function Burger({ isOpen, setIsOpen }) {
  //variables
  const { t, i18n } = useTranslation();

  //return value
  return (
    <div
      className={`fixed top-0 left-0 h-screen w-70 p-4 
      pt-35 flex flex-col gap-2 border-r z-[998]
         bg-[rgba(224,224,224,0.2)] backdrop-blur-md
      border-gray-200 border-solid transform transition-transform font-atrament
      dark:bg-gray-700
      dark:border-gray-800
      duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex flex-col gap-2">
        <div className="lg:hidden md:hidden lg:hidden">
          <Searchpart isOpen={setIsOpen} />
        </div>
        <NavLink to="/home">{({ isActive }) => (
          <MenuPart svg={Home} isActive={isActive} name={t("HOME")} />)}</NavLink>
        <NavLink to="/studysets">{({ isActive }) => (
          <MenuPart svg={List} isActive={isActive} name={t("STUDYSETS")} />)}</NavLink>
        <NavLink to="/folders">{({ isActive }) => (
          <MenuPart svg={Folder} isActive={isActive} name={t("FOLDERS")} />)}</NavLink>
        <NavLink to="/courses">{({ isActive }) => (
          <MenuPart svg={Courses} isActive={isActive} name={t("COURSES")} />)}</NavLink>
        <div className="p-3 pt-10 pb-10">
          <hr className="border-gray-500 border-0.5 opacity-15" />
        </div>
        <div className="h-1/2 flex flex-col justify-end gap-2">
          <NavLink to="/classrooms">{({ isActive }) => (
            <MenuPart svg={Class} isActive={isActive} name={t("CLASSROOMS")} />)}</NavLink>
          <NavLink to="/Account">{({ isActive }) => (
            <MenuPart svg={Account} isActive={isActive} name={t("ACCOUNT")} />)}</NavLink>
        </div>
      </div>
    </div>
  );
}
