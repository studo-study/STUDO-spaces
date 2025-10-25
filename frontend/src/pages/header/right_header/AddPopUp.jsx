import studyset from '../../../assets/icons/studyset.svg';
import visual from '../../../assets/icons/visualset.svg';
import folder from '../../../assets/icons/folder2.svg';
import {Link} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import {useEffect, useRef} from 'react';

export default function AddPopUp({isOpen, onClose}) {
	const { t, i18n } = useTranslation();
	const popupRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (popupRef.current && !popupRef.current.contains(event.target)) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen, onClose]);

	return (
		<div
			ref={popupRef}
			className={`fixed top-27 right-30 z-[9999] flex flex-col items-center
         p-4 gap-3 font-akira text-2xl font-semibold text-[#2a3a42]
         rounded-3xl border border-white/30
         shadow-[8px_8px_16px_#bebebe,_-8px_-8px_16px_rgba(255,255,255,0.5)]
         bg-[rgba(224,224,224,0.2)] backdrop-blur-md
         dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
         transition-all duration-300
         ${isOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'}`}>

			<Link to="/create-set" className="w-full">
				<div className="flex items-center w-56 h-12 font-atrament text-base text-[#2a3a42]
              bg-studogrey rounded-xl shadow-md
             border-solid border-2 border-studogrey
             cursor-pointer select-none transition-transform duration-300 ease-out
             hover:scale-105">
          <span className="flex items-center w-full px-4 py-2 gap-2 dark:text-white">
            <img src={studyset} alt="" className="h-6 dark:invert dark:brightness-0"/>
			  {t("CREATE STUDYSET")}
          </span>
				</div>
			</Link>
			<Link to="/create-folder" className="w-full">
				<div className="flex items-center w-56 h-12 font-atrament text-base text-[#2a3a42]
              bg-studogrey rounded-xl shadow-md
             border-solid border-2 border-studogrey
             cursor-pointer select-none transition-transform duration-300 ease-out
             hover:scale-105">
          <span className="flex items-center w-full px-4 py-2 gap-2 dark:text-white">
            <img src={folder} alt="" className="h-6 dark:invert dark:brightness-0"/>
			  {t("CREATE FOLDER")}
          </span>
				</div>
			</Link>
		</div>
	);
}