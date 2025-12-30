import plusIcon from "../../../assets/icons/cross.png";
import profileIcon from "../../../assets/icons/profile.svg";
import Streak from "../../../assets/icons/streak2.svg";
import { PiStudent } from "react-icons/pi";

export default function Right_Header({ onPopupClick, onAddClick, user }) {
  return (
    <div className="flex justify-center items-center h-16 sm:h-[88px] w-auto gap-3 sm:gap-8 pr-2 sm:pr-10">
      <div className="relative">
        <div className="absolute inset-0 rounded-lg bg-studoblue opacity-45 blur-md z-[1] pointer-events-none" />
        <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-studoblue rounded-full flex items-center justify-center
          cursor-pointer active:scale-105 transition-transform z-[2] select-none
          border-[0.5px] border-solid border-[#8181812f] border-t-blue-300 border-l-blue-300"
             onClick={onAddClick}>
          <img src={plusIcon} className="w-5 sm:w-6 h-auto" alt="Add" />
        </div>
      </div>


      <div className="relative w-10 h-10 sm:w-12 sm:h-12 ">
        <div className="absolute inset-0 rounded-lg bg-emerald-400 opacity-50 blur-md z-0 pointer-events-none" />
        <div className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center 
          bg-emerald-400 cursor-pointer select-none z-10 transition-transform active:scale-95 
          ${user.pfp ? "" : "border-[0.5px] border-solid border-[#8181812f] border-t-emerald-200 border-l-emerald-200"}`}
             onClick={onPopupClick}>
          {user.pfp != "default" ?
            <img src={user.pfp} alt="user" className="w-full rounded-full h-full" /> :
            <PiStudent color={"white"} />
          }
          {user.streak_count > 3 && (
            <div className="absolute -right-0.5 sm:-right-1 -bottom-0.5 sm:-bottom-1 w-5 h-5 sm:w-6 sm:h-6
              rounded-full bg-white flex items-center justify-center p-1 z-20">
              <img src={Streak} className="h-3 w-3 sm:h-4 sm:w-4" alt="Streak" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}