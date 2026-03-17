import {memo} from "react";
import {useTranslations} from "next-intl";
import Link from "next/link";
import {GoPlus} from "react-icons/go";

export default function CTABlock({ t }: { t: ReturnType<typeof useTranslations> }) {
    return (
        <div className="p-6 rounded-3xl shadow-2xl bg-gradient-to-br dark:from-emerald-500/10 dark:to-emerald-400/10 from-emerald-500/50 to-teal-500/50 border border-studoborder/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{t("ready")}</h3>
                    <p className="dark:text-studogrey text-studodarkblue/40 text-sm">{t("create_block")}</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/create-studoset"
                        className="px-5 py-2.5 min-w-30 rounded-2xl text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                        <GoPlus /> {t("create_ss")}
                    </Link>
                    <Link
                        href="/create-visualset"
                        className="px-5 py-2.5 min-w-30 text-sm flex flex-row items-center gap-2 rounded-2xl dark:bg-studogrey/20 bg-white/40 text-studodarkblue dark:text-white font-medium dark:hover:bg-studogrey/30 hover:bg-white/50 transition-colors border border-studogrey/30"
                    >
                        <GoPlus /> {t("create_vs")}
                    </Link>
                </div>
            </div>
        </div>
    );
}

