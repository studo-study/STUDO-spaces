import {ClassActivity} from "@/types/types";
import {memo, useMemo} from "react";
import Link from "next/link";

interface ActivityItemProps {
    activity: ClassActivity;
}

export default function ActivityItem({ activity }: ActivityItemProps) {
    const timeAgo = useMemo(() => getTimeAgo(activity.last_seen), [activity.last_seen]);
    const iconSrc = activity.set_type === "studyset" ? "/icons/studyset.svg" : "/icons/visualset.svg";

    return (
        <Link
            href={`/set/${activity.set_id}/${activity.set_type}`}
            className="flex items-center shadow-2xl gap-4 px-3 py-2 pr-5 rounded-full dark:bg-studogrey/10 border dark:border-studogrey/20 border-gray-200 bg-white/50 hover:border-studogrey/40 transition-all"
        >
            <img
                src={activity.img_url}
                alt={activity.displayName}
                className="min-w-10 min-h-10 h-10 w-10 max-h-10 max-w-10 rounded-full border border-studoborder object-cover"
            />
            <div className="flex-1 min-w-0">
                <h3 className="font-medium dark:text-white text-studodarkblue truncate">{activity.displayName}</h3>
                <div className="flex flex-row items-center gap-2">
                    <img src={iconSrc} alt="" className="w-4 dark:invert brightness-0 dark:opacity-30 opacity-40" />
                    <p className="dark:text-studogrey text-gray-400 text-sm truncate">{activity.title}</p>
                </div>
            </div>
            <div className="flex flex-col items-baseline gap-1">
                <span className="dark:text-white/54 text-gray-400 text-xs">{timeAgo}</span>
            </div>
        </Link>
    );
}

function getTimeAgo(dateString: string): string {
    const diffInSeconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);

    if (diffInSeconds < 60) return 'Zojuist';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}u`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;

    return new Date(dateString).toLocaleDateString('nl-BE', { day: 'numeric', month: 'short' });
}
