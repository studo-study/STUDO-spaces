"use client"
import {Metadata} from "next";
import {useLocale} from "next-intl";
import {redirect} from "next/navigation";
import {usePathname} from "@/i18n/routing";
import {getPagePath} from "next/dist/server/require";

export default function Page() {
    const path = usePathname();
    redirect(`${path}/overview`);
}