"use client"
import {useCallback, useEffect, useState, useMemo} from "react";
import {useLocale, useTranslations} from "next-intl";
import Link from "next/link";
import AnimateOnMount from "@/components/overige/ui/AnimateOnMount";

const validationRules = {
    email: {
        required: "Email is required"
    },
    password: {
        required: "Password is required"
    }
};

export default function MobileForm() {
    const language = useLocale();
    const [open, setOpen] = useState(false);
    const t = useTranslations("register");
    const errors = false;
    const loading = false;
    const toggleShow = () => setOpen(!open);

    const loginGoogle = useCallback(() => {
        window.location.href = "http://localhost:3000/api/sessions/google";
    }, []);

    const loginMicrosoft = useCallback(() => {
        window.location.href = "http://localhost:3000/api/sessions/microsoft";
    }, []);

    const loginSmartschool = useCallback(() => {
        window.location.href = "http://localhost:3000/api/sessions/smartschool";
    }, []);

    return (
        <AnimateOnMount delay={100}>
            <div className="w-screen h-screen flex items-center justify-center overflow-scroll">
                <div className={`w-full h-full flex flex-row overflow-y-scroll transition-all duration-700`}>
                    <div className="w-full backdrop-blur-2xl flex flex-col gap-6 justify-center items-center px-12 py-16 relative overflow-hidden">
                        <div className="h-full w-full md:w-1/2 justify-center relative gap-6 z-10 flex flex-col">
                            <AnimateOnMount delay={200}>
                                <div className={`flex flex-col gap-2 transition-all duration-500 delay-200`}>
                                    <h1 className="text-4xl font-bold text-studodarkblue dark:text-white">{t("Create account")}</h1>
                                    <p className="text-slate-400 text-sm">{t("create_account")}</p>
                                </div>
                            </AnimateOnMount>

                            <form data-cy="login_form" className="flex flex-col gap-4">
                                <AnimateOnMount delay={300}>
                                    <div className={`flex flex-col gap-5 transition-all duration-500 delay-300`}>
                                        <div className={"w-full flex flex-col gap-4 transition-all duration-500 delay-300"}>
                                            <span className={"w-full dark:text-white text-studodarkblue text-sm opacity-50"}>{t("info_title")}</span>
                                            <div className="flex flex-col gap-1">
                                                <div className={`flex flex-row justify-between px-4 sm:px-[2vh] h-11 sm:h-12 md:h-13
                                                                                  rounded-full text-sm sm:text-base border-0
                                                                                  bg-[rgba(255,255,255,0.175)] w-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
                                                                                  border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0 text-studodarkblue
                                                                                  dark:text-white ${errors ? 'ring-2 ring-red-400' : ''}`}>
                                                    <input
                                                        type="text"
                                                        placeholder={t("email")}
                                                        autoComplete="none"
                                                        className="transition-all w-full duration-500 focus:outline-none bg-transparent"
                                                        data-cy="email_input"
                                                    />
                                                </div>
                                                {errors && (
                                                    <span className="px-4 text-red-400 text-xs">{}</span>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <div className={`flex flex-row justify-between px-4 sm:px-[2vh] h-11 sm:h-12 md:h-13
                                                                                  rounded-full text-sm sm:text-base border-0
                                                                                  bg-[rgba(255,255,255,0.175)] w-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
                                                                                  border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0 text-studodarkblue
                                                                                  dark:text-white ${errors ? 'ring-2 ring-red-400' : ''}`}>
                                                    <input
                                                        type="text"
                                                        placeholder={t("name")}
                                                        autoComplete="none"
                                                        className="transition-all w-full duration-500 focus:outline-none bg-transparent"
                                                        data-cy="email_input"
                                                    />
                                                </div>
                                                {errors && (
                                                    <span className="px-4 text-red-400 text-xs">{}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className={`w-full flex flex-col gap-4 transition-all duration-500 delay-300`}>
                                            <span className={"w-full dark:text-white text-studodarkblue text-sm opacity-50"}>{t("password_title")}</span>
                                            <div className="flex flex-col gap-1">
                                                <div className={`flex flex-row justify-between items-center px-4 sm:px-[2vh] h-11 sm:h-12 md:h-13
											  rounded-full text-sm sm:text-base border-0
											  bg-[rgba(255,255,255,0.175)] w-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
											  border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0 text-studodarkblue
											  dark:text-white overflow-hidden gap-2 ${errors ? 'ring-2 ring-red-400' : ''}`}>
                                                    <input
                                                        type={open ? "text" : "password"}
                                                        placeholder={t("password")}
                                                        autoComplete="none"

                                                        className="transition-all duration-500 focus:outline-none bg-transparent flex-1 min-w-0"
                                                        data-cy="password_input"
                                                    />
                                                    <img
                                                        src={open ? "/icons/eye-open.svg" : "/icons/eye-closed.svg"}
                                                        onClick={toggleShow}
                                                        className={`w-4 sm:w-5 flex-shrink-0 cursor-pointer dark:invert dark:brightness-0 dark:opacity-50 ${
                                                            open ? "" : "pt-0.5 sm:pt-1"
                                                        }`}
                                                        data-cy="toggle_password_visibility"
                                                    />
                                                </div>
                                                {errors && (
                                                    <span className="px-4 text-red-400 text-xs">{}</span>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <div className={`flex flex-row justify-between items-center px-4 sm:px-[2vh] h-11 sm:h-12 md:h-13
											  rounded-full text-sm sm:text-base border-0
											  bg-[rgba(255,255,255,0.175)] w-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
											  border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0 text-studodarkblue
											  dark:text-white overflow-hidden gap-2 ${errors ? 'ring-2 ring-red-400' : ''}`}>
                                                    <input
                                                        type={open ? "text" : "password"}
                                                        placeholder={t("repeat password")}
                                                        autoComplete="none"

                                                        className="transition-all duration-500 focus:outline-none bg-transparent flex-1 min-w-0"
                                                        data-cy="password_input"
                                                    />
                                                    <img
                                                        src={open ? "/icons/eye-open.svg" : "/icons/eye-closed.svg"}
                                                        onClick={toggleShow}
                                                        className={`w-4 sm:w-5 flex-shrink-0 cursor-pointer dark:invert dark:brightness-0 dark:opacity-50 ${
                                                            open ? "" : "pt-0.5 sm:pt-1"
                                                        }`}
                                                        data-cy="toggle_password_visibility"
                                                    />
                                                </div>
                                                {errors && (
                                                    <span className="px-4 text-red-400 text-xs">{}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className={`w-full flex flex-col gap-4 transition-all duration-500 delay-300`}>
                                            <span className={"w-full dark:text-white text-studodarkblue text-sm opacity-50"}>{t("role_title")}</span>
                                            <div className="flex flex-col justify-center px-4 sm:px-[2vh] h-11 sm:h-12 md:h-13
                      rounded-full text-sm sm:text-base border-0
                      bg-[rgba(255,255,255,0.175)] w-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
                      border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0 text-studodarkblue
                      dark:text-white">
                                                <select
                                                    className="w-full bg-transparent focus:outline-none"
                                                    data-cy="role_select"
                                                >
                                                    <option value="student" className="bg-slate-800">{t("student")}</option>
                                                    <option value="teacher" className="bg-slate-800">{t("teacher")}</option>
                                                    <option value="professor" className="bg-slate-800">{t("professor")}</option>
                                                </select>
                                            </div>
                                        </div>

                                    </div>
                                </AnimateOnMount>
                                {errors ? (
                                        <div className="px-4 min-h-5 rounded-xl text-red-400 text-sm" data-cy="login_error">
                                            {}
                                        </div>) :
                                    (<div className={"h-5 w-full"}></div>
                                    )}
                                <AnimateOnMount delay={400}>
                                    <button
                                        type="submit"
                                        className={`w-full h-13 mt-2 rounded-full font-semibold text-white
										bg-emerald-400 
										hover:bg-emerald-500 
										active:scale-[0.98] cursor-pointer
										disabled:opacity-50 disabled:cursor-not-allowed
										shadow-lg shadow-emerald-500/25
										transition-all duration-500 delay-400`}
                                        data-cy="submit_login">
                                        {loading ? t("Loading") : t("Register")}
                                    </button>
                                </AnimateOnMount>
                            </form>

                            <AnimateOnMount delay={400}>
                                <div className={`flex flex-col gap-4 transition-all duration-500 delay-500`}>

                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex-1 h-px bg-white/10" />
                                        <span className="text-xs text-slate-500">{t("other_register")}</span>
                                        <div className="flex-1 h-px bg-white/10" />
                                    </div>

                                    <div className="flex gap-3 flex-row">
                                        <button
                                            type="button"
                                            onClick={loginGoogle}
                                            className="flex-1 min-h-13 flex items-center justify-center gap-2 rounded-full
                                                bg-studodarkblue/5 border-studodarkblue/5
                                                dark:bg-white/5 border dark:border-white/10 dark:hover:bg-white/10 dark:hover:border-white/20
                                                transition-all duration-300 cursor-pointer"
                                            data-cy="login_google">
                                            <img src={"/icons/logos/google.svg"} alt="" className="h-6" />

                                        </button>
                                        <button
                                            type="button"
                                            onClick={loginMicrosoft}
                                            className="flex-1 min-h-13 flex items-center justify-center gap-2 rounded-full
                                                bg-studodarkblue/5 border-studodarkblue/5
                                                dark:bg-white/5 border dark:border-white/10 dark:hover:bg-white/10 dark:hover:border-white/20
                                                transition-all duration-300 cursor-pointer"
                                            data-cy="login_microsoft">
                                            <img src={"/icons/logos/microsoft.svg"} alt="" className="h-6" />

                                        </button>
                                        {language === "nl" || language === "fr-BE"  ? (
                                            <button
                                                type="button"
                                                onClick={loginSmartschool}
                                                className="flex-1 min-h-13 flex items-center justify-center gap-2 rounded-full
                                                bg-studodarkblue/5 border-studodarkblue/5
                                                dark:bg-white/5 border dark:border-white/10 dark:hover:bg-white/10 dark:hover:border-white/20
                                                transition-all duration-300 cursor-pointer"
                                                data-cy="login_smartschool">
                                                <img src={"/icons/logos/smartschool.png"} alt="" className="h-6" />

                                            </button>
                                        ): null}
                                    </div>
                                </div>
                            </AnimateOnMount>
                            <AnimateOnMount delay={500}>
                                <p className={`text-center text-sm text-slate-500 transition-all duration-500 delay-600`}>
                                    {t("Already")}{" "}
                                    <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors" data-cy="register_link">
                                        {t("log in")}
                                    </Link>
                                </p>
                            </AnimateOnMount>
                        </div>
                    </div>
                </div>
            </div>
        </AnimateOnMount>
    );
}