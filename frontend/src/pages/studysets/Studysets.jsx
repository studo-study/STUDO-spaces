import {useTranslation} from 'react-i18next';
import Navbar from './navbar/Navbar.jsx';
export default function Studysets() {
  const { t, i18n } = useTranslation();
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-baseline pt-35">
      <div className="flex w-3/5 flex-col items-center justify-center gap-3">
        <span className="w-full text-4xl flex flex-col justify-center items-baseline
      text-studodarkblue font-atrament font-semibold dark:text-white">{t('YOUR FILES')}</span>
        <Navbar />
      </div>
    </div>
  );
}