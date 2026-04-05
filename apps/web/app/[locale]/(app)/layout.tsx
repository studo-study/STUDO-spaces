// app/[locale]/(app)/layout.tsx
import { ReactNode } from "react";
import AppLayoutClient from "@/components/app/AppLayoutClient";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return <AppLayoutClient>{children}</AppLayoutClient>;
}