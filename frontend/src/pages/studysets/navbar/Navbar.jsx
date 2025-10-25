import {useTranslation} from 'react-i18next';
import {NavLink, Outlet} from 'react-router-dom';
export default function Navbar() {
  //variables
  const { t, i18n } = useTranslation();

  //return statement
  return (
    <div className="w-full h-200  flex flex-col justify-baseline">
      <div className="w-full h-20 flex flex-col justify-center gap-5">
        <div className="w-full flex flex-row gap-10">
          <NavLink to="studysets" className="w-1/10 h-6 flex justify-center items-center text-studodarkblue
 		hover:scale-110 hover:text-green-300 transition-transform transition-colors duration-300 dark:text-white
          aria-[current=page]:font-bold text-studoblue dark:text-green-300">{t('Studysets')}</NavLink>

          <NavLink to="folders" className="w-1/10 h-6 flex justify-center items-center text-studodarkblue
          hover:scale-110 hover:text-green-300 transition-transform transition-colors duration-300 dark:text-white
          aria-[current=page]:font-bold text-studoblue dark:text-green-300">{t('Folders')}</NavLink>

          <NavLink to="courses" className="w-1/10 h-6  flex justify-center items-center text-studodarkblue
          hover:scale-110  hover:text-green-300 transition-transform transition-colors duration-300 dark:text-white
          aria-[current=page]:font-bold text-studoblue dark:text-green-300">{t('Courses')}</NavLink></div>
        <div className="w-full h-1 bg-studogrey rounded-4xl">

        </div>
      </div>

      <Outlet />
    </div>);
}