import Check from '../../../assets/icons/check.svg';
import Checked from '../../../assets/icons/checked.svg';
import Plus from '../../../assets/icons/plus.svg';
import {useTranslation} from 'react-i18next';
import FolderItem from './FolderItem.jsx';
import {Link} from 'react-router-dom';
import { useRef, useEffect } from 'react';

export default function SavePopUp({toggled, toggleSave, saved, selectedFolder, setPopUpToggle}) {
  //variables
  const { t, i18n } = useTranslation();
  const folders = [
    {id:'17383939', name:'chacha\'s folder', owner:'charles'},
    {id:'383839393', name:'hutsefluts', owner:'charles'},
  ];
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopUpToggle(false);
      }
    };

    if (toggled) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggled, setPopUpToggle]);

  //return statement
  return (
    <div
      className={`${toggled ? 'opacity-100': 'opacity-0 pointer-events-none'}
       absolute mt-85 mr-60 w-70 h-65 rounded-4xl shadow-lg z-[99999]
      flex flex-col justify-baseline items-center p-4
         shadow-[8px_8px_16px_#bebebe,_-8px_-8px_16px_rgba(255,255,255,0.5)]
         bg-[rgba(224,224,224,0.2)] backdrop-blur-md
         dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
         transition-all duration-300 gap-3
      `}
    >
      <span className={'text-2xl font-semibold'}>{t('Save in folder').toUpperCase()}</span>
      <Link to='/create-folder' className="w-full">
        <div className="flex items-center w-full p-4 pl-5 pr-5 font-atrament text-base text-[#2a3a42]
              bg-studogrey rounded-xl shadow-md
             border-solid border-2 border-studogrey gap-2
             cursor-pointer select-none transition-transform duration-300 ease-out">
          <img src={Plus} alt="plus"
            className="h-8 dark:invert dark:brightness-0"/>
          <span className={'font-sfpro text-lg dark:text-white'}>{t('create new folder')}</span>
        </div>
      </Link>
      <div className='w-full h-full overflow-x-scroll flex gap-3 flex-col justify-baseline scroll-hidden rounded-xl'>
        {folders.map((folder, i) => {
          return <FolderItem saved={saved && selectedFolder === folder.id} toggle={() => toggleSave(folder.id)} key={i} folder={folder}/>;
        })}
      </div>
    </div>);
}