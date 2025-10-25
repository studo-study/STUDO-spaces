import {useLocation} from 'react-router-dom';
import Members from './members/Members.jsx';
import {useTranslation} from 'react-i18next';
const Classroom = ({id}) => {
  const {pathname} = useLocation();
  const members = [
    {
      id: 1,
      firstName: 'Lotte',
      lastName: 'Peeters',
      age: 20,
      major: 'Computerwetenschappen',
      year: 2,
      email: 'lotte.peeters@student.example.com',
      gpa: 3.5,
    },
    {
      id: 2,
      firstName: 'Yassin',
      lastName: 'El Amrani',
      age: 21,
      major: 'Toegepaste Informatica',
      year: 3,
      email: 'yassin.elamrani@student.example.com',
      gpa: 3.8,
    },
    {
      id: 3,
      firstName: 'Emma',
      lastName: 'Van Dijk',
      age: 19,
      major: 'Communicatiemanagement',
      year: 1,
      email: 'emma.vandijk@student.example.com',
      gpa: 3.2,
    },
    {
      id: 4,
      firstName: 'Ruben',
      lastName: 'Vermeulen',
      age: 22,
      major: 'Multimedia en Creatieve Technologie',
      year: 3,
      email: 'ruben.vermeulen@student.example.com',
      gpa: 3.9,
    },
    {
      id: 5,
      firstName: 'Sara',
      lastName: 'Declercq',
      age: 20,
      major: 'Grafische Vormgeving',
      year: 2,
      email: 'sara.declercq@student.example.com',
      gpa: 3.6,
    },
    {
      id: 6,
      firstName: 'Noah',
      lastName: 'Jacobs',
      age: 23,
      major: 'Bedrijfsmanagement',
      year: 3,
      email: 'noah.jacobs@student.example.com',
      gpa: 3.4,
    },
  ];
  const { t, i18n } = useTranslation();

  return (
    <div className="w-full h-full flex flex-row gap-5">
      <div className="w-full h-fit flex flex-col justify-baseline items-baseline">
        <span className="text-studobarkblue dark:text-white font-bold">Studysets: </span>
      </div>
      <div className="flex flex-col gap-10 w-2/5">
        <Members members={members} />
        <button className="
			inline-flex font-semibold flex-row gap-2 justify-center
			items-center p-2 pl-5 pr-7 rounded-4xl cursor-pointer
			dark:text-white text-studodarkblue">
          {t('leave classroom')}
        </button>
      </div>
    </div>);
};

export default Classroom;