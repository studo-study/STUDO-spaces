import {useTranslation} from 'react-i18next';
import Stats from './stats/Stats.jsx';
import Studyset from '../../assets/icons/studyset.svg';
import Cards from '../../assets/icons/cards.svg';
import Time from '../../assets/icons/time.svg';
import Streak from '../../assets/icons/streak.svg';
import Cal from '../../assets/icons/calendar.svg';
import Button from './button/Button.jsx';
import Plus from '../../assets/icons/plus.svg';
import {Link} from 'react-router-dom';
import LogOut from '../../assets/icons/logout.svg';
import Delete from '../../assets/icons/delete.svg';
import Profile from './profilepicture/ProfilePicutre.jsx';
import {useRef} from "react";


export default function Account() {
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
          <Profile/>
          <div className="flex flex-col gap-3">
            <div className="flex flex-row justify-baseline items-center gap-3">
              <span className="flex items-center text-2xl
              font-sfpro font-bold text-studodarkblue dark:text-white">{Name}</span>
              <span className="flex flex-col items-center text-studodarkblue dark:text-white cursor-pointer">#</span>
              <Link to="/streak"><img className="h-5 cursor-pointer" src={Streak} alt="calendar icon"/></Link>
            </div>
            <div className="flex flex-row justify-baseline items-center gap-3">
              <img className="h-5 dark:brightness-0 dark:invert"src={Cal} alt="calendar icon"/>
              <span className="text-studodarkblue dark:text-white">{t("Joined")}: {date}</span>
            </div>
          </div>
        </div>

        <div className="w-full h-30 flex flex-col gap-5 mb-5">
          <span className="text-2xl font-bold font-sfpro text-studodarkblue dark:text-white">{t('My Stats')}:</span>
          <div className="flex flex-row gap-5 justify-between items-center">
            <Stats svg={Studyset} waarde={10} title={t('Studysets')}/>
            <Stats svg={Cards} waarde={10} title={t('Cards Studied')}/>
            <Stats svg={Time} waarde={10} title={t('Time Studied')}/>
          </div>
        </div>

        <div className="w-full h-40 flex flex-col gap-5">
          <div className="flex flex-row justify-between">
            <span className="text-2xl font-bold font-sfpro text-studodarkblue dark:text-white">{t('My Sets')}:</span>
			  <Link to="/create-set"><Button color={"blue"} icon={Plus} text={t("New Set")}/></Link>
          </div>
			<div>{}</div>
			<div className="w-full h-10 flex flex-row justify-end items-center">
				<Link className="text-studodarkblue dark:text-white"to="/studysets/studysets">{t("more sets")}</Link>
			</div>

        </div>
        <div className="w-full h-20 flex flex-row justify-between items-center">
          <Button color={"green"} ref={LogOutBtn} icon={LogOut} text={t('Log Out')}/>
          <Button color={"white"} ref={DeleteBtn} icon={Delete} text={t('Delete Account')}/>
        </div>
      </div>
    </div>);
};
