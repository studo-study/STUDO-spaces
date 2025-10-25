import {useTranslation} from 'react-i18next';
import Plus from '../../assets/icons/plus.svg';
import Card from './card/Card.jsx';
import {useRef, useState} from 'react';
import interact from 'interactjs';

export default function CreateSet() {
  const {t, i18n} = useTranslation();
  const folders = ['folder1', 'folder2', 'folder3'];
  const [cards, setCards] = useState([1, 2, 3]);
  const [index, setIndex] = useState(3);

  const insertCard = () => {
    const newIndex = index + 1;
    setIndex(newIndex);
    setCards((prev) => [...prev, newIndex]);

  };

  return (
    <div className="w-full min-h-screen h-fit flex text-base flex-col items-center justify-baseline pt-35">
      <div className="flex w-3/5 flex-col items-center justify-center gap-3">
        <span className="w-full text-3xl flex flex-col justify-center items-baseline
      text-studodarkblue font-atrament font-semibold dark:text-white">{t('create new studyset').toUpperCase()}</span>
        <div className="w-full gap-4 flex-col flex">
          <input
            type="text"
            required
            className="px-[2vh] h-12 rounded-[50px] text-base border-0
			bg-[rgba(255,255,255,0.175)] w-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
			border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0 text-studodarkblue
			dark:text-white"
            autoComplete="off"
            placeholder={t('Fill in a title...')}
          />
          <span className="error-message" id="error-title"></span>

          <div className="flex flex-row gap-5 w-full">
            <div className="w-1/2 gap-2 flex flex-col">
              <input
                type="text"
                required
                autoComplete="off"
                placeholder={t('Fill in a course...')}
                className="px-[2vh] h-12 w-full rounded-[50px] text-base border-0
			bg-[rgba(255,255,255,0.175)] shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
			border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0 text-studodarkblue
			dark:text-white"
              />
              <span className="error-message" id="error-course"></span>
            </div>

            <div className="w-1/2 gap-2 flex flex-col h-22">
              <div className="custom-select w-full flex flex-col h-12">
                <select id="folder-select" className="text-studodarkblue h-12 text-base dark:text-white">
                  {folders.map((folder) => (
                    <option value={folder} key={folder} className="text-white text-base color-white bg-white">{folder}</option>
                  ))}
                </select>
              </div>
              <span className="error-message" id="error-folder"></span>
            </div>
          </div>
        </div>

        <div className=" w-full h-12 flex flex-row justify-between items-end">
          <span className="inline-flex flex-row items-center gap-[0.6em] h-12 pl-[2em] pr-[2em]
				font-atrament font-normal  text-[#2a3a42] justify-center
				rounded-[50px] bg-[#e7e7e747] cursor-pointer select-none whitespace-nowrap overflow-hidden text-ellipsis
				origin-center transition ease-out duration-300
				dark:border-gray-700
				dark:border-t-gray-500 dark:border-l-border-gray-500
				border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
				shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
				dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
				dark:text-white text-xl"

          >
            <img src={Plus} className="h-5 dark:brightness-0 dark:invert"/>
            {t('import').toUpperCase()}
          </span>

          <span className="inline-flex flex-row items-center gap-[0.6em] h-12 pl-[2em] pr-[2em]
				font-atrament font-normal text-xl text-[#2a3a42] justify-center
				rounded-[50px] bg-studoblue cursor-pointer select-none whitespace-nowrap overflow-hidden text-ellipsis
				origin-center transition ease-out duration-300 border-[0.5px] border-solid border-[#8181812f] border-t-blue-300 border-l-blue-300
				shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
				dark:bg-studoblue dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
				dark:text-white"

          >
            {t('create set').toUpperCase()}
          </span>

        </div>
        <div className="w-full h-fit flex flex-col gap-5 pt-10">
          {cards.map((i) => (
            <Card key={i} index={i} Disabled={cards.length <= 3 ? true : false} />
          ))}

        </div>
        <div className="flex w-full mb-10">
          <span className="inline-flex flex-row items-center gap-[0.6em] p-3
				font-atrament font-normal text-xl text-[#2a3a42] justify-center w-full
				rounded-[50px] bg-studoblue cursor-pointer select-none whitespace-nowrap overflow-hidden text-ellipsis
				origin-center transition ease-out duration-300
				border-[0.5px] border-solid border-[#8181812f]
				border-t-blue-300 border-l-blue-300
				shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
				dark:bg-studoblue dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
				dark:text-white font-bold select-all"

          onClick={insertCard}
          >{t('add card').toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}