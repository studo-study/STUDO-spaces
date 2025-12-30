import TriggerMethods from "./dropdownmethods/TriggerMethods.jsx";
import TriggerTools from "./dropdowntools/TriggerTools.jsx";
import { Link } from "react-router-dom";
import { t } from "i18next";
import {useEffect, useRef, useState} from "react";
import { Menu, X } from "react-feather";
import {useTranslation} from "react-i18next";
import ss from "../../../assets/icons/studyset.svg";
import vs from "../../../assets/icons/visualset.svg";
import ai from "../../../assets/icons/sparkle.svg";
import learn from "../../../assets/icons/pencil.svg";
import speedy from "../../../assets/icons/clock.svg";
import cards from "../../../assets/icons/cards.svg";
import pin from "../../../assets/icons/pin-icon.svg";
import point from "../../../assets/icons/point.svg";

const menuItems = [
	{ to: "/about-studysets", icon: ss, label: "studysets", color: "from-emerald-400 to-teal-500" },
	{ to: "/about-visualsets", icon: vs, label: "visualsets", color: "from-blue-400 to-indigo-500" },
	{ to: "/about-ai", icon: ai, label: "ai", color: "from-violet-400 to-purple-500" },
];

const toolCategories = [
	{ to: "/learn", icon: learn, label: "learn", gradient: "from-emerald-400 to-emerald-500" },
	{ to: "/speedy", icon: speedy, label: "speedy", gradient: "from-amber-400 to-orange-500" },
	{ to: "/flashcards", icon: cards, label: "flashcards", gradient: "from-blue-400 to-blue-500" },
	{ to: "/identify", icon: pin, label: "pin", gradient: "from-rose-400 to-red-500" },
	{ to: "/point", icon: point, label: "point", gradient: "from-violet-400 to-purple-500" },
];


