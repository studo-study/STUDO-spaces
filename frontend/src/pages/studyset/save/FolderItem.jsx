import Check from '../../../assets/icons/check.svg';
import Checked from '../../../assets/icons/checked.svg';
import Plus from '../../../assets/icons/plus.svg';

export default function FolderItem({saved, toggle, folder}) {
	return (<div className={'flex items-center w-full p-4 pl-3 pr-5 gap-3 font-atrament text-base text-[#2a3a42]\n' +
		'bg-studogrey rounded-xl shadow-md\n' +
		'border-solid border-2 border-studogrey\n' +
		'cursor-pointer select-none transition-transform duration-300 ease-out\n'}
				 onClick={toggle}>
		<img src={saved ? Checked : Check} alt=""
			 className="h-8 dark:invert dark:brightness-0"/>
		<span className={'font-sfpro text-lg dark:text-white'}>{folder.name}</span>
	</div>);
}