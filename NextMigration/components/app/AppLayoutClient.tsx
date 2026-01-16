// components/app/AppLayoutClient.tsx
"use client"
import {memo, ReactNode, useState} from "react";
import AppHeader from "@/components/app/app_header/header";
import Burger from "@/components/app/app_header/burger";
import { UserProvider } from "@/components/providers/UserProvider";

const MemoizedHeader = memo(AppHeader);
const MemoizedBurger = memo(Burger);

export default function AppLayoutClient({ children }: { children: ReactNode }) {
    const [burgerOpen, setBurgerOpen] = useState(false);
    const [Search, setSearch] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);

    const toggleSearch = () => setSearch(true);
    const toggleCreate = () => setCreateOpen(true);

    return (
        <UserProvider>
            <div className="h-screen w-screen flex flex-col overflow-hidden">
                <MemoizedHeader
                    burgerOpen={burgerOpen}
                    setBurgerOpen={setBurgerOpen}
                    Search={Search}
                    setSearch={setSearch}
                    createOpen={createOpen}
                    setCreateOpen={setCreateOpen}
                    toggleCreate={toggleCreate}
                />

                <div className="flex-1 min-h-0 w-full flex flex-row">
                    <MemoizedBurger
                        burgerOpen={burgerOpen}
                        toggleSearch={toggleSearch}
                        toggleCreate={toggleCreate}
                    />
                    <main className="flex-1 min-h-0 overflow-hidden xl:w-9/10 5xl:w-1/2 h-full px-15 pr-55">
                        {children}
                    </main>
                </div>
            </div>
        </UserProvider>
    );
}