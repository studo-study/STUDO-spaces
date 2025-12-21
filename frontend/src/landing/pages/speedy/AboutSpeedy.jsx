import {t} from 'i18next';
import {Link} from 'react-router-dom';
import hero from '../../../../public/assets/icons/start/speedy-hero-img.svg';

export default function AboutSpeedy() {
  return <div className={'w-full max-h-screen dark:text-white text-studodarkblue ' +
		'min-h-[90vh] flex justify-center items-center ' +
		'bg-gradient-to-b from-transparent via-transparent to-amber-500/40'}>
    <div className={'w-full h-full flex flex-row gap-15 justify-center items-center'}>
      <div className={'w-1/2 h-full flex flex-col items-end justify-center'}>
        <div className={'w-1/2 h-full gap-8 flex flex-col items-center justify-center'}>
          <span className={'w-full h-fit font-bold text-5xl whitespace-pre-line'}>
            {t('Speed Meets Knowledge')}</span>
          <span
            className={'w-full h-fit text-2xl font-bold'}>
            {t('A timed quiz mode with rounds that push you to recall terms under')}</span>
          <ul className={'w-full flex pl-5 gap-4 flex-col font-bold ' +
						'text-base  items-baseline justify-baseline mb-7'}>
            <li className={'list-disc'}>{t('Beat the timer in every round')}</li>
            <li className={'list-disc'}>{t('Wrong answers move to the next round')}</li>
            <li className={'list-disc'}>{t('Clear all terms to win the session')}</li>
          </ul>
          <div className={'w-full flex items-center justify-baseline'}>
            <Link to={'/register'}
              className={'px-6 py-3 rounded-full  flex items-center justify-center ' +
								  'text-white bg-amber-300 font-bold'}>{t('try it out')}</Link>
          </div>
        </div>
      </div>
      <div className={'w-1/2 h-full flex flex-col justify-center items-baseline'}>
        <img src={hero} alt="" className={'md:min-w-150 w-1/2'}/>
      </div>
    </div>
  </div>;
}