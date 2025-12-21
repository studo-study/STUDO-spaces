export default function Button({color, icon, text, onClick}) {
  return (
    <div
      onClick={onClick}
      className={`inline-flex font-semibold 
        flex-row gap-2 justify-center items-center p-2 pl-5 pr-7 rounded-4xl cursor-pointer
        active:scale-105 transition-transform z-[2]
        border-[0.5px] border-solid border-[#8181812f]
        shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
        dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
        ${
    color === 'blue'
      ? 'bg-studoblue text-white border-t-blue-300 border-l-blue-300'
      : color === 'green'
        ? 'bg-studogreen text-white border-t-green-200 border-l-green-200'
        : color === 'white'
          ? 'bg-white text-studodarkblue border-t-gray-300 border-l-gray-300'
          : 'bg-studoblue text-white'
    }`}
    >
      <img
        src={icon}
        alt="icon"
        className={`h-4 ${
          color === 'green' || color === 'blue' ? 'brightness-0 invert' : ''
        }`}
      />
      <span className="font-atrament text-lg select-none">
        {text.toUpperCase()}
      </span>
    </div>
  );
}
