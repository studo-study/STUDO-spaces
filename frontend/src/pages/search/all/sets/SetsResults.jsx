import {t} from 'i18next';

export default function SetsResults({sets, toggleSets}) {
  return (
    <div className="w-full h-fit flex flex-row justify-between items-center">
      <span>{t('Sets')}:</span>
      <span onClick={toggleSets}
        className="cursor-pointer font-semibold text-studogrey">{t('show alle sets')}</span>
    </div>
  );
}