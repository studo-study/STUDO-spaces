import error from '../../assets/animations/Error.webm';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';

export default function Error() {
  const {t, i18n} = useTranslation();
  return (
    <div className="w-screen h-screen flex flex-col gap-3 justify-center items-center">
      <video autoPlay loop muted
        className="block w-90 h-90 backface-visibility-hidden border-none outline-none dark:hue-rotate-60">
        <source src={error}/>
      </video>
      <span className="font-atrament dark:text-white  text-2xl">{t('404').toUpperCase()}</span>
      <Link to="/home">
        <div className="inline-flex flex-row gap-2 justify-center
        items-center p-2 pl-7 pr-7 font-semibold bg-emerald-400 dark:bg-studoblue dark:text-studodarkblue text-white font-atrament rounded-4xl cursor-pointer">{t('return').toUpperCase()}
        </div>
      </Link>
    </div>);
}