export default function Progress({type, percent}) {
  //variables
  const offset = 1600 - ((percent / 100) * 1600);

  //return statement
  return (
    <div id="reviewed-container"
      className="w-full flex flex-col justify-center items-center gap-3 bg-studowhite cursor-pointer
    gap-5 border-1 border-transparent border-studoborder rounded-4xl
			  shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe] p-5 pb-2 backdrop-blur-xs
			dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
			  border-[0.5px] border-solid dark:border-t-gray-500 dark:border-l-gray-500
  border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]">
      <span className="font-bold dark:text-white text-studodarkblue ">{type}:</span>
      <div className="neu-wrapper">
        <svg id="Layer_2" data-name="Layer 2" className="w-full min-w-2/3"
			 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1115.79 607.89">
          <defs>
            <style>
              {`
                .cls-1 {
                  fill: none;
                  stroke-linecap: round;
                  stroke-miterlimit: 10;
                  stroke-width: 100px;
                }
                
                .cls-2 {
                  fill: none;
                  stroke-dasharray: 1600;
                  stroke-linecap: round;
                  stroke-miterlimit: 10;
                  stroke-width: 100px;
                  filter: url(#shadow);
                  transition: stroke-dashoffset 0.5s ease;
                }
              `}
            </style>
          </defs>
          <g id="Layer_1-2" data-name="Layer 1">
            <path className="cls-1 stroke-[#1112] dark:stroke-studodarkblue"
              d="M50,557.89c0-280.5,227.39-507.89,507.89-507.89s507.9,227.39,507.9,507.89"/>
            <path
              className={`cls-2 
    			${type === 'Not Studied' ? 'stroke-studoblue' : ''} 
    			${type === 'Reviewed' ? 'stroke-amber-500' : ''}
    			${type === 'Studied' ? 'stroke-emerald-400' : ''}`}
              style={{
                strokeDashoffset: offset,
              }}
              d="M50,557.89c0-280.5,227.39-507.89,507.89-507.89s507.9,227.39,507.9,507.89"/>
          </g>
        </svg>
        <div className="progress-text" id="reviewedText">{percent}%</div>
      </div>
      <span id="reviewed-terms"></span>
    </div>
  );
}