"use client"
import {ReactNode, useRef, useState} from "react";
import AppHeader from "@/components/app_header/header";
import Burger from "@/components/app_header/burger";

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

    return(<div className={`max-h-screen overflow-hidden h-screen w-screen max-w-screen flex flex-col`}>
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

        <div className={"h-full w-screen flex flex-row"}>
            <Burger
                burgerOpen={burgerOpen}
                toggleSearch={toggleSearch}
                toggleCreate={toggleCreate}
                isMod={data.moderator}/>
            <main className={"w-full max-h-full flex items-center justify-center overflow-hidden z-0 overflow-y-scroll scroll-hidden"}>{children}</main>
        </div>
    </div>);
}