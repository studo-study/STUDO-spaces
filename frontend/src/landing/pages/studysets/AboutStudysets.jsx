import hero from '../../../../public/assets/icons/start/create.svg';
import {t} from 'i18next';
import {Link} from 'react-router-dom';

export default function AboutStudysets() {
  return <div className={'w-full dark:text-white text-studodarkblue ' +
		' max-h-screen min-h-[90vh] flex justify-center items-center ' +
		'bg-gradient-to-b from-transparent via-transparent to-emerald-700/40'}>
    <div className={'w-full h-full flex flex-row gap-15 justify-center items-center'}>
      <div className={'w-1/2 h-full flex flex-col items-end justify-center'}>
        <div className={'w-1/2 h-full gap-8 flex flex-col items-center justify-center'}>
          <span className={'w-full h-fit font-bold text-5xl '}>
            {t('Your Study Starts Here')}</span>
          <span
            className={'w-full h-fit  text-2xl font-bold'}>
            {t('A Study Set is the core of your learning experience: a collection of terms ' +
				'and definitions you can master through different modes')}</span>
          <ul className={'w-full flex pl-5 gap-4 flex-col font-bold ' +
						'text-base items-baseline justify-baseline mb-7'}>
            <li className={'list-disc'}>{t('Each study set contains terms and their definitions')}</li>
            <li className={'list-disc'}>{t('Create your own sets, import existing ones, or collaborate with others')}</li>
            <li className={'list-disc'}>{t('Use the same set across all study modes')}</li>
          </ul>
          <div className={'w-full flex items-center justify-baseline'}>
            <Link to={'/register'}
              className={'px-6 py-3 rounded-full  flex items-center justify-center ' +
								  'text-white bg-emerald-400 font-bold'}>{t('create your own')}</Link>
          </div>
        </div>
      </div>
      <div className={'w-1/2 h-full flex flex-col justify-center overflow-hidden items-baseline'}>
        <img src={hero} alt="" className={'min-w-2/1'}/>
      </div>
    </div>
  </div>;
}