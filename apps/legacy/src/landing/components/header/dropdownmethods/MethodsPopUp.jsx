import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import ss from "../../../../assets/icons/studyset.svg";
import vs from "../../../../assets/icons/visualset.svg";
import ai from "../../../../assets/icons/sparkle.svg";

const menuItems = [
	{ to: "/about-studosets", icon: ss, label: "studysets", color: "from-emerald-400 to-teal-500" },
	{ to: "/about-visualsets", icon: vs, label: "visualsets", color: "from-blue-400 to-indigo-500" },
	{ to: "/about-ai", icon: ai, label: "ai", color: "from-violet-400 to-purple-500" },
];

export default function MethodsPopUp({ MethodsOpen, setMethodsOpen, triggerRef }) {
	const { t } = useTranslation();
	const popupRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				popupRef.current &&
				!popupRef.current.contains(event.target) &&
				triggerRef.current &&
				!triggerRef.current.contains(event.target)
			) {
				setMethodsOpen(false);
			}
		};

		if (MethodsOpen) {
			setTimeout(() => {
				document.addEventListener("mousedown", handleClickOutside);
			}, 0);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [MethodsOpen, setMethodsOpen, triggerRef]);

	return (
		<div
			ref={popupRef}
			className={`absolute top-full left-1/2 -translate-x-1/2 mt-4
        z-[9999] w-56 p-2
        rounded-2xl
        bg-white/80 dark:bg-[#1e293b]/90
        backdrop-blur-xl
        border border-white/50 dark:border-white/10
        shadow-xl shadow-black/10 dark:shadow-black/30
        transition-all duration-300 ease-out origin-top
        ${MethodsOpen
				? "opacity-100 scale-100 translate-y-0 visible pointer-events-auto"
				: "opacity-0 scale-95 -translate-y-2 invisible pointer-events-none"}
      `}
			onClick={(e) => e.stopPropagation()}
		>
			{/* Arrow */}
			<div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45
        bg-white/80 dark:bg-[#1e293b]/90
        border-l border-t border-white/50 dark:border-white/10"
			/>

			{/* Menu Items */}
			<div className="relative flex flex-col gap-1">
				{menuItems.map((item, index) => (
					<Link
						key={item.to}
						to={item.to}
						onClick={() => setMethodsOpen(false)}
						className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl
              text-studodarkblue dark:text-white
              hover:bg-gradient-to-r hover:${item.color} hover:text-white
              transition-all duration-200 ease-out
              ${MethodsOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
            `}
						style={{
							transitionDelay: MethodsOpen ? `${index * 50}ms` : "0ms",
						}}
					>
						{/* Icon Container */}
						<div className={`flex items-center justify-center w-8 h-8 rounded-lg
              bg-gradient-to-br ${item.color}
              shadow-md shadow-black/10
              group-hover:scale-110 group-hover:shadow-lg
              transition-all duration-200`}
						>
							<img
								src={item.icon}
								alt=""
								className="h-4 w-4 brightness-0 invert"
							/>
						</div>

						{/* Label */}
						<span className="font-medium text-sm">
              {t(item.label)}
            </span>

						{/* Hover Arrow */}
						<svg
							className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
						</svg>
					</Link>
				))}
			</div>
		</div>
	);
}