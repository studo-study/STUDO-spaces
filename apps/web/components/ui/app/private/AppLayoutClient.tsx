"use client";
import { memo, ReactNode, useEffect, useState } from "react";
import AppHeader from "@/components/ui/app/private/app_header/AppHeader";
import BurgerMenu from "@/components/ui/app/private/app_header/BurgerMenu";
import {
  UserProvider,
  useUser,
} from "@/components/providers/auth/UserProvider";
import ConsoleEasterEgg from "@/components/ui/overige/easteregg/console";
import CreateCourse from "@/components/ui/app/private/course/CreateCourse";
import AppLayoutContext from "@/components/context/AppLayoutContext";
import { useAppStore } from "@/store/useAppStore";
import { usePathname } from "next/navigation";
import ResizablePanelLayout from "@/components/ui/design_system/resizable_panel_layout/ResizablePanelLayout";
import CourseSidebar from "@/components/ui/app/private/course_context_menu/CourseSidebar";
import SideMenu from "@/components/ui/app/private/course_context_menu/SideMenu";
import { useSideMenu } from "@/store/coursecontextmenu/SideMenuStore";
const MemoizedHeader = memo(AppHeader);
const MemoizedBurger = memo(BurgerMenu);

const STUDOSET_ROUTES = [
  "/studoset/",
  "/visualset/",
  "/flashcards/",
  "/learn/",
  "/speedy/",
  "/sets",
];

function AppLayoutInner({ children }: { children: ReactNode }) {
  const { user, isLoading } = useUser();
  const [Search, setSearch] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const pathname = usePathname();
  const menuOpen = useSideMenu((state) => state.menuInfo);
  const setMenuOpen = useSideMenu((state) => state.setMenuInfo);
  const toggleCreate = () => {
    requestAnimationFrame(() => setCreateOpen(true));
  };

  const pathWithoutLocale = pathname.replace(/^\/(nl|en|fr|de)/, "");
  const showStudoSidebar = STUDOSET_ROUTES.some((r) =>
    pathWithoutLocale.includes(r),
  );
  useEffect(() => {
    setMenuOpen({ isOpen: false, origin: null });
  }, [pathname, setMenuOpen]);

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

        <div className="flex-1 min-h-0 w-full flex flex-row">
          {/* Left nav */}
          <div className="shrink-0 h-full">
            <MemoizedBurger
              burgerOpen={sidebarOpen}
              toggleSearch={() => setSearch(true)}
              toggleCreate={toggleCreate}
            />
          </div>

          <div
            className={
              "relative border rounded-4xl border-studoborder/30 min-w-0 min-h-0 flex-1 flex mb-5 mx-5 dark:bg-slate-800 overflow-hidden"
            }
          >
            {showStudoSidebar ? (
              <>
                <ResizablePanelLayout
                  storageKey="studoset-sidebar"
                  panels={[
                    { id: "main", defaultSize: 78, minSize: 40 },
                    {
                      id: "contextmenu",
                      defaultSize: 30,
                      minSize: 30,
                      maxSize: 45,
                    },
                  ]}
                >
                  <ResizablePanelLayout.Panel panelId="main">
                    <main className="flex-1 min-h-0 h-full overflow-y-scroll scroll-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {children}
                    </main>
                  </ResizablePanelLayout.Panel>
                  {menuOpen.isOpen && (
                    <ResizablePanelLayout.Panel panelId="contextmenu">
                      <SideMenu origin={menuOpen?.origin ?? ""} />
                    </ResizablePanelLayout.Panel>
                  )}
                </ResizablePanelLayout>
                <CourseSidebar />
              </>
            ) : (
              <main
                className={`flex-1 min-h-0 h-full overflow-y-scroll scroll-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] pr-20 [scrollbar-width:none] transition-[padding] duration-300`}
              >
                {children}
              </main>
            )}
          </div>
        </div>
      </div>
      <CreateCourse createOpen={createOpen} setCreateOpen={setCreateOpen} />
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
