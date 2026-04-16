"use client"
import {useCallback, useState} from "react";
import AnimateOnMount from "@/components/ui/overige/ui/AnimateOnMount";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { registerUser } from "@/lib/api/auth";
import { RegisterFormData, registerSchema } from "@/lib/validations/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {signIn} from "next-auth/react";

export default function MobileForm() {
    const [open, setOpen] = useState(false);
    const language = useLocale();
    const t = useTranslations("register");
    const toggleShow = () => setOpen(!open);

    const [serverError, setServerError] = useState<string | null>(null);

    const router = useRouter();
    const locale = useLocale();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || `/${locale}/home`;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: 'student',
        },
    });

    const onSubmit = async (data: RegisterFormData) => {
        setServerError(null);

        try {
            const { confirmPassword, ...registerData } = data;


            await registerUser(registerData);

            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,  // We handlen redirect zelf
            });

            if (result?.error) {
                router.push('/login?registered=true');
                return;
            }

            router.push(callbackUrl);

        } catch (error: any) {
            setServerError(error.message || 'Registratie mislukt');
        }
    };

    const loginGoogle = useCallback(() => {
        signIn('google');
    }, []);

    const loginMicrosoft = useCallback(() => {
        signIn('microsoft-entra-id');
    }, []);

    const loginSmartschool = useCallback(() => {
        window.location.href = "http://localhost:3000/api/sessions/smartschool";
    }, []);


    return (
        <div className={"w-full h-full overflow-y-scroll"}>
        <AnimateOnMount delay={100}>
            <div className="w-screen h-full flex items-center justify-center overflow-scroll scroll-hidden">
                <div className={`w-full h-fit flex flex-row overflow-y-scroll transition-all duration-700`}>
                    <div className="w-full backdrop-blur-2xl h-fit pt-16 flex flex-col gap-6 justify-center items-center px-12 relative overflow-hidden">
                        <div className="h-fit w-full md:w-1/2 justify-center relative gap-6 z-10 flex flex-col">
                            <AnimateOnMount delay={200}>
                                <div className={`flex flex-col gap-2 transition-all duration-500 delay-200`}>
                                    <h1 className="text-4xl font-bold text-studodarkblue dark:text-white">{t("Create account")}</h1>
                                    <p className="text-slate-400 text-sm">{t("create_account")}</p>
                                </div>
                            </AnimateOnMount>

                            <form data-cy="login_form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                                <AnimateOnMount delay={300}>
                                    <div className={`flex flex-col gap-5 transition-all duration-500 delay-300`}>
                                        <div className={"w-full flex flex-col gap-4 transition-all duration-500 delay-300"}>
                                            <span className={"w-full dark:text-white text-studodarkblue text-sm opacity-50"}>{t("info_title")}</span>
                                            <div className="flex flex-col gap-1">
                                                <div className={`flex flex-row justify-between px-4 sm:px-[2vh] h-11 sm:h-12 md:h-13
                                                                                  rounded-full text-sm sm:text-base border-0
                                                                                  bg-[rgba(255,255,255,0.175)] w-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
                                                                                  border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0 text-studodarkblue
                                                                                  dark:text-white  ${errors.email ? 'ring-2 ring-red-400' : ''}`}>
                                                    <input
                                                        type="email"
                                                        placeholder={t("email")}
                                                        autoComplete="none"
                                                        {...register('email')}
                                                        className="transition-all w-full duration-500 focus:outline-none bg-transparent"
                                                        data-cy="email_input"
                                                    />
                                                </div>
                                                {errors.email && errors.email.message && (
                                                    <span className="px-4 text-red-400 text-xs">{t(errors.email.message)}</span>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                <div className={`flex flex-row justify-between px-4 sm:px-[2vh] h-11 sm:h-12 md:h-13
                                                                                  rounded-full text-sm sm:text-base border-0
                                                                                  bg-[rgba(255,255,255,0.175)] w-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
                                                                                  border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0 text-studodarkblue
                                                                                  dark:text-white ${errors.displayName ? 'ring-2 ring-red-400' : ''}`}>
                                                    <input
                                                        type="text"
                                                        placeholder={t("name")}
                                                        {...register('displayName')}
                                                        autoComplete="none"
                                                        className="transition-all w-full duration-500 focus:outline-none bg-transparent"
                                                        data-cy="email_input"
                                                    />
                                                </div>
                                                {errors.displayName && errors.displayName.message && (
                                                    <span className="px-4 text-red-400 text-xs">{t(errors.displayName.message)}</span>
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
											  dark:text-white overflow-hidden gap-2 ${errors.password ? 'ring-2 ring-red-400' : ''}`}>
                                                    <input
                                                        type={open ? "text" : "password"}
                                                        placeholder={t("password")}
                                                        autoComplete="none"
                                                        {...register('password')}
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
                                                        alt="Toggle password visibility"
                                                    />
                                                </div>
                                                {errors.password && errors.password.message && (
                                                    <span className="px-4 text-red-400 text-xs">{t(errors.password.message)}</span>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <div className={`flex flex-row justify-between items-center px-4 sm:px-[2vh] h-11 sm:h-12 md:h-13
											  rounded-full text-sm sm:text-base border-0
											  bg-[rgba(255,255,255,0.175)] w-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
											  border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0 text-studodarkblue
											  dark:text-white overflow-hidden gap-2 ${errors.confirmPassword ? 'ring-2 ring-red-400' : ''}`}>
                                                    <input
                                                        type={open ? "text" : "password"}
                                                        placeholder={t("repeat password")}
                                                        autoComplete="none"
                                                        {...register('confirmPassword')}
                                                        className="transition-all duration-500 focus:outline-none bg-transparent flex-1 min-w-0"
                                                        data-cy="confirm_password_input"
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
                                                {errors.confirmPassword && errors.confirmPassword.message && (
                                                    <span className="px-4 text-red-400 text-xs">{t(errors.confirmPassword.message)}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className={`w-full flex flex-col gap-4 transition-all duration-500 delay-300`}>
                                            <span className={"w-full dark:text-white text-studodarkblue text-sm opacity-50"}>{t("role_title")}</span>
                                            <div className={`flex flex-col justify-center px-4 sm:px-[2vh] h-11 sm:h-12 md:h-13
                                                  rounded-full text-sm sm:text-base border-0
                                                  bg-[rgba(255,255,255,0.175)] w-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
                                                  border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0 text-studodarkblue
                                                dark:text-white ${errors.role ? 'ring-2 ring-red-400' : ''}`}>
                                                <select
                                                    {...register('role')}
                                                    className="w-full bg-transparent focus:outline-none"
                                                    data-cy="role_select"
                                                >
                                                    <option value="student" className="bg-slate-800">{t("student")}</option>
                                                    <option value="teacher" className="bg-slate-800">{t("teacher")}</option>
                                                    <option value="professor" className="bg-slate-800">{t("professor")}</option>
                                                </select>
                                            </div>
                                            {errors.role && errors.role.message && (
                                                <span className="px-4 text-red-400 text-xs">{t(errors.role.message)}</span>
                                            )}
                                        </div>

                                    </div>
                                </AnimateOnMount>
                                <div className="px-4 min-h-5">
                                    {serverError && (
                                        <div className="rounded-xl text-red-400 text-sm" data-cy="register_error">
                                            {t(serverError)}
                                        </div>
                                    )}
                                </div>

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
                                        {isSubmitting ? t("Loading") : t("Register")}
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
        </div>
    );
}