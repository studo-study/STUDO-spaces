import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import smart from "../../../assets/icons/start/studysmart.svg";
import ready from "../../../assets/icons/start/ready.svg";
import laptop from "../../../assets/icons/laptop.svg";
import {useTranslation} from "react-i18next";


const features = [
	{
		title: "Study the smart way",
		description: "block1",
		image: smart,
		color: "from-orange-400 to-amber-500",
		bgColor: "bg-gradient-to-br from-orange-400 to-amber-50 dark:from-orange-400 dark:to-amber-400",
		direction: "normal",
	},
	{
		title: "Created by students, for students",
		description: "block2",
		image: laptop,
		color: "from-blue-400 to-cyan-500",
		bgColor: "bg-gradient-to-br from-blue-400 to-cyan-50 dark:from-blue-400 dark:to-cyan-400",
		direction: "reverse",
	},
	{
		title: "Ready for every challenge",
		description: "block3",
		image: ready,
		color: "from-emerald-400 to-teal-500",
		bgColor: "bg-gradient-to-br from-emerald-400 to-teal-50 dark:from-emerald-400 dark:to-teal-400",
		direction: "normal",
		showCTA: true,
	},
];


function FeatureCard({ feature, index, isVisible }) {
	const isReverse = feature.direction === "reverse";
	const {t} = useTranslation();
	return (
		<div
			className={`grid grid-cols-1 overflow-visible lg:grid-cols-2 gap-8 lg:gap-5 items-center
      transition-all duration-1000
      ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
			style={{ transitionDelay: isVisible ? `${index * 200}ms` : "0ms" }}
		>
			{/* Tekstkolom */}
			<div className={`flex  overflow-visible flex-col w-full gap-6 ${isReverse ? "lg:order-2 items-end text-right" : "lg:order-1 items-start text-left"}`}>
				<div className="inline-flex overflow-visible items-center gap-2">
				  <span className={`w-8 h-8 rounded-full backdrop-blur-sm bg-gradient-to-r ${feature.color} flex items-center justify-center text-white font-bold text-sm`}>
					{index + 1}
				  </span>
								<span className="text-xs uppercase tracking-wider text-studodarkblue/40 dark:text-white/40 font-medium">
					{t("Feature")}
				  </span>
				</div>

				<h3 className={`text-2xl w-full sm:text-3xl overflow-visible  lg:text-4xl font-bold text-studodarkblue dark:text-white leading-tight`}>
					{t(feature.title)}
				</h3>

				<p className={`text-base lg:text-lg text-studodarkblue/70 dark:text-white/70 leading-relaxed`}>
					{t(feature.description)}
				</p>

				{feature.showCTA && (
					<div className="mt-4 overflow-visible ">
						<Link
							to="/register"
							className="group overflow-visible inline-flex items-center gap-3 px-8 py-4 text-lg font-bold text-white rounded-full
                     bg-gradient-to-r from-emerald-500 to-emerald-400 dark:from-studoblue dark:to-blue-400
                     shadow-xl shadow-emerald-500/25 dark:shadow-studoblue/25
                     hover:shadow-2xl hover:shadow-emerald-500/30 dark:hover:shadow-studoblue/30
                     hover:-translate-y-1 active:translate-y-0
                     transition-all duration-300"
						>
							{t("Sign Up For Free")}
							<svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
							</svg>
						</Link>
					</div>
				)}
			</div>

			{/* Afbeelding kolom */}
				<div className={` ${isReverse ? "lg:order-1" : "lg:order-2"}`}>
					<div className={`rounded-3xl ${feature.bgColor} p-8 lg:p-12 overflow-hidden
                      border border-white/50 dark:border-white/10 h-full w-full
                      shadow-xl shadow-black/5 dark:shadow-black/20 backdrop-blur-sm
                      group hover:scale-[1.02] transition-transform duration-500`}
					>
						<img
							src={feature.image}
							alt={t(feature.title)}
							className="object-contain transform group-hover:scale-105 group-hover:-translate-y-2 transition-transform duration-500"
						/>
					</div>
				</div>
		</div>

	);
}

export default function Info() {
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
		<section ref={ref} className="relative px-4 overflow-visible ">
			<div className="absolute inset-0 -z-10">
				<div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-studogrey/20 to-transparent" />
				<div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-studogrey/20 to-transparent" />
			</div>

			<div className="max-w-6xl mx-auto flex flex-col justify-center items-center">
				<div className={`text-center mb-16 lg:mb-24 transition-all duration-700
            	${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
				>
				  <span className="inline-block px-4 py-2 rounded-full text-sm font-medium
					bg-emerald-100 dark:bg-studoblue/20
					text-emerald-700 dark:text-studoblue
					border border-emerald-200 dark:border-studoblue/30
					mb-6">
					{t("Why Studo?")}
				  </span>
					<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-studodarkblue dark:text-white">
						{t("Everything you need to")}
						<span className="block mt-2 bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-studoblue dark:to-blue-400 bg-clip-text text-transparent">
              				{t("ace your studies")}
            			</span>
					</h2>
				</div>

				<div className="flex flex-col md:w-2/3 gap-10">
					{features.map((feature, index) => (
						<FeatureCard
							key={index}
							feature={feature}
							index={index}
							isVisible={isVisible}
						/>
					))}
				</div>
			</div>
		</section>
	);
}