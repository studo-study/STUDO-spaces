import {useState} from 'react';
import StreakIcon from '../../../../public/assets/icons/streak.svg';
import StreakPopup from './StreakPopup.jsx';

export default function Streak({streak}) {
  const [hovering, setHovering] = useState(false);
  const hoverToggle = () => {
    setHovering((hoveringJoined) => !hoveringJoined);
  };
  return (
    <div className="relative ml-2 flex items-center">
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3">
        <StreakPopup hovering={hovering} streak={streak}/>
      </div>

      <img
        src={StreakIcon}
        alt="streak"
        className={'h-5 cursor-pointer'}
        onMouseOver={hoverToggle}
        onMouseLeave={hoverToggle}
      />

    </div>
  );
}
