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
import { usePathname } from "next/navigation";
import ResizablePanelLayout from "@/components/ui/design_system/resizable_panel_layout/ResizablePanelLayout";
import CourseSidebar from "@/components/ui/app/shared/studosets/course_context_menu/CourseSidebar";

const MemoizedHeader = memo(AppHeader);
const MemoizedBurger = memo(BurgerMenu);

const STUDOSET_ROUTES = [
  "/studoset/",
  "/visualset/",
  "/flashcards/",
  "/learn/",
  "/speedy/",
];

function AppLayoutInner({ children }: { children: ReactNode }) {
  const { user, isLoading } = useUser();
  const [Search, setSearch] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const pathname = usePathname();

  const toggleCreate = () => {
    requestAnimationFrame(() => setCreateOpen(true));
  };

  const pathWithoutLocale = pathname.replace(/^\/(nl|en|fr|de)/, "");
  const showStudoSidebar = STUDOSET_ROUTES.some((r) =>
    pathWithoutLocale.includes(r),
  );

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
                {menuOpen && (
                  <ResizablePanelLayout.Panel panelId="contextmenu">
                    <div className="h-full w-full border-l border-studoborder/30">
                      <div className="w-full border-b border-studoborder/30 flex font-bold text-white items-center px-5 py-5">
                        title
                      </div>
                    </div>
                  </ResizablePanelLayout.Panel>
                )}
              </ResizablePanelLayout>
              <CourseSidebar setMenuOpen={setMenuOpen} />
            </>
          ) : (
            <main
              className={`flex-1 min-h-0 h-full overflow-y-scroll scroll-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${sidebarOpen ? "pr-57" : "pr-30"} transition-[padding] duration-300`}
            >
              {children}
            </main>
          )}
        </div>
      </div>
      <CreateFlowCourse createOpen={createOpen} setCreateOpen={setCreateOpen} />
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
