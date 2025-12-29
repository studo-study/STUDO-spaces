import hero from '../../../../public/assets/icons/start/create.svg';
import {t} from 'i18next';
import {Link} from 'react-router-dom';
import {useEffect, useState} from "react";

export default function AboutStudysets() {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return <div className={`
	w-full dark:text-white text-studodarkblue ` +
		' max-h-screen min-h-[90vh] pt-25 p-10 md:p-20 xl:p-0 xl:pt-0 h-screen flex justify-center items-center ' +
		'bg-gradient-to-b from-transparent via-transparent to-emerald-700/40'}>
    <div className={'w-full h-full flex flex-col xl:flex-row gap-15 justify-center items-center'}>
      <div className={'w-full xl:w-1/2 h-full flex flex-col items-end justify-center'}>
      <div className={'w-full xl:w-1/2 h-full gap-8 flex flex-col items-center justify-center'}>
          <span className={`w-full h-fit font-bold text-5xl 
			  'transition-all duration-700 delay-100	${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"} `}>
            {t('title_studyset')}</span>
          <span
            className={`w-full h-fit  text-2xl font-bold
            transition-all duration-700 delay-200
			${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"} `}>
            {t('block1_studyset')}</span>
          <ul className={`w-full flex pl-5 gap-4 flex-col font-bold 
          transition-all duration-700 delay-300
		${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"} 
						text-base items-baseline justify-baseline mb-7`}>
            <li className={'list-disc'}>{t('block2_studyset')}</li>
            <li className={'list-disc'}>{t('block3_studyset')}</li>
            <li className={'list-disc'}>{t('block4_studyset')}</li>
          </ul>
          <div className={`w-full flex items-center justify-baseline
          transition-all duration-700 delay-1000
			${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} `}>
            <Link to={'/register'}
              className={'px-6 py-3 rounded-full  flex items-center justify-center ' +
								  'text-white bg-emerald-400 font-bold'}>{t('create your own')}</Link>
          </div>
        </div>
    </div>
      <div className={`hidden xl:flex xl:w-1/2 h-full flex-col justify-center overflow-hidden items-baseline
      transition-all duration-700 delay-400 ${mounted ? "opacity-100" : "opacity-0"} `}>
        <img src={hero} alt="" className={'min-w-2/1'}/>
      </div>
    </div>
  </div>;
}