// components/app/AppLayoutClient.tsx
"use client";
import { memo, ReactNode, useState } from "react";
import AppHeader from "@/components/ui/app/private/app_header/AppHeader";
import BurgerMenu from "@/components/ui/app/private/app_header/BurgerMenu";
import {
  UserProvider,
  useUser,
} from "@/components/providers/auth/UserProvider";
import ConsoleEasterEgg from "@/components/ui/overige/easteregg/console";
import CreateFlowCourse from "@/components/ui/app/private/course/page/layout/CreateFlowCourse";
import AppLayoutContext from "@/components/context/AppLayoutContext";
import { useAppStore } from "@/store/useAppStore";

const MemoizedHeader = memo(AppHeader);
const MemoizedBurger = memo(BurgerMenu);

function AppLayoutInner({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "mode";
}) {
  const { user, isLoading } = useUser();
  const [Search, setSearch] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const toggleCreate = () => {
    requestAnimationFrame(() => {
      setCreateOpen(true);
    });
  };

  /*
  const pathname = usePathname();
  const inMode = /\/(speedy|learn|flashcards)\//.test(pathname);
  const newStudoset = () => {
    router.push("/create-studoset");
  };

  const newVisualset = () => {
    router.push("/create-visualset");
  };

  //useKeyboardShortcut("f", () => !inMode && toggleCreate());
  //useKeyboardShortcut("s", () => !inMode && newStudoset());
  //useKeyboardShortcut("v", () => !inMode && newVisualset());
  */

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
              toggleSearch={() => setSearch(true)}
              toggleCreate={toggleCreate}
            />
          </div>
          {variant === "mode" ? (
            <main className="flex-1 min-h-0 h-full overflow-hidden flex flex-col">
              {children}
            </main>
          ) : (
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
          )}
        </div>
      </div>
      <CreateFlowCourse createOpen={createOpen} setCreateOpen={setCreateOpen} />
      <ConsoleEasterEgg />
    </AppLayoutContext.Provider>
  );
}

export default function AppLayoutClient({
  children,
  variant,
}: {
  children: ReactNode;
  variant?: "default" | "mode";
}) {
  return (
    <UserProvider>
      <AppLayoutInner variant={variant}>{children}</AppLayoutInner>
    </UserProvider>
  );
}
