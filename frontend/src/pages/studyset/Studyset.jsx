import {useTranslation} from 'react-i18next';
import Save from '../../assets/icons/save.svg';
import Saved from '../../assets/icons/saved.svg';
import Classroom from '../../assets/icons/classroom.svg';
import Share from '../../assets/icons/share.svg';
import Settings from '../../assets/icons/settings.svg';
import Love from '../../assets/icons/love.svg';
import Loved from '../../assets/icons/loved.svg';
import Pencil from '../../assets/icons/pencil.svg';
import Clock from '../../assets/icons/clock.svg';
import Card from '../../assets/icons/cards.svg';
import Left from '../../assets/icons/left.svg';
import 'animate.css';
import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import Flashcard from './flashcard/Flashcard.jsx';
import Progress from './progress/Progress.jsx';
import SavePopUp from './save/SavePopUp.jsx';
import Data from '../../data/testdata.json';
import CardItem from './card/CardItem.jsx';

export default function Studyset() {
	//states
	const Studyset = Data;
	const cards = Studyset.cards;
	const likes = Studyset.hearts;
	const { t, i18n } = useTranslation();
	const [saved, setSaved] = useState(false);
	const [popUpToggle, setPopUpToggle] = useState(false);
	const [loved, setLoved] = useState(false);
	const [animate, setAnimate] = useState(false);
	const [loveCounter, setLoveCounter] = useState(likes);
	const [selectedFolder, setSelectedFolder] = useState(null);
	const [isStarred, setIsStarred] = useState(false);
	const [shownCards, setShownCards] = useState(cards);
	const [activeFilter, setActiveFilter] = useState(null);

	//toggles
	const toggleSave = (folderId) => {
		setSaved((prev) => !prev);
		setSelectedFolder(folderId);
	};

	const toggleLoved = () => {
		setLoved((prev) => !prev);
		if(!loved){
			setAnimate(true);
			setTimeout(() => setAnimate(false), 700);
		}
		toggleCounter();
	};

	const toggleCounter = () => {
		if (!loved)    setLoveCounter( loveCounter + 1);
		else setLoveCounter( loveCounter - 1);
	};

	const toggleNotStudied = () => {
		if (activeFilter === 'notStudied') {
			setShownCards(cards);
			setActiveFilter(null);
		} else {
			const filtered = cards.filter((card) => card.card_viewcount === 0);
			setShownCards(filtered);
			setActiveFilter('notStudied');
		}
	};

	const toggleReviewed = () => {
		if (activeFilter === 'reviewed') {
			setShownCards(cards);
			setActiveFilter(null);
		} else {
			const filtered = cards.filter((card) => card.card_viewcount === 1);
			setShownCards(filtered);
			setActiveFilter('reviewed');
		}
	};

	const toggleStudied = () => {
		if (activeFilter === 'studied') {
			setShownCards(cards);
			setActiveFilter(null);
		} else {
			const filtered = cards.filter((card) => card.card_viewcount >= 2);
			setShownCards(filtered);
			setActiveFilter('studied');
		}
	};

	const togglePopUp = () => {
		setPopUpToggle( (prev) => !prev );
	};

	//variables
	const title = Studyset.title;
	const owner = Studyset.user.displayName;
	const id = Studyset.id;

	//return statement
	return (
		<div className="w-screen h-screen flex flex-col items-center justify-baseline pt-35">
			<div className="flex w-full sm:w-1/2 md:w-5/12 lg:w-5/12 xl:w-2/5 2xl:w-2/5 max-w-[700px]
      flex-col items-center justify-center gap-3">
				<div className="w-full h-fit flex flex-row items-center justify-baseline gap-3 text-sm">
					{t('Created by')}
					<Link to={`/profile/${id}`} className="flex flex-row w-fit h-fit rounded-4xl
          gap-2 p-2 pl-4 pr-5 bg-studodark max-w-2/5
          dark:border-gray-700
				dark:border-t-gray-500 dark:border-l-border-gray-500
				border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
				shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
				dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
				dark:text-white">
						<div className="min-h-5 min-w-5 bg-amber-300 rounded-full"></div>
						<span className="opacity-50 text-sm inline-block truncate w-full hover:underline">@{owner}</span>
					</Link>
				</div>
				<div className="w-full flex flex-row items-center justify-around">
          <span className="inline-block w-2/3 flex flex-row items-center justify-baseline
          text-4xl font-atrament font-semibold truncate">
            {title.toUpperCase()}
          </span>
					<div className="w-1/3 flex h-full gap-3 flex-row items-center justify-end">
						<div className="inline-flex flex-row items-center gap-[0.6em] min-h-10 min-w-10
				font-atrament font-normal  text-[#2a3a42] justify-center
				rounded-[50px] bg-[#e7e7e747] cursor-pointer select-none whitespace-nowrap overflow-hidden text-ellipsis
				origin-center transition ease-out duration-300
				dark:border-gray-700
				dark:border-t-gray-500 dark:border-l-border-gray-500
				border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
				shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
				dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
				dark:text-white"
							 onClick={togglePopUp}>
							<img src={saved && selectedFolder ? Saved : Save } alt="" className="h-5 dark:invert dark:brightness-0" />
							<SavePopUp toggled={popUpToggle} toggleSave={toggleSave} saved={saved} selectedFolder={selectedFolder} setPopUpToggle={setPopUpToggle}/>
						</div>
						<div className="inline-flex flex-row items-center gap-[0.6em] min-h-10 min-w-10
			 font-normal  text-[#2a3a42] justify-center
				rounded-[50px] bg-[#e7e7e747] cursor-pointer select-none whitespace-nowrap overflow-hidden text-ellipsis
				origin-center transition ease-out duration-300
				dark:border-gray-700
				dark:border-t-gray-500 dark:border-l-border-gray-500
				border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
				shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
				dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
				dark:text-white">
							<img src={Classroom} alt="" className="h-5 dark:invert dark:brightness-0"/>
						</div>
						<div className="inline-flex flex-row items-center gap-[0.6em] min-h-10 min-w-10
				font-atrament font-normal  text-[#2a3a42] justify-center
				rounded-[50px] bg-[#e7e7e747] cursor-pointer select-none whitespace-nowrap overflow-hidden text-ellipsis
				origin-center transition ease-out duration-300
				dark:border-gray-700
				dark:border-t-gray-500 dark:border-l-border-gray-500
				border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
				shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
				dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
				dark:text-white">
							<img src={Share} alt="" className="h-5 dark:invert dark:brightness-0"/>
						</div>
						<div className="inline-flex flex-row items-center gap-[0.6em] min-h-10 min-w-10
				font-atrament font-normal  text-[#2a3a42] justify-center
				rounded-[50px] bg-[#e7e7e747] cursor-pointer select-none whitespace-nowrap overflow-hidden text-ellipsis
				origin-center transition ease-out duration-300
				dark:border-gray-700
				dark:border-t-gray-500 dark:border-l-border-gray-500
				border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
				shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
				dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
				dark:text-white">
							<img src={Settings} alt="" className="h-5 dark:invert dark:brightness-0"/>
						</div>
					</div>
				</div>
				<div className="w-full h-15 gap-2 flex flex-row justify-baseline items-center">
					<div  className="w-fit flex flex-row cursor-pointer gap-2 inline-flex" onClick={toggleLoved}>
						<img src={loved ? Loved : Love} alt="" className={`h-6 cursor-pointer dark:opacity-50 
            dark:invert dark:brightness-0 
            ${loved ? '' : 'opacity-50'} 
            ${animate ? 'animate__animated animate__rubberBand' : ''}`}/>
						<span className="opacity-50 inline-block truncate select-none">
              {formatter(loveCounter)} {t(' people loved this set')}
            </span>
					</div>
				</div>
				<div className="w-full h-fit flex flex-col gap-10 justify-center items-center">
					<div className="w-full inline-grid gap-5 grid-cols-3 grid-rows-1">
						<Link to={'/learn'}>
							<div className="inline-flex flex-row items-center gap-3 min-h-12 w-full
			 	font-normal  text-[#2a3a42] justify-center
				rounded-2xl bg-[#e7e7e747] cursor-pointer select-none whitespace-nowrap overflow-hidden text-ellipsis
				origin-center transition ease-out duration-300
				dark:border-gray-700
				dark:border-t-gray-500 dark:border-l-border-gray-500
				border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
				shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
				dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
				dark:text-white pl-8 pr-10 font-atrament text-xl">
								<img src={Pencil} alt="" className="h-5 dark:invert dark:brightness-0"/>
								{t('learn').toUpperCase()}
							</div>
						</Link>
						<Link to={'/speedy'}>
							<div className="inline-flex flex-row items-center gap-3 min-h-12 w-full
			 	font-normal  text-[#2a3a42] justify-center
				rounded-2xl bg-[#e7e7e747] cursor-pointer select-none whitespace-nowrap overflow-hidden text-ellipsis
				origin-center transition ease-out duration-300
				dark:border-gray-700
				dark:border-t-gray-500 dark:border-l-border-gray-500
				border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
				shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
				dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
				dark:text-white pl-8 pr-8 font-atrament text-xl">
								<img src={Clock} alt="" className="h-5 dark:invert dark:brightness-0"/>
								{t('speedy').toUpperCase()}
							</div>
						</Link>
						<Link to={'/flashcards'}>
							<div className="inline-flex flex-row items-center gap-3 min-h-12 w-full
			 	font-normal  text-[#2a3a42] justify-center
				rounded-2xl bg-[#e7e7e747] cursor-pointer select-none whitespace-nowrap overflow-hidden text-ellipsis
				origin-center transition ease-out duration-300
				dark:border-gray-700
				dark:border-t-gray-500 dark:border-l-border-gray-500
				border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
				shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
				dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
				dark:text-white pl-8 pr-8 font-atrament text-xl">
								<img src={Card} alt="" className="h-5 dark:invert dark:brightness-0"/>
								{t('flashcards').toUpperCase()}
							</div>
						</Link>
					</div>
					<Flashcard Cards={cards}/>
					<hr className="w-full border-0.5 border-solid border-gray-500 mt-5 mb-2"/>
					<span className="w-full h-fit mb-3 font-bold">{t('Your Progress:')}</span>
					<div className="w-full flex flex-row justify-between items-center gap-5">
						<Progress type={t('Not Studied')} percent={calcProgress(cards)[0]} onClick={toggleNotStudied}/>
						<Progress type={t('Reviewed')} percent={calcProgress(cards)[1]} onClick={toggleReviewed}/>
						<Progress type={t('Studied')} percent={calcProgress(cards)[2]} onClick={toggleStudied}/>
					</div>
					<hr className="w-full border-0.5 border-solid border-gray-500 mt-5 mb-5"/>
					<div className="w-full h-fit flex flex-col gap-5 mb-10">
						{shownCards.map((card, index) => {
								return <CardItem card={card} key={index} />;
							},
						)}
					</div>
				</div>
			</div>
		</div>);
}

function formatter(likes) {
	console.log('aangeroepen');

	let formatted;
	if(likes > 999) {
		return (likes/ 1000).toFixed(1) + 'k';
	}

	if(likes > 999999) {
		return  (likes/ 1000000).toFixed(1) + 'm';
	} else {
		formatted = likes;
		console.log(formatted);
		return formatted;
	}
};

function calcProgress(cards) {
	let nstud = 0;
	let rev = 0;
	let stud = 0;
	cards.forEach((card) => {
		if(card.card_viewcount == 0) nstud++;
		if(card.card_viewcount == 1) rev++;
		if(card.card_viewcount >= 2) stud++;
	});
	return [((nstud * 100) / cards.length).toFixed(0),
		((rev * 100) / cards.length).toFixed(0),
		((stud * 100) / cards.length).toFixed(0)];

}