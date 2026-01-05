import {ReactNode} from "react";
import AppHeader from "@/components/app_header/header";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return(<div>
        <AppHeader/>
        <main>{children}</main>
    </div>);
}