"use client";
import {useCallback, useState} from "react";
import AnimateOnMount from "@/components/ui/overige/ui/AnimateOnMount";
import {useLocale, useTranslations} from "next-intl";
import Link from "next/link";
import Image from "next/image";
import {useRouter, useSearchParams} from "next/navigation";
import {signIn} from "next-auth/react";


export default function DesktopForm() {
    const [open, setOpen] = useState(false);
    const language = useLocale();
    const t = useTranslations("login")
    const errors = false;
    const toggleShow = () => setOpen(!open);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);


    const router = useRouter();
    const locale = useLocale();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || `/${locale}/home`;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        console.log('🚀 Attempting login with:', { email, password: '***' });

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });


            if (result?.error) {
                setLoading(false);
                return;
            }

            console.log('✅ Login successful, redirecting to:', callbackUrl);
            router.push(callbackUrl);
            router.refresh();

        } catch (err) {
            console.error(err)
            setLoading(false);
        }
    };

    const loginGoogle = useCallback(() => {
        signIn('google');
    }, []);

    const loginMicrosoft = useCallback(() => {
        signIn('microsoft-entra-id');
    }, []);

    const loginSmartschool = useCallback(() => {
        window.location.href = process.env.NEXT_PUBLIC_BACKEND_URL + "/sessions/smartschool";
    }, []);


    return (
        <div className="w-full h-full 3xl:absolute 3xl:inset-0 3xl:flex 3xl:justify-center 3xl:items-center flex justify-end">
                <AnimateOnMount delay={100}>
                <div className={`w-3/5 xl:w-full h-full flex flex-row overflow-hidden
					rounded-4xl 3xl:h-fit 3xl:max-w-full< 
					shadow-2xl shadow-black/20
					transition-all duration-700`}>

                    <div className="w-full backdrop-blur-2xl flex flex-col gap-10 justify-center px-12 py-15 relative overflow-hidden">


                        <div className="h-full justify-baseline relative gap-8 z-10 flex flex-col ">
                            <AnimateOnMount delay={200}>
                            <div className={`flex flex-col gap-2 transition-all duration-500 delay-200`}>
                                <h1 className="text-4xl font-bold text-studodarkblue dark:text-white">{t("Welcome back")}</h1>
                                <p className="text-slate-400 text-sm">{t("log into account")}</p>
                            </div>
                            </AnimateOnMount>

                            <form data-cy="login_form" onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <AnimateOnMount delay={300}>
                                <div className={`flex flex-col gap-4 transition-all duration-500 delay-300`}>
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
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="transition-all w-full duration-500 focus:outline-none bg-transparent"
                                                data-cy="email_input"
                                                required
                                                disabled={loading}
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
                                                placeholder={t("password")}
                                                autoComplete="none"
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="transition-all duration-500 focus:outline-none bg-transparent flex-1 min-w-0"
                                                data-cy="password_input"
                                                required
                                                disabled={loading}
                                            />
                                            <Image
                                                src={open ? "/icons/eye-open.svg" : "/icons/eye-closed.svg"}
                                                onClick={toggleShow}
                                                width={20}
                                                height={20}
                                                alt=""
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
                                    disabled={loading}
                                    className={`w-full h-13 mt-2 rounded-full font-semibold text-white
										bg-gradient-to-r from-studoblue to-blue-400
										hover:from-blue-500 
										active:scale-[0.98] cursor-pointer
										disabled:opacity-50 disabled:cursor-not-allowed
										shadow-lg shadow-blue-500/25
										transition-all duration-500 delay-400`}
                                    data-cy="submit_login">
                                    {loading ? t("Loading") : t("Log In")}
                                </button>
                                </AnimateOnMount>
                            </form>

                            <AnimateOnMount delay={500}>
                            <div className={`flex flex-col gap-4 transition-all duration-500 delay-500`}>

                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex-1 h-px bg-white/10" />
                                    <span className="text-xs text-slate-500">{t("or log in with")}</span>
                                    <div className="flex-1 h-px bg-white/10" />
                                </div>

                                <div className="flex gap-4 flex-col">
                                    <button
                                        type="button"
                                        onClick={loginGoogle}
                                        className="flex-1 min-h-13 flex items-center justify-center gap-2 rounded-full
											bg-studodarkblue/5 border-studodarkblue/5
											dark:bg-white/5 border dark:border-white/10 dark:hover:bg-white/10 dark:hover:border-white/20
											transition-all duration-300 cursor-pointer"
                                        data-cy="login_google">
                                        <Image src="/icons/logos/google.svg" width={24} height={24} alt="" className="h-6" />
                                        <span className="text-sm text-studodarkblue dark:text-slate-300">Google</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={loginMicrosoft}
                                        className="flex-1 min-h-13 flex items-center justify-center gap-2 rounded-full
											bg-studodarkblue/5 border-studodarkblue/5
											dark:bg-white/5 border dark:border-white/10 dark:hover:bg-white/10 dark:hover:border-white/20
											transition-all duration-300 cursor-pointer"
                                        data-cy="login_microsoft">
                                        <Image src="/icons/logos/microsoft.svg" width={24} height={24} alt="" className="h-6" />
                                        <span className="text-sm text-studodarkblue dark:text-slate-300">Microsoft</span>
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
                                            <Image src="/icons/logos/smartschool.png" width={24} height={24} alt="" className="h-6" />
                                            <span className="text-sm text-studodarkblue dark:text-slate-300">{t("Smartschool")}</span>
                                        </button>
                                    ): null}
                                </div>
                            </div>
                            </AnimateOnMount>
                            <AnimateOnMount delay={600}>
                                <p className={`text-center text-sm text-slate-500 transition-all duration-500 delay-600`}>
                                    {t("Don't have an account?")}{" "}
                                    <Link href="/register" className="text-emerald-400 hover:text-emerald-300 transition-colors" data-cy="register_link">
                                        {t("sign up")}
                                    </Link>
                                </p>
                            </AnimateOnMount>
                        </div>
                    </div>
                </div>
                </AnimateOnMount>
        </div>
    );
}