import Left_Header from './left_header/Left_Header.jsx';
import SearchBar from './search_header/Search_Bar.jsx';
import Right_Header from './right_header/Right_Header.jsx';
import Burger from './burger/Burger.jsx';
import {useState} from 'react';
import AddPopUp from './right_header/AddPopUp.jsx';
import ProfilePopUp from './right_header/ProfilePopUp.jsx';

export default function Header() {
	const [isBurgerOpen, setIsBurgerOpen] = useState(false);
	const [triggerPopup, setTriggerPopup] = useState(false);
	const [triggerAddPop, setTriggerAddPop] = useState(false);

	const toggleBurger = () => setIsBurgerOpen((prev) => !prev);
	const togglePopup = () => setTriggerPopup((prev) => !prev);
	const toggleAddPop = () => setTriggerAddPop((prev) => !prev);

	const closePopup = () => setTriggerPopup(false);
	const closeAddPop = () => setTriggerAddPop(false);

	return (
		<div className="fixed top-0 left-0 flex m-0 flex-row justify-between content-center h-fit w-full p-4 z-[999]">
			<Left_Header onBurgerClick={toggleBurger}/>
			<SearchBar/>
			<Right_Header onPopupClick={togglePopup} onAddClick={toggleAddPop}/>
			<AddPopUp isOpen={triggerAddPop} onClose={closeAddPop}/>
			<ProfilePopUp isOpen={triggerPopup} onClose={closePopup}/>
			<Burger isOpen={isBurgerOpen}/>
		</div>
	);
}