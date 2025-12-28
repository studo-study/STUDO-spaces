import { t } from "i18next";
import { Link } from "react-router-dom";
import { HashLink as LinkHash } from "react-router-hash-link";
import learn from "../../../../public/assets/icons/start/learn.svg";
import flash from "../../../../public/assets/icons/start/flashcards.svg";
import speedy from "../../../../public/assets/icons/start/speedy.svg";
import pin from "../../../../public/assets/icons/start/point.svg";
import point from "../../../../public/assets/icons/start/hero-pin.svg";
import HeroBackground from "./HeroBackground.jsx";
import {useEffect, useState} from "react";
import {FaCheck} from "react-icons/fa";
import {FaArrowDownLong, FaArrowRightLong} from "react-icons/fa6";

const studyModes = [
	{ to: "/learn", label: "Learn", icon: learn, color: "from-emerald-500 to-emerald-400", shadow: "shadow-emerald-500/30" },
	{ to: "/flashcards", label: "Flashcards", icon: flash, color: "from-blue-500 to-blue-400", shadow: "shadow-blue-500/30" },
	{ to: "/speedy", label: "Speedy", icon: speedy, color: "from-amber-500 to-orange-400", shadow: "shadow-amber-500/30" },
	{ to: "/pin", label: "Identify", icon: pin, color: "from-rose-500 to-red-400", shadow: "shadow-rose-500/30" },
	{ to: "/point", label: "Point", icon: point, color: "from-violet-500 to-purple-400", shadow: "shadow-violet-500/30" },
];

export default function Hero() {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-start pt-8 pb-20 px-4 overflow-hidden">
      <div className="absolute inset-0 hidden dark:flex select-none pointer-events-none z-0">
        <HeroBackground color="to-white/10" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center pt-5 gap-8 max-w-5xl md:max-w-screen">
		  <div
			  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full 
            bg-emerald-400/20 dark:bg-studoblue/20 
            border border-emerald-400 dark:border-studoblue/30
            transition-all duration-700 delay-100
            ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
		  >
			  <span className="text-sm font-medium text-emerald-400 dark:text-studoblue">
            {t("Your New Study Tool")}
          </span>
		  </div>
		  <h1
			  className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight
            transition-all duration-700 delay-200
            ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
		  >
          <span className="block text-studodarkblue dark:text-white">
            {t("Study Smart,")}
          </span>
			  <span className="block bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 dark:from-studoblue dark:via-blue-400 dark:to-studoblue bg-clip-text text-transparent">
            {t("Stay Ahead")}
          </span>
		  </h1>

		  <p
			  className={`text-lg sm:text-xl md:text-2xl text-studodarkblue/70 dark:text-white/70 max-w-2xl
            transition-all duration-700 delay-300
            ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
		  >
			  {t("Free study tools for smarter and faster learning")}
		  </p>

		  <div
			  className={`flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 text-sm sm:text-base text-studodarkblue/60 dark:text-white/60
            transition-all duration-700 delay-400
            ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
		  >
			  {[
				  t("Create custom study sets"),
				  t("Text or visual learning"),
				  t("Study anywhere, anytime")
			  ].map((feature, i) => (
				  <div key={i} className="flex items-center gap-2 text-emerald-500 dark:text-studoblue">
					  <FaCheck />
					  <span className={"text-studodarkblue/60 dark:text-white/60"}>{feature}</span>
				  </div>
			  ))}
		  </div>

        <div className={`grid grid-cols-2 grid-rows-1 gap-4 mt-6 w-7/15 max-w-150
        ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
            transition-all duration-700 delay-500`}>
          <Link
            to="/register"
            className="px-8 py-4 text-lg flex flex-row items-center justify-center gap-2 font-bold text-white bg-emerald-400 dark:bg-studoblue rounded-full border-2 border-emerald-400 dark:border-studoblue hover:bg-emerald-500 dark:hover:bg-studoblue/90 transition"
          >
            {t("Sign Up For Free")}
			  <FaArrowRightLong />
          </Link>

          <LinkHash
            to="/welcome#info"
            className="px-8 py-4 text-lg flex flex-row items-center justify-center gap-2 font-bold text-emerald-400 dark:text-studoblue rounded-full border-2 border-emerald-400 dark:border-studoblue bg-transparent hover:bg-emerald-400/10 dark:hover:bg-studoblue/10 transition backdrop-blur-sm"
          >
            {t("learn more")}
			  <FaArrowDownLong />
          </LinkHash>
        </div>

        <div className={`flex flex-col md:grid  ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
            transition-all duration-700 delay-600
          grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 mt-12 w-full max-w-4/5 md:w-screen px-4 sm:px-8 md:px-0`}
		>
			{studyModes.map((item) =>
				<Link
					to={item.to}
					className={`group relative overflow-hidden rounded-3xl bg-radial ${item.color} flex flex-col justify-between h-64 sm:h-80 transition-transform hover:scale-105`}
				>
					<span className="text-2xl sm:text-3xl font-bold text-studodarkblue text-center pt-6">
					  {t(item.label)}
					</span>
					<img src={item.icon} alt="Learn icon" className="w-full object-cover object-bottom" />
				</Link>
			)}
        </div>
      </div>
    </section>
  );
}