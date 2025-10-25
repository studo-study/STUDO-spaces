import {Link} from "react-router-dom";
export default function Left_Header({onBurgerClick}) {
  const svgLink = 'http://www.w3.org/2000/svg';
  const menu = '#menu';

  return (
    <div
      className="
  flex justify-around items-center
  bg-studowhite h-22 w-125 gap-5 border-1 border-transparent border-studoborder rounded-4xl
  shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]
  pl-10 pr-10
    z-[999]
    backdrop-blur-xs
  dark:bg-gray-700
  border-[0.5px] border-solid
  dark:border-t-gray-500 dark:border-l-gray-500
  border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
dark:shadow-[8px_8px_16px_#1a1a1a,-8px_-8px_16px_#1a1a2a]
"
    >
      <div>
        <div className="nav stroke-[#2a3a42] dark:stroke-white" id="burger-toggle">
          <input
            type="checkbox"
            id="burger-checkbox"
            onClick={onBurgerClick}
          />
          <svg>
            <use href={menu}/>
            <use href={menu}/>
          </svg>
        </div>

        <svg xmlns={svgLink} className="hidden">
          <symbol xmlns={svgLink} viewBox="0 0 100 56" id="menu">
            <path
              d="M48.33,45.6H18a14.17,
              14.17,0,0,1,0-28.34H78.86a17.37,17.37
              ,0,0,1,0,34.74H42.33l-21-21.26L47.75,4"
            />
          </symbol>
        </svg>
      </div>
      <Link to="/home" className="font-akira text-5xl text-emerald-400 dark:text-white select-none cursor-pointer">
        STUDO
      </Link>
    </div>
  );
}
