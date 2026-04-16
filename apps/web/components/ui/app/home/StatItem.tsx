import {useTranslations} from "next-intl";
import {memo} from "react";
import {PiMedalLight} from "react-icons/pi";

interface StatsProps {
    color: string;
    icon?: string;
    iconComponent?: boolean;
    stat: number;
    label: string;
    measurement: string;
    extra: string;
    invert?: boolean;
    t: ReturnType<typeof useTranslations>;
}

export default function Stats({ color, icon, iconComponent, label, stat, measurement, extra, invert, t }: StatsProps) {
    return (
        <div className={`w-full h-35 border shadow-2xl bg-linear-to-r ${color} 
                        border-studoborder/30 rounded-3xl flex flex-col gap-3 p-3 px-5`}>
            <span className="w-full h-8 text-sm flex gap-2 dark:text-studogrey items-center text-white">
                {iconComponent ? (
                    <PiMedalLight size={20} className="text-white dark:opacity-50" />
                ) : (
                    <img src={icon} className={`h-5 ${invert ? 'invert brightness-0 dark:opacity-30 ' : 'brightness-100'}`} alt="" />
                )}
                {t(label)}
            </span>
            <div className="w-full flex flex-col gap-1">
                <div className="w-full flex flex-row gap-2">
                    <span className="text-white text-3xl font-bold">{stat}</span>
                    <span className="h-full flex items-end pb-1 text-sm dark:text-studogrey text-white">{t(measurement)}</span>
                </div>
                {extra && <span className="w-full text-white dark:text-studogrey text-xs">{t(extra)}</span>}
            </div>
        </div>
    );
}
