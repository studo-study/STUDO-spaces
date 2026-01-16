//app/[locale/(app)/layout.tsx
"use client"
import {ReactNode, useRef, useState} from "react";
import AppHeader from "@/components/app/app_header/header";
import Burger from "@/components/app/app_header/burger";

export default function AuthLayout({ children }: { children: ReactNode }) {
    const [burgerOpen, setBurgerOpen] = useState(false);
    const [Search, setSearch] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const toggleSearch = () => {
        setSearch(true);
    }

    const data = {
        displayName: "Studo Admin",
        email: "admin@studo.study",
        streak_count: 29,
        pfp: "https://i.pravatar.cc/150?img=1",
        moderator: true
    };

    const toggleCreate = () => {
        setCreateOpen(true);
    }

    return(
        <div className="h-screen w-screen flex flex-col overflow-hidden">
            <AppHeader
                burgerOpen={burgerOpen}
                setBurgerOpen={setBurgerOpen}
                Search={Search}
                setSearch={setSearch}
                createOpen={createOpen}
                setCreateOpen={setCreateOpen}
                toggleCreate={toggleCreate}
                user={data}
            />

            <div className="flex-1 min-h-0 w-full flex flex-row">
                <Burger
                    burgerOpen={burgerOpen}
                    toggleSearch={toggleSearch}
                    toggleCreate={toggleCreate}
                    isMod={data.moderator}
                />
                <main className="flex-1 min-h-0 overflow-hidden
                xl:w-9/10 5xl:w-1/2 h-full px-15 pr-55 ">
                    {children}
                </main>
            </div>
        </div>
    );
}