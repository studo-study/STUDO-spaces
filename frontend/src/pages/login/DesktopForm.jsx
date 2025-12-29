import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCallback, useState, useEffect } from "react";
import { useAuth } from "../../contexts/auth";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import eyeOpened from "../../../public/assets/icons/eye-open.svg";
import eyeClosed from "../../../public/assets/icons/eye-closed.svg";
import google from "../../../public/assets/icons/logos/google.svg";
import microsoft from "../../../public/assets/icons/logos/microsoft.svg";
import smartschool from "../../../public/assets/icons/logos/smartschool.png";
import learn from "../../../public/assets/icons/start/learn.svg";
import flash from "../../../public/assets/icons/start/flashcards.svg";
import speedy from "../../../public/assets/icons/start/speedy.svg";
import pin from "../../../public/assets/icons/start/point.svg";
import point from "../../../public/assets/icons/start/hero-pin.svg";
import i18n from "i18next";

const validationRules = {
	email: { required: "Email is required" },
	password: { required: "Password is required" }
};


const studyModes = [
	{ label: "Learn", icon: learn, color: "from-emerald-500 to-emerald-400" },
	{ label: "Flashcards", icon: flash, color: "from-blue-500 to-blue-400" },
	{ label: "Speedy", icon: speedy, color: "from-amber-500 to-orange-400" },
	{ label: "Identify", icon: pin, color: "from-rose-500 to-red-400" },
	{ label: "Point", icon: point, color: "from-violet-500 to-purple-400" },
];

export default function DesktopForm() {
	const language = i18n.language;
	const { search } = useLocation();
	const [open, setOpen] = useState(false);
	const [mounted, setMounted] = useState(false);
	const { error, loading, login } = useAuth();
	const navigate = useNavigate();
	const methods = useForm({});
	const { handleSubmit } = methods;
	const { t } = useTranslation();

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleLogin = useCallback(
		async ({ email, password }) => {
			const loggedIn = await login(email, password);
			if (loggedIn) {
				const params = new URLSearchParams(search);
				navigate({
					pathname: params.get("redirect") || "/home",
					replace: true
				});
			}
		},
		[login, navigate, search]
	);

	const toggleShow = () => setOpen(!open);

	const loginGoogle = useCallback(() => {
		window.location.href = "http://localhost:3000/api/sessions/google";
	}, []);

	const loginMicrosoft = useCallback(() => {
		window.location.href = "http://localhost:3000/api/sessions/microsoft";
	}, []);

	return (
		<div className="w-full h-full flex justify-end">
			<FormProvider {...methods}>
				<div className={`w-1/3 h-full flex flex-row overflow-hidden
					rounded-4xl 
					shadow-2xl shadow-black/20
					transition-all duration-700
					${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>

					<div className="w-full backdrop-blur-2xl flex flex-col gap-10 justify-center px-12 py-25 relative overflow-hidden">


						<div className="h-full justify-baseline relative gap-8 z-10 flex flex-col ">

							<div className={`flex flex-col gap-2 transition-all duration-500 delay-200
								${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
								<h1 className="text-4xl font-bold text-white">{t("Welcome back")}</h1>
								<p className="text-slate-400 text-sm">{t("log into account")}</p>
							</div>

							<form onSubmit={handleSubmit(handleLogin)} data-cy="login_form" className="flex flex-col gap-4">
								<div className={`flex flex-col gap-4 transition-all duration-500 delay-300
									${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>

									<div className="flex flex-row justify-between px-4 sm:px-[2vh] h-11 sm:h-12 md:h-13
									  rounded-full text-sm sm:text-base border-0
									  bg-[rgba(255,255,255,0.175)] w-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
									  border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0 text-studodarkblue
									  dark:text-white">
										<input
											{...methods.register("email", validationRules.email)}
											type="text"
											placeholder={t("email")}
											autoComplete="none"
											className="transition-all w-full duration-500 focus:outline-none bg-transparent"
											data-cy="email_input"
										/>
									</div>

									<div className="flex flex-row justify-between items-center px-4 sm:px-[2vh] h-11 sm:h-12 md:h-13
										  rounded-full text-sm sm:text-base border-0
										  bg-[rgba(255,255,255,0.175)] w-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
										  border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0 text-studodarkblue
										  dark:text-white overflow-hidden gap-2">
										<input
											type={open ? "text" : "password"}
											placeholder={t("password")}
											autoComplete="none"
											{...methods.register("password", validationRules.password)}
											className="transition-all duration-500 focus:outline-none bg-transparent flex-1 min-w-0"
											data-cy="password_input"
										/>
										<img
											src={open ? eyeOpened : eyeClosed}
											onClick={toggleShow}
											className={`w-4 sm:w-5 flex-shrink-0 cursor-pointer dark:invert dark:brightness-0 dark:opacity-50 ${
												open ? "" : "pt-0.5 sm:pt-1"
											}`}
											data-cy="toggle_password_visibility"
										/>
									</div>
								</div>

								{error ? (
									<div className="px-4 min-h-5 rounded-xl text-red-400 text-sm" data-cy="login_error">
										{error.message}
									</div>) :
									(<div className={"h-5 w-full"}></div>
								)}

								<button
									type="submit"
									disabled={loading}
									className={`w-full h-13 mt-2 rounded-full font-semibold text-white
										bg-gradient-to-r from-studoblue to-blue-400
										hover:from-blue-500 
										active:scale-[0.98] cursor-pointer
										disabled:opacity-50 disabled:cursor-not-allowed
										shadow-lg shadow-blue-500/25
										transition-all duration-500 delay-400
										${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
									data-cy="submit_login">
									{loading ? t("Loading...") : t("Log In")}
								</button>
							</form>

							<div className={`flex flex-col gap-4 transition-all duration-500 delay-500
								${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>

								<div className="flex items-center gap-4 mb-4">
									<div className="flex-1 h-px bg-white/10" />
									<span className="text-xs text-slate-500">{t("or log in with")}</span>
									<div className="flex-1 h-px bg-white/10" />
								</div>

								<div className="flex gap-4 flex-col">
									<button
										type="button"
										onClick={loginGoogle}
										className="flex-1  min-h-13 py-2 flex items-center justify-center gap-2 rounded-full
											bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20
											transition-all duration-300 cursor-pointer"
										data-cy="login_google">
										<img src={google} alt="" className="h-6" />
										<span className="text-sm text-slate-300">Google</span>
									</button>
									<button
										type="button"
										onClick={loginMicrosoft}
										className="flex-1  min-h-13 flex items-center justify-center gap-2 rounded-full
											bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20
											transition-all duration-300 cursor-pointer"
										data-cy="login_microsoft">
										<img src={microsoft} alt="" className="h-6" />
										<span className="text-sm text-slate-300">Microsoft</span>
									</button>
									{language === "nl-BE" || language === "fr-FR-BE"  ? (
										<button
											type="button"
											className="flex-1 min-h-13 flex items-center justify-center gap-2 rounded-full
											bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20
											transition-all duration-300 cursor-pointer"
											data-cy="login_smartschool">
											<img src={smartschool} alt="" className="h-6" />
											<span className="text-sm text-slate-300">{t("Smartschool")}</span>
										</button>
									): null}
								</div>
							</div>

							<p className={`text-center text-sm text-slate-500 transition-all duration-500 delay-600
								${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
								{t("Don't have an account?")}{" "}
								<Link to="/register" className="text-emerald-400 hover:text-emerald-300 transition-colors" data-cy="register_link">
									{t("sign up")}
								</Link>
							</p>
						</div>
					</div>
				</div>
			</FormProvider>
		</div>
	);
}