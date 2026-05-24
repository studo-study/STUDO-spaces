// components/app/AppLayoutClient.tsx
"use client";
import { memo, ReactNode, useState } from "react";
import AppHeader from "@/components/ui/app/app_header/AppHeader";
import BurgerMenu from "@/components/ui/app/app_header/BurgerMenu";
import {
  UserProvider,
  useUser,
} from "@/components/providers/auth/UserProvider";
import ConsoleEasterEgg from "@/components/ui/overige/easteregg/console";
import CreateFolder from "@/components/ui/app/create-folder/CreateFolder";
import AppLayoutContext from "@/components/context/AppLayoutContext";
import { useKeyboardShortcut } from "@/hooks/overige/useKeyboardShortcut";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

const MemoizedHeader = memo(AppHeader);
const MemoizedBurger = memo(BurgerMenu);

function AppLayoutInner({ children }: { children: ReactNode }) {
  const { user, isLoading } = useUser();
  const [Search, setSearch] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const router = useRouter();
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const toggleSearch = () => setSearch(true);
  const toggleCreate = () => {
    requestAnimationFrame(() => {
      setCreateOpen(true);
    });
  };
  const newStudoset = () => {
    router.push("/create-studoset");
  };

  const newVisualset = () => {
    router.push("/create-visualset");
  };

  useKeyboardShortcut("f", () => toggleCreate());
  useKeyboardShortcut("s", () => newStudoset());
  useKeyboardShortcut("v", () => newVisualset());
  useKeyboardShortcut("m", () => toggleSearch(), { ctrl: true, always: true });

  return (
    <AppLayoutContext.Provider value={{ toggleCreate }}>
      <div className="h-screen min-w-screen flex flex-col overflow-hidden">
        <MemoizedHeader
          burgerOpen={sidebarOpen}
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
              burgerOpen={sidebarOpen}
              toggleSearch={toggleSearch}
              toggleCreate={toggleCreate}
            />
          </div>
          <div className={"w-full flex items-center justify-center h-full"}>
            <main
              className={`flex-1 min-h-0 xl:w-9/10 3xl:w-1/3 
                                        h-full pl-5 pr-5 lg:pl-10 lg:pr-77 
                                        overflow-y-scroll scroll-hidden 
                                        [&::-webkit-scrollbar]:hidden
                                        [-ms-overflow-style:none]
                                        [scrollbar-width:none]`}
            >
              {children}
            </main>
          </div>
        </div>
      </div>
      <CreateFolder createOpen={createOpen} setCreateOpen={setCreateOpen} />
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
