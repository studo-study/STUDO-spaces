import {memo} from "react";
import Link from "next/link";
import {IoIosArrowForward} from "react-icons/io";

interface SectionHeaderProps {
    title: string;
    linkText: string;
    href: string;
}

export default function SectionHeader({ title, linkText, href }: SectionHeaderProps) {
    return (
        <div className="w-full flex flex-row items-center justify-between">
            <span className="w-full text-lg font-bold dark:text-white/75 text-studodarkblue">{title}</span>
            <Link href={href} className="w-1/2 flex flex-row justify-end items-center gap-2 text-studodarkblue dark:text-white opacity-30">
                {linkText}
                <IoIosArrowForward />
            </Link>
        </div>
    );
}
