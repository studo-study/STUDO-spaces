export default function Button({color, icon, text}) {
  return(
    <div
      className={`inline-flex font-semibold flex-row gap-2 justify-center items-center p-2 pl-5 pr-7 rounded-4xl cursor-pointer
  ${
    color === 'blue'
      ? 'bg-studoblue text-white'
      : color === 'green'
        ? 'bg-studogreen text-white'
        : color === 'white'
          ? 'bg-white text-studodarkblue'
          : 'bg-studoblue text-white' // default
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
    </div>);

}