import Close from '../../../assets/icons/close.svg';
import SearchIcon from '../../../assets/icons/search.svg';
import {useRef, forwardRef} from 'react';
import {useTranslation} from "react-i18next";

const SearchBarContent = forwardRef((props, ref) => {
  const deleteBtn = useRef(null);
  const inputField = useRef(null);
  const { t, i18n } = useTranslation();
  const showDeleteBtn = () => {
    deleteBtn.current.classList.add('opacity-100');
  };

  const clearSearchField = () => {
    inputField.current.value = '';
    deleteBtn.current.classList.add('opacity-0');
  };
	const zin = t('looking');
  return (
    <div
      ref={ref}
      className={`w-fit h-12 flex flex-row mr-5 ${props.className || ''}`}
    >
      <input
        ref={inputField}
        className="w-full h-full p-3 rounded-4xl border-none align-sub text-studodarkblue
                 dark:text-white focus:outline-none focus:ring-0"
        type="text"
        placeholder={zin}
        onFocus={showDeleteBtn}
      />
      <img
        ref={deleteBtn}
        src={Close}
        className="w-6 h-auto cursor-pointer dark:invert dark:brightness-0 duration-300 opacity-0 transition-opacity"
        alt="close icon"
        onClick={clearSearchField}
      />
    </div>
  );
});

export default SearchBarContent;