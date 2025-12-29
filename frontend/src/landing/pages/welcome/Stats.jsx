import { t } from "i18next";
import {FiTool} from "react-icons/fi";
import {PiStudent} from "react-icons/pi";
import {TbFreeRights} from "react-icons/tb";
import {IoIosInfinite, IoMdInfinite} from "react-icons/io";
import {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";

export default function Stats() {
	const [isVisible, setIsVisible] = useState(false);
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

	return (
		<div
			 ref={ref}
			 className={`
      w-full max-w-screen flex justify-center items-center
      md:px-20
      transition-all duration-700
      ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
    `}
		>
			<div
				className={`
        flex flex-col md:flex-row items-center justify-center gap-4
        w-fit md:min-w-[40%] rounded-3xl
        md:rounded-full
        bg-gradient-to-r from-emerald-400 to-emerald-500
        dark:bg-none dark:backdrop-blur-md
        border border-studoborder/20
        py-4 px-6 md:px-8
        shadow-lg hover:shadow-2xl
        transition-all duration-300
      `}
			>
				{/* Tool 1 */}
				<div className="flex flex-col items-center justify-center text-white text-center gap-2 md:gap-1 px-3">
					<FiTool className="text-3xl md:text-4xl" />
					<span className="font-bold text-lg md:text-xl">{t("5 study tools")}</span>
				</div>

				{/* Separator */}
				<div className="hidden md:block h-12 border-l-2 border-white mx-4"></div>

				{/* Tool 2 */}
				<div className="flex flex-col items-center justify-center text-white text-center gap-2 md:gap-1 px-3">
					<IoMdInfinite className="text-3xl md:text-4xl" />
					<span className="font-bold text-lg md:text-xl">{t("endless sets")}</span>
				</div>

				{/* Separator */}
				<div className="hidden md:block h-12 border-l-2 border-white mx-4"></div>

				{/* Tool 3 */}
				<div className="flex flex-col items-center justify-center text-white text-center gap-2 md:gap-1 px-3">
					<TbFreeRights className="text-3xl md:text-4xl" />
					<span className="font-bold text-lg md:text-xl">{t("100% free")}</span>
				</div>
			</div>
		</div>
	);

}