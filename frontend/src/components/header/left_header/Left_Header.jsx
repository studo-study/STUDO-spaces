import { Link } from "react-router-dom";

export default function Left_Header({ onBurgerClick }) {
  const svgLink = "http://www.w3.org/2000/svg";
  const menu = "#menu";

  return (
    <div className="flex justify-around items-center backdrop-blur-2xl h-16 sm:h-22 min-w-fit gap-2 sm:gap-5
      border-1 rounded-4xl shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]
      pl-4 sm:pl-10 pr-4 sm:pr-10 z-[999] glass-rgb
       border-solid border-gray-200 dark:border-[#8181812f]
      dark:border-t-gray-500 dark:border-l-gray-500
      dark:shadow-[8px_8px_16px_#1a1a1a,-8px_-8px_16px_#1a1a2a]">
      <div className="dark:bg-transparent bg-studogrey w-12 sm:w-15 h-10 sm:h-13 rounded-3xl
        pl-1 sm:pl-2 pb-1 items-center flex justify-center">
        <div className="nav stroke-[#2a3a42] dark:stroke-white" id="burger-toggle">
          <input type="checkbox" id="burger-checkbox" onClick={onBurgerClick} />
          <svg>
            <use href={menu} />
            <use href={menu} />
          </svg>
        </div>
        <svg xmlns={svgLink} className="hidden">
          <symbol xmlns={svgLink} viewBox="0 0 100 56" id="menu">
            <path
              d="M48.33,45.6H18a14.17,14.17,0,0,1,0-28.34H78.86a17.37,17.37,0,0,1,0,34.74H42.33l-21-21.26L47.75,4" />
          </symbol>
        </svg>
      </div>

      <Link to="/home" className={`font-akira text-3xl sm:text-5xl bg-gradient-to-r ${specialeDag()}
      bg-clip-text text-transparent transition-all duration-300 select-none cursor-pointer`}>
        STUDO
      </Link>
    </div>
  );
}



function specialeDag() {
	const date = new Date();
	const dag = date.getDate();
	const maand = date.getMonth();
	const jaar = date.getFullYear();

	const feestdagen = {
		christmas: "from-rose-600 via-rose-500 to-rose-400 dark:from-white dark:to-rose-200",
		christmasDay: "from-red-600 via-red-500 to-red-400 dark:from-white dark:to-red-200",
		newYear: "from-yellow-700 via-amber-500 to-yellow-400 dark:from-white dark:to-amber-200",
		threeKings: "from-amber-600 via-amber-500 to-yellow-500 dark:from-white dark:to-yellow-200",
		labour: "from-red-600 via-red-500 to-red-400 dark:from-white dark:to-red-200",
		valentine: "from-pink-600 via-pink-500 to-pink-400 dark:from-white dark:to-pink-200",
		halloween: "from-orange-600 via-orange-500 to-orange-400 dark:from-white dark:to-orange-200",
		easter: "from-violet-500 via-violet-400 to-purple-400 dark:from-white dark:to-violet-200",
		stPatricks: "from-green-600 via-green-500 to-green-400 dark:from-white dark:to-green-200",
		mothersDay: "from-pink-500 via-pink-400 to-rose-400 dark:from-white dark:to-pink-200",
		fathersDay: "from-sky-600 via-sky-500 to-sky-400 dark:from-white dark:to-sky-200",
		carnival: "from-fuchsia-600 via-fuchsia-500 to-fuchsia-400 dark:from-white dark:to-fuchsia-200",
		kingsDay: "from-orange-500 via-orange-400 to-amber-400 dark:from-white dark:to-orange-200",
		midsummer: "from-blue-400 via-green-300 to-amber-300 dark:from-white dark:to-sky-200",
	};

	const pasen = berekenPasen(jaar);
	const pasenDatum = new Date(jaar, pasen.maand - 1, pasen.dag);

	const carnaval = new Date(pasenDatum);
	carnaval.setDate(carnaval.getDate() - 49);

	if (dag === pasen.dag && maand === pasen.maand - 1) {
		return feestdagen.easter;
	}
	if (dag === carnaval.getDate() && maand === carnaval.getMonth()) {
		return feestdagen.carnival;
	}

	// Vaste feestdagen
	const key = `${dag}/${maand}`;
	const vasteDagen = {
		"1/0": feestdagen.newYear,
		"6/0": feestdagen.threeKings,
		"14/1": feestdagen.valentine,
		"17/2": feestdagen.stPatricks,
		"1/4": feestdagen.labour,
		"21/5": feestdagen.midsummer,
		"31/9": feestdagen.halloween,
		"24/11": feestdagen.christmas,
		"25/11": feestdagen.christmasDay,
		"31/11": feestdagen.newYear,
	};
	return vasteDagen[key] || "from-emerald-500 to-emerald-400 dark:from-white dark:to-blue-200";
}

function berekenPasen(jaar) {
	const a = jaar % 19;
	const b = Math.floor(jaar / 100);
	const c = jaar % 100;
	const d = Math.floor(b / 4);
	const e = b % 4;
	const f = Math.floor((b + 8) / 25);
	const g = Math.floor((b - f + 1) / 3);
	const h = (19 * a + b - d - g + 15) % 30;
	const i = Math.floor(c / 4);
	const k = c % 4;
	const l = (32 + 2 * e + 2 * i - h - k) % 7;
	const m = Math.floor((a + 11 * h + 22 * l) / 451);

	const maand = Math.floor((h + l - 7 * m + 114) / 31);
	const dag = ((h + l - 7 * m + 114) % 31) + 1;

	return { dag, maand };
}