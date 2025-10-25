import Delete from '../../../assets/icons/delete.svg';
import Grab from '../../../assets/icons/grab.svg';
import Image from '../../../assets/icons/image.svg';
import {useTranslation} from 'react-i18next';
import AddImage from '../addImage/AddImage.jsx';
import SelectLanguage from '../selectLanguage/SelectLanguage.jsx';

export default function Card({index, Disabled}) {
  //variables
  const {t, i18n} = useTranslation();

  //return statement
  return (
    <div className="flex justify-around items-baseline flex flex-col
	bg-studowhite h-fit w-full gap-5 border-1 border-transparent border-studoborder rounded-4xl
	shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe] backdrop-blur-xs
	dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a] mb-10
	border-[0.5px] border-solid overflow-hidden
  dark:border-t-gray-500 dark:border-l-gray-500
  border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]">
      <div className="w-full h-13 bg-studowhite flex flex-row justify-between
      items-center p-3 pl-8 pr-8 border-0 border-solid border-b-2
	dark:border-gray-500 border-gray-300">
        <span className="text-studodarkblue dark:text-white text-base">{index}</span>
        <div className="flex flex-row gap-3">
          <img src={Delete} alt="delete"
            className={`${Disabled ? 'pointer-events-none opacity-50 cursor-default' : 'cursor-pointer'}
            h-5 dark:invert dark:brightness-0`}/>
          <img src={Grab} alt="grab" className="h-5 cursor-grab dark:invert dark:brightness-0"/>
        </div>
      </div>
      <div className="flex flex-row w-full gap-3">
        <div className="flex flex-col pb-8 p-3 pl-8 w-full gap-3 justify-between">
          <input
            type="text"
            required
            className="px-[2vh] h-12 rounded-[50px] text-base border-0
			bg-[rgba(255,255,255,0.175)] w-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
			border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0 text-studodarkblue
			dark:text-white"
            autoComplete="off"
            placeholder={t('Term')}
          />
          <SelectLanguage/>
        </div>
        <div className="flex flex-row justify-between w-full pb-8 p-3 gap-9 pr-8 " >
          <div className="w-full flex flex-col gap-3 justify-between">
            <input
              type="text"
              required
              className="px-[2vh] h-12 rounded-[50px] text-base border-0
			bg-[rgba(255,255,255,0.175)] w-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
			border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0 text-studodarkblue
			dark:text-white"
              autoComplete="off"
              placeholder={t('Definition')}
            />
            <SelectLanguage/>
          </div>
          <AddImage/>
        </div>
      </div>
    </div>
  );
}