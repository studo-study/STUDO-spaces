import Close from '../../../../public/assets/icons/close.svg';
import SearchIcon from '../../../../public/assets/icons/search.svg';
import {useRef, forwardRef, useEffect} from 'react';
import {useTranslation} from 'react-i18next';

const SearchBarContent = forwardRef(({toggleSearch, searchvalue, setSearchvalue, className}, ref) => {
  const deleteBtn = useRef(null);
  const inputField = useRef(null);
  const {t, i18n} = useTranslation();

  const showDeleteBtn = () => {
    deleteBtn.current?.classList.add('opacity-100');
  };

  const clearSearchField = () => {
    inputField.current.value = '';
    setSearchvalue('');
    deleteBtn.current?.classList.remove('opacity-100');
    deleteBtn.current?.classList.add('opacity-0');
  };

  const handleInputChange = (e) => {
    setSearchvalue(e.target.value);
    if (e.target.value) {
      showDeleteBtn();
    } else {
      deleteBtn.current?.classList.remove('opacity-100');
      deleteBtn.current?.classList.add('opacity-0');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputField.current.value.trim()) {
      toggleSearch(inputField.current.value);
      clearSearchField();
    }
  };

  const zin = t('looking');

  return (
    <div
      ref={ref}
      className={`w-fit h-12 flex flex-row mr-5 ${className || ''}`}
    >
      <input
        ref={inputField}
        className="w-full h-full p-3 rounded-4xl border-none align-sub text-studodarkblue
                 dark:text-white focus:outline-none focus:ring-0
                 "
        type="text"
        placeholder={zin}
        value={searchvalue}
        onChange={handleInputChange}
        onFocus={showDeleteBtn}
        onKeyDown={handleKeyDown}
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