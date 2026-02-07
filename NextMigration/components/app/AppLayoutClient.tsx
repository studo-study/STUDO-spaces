// components/app/AppLayoutClient.tsx
"use client"
import { memo, ReactNode, useState } from "react";
import AppHeader from "@/components/app/app_header/header";
import Burger from "@/components/app/app_header/burger";
import { UserProvider, useUser } from "@/components/providers/UserProvider";
import ConsoleEasterEgg from "@/components/overige/easteregg/console";
import CreateFolder from "@/components/app/create-folder/create_folder";
import AppLayoutContext from "./context/AppLayoutContext";

const MemoizedHeader = memo(AppHeader);
const MemoizedBurger = memo(Burger);

function AppLayoutInner({ children }: { children: ReactNode }) {
    const { user, isLoading } = useUser(); // ✅ Nu BINNEN UserProvider
    const [burgerOpen, setBurgerOpen] = useState(false);
    const [Search, setSearch] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);

    const toggleSearch = () => setSearch(true);
    const toggleCreate = () => {
        requestAnimationFrame(() => {
            setCreateOpen(true);
        });
    };


    return (
        <AppLayoutContext.Provider value={{ toggleCreate }}>
            <div className="h-screen w-screen flex flex-col overflow-hidden">
                <MemoizedHeader
                    burgerOpen={burgerOpen}
                    setBurgerOpen={setBurgerOpen}
                    Search={Search}
                    setSearch={setSearch}
                    createOpen={createOpen}
                    setCreateOpen={setCreateOpen}
                    toggleCreate={toggleCreate}
                    user={user}
                    isLoading={isLoading}
                />

                <div className="flex-1 min-h-0 w-full flex flex-row relative">
                    <div className={"min-w-57 h-full"}>
                        <MemoizedBurger
                            burgerOpen={burgerOpen}
                            toggleSearch={toggleSearch}
                            toggleCreate={toggleCreate}
                        />
                    </div>
                    <div className={"w-full flex items-center justify-center h-full"}>
                        <main className="flex-1 min-h-0 xl:w-9/10 3xl:w-1/3 h-full pl-5 pr-5 lg:pl-10 lg:pr-77 overflow-y-scroll scroll-hidden [&::-webkit-scrollbar]:hidden
    [-ms-overflow-style:none]
    [scrollbar-width:none]">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
            <CreateFolder
                createOpen={createOpen}
                setCreateOpen={setCreateOpen}
            />
            <ConsoleEasterEgg />
        </AppLayoutContext.Provider>
    );
}

export default function AppLayoutClient({ children }: { children: ReactNode }) {
    return (
        <UserProvider>
            <AppLayoutInner>{children}</AppLayoutInner>
        </UserProvider>
    );
}