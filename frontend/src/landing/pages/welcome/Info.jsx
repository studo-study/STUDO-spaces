import { t } from "i18next";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import smart from "../../../../public/assets/icons/start/studysmart.svg";
import ready from "../../../../public/assets/icons/start/ready.svg";
import laptop from "../../../../public/assets/icons/laptop.svg";

const features = [
	{
		title: "Study the smart way",
		description: "block1",
		image: smart,
		color: "from-orange-400 to-amber-500",
		bgColor: "bg-gradient-to-br from-orange-100 to-amber-50 dark:from-orange-500/20 dark:to-amber-500/10",
		direction: "normal",
	},
	{
		title: "Created by students, for students",
		description: "block2",
		image: laptop,
		color: "from-blue-400 to-cyan-500",
		bgColor: "bg-gradient-to-br from-blue-100 to-cyan-50 dark:from-blue-500/20 dark:to-cyan-500/10",
		direction: "reverse",
	},
	{
		title: "Ready for every challenge",
		description: "block3",
		image: ready,
		color: "from-emerald-400 to-teal-500",
		bgColor: "bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-500/20 dark:to-teal-500/10",
		direction: "normal",
		showCTA: true,
	},
];

function FeatureCard({ feature, index, isVisible }) {
	const isReverse = feature.direction === "reverse";

	return (
		<div
			className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center
        transition-all duration-1000 delay-${index * 200}
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
			style={{ transitionDelay: isVisible ? `${index * 200}ms` : "0ms" }}
		>
			{/* Text Content */}
			<div className={`flex flex-col gap-6 ${isReverse ? "lg:order-2" : "lg:order-1"}`}>
				{/* Number Badge */}
				<div className="inline-flex items-center gap-2">
          <span className={`w-8 h-8 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-white font-bold text-sm`}>
            {index + 1}
          </span>
					<span className="text-xs uppercase tracking-wider text-studodarkblue/40 dark:text-white/40 font-medium">
            Feature
          </span>
				</div>

				{/* Title */}
				<h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-studodarkblue dark:text-white leading-tight">
					{t(feature.title)}
				</h3>

				{/* Description */}
				<p className="text-base lg:text-lg text-studodarkblue/70 dark:text-white/70 leading-relaxed">
					{t(feature.description)}
				</p>

				{/* CTA Button */}
				{feature.showCTA && (
					<div className="mt-4">
						<Link
							to="/register"
							className="group inline-flex items-center gap-3 px-8 py-4 text-lg font-bold text-white rounded-full
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

			{/* Image Card */}
			<div className={`${isReverse ? "lg:order-1" : "lg:order-2"}`}>
				<div className={`relative rounded-3xl ${feature.bgColor} p-8 lg:p-12 overflow-hidden
          border border-white/50 dark:border-white/10
          shadow-xl shadow-black/5 dark:shadow-black/20
          group hover:scale-[1.02] transition-transform duration-500`}
				>
					{/* Decorative Elements */}
					<div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/30 dark:bg-white/5 blur-2xl" />
					<div className="absolute bottom-4 left-4 w-32 h-32 rounded-full bg-white/20 dark:bg-white/5 blur-3xl" />

					{/* Image */}
					<img
						src={feature.image}
						alt={feature.title}
						className="relative w-full max-w-md mx-auto object-contain
              transform group-hover:scale-105 group-hover:-translate-y-2
              transition-transform duration-500"
					/>
				</div>
			</div>
		</div>
	);
}

export default function Info() {
	const [isVisible, setIsVisible] = useState(false);
	const ref = useRef(null);

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
		<section id="info" ref={ref} className="relative py-20 lg:py-32 px-4 overflow-hidden">
			{/* Section Background */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-studogrey/20 to-transparent" />
				<div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-studogrey/20 to-transparent" />
			</div>

			<div className="max-w-6xl mx-auto">
				{/* Section Header */}
				<div
					className={`text-center mb-16 lg:mb-24
            transition-all duration-700
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

				{/* Features */}
				<div className="space-y-20 lg:space-y-32">
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