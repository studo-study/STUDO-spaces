"use client"
import {useState} from "react";
import {useLocale, useTranslations} from "next-intl";
import {useRouter, useSearchParams} from "next/navigation";
import {signIn} from "next-auth/react";
import AnimateOnMount from "@/components/pages/overige/ui/AnimateOnMount";
import { db } from '@/lib/firebase/firebase';
import {collection, addDoc, serverTimestamp, query, where, getDocs, setDoc, doc, getDoc} from 'firebase/firestore';
import {navigate} from "next/dist/client/components/segment-cache/navigation";
import router from "next/router";


export default function MobileForm() {
    const t = useTranslations("waitinglist")
    const errors = false;

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const locale = useLocale();
    const searchParams = useSearchParams();
    const router= useRouter();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const docRef = doc(db, 'waitinglist', email);
            const existing = await getDoc(docRef);

            if (existing.exists()) {
                setError(t('alreadyRegistered'));
                return;
            }

            await setDoc(docRef, {
                email,
                locale,
                createdAt: serverTimestamp(),
            });

            await fetch('/api/send-waitinglist-mail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, locale }),
            });

            router.push(`/${locale}/welcome`);

        } catch (err) {
            console.error('Firebase error details:', err);
            setError(t('somethingWentWrong'));
        } finally {
            setLoading(false);
        }
    }

    return (
        <AnimateOnMount delay={100}>
            <div className="w-screen h-screen flex items-center justify-center overflow-scroll">
                <div className={`w-full h-full flex flex-row overflow-y-scroll transition-all duration-700`}>
                    <div className="w-full backdrop-blur-2xl flex flex-col gap-10 justify-center items-center px-12 py-16 relative overflow-hidden">
                        <div className="h-full w-full md:w-1/2 justify-center relative gap-8 z-10 flex flex-col">
                            <AnimateOnMount delay={200}>
                                <div className={`flex flex-col gap-2 transition-all duration-500 delay-200`}>
                                    <h1 className="text-4xl font-bold text-studodarkblue dark:text-white">{t("title")}</h1>
                                    <p className="text-slate-400 text-sm">{t("join_waitinglist")}</p>
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
                                                <span className="px-4 text-red-400 text-xs">{errors}</span>
                                            )}
                                        </div>
                                    </div>
                                </AnimateOnMount>

                                {errors ? (
                                    <div className="px-4 min-h-5 rounded-xl text-red-400 text-sm" data-cy="login_error">
                                        {errors}
                                    </div>
                                ) : (
                                    <div className={"h-5 w-full"}></div>
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
                                        {loading ? t("Loading") : t("join")}
                                    </button>
                                </AnimateOnMount>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AnimateOnMount>
    );
}