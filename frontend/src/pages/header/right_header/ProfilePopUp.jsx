import profile from '../../../assets/icons/profile.svg';
import logout from '../../../assets/icons/logout.svg';
import privacy from '../../../assets/icons/privacy.svg';
import streak from '../../../assets/icons/streak.svg';
import 'animate.css';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useEffect, useRef} from 'react';

export default function ProfilePopUp({isOpen, onClose}) {
  const { t, i18n } = useTranslation();
  const popupRef = useRef(null);
  const name = 'Charles Degraeuwe';
  const email = 'charles.degraeuwe@icloud.com';
  const Streak = 15;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div
      ref={popupRef}
      className={`fixed top-27 right-10 z-[9999] flex flex-col items-center
         p-4 gap-3 font-akira text-2xl text-[#2a3a42] font-semibold
         rounded-3xl border border-white/30
         shadow-[8px_8px_16px_#bebebe,_-8px_-8px_16px_rgba(255,255,255,0.5)]
         bg-[rgba(224,224,224,0.2)] backdrop-blur-md
         dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
         transition-all duration-300
         ${isOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'}`}>

      <div className="w-full">
        <Link to={`${Streak > 2 ? '/streak' : '/account'}`}>
          <div
            className={`flex flex-col items-baseline w-75 h-24 font-atrament text-[#2a3a42]
              rounded-xl shadow-md
             border-solid border-2 border-studogrey justify-center
             cursor-pointer select-none transition-transform duration-300 ease-out
             ${Streak > 9 ? 'background-profile' : 'bg-studogrey'}
              p-4 overflow-hidden`}>
            <div className="overflow-hidden w-full flex flex-row items-center gap-2">
              <span className="text-2xl text-start  dark:text-white animate__animated animate__headShake
                font-bold h-fit w-fit max-w-3/4 text-ellipsis overflow-hidden">
                {name}
              </span>
              <Link to="/streak"><img src={streak} className={`${Streak > 2 && Streak < 10 ? 'flex' : 'hidden'}
             transition-scale duration-300 hover:scale-110 h-fit w-5`}/></Link>
            </div>
            <span className={`text-ellipsis w-2 text-sm text-gray-400 
          ${Streak > 9 ? 'dark:text-studodarkblue' : 'dark:text-gray-400'} font-bold font-sfpro`}>
              {email}
            </span>
          </div></Link>
      </div>

      <Link to="/Account" className="w-full">
        <div className="flex items-center w-75 h-12 font-atrament text-base text-[#2a3a42]
              bg-studogrey rounded-xl shadow-md
             border-solid border-2 border-studogrey font-semibold
             cursor-pointer select-none transition-transform duration-300 ease-out
             hover:scale-105">
          <span className="flex items-center w-full px-4 py-2 gap-2 dark:text-white">
            <img src={profile} alt="" className="h-6 dark:invert dark:brightness-0"/>
            {t('account').toUpperCase()}
          </span>
        </div>
      </Link>
      <Link to="/Privacy" className="w-full">
        <div className="flex items-center w-75 h-12 font-atrament text-base text-[#2a3a42]
              bg-studogrey rounded-xl shadow-md
             border-solid border-2 border-studogrey font-semibold
             cursor-pointer select-none transition-transform duration-300 ease-out
             hover:scale-105">
          <span className="flex items-center w-full px-4 py-2 gap-2 dark:text-white">
            <img src={privacy} alt="" className="h-6 dark:invert dark:brightness-0"/>
            {t('privacy').toUpperCase()}
          </span>
        </div>
      </Link>
      <div className="w-full">
        <div className="flex items-center w-75 h-12 font-atrament text-base text-[#2a3a42]
              bg-studogrey rounded-xl shadow-md
             border-solid border-2 border-studogrey font-semibold
             cursor-pointer select-none transition-transform duration-300 ease-out
             hover:scale-105">
          <span className="flex items-center w-full px-4 py-2 gap-2 dark:text-white">
            <img src={logout} alt="" className="h-6 dark:invert dark:brightness-0"/>
            {t('Log Out').toUpperCase()}
          </span>
        </div>
      </div>

    </div>);
}