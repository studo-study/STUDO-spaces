// (set)/layout.tsx
import { auth } from '@/auth';
import AuthLayout from "@/app/[locale]/(app)/layout";
import MarketingLayout from "@/app/[locale]/(marketing)/layout";
import {ReactNode} from "react";

export default async function SetLayout({ children }: {
    children: ReactNode;
}) {
    const session = await auth();
    const isLoggedIn = !!session;

    if (isLoggedIn) {
        return <AuthLayout>{children}</AuthLayout>;
    }

    return <MarketingLayout>{children}</MarketingLayout>;
}