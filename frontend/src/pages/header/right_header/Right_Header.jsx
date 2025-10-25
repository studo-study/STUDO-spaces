import plusIcon from '../../../assets/icons/cross.png';
import profileIcon from '../../../assets/icons/profile.svg';
import Streak from '../../../assets/icons/streak2.svg';

export default function Right_Header({ onPopupClick, onAddClick }) {
	return (
		<div className="flex justify-center items-center h-[88px] w-[150px] gap-8 pr-10">
			{/* Plus-knop */}
			<div className="relative">
				<div className="absolute inset-0 rounded-lg bg-studoblue opacity-45 blur-md z-[1] pointer-events-none" />
				<div
					className="relative w-12 h-12 bg-studoblue rounded-full flex items-center justify-center cursor-pointer
          active:scale-105 transition-transform z-[2] select-none
          border-[0.5px] border-solid border-[#8181812f] border-t-blue-300 border-l-blue-300"
					onClick={onAddClick}
				>
					<img src={plusIcon} className="w-6 h-auto" alt="Add" />
				</div>
			</div>

			{/* Profiel-knop */}
			<div className="relative w-12 h-12">
				<div className="absolute inset-0 rounded-lg bg-emerald-400 opacity-50 blur-md z-0 pointer-events-none" />

				<div
					className="relative w-12 h-12 rounded-full flex items-center justify-center bg-emerald-400
          cursor-pointer select-none z-10 transition-transform active:scale-95
          border-[0.5px] border-solid border-[#8181812f] border-t-emerald-200 border-l-emerald-200"
					onClick={onPopupClick}
				>
					<img src={profileIcon} className="w-6 h-6" alt="Profile" />
					<div
						className="absolute -right-1 -bottom-1 w-6 h-6 rounded-full bg-white
            flex items-center justify-center p-1 z-20"
					>
						<img src={Streak} className="h-4 w-4" alt="Streak" />
					</div>
				</div>
			</div>
		</div>
	);
}