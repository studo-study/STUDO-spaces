import {t} from 'i18next';

export default function ClassroomResults({classrooms, toggleClassrooms}) {
  return (
    <div className="w-full h-fit flex flex-row justify-between items-center">
      <span>{t('Classrooms')}:</span>
      <span onClick={toggleClassrooms}
        className="cursor-pointer font-semibold text-studogrey">{t('show alle classrooms')}</span>
    </div>
  );
}