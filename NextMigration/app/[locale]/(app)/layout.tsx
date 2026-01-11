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

    const toggleCreate = () => {
        setCreateOpen(true);
    }

    return(<div className={`h-screen w-screen flex flex-col`}>
        <AppHeader
            burgerOpen={burgerOpen}
            setBurgerOpen={setBurgerOpen}
            Search={Search}
            setSearch={setSearch}
            createOpen={createOpen}
            setCreateOpen={setCreateOpen}
            toggleCreate={toggleCreate}
        />

        <div className={"h-full w-screen flex flex-row"}>
            <Burger burgerOpen={burgerOpen} toggleSearch={toggleSearch} toggleCreate={toggleCreate} />
            <main className={"w-full max-h-full overflow-y-scroll scroll-hidden"}>{children}</main>
        </div>
    </div>);
}