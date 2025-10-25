import SearchIcon from '../../../assets/icons/search.svg';
import Close from '../../../assets/icons/close.svg';
import SearchBarContent from './SearchBarContent.jsx'; // Geen accolades!
import {useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';

export default function SearchBar() {
  const { t, i18n } = useTranslation();
  const outerBtn = useRef(null);
  const triggerBtn = useRef(null);
  const content = useRef(null);
  const [triggered, setTriggered] = useState(false);

  const triggerSearch = () => {
    if (triggered == true) {
      Search();
      console.log('zoekende');
    }
    content.current.classList.remove('hidden');
    content.current.classList.add('flex');
    setTriggered(true); // Fix: setTriggered moet een waarde krijgen
  };

  const Search = () => {
  };

  return (
    <div className="w-full min-w-22 h-22 flex justify-end items-center pr-10
    ">
      <div
        ref={outerBtn}
        className="w-fit h-12 bg-studowhite
                   shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]
                   rounded-4xl flex justify-between items-center
                   dark:shadow-[8px_8px_16px_#1a1a1a,-8px_-8px_16px_#1a1a2a]
                     border-[0.5px] border-solid
  dark:border-t-gray-500 dark:border-l-gray-500
  border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]"
      >
        <img
          ref={triggerBtn}
          src={SearchIcon}
          className="w-6 mr-3 ml-3 h-auto cursor-pointer dark:invert dark:brightness-0"
          alt="search icon"
          onClick={triggerSearch}
        />

        <SearchBarContent ref={content} className="hidden" triggered={triggered} setTriggered={setTriggered}/>
      </div>
    </div>
  );
}