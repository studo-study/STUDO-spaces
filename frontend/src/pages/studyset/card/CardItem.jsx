import Pencil from '../../../assets/icons/pencil.svg';
import Star from '../../../assets/icons/star.svg';
import Starred from '../../../assets/icons/starred.svg';
import 'animate.css';
import {useRef, useState} from 'react';

export default function CardItem({card, index, isStarred}) {
  //refs
  const DefinitieInput = useRef(null);
  const TermInput = useRef(null);

  //states
  const [edit, setEdit] = useState(false);
  const [starred, setStarred] = useState(false);
  const [animate, setAnimate] = useState(false);

  //toggles
  const toggleEdit = () => {
    setEdit((prev) => !prev);
    DefinitieInput.current.value = card.definition;
    TermInput.current.value = card.term;
  };

  const toggleStarred = () => {
    setStarred((prev) => !prev);

    if(!starred){
      setAnimate(true);
      setTimeout(() => setAnimate(false), 700);
    }
    if (starred) {
      isStarred = true;
    } else
      isStarred = false;
  };

  //return statement
  return (
    <div className="w-full flex flex-row items-center justify-start flex-nowrap
    bg-studowhite min-h-[10vh] gap-4
    border-1 rounded-[30px]
  shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe] p-5 backdrop-blur-xs
			dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
			  border-[0.5px] border-solid dark:border-t-gray-500 dark:border-l-gray-500
  border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]r outline-0"
    data-index={index}>

      {/* Termveld - flex: 0 0 30% */}
      <div className="flex items-center h-[5vh]" style={{flex: '0 0 30%'}}>
        <span className={`${edit ? 'hidden' : 'flex'} text-left p-2 pl-5`}>{card.term}</span>
        <input
          type="text"
          required
          ref={TermInput}
          className={`${edit ? 'flex' : 'hidden'} w-full p-2 pl-5 bg-studowhite rounded-4xl 
          border-solid dark:border-t-gray-500 dark:border-l-gray-500 border-1
  border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]r outline-0`}
          autoComplete="off"
          placeholder="Edit the term..."
        />
      </div>

      {/* Definitieveld - flex: 1 */}
      <div className="flex items-center h-[5vh]" style={{flex: '1'}}>
        <span className={`${edit ? 'hidden' : 'flex'}`}>{card.definition}</span>
        <input
          type="text"
          required
          ref={DefinitieInput}
          autoComplete="off"
          autoFocus
          placeholder="Edit the definition..."
          className={`${edit ? 'flex' : 'hidden'} w-full p-2 pl-5 bg-studowhite rounded-4xl 
          border-solid dark:border-t-gray-500 dark:border-l-gray-500 border-1
  border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]r outline-0`}
        />
      </div>

      {/* Card-edit - flex: 0 0 10% */}
      <div className="flex flex-row gap-3 items-center cursor-pointer" style={{flex: '0 0 10%'}}>
        <img className={`cursor-pointer h-6 dark:brightness-0 dark:invert 
                    ${animate ? 'animate__animated animate__rubberBand' : ''}`}
        src={starred ? Starred : Star}
        alt="star"
        onClick={toggleStarred}
        />
        <img className="cursor-pointer h-5 dark:brightness-0 dark:invert"
          src={Pencil}
          alt="Edit"
          onClick={toggleEdit}
        />
      </div>

    </div>
  );
}

function ExportNewInput() {

}