export default function LandingHeader() {
  const [MethodsOpen, setMethodsOpen] = useState(false);
  const [ToolsOpen, setToolsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
	const popupRef = useRef(null);
	const [isVisible, setIsVisible] = useState(false);
	const currentIndex = 0;
	const catIndex = 0;
	const ref = useRef(null);
	const {t, i18n} = useTranslation();
	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
				}
			},
			{ threshold: 0.1 }
		);

		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => observer.disconnect();
	}, []);


	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				popupRef.current &&
				!popupRef.current.contains(event.target)
			) {
				setMobileMenuOpen(false);
			}
		};

		if (mobileMenuOpen) {
			setTimeout(() => {
				document.addEventListener("mousedown", handleClickOutside);
			}, 0);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [mobileMenuOpen, setMobileMenuOpen]);

	return (<>
    <header
      className={`w-screen h-20 md:h-20 fixed top-0 left-0 right-0 z-[999] border-b border-transparent transition-all duration-300
      bg-transparent ${scrolled ? "bg-white dark:bg-[#182536] border-b border-studogrey/20" : null}
      flex items-center justify-between px-4 sm:px-8 lg:px-20`}
    >
      <div className="flex items-center justify-start gap-6 md:gap-10 flex-1">
		  <Link
			  to="/welcome"
			  className="group relative font-akira text-3xl md:text-4xl whitespace-nowrap"
		  >
          <span className="relative z-10 bg-gradient-to-r from-emerald-500 to-emerald-400 dark:from-white dark:to-blue-200 bg-clip-text text-transparent transition-all duration-300">
            STUDO
          </span>
		  </Link>

        <nav className="hidden md:flex flex-row gap-10 items-center">
          <TriggerMethods MethodsOpen={MethodsOpen} setMethodsOpen={setMethodsOpen} />
          <TriggerTools ToolsOpen={ToolsOpen} setToolsOpen={setToolsOpen} />
        </nav>
      </div>

      <div className="flex items-center justify-end gap-4 md:gap-5 flex-1">
        <div className="hidden md:flex items-center gap-5">
          <Link
            to={"/login"}
            className="inline-flex font-semibold text-white
            flex-row gap-2 justify-center items-center p-2 pl-7 pr-7 rounded-4xl cursor-pointer
            active:scale-105 transition-transform z-[2]
            border-[0.5px] border-solid border-[#8181812f]
            shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
            dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
            bg-emerald-400 dark:bg-white dark:text-studodarkblue"
          >
            {t("Log In")}
          </Link>
          <Link
            to={"/register"}
            className="font-semibold text-studodarkblue dark:text-white hover:underline"
          >
            {t("Create Account")}
          </Link>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-studodarkblue dark:text-white p-2"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>


    </header>
			{(
				<div className={`fixed inset-0 z-[99999] flex flex-col justify-end md:hidden
					bg-black/50 transition-opacity duration-300
					${mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}
				  `}
				>
					<div ref={popupRef} className={` ${mobileMenuOpen
						? "translate-y-0 sm:translate-y-0 opacity-100 visible pointer-events-auto"
						: "translate-y-full sm:translate-y-0 opacity-0 invisible pointer-events-none"}
						transition-all duration-500 ease-out origin-bottom
					h-3/4w-screen z-50 bg-white dark:bg-[#182536] rounded-tl-4xl rounded-tr-4xl md:hidden flex flex-col
					border-t border-l border-r border-studoborder`}>
						<div className={"flex flex-col gap-8 p-7 w-full h-fit"}>
							<div className={"flex flex-col gap-3"}>
								<span className={"font-bold"}>{t("Learn Modes")}:</span>
								<div className={"w-full h-fit grid grid-cols-2 gap-3"}>
									{menuItems.map((item, index) => (
										<Link
											key={item.to}
											to={item.to}
											onClick={() => setMobileMenuOpen(false)}
											className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl
												  text-studodarkblue dark:text-white
												  bg-studodarkblue/5 dark:bg-white/5
												  transition-all duration-200 ease-out
												  ${mobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
                    `}
											style={{
												transitionDelay: MethodsOpen ? `${(currentIndex + 1) * 50 + catIndex * 50}ms` : "0ms",
											}}
										>
											{/* Icon Container */}
											<div className={`flex items-center justify-center min-w-9 h-9 rounded-xl
												bg-gradient-to-br ${item.color}
												shadow-md shadow-black/10 overflow-hidden
												transition-all duration-200`}
											>
												<img src={item.icon} alt="" className="h-3 w-3 brightness-0 invert"/>
											</div>

											{/* Label */}
											<span className="font-medium text-sm">
											  {t(item.label)}
											</span>
										</Link>
									))}
								</div>
							</div>
							<div className={"flex flex-col gap-3"}>
								<span className={"font-bold"}>{t("Study Tools")}:</span>
								<div className={"w-full h-fit grid grid-cols-2 gap-3 "}>
									{toolCategories.map((item) => {
											return (
												<Link
													key={item.to}
													to={item.to}
													onClick={() => setMobileMenuOpen(false)}
													className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl
												  text-studodarkblue dark:text-white
												  bg-studodarkblue/5 dark:bg-white/5
												  transition-all duration-200 ease-out
												  ${mobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
                    `}
													style={{
														transitionDelay: MethodsOpen ? `${(currentIndex + 1) * 50 + catIndex * 50}ms` : "0ms",
													}}
												>
													{/* Icon Container */}
													<div className={`flex items-center justify-center w-9 h-9 rounded-xl
													  bg-gradient-to-br ${item.gradient}
													  shadow-md shadow-black/10 overflow-hidden
													  transition-all duration-200`}
													>
														<img
															src={item.icon}
															alt=""
															className="h-4 w-4 brightness-0 invert"
														/>
													</div>

													{/* Label */}
													<div className="flex flex-col">
													  <span className="font-medium text-sm group-hover:text-studodarkblue dark:group-hover:text-white transition-colors">
														{t(item.label)}
													  </span>
													</div>

													{/* Hover Arrow */}
													<svg
														className="w-4 h-4 ml-auto text-studodarkblue/30 dark:text-white/30 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
													</svg>

													{/* Hover Background Glow */}
													<div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-200`} />
												</Link>
											);
										})
									}
								</div>
							</div>
						</div>
						<div className="px-6 pt-10 pb-8 flex flex-col gap-4">
							<Link
								to={"/login"}
								onClick={() => setMobileMenuOpen(false)}
								className="w-full inline-flex font-semibold text-white justify-center items-center py-4 rounded-4xl cursor-pointer
				  active:scale-105 transition-transform
				  border-[0.5px] border-solid border-[#8181812f]
				  shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
				  dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
				  bg-emerald-400 dark:bg-white dark:text-studodarkblue"
							>
								{t("Log In")}
							</Link>
							<Link
								to={"/register"}
								onClick={() => setMobileMenuOpen(false)}
								className="w-full text-center font-semibold text-studodarkblue dark:text-white py-4 hover:underline"
							>
								{t("Create Account")}
							</Link>
						</div>
					</div>
				</div>
			)}
		</>
  );
}