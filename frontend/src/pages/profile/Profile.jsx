import {useTranslation} from 'react-i18next';
import Streak from '../../assets/icons/streak.svg';
import Cal from '../../assets/icons/calendar.svg';
import {Link} from 'react-router-dom';
import {useRef} from 'react';

export default function Profile() {
//variables
  const DeleteBtn = useRef(null);
  const LogOutBtn = useRef(null);
  //TODO
  const Name = 'Chacha';
  //TODO
  const date = 'June 17, 2025';

  const { t, i18n } = useTranslation();

  //return statement
  return(
    <div className="w-full h-screen flex flex-col items-center justify-baseline pt-35">
      <div className="flex w-3/5 flex-col items-center justify-center gap-5">
        <div className="flex flex-row justify-baseline items-center
			  bg-studowhite min-h-32 w-full gap-5 border-1 border-transparent
			  border-studoborder rounded-4xl
			  shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe] backdrop-blur-xs p-4
			dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]">
          <div className="bg-green-300 rounded-full h-22 w-22"></div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-row justify-baseline items-center gap-3">
              <span className="flex items-center text-2xl
              font-sfpro font-bold text-studodarkblue dark:text-white">{Name}</span>
              <span className="flex flex-col items-center text-studodarkblue dark:text-white cursor-pointer">#</span>
              <img className="h-5 cursor-pointer" src={Streak} alt="calendar icon"/>
            </div>
            <div className="flex flex-row justify-baseline items-center gap-3">
              <img className="h-5 dark:brightness-0 dark:invert"src={Cal} alt="calendar icon"/>
              <span className="text-studodarkblue dark:text-white">{t('Joined')}: {date}</span>
            </div>
          </div>
        </div>

        <div className="w-full h-40 flex flex-col gap-5">
          <div className="flex flex-row justify-between">
            <span className="text-2xl font-bold font-sfpro text-studodarkblue dark:text-white">
              {Name}'s {t(`sets`)}:
			</span>
          </div>
          <div>{}</div>
          <div className="w-full h-10 flex flex-row justify-end items-center">
            <div className="text-studodarkblue dark:text-white cursor-pointer">{t('all sets')}</div>
          </div>

        </div>
      </div>
    </div>);
}