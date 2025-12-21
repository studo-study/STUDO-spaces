import {useNavigate} from 'react-router-dom';
import {Link} from 'react-router-dom';
import Cross from '../../../public/assets/icons/close.svg';
import animation from '../../../public/assets/animations/Streak.webm';
import {useTranslation} from 'react-i18next';
import Phrases from './phrases/Phrases.jsx';

export default function Streak() {
  const {t, i18n} = useTranslation();
  const Streak = 32;
  const navigate = useNavigate();
  return (
    <div className="relative w-screen h-screen bg-white z-[99999]">
      <div className="absolute top-0   w-full h-22 flex flex-row justify-end items-center p-5">
        <button onClick={() => navigate(-1)}><img src={Cross} alt="sluit" className=" cursor-pointer h-8"/>
        </button>
      </div>
      <div className="w-screen h-screen overflow-hidden flex flex-col gap-3 justify-center items-center">
        <div className=" h-[65] border-none flex justify-center items-center">
          <video autoPlay loop muted
            className="block w-90 h-90 backface-visibility-hidden border-none outline-none">
            <source src={animation}/>
          </video>
        </div>
        <span className="font-atrament bg-gradient-to-b from-orange-400
				to-yellow-400 bg-clip-text font-bold text-transparent text-9xl">
          {Streak}</span>

        <span className="font-atrament font-sfpro font-bold text-3xl text-orange-400">{t('day streak')}</span>
        <span className="font-sfpro text-xl text-gray-400">
          {t('You have studied ')}{Streak}{t(' day in a row')}.
        </span>
        <span className="font-sfpro text-xl text-gray-400">
          {Phrases()}!
        </span>
      </div>
      <div className="absolute bottom-0  border-t-2 border-solid
      border-gray-100 w-full h-22 flex flex-row justify-center items-center p-5">
        <div onClick={() => navigate(-1)}>
          <div className="inline-flex flex-row gap-2 justify-center
        items-center p-2 pl-7 pr-7 bg-studoblue text-white
        font-atrament rounded-4xl cursor-pointer">{t('close').toUpperCase()}</div>
        </div>
      </div>
    </div>);
}