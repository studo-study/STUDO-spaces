import { useTranslation } from "react-i18next";
import { NavLink, useParams } from "react-router-dom";
import ClassNav from "./classnav/ClassNav.jsx";

export default function Navbar({ data, isLoading }) {
  const { t, i18n } = useTranslation();
  const { id } = useParams();


  const classrooms = data?.classrooms || [];

  return (
    <div className="w-full h-fit flex flex-col justify-baseline">
      <div className="w-full h-20 flex flex-col justify-center gap-5">
        <div className="w-full flex flex-row gap-10 overflow-x-scroll scroll-hidden">
          {!isLoading && classrooms.map((item) => (
            <NavLink to={item.id} key={item.id}>
              <div
                className={`p-2 pr-5 pl-5 w-70 truncate text-center ${id === item.id ? "font-bold" : null} h-10 text-studodarkblue dark:text-white cursor-pointer rounded-4xl  aria-[current=page]:font-bold`}>
                {item.name}
              </div>
            </NavLink>
          ))}
        </div>
        <div className="w-full h-1 bg-studogrey rounded-4xl"></div>
      </div>
    </div>
  );
}