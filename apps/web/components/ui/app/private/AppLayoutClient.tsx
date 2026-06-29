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
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import { HiSparkles } from "react-icons/hi2";
import BaseTooltip from "@/components/ui/design_system/tooltip/BaseToolTip";
import { LuScanSearch } from "react-icons/lu";
import { IoIosOptions } from "react-icons/io";

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
    requestAnimationFrame(() => {
      setCreateOpen(true);
    });
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
                  { id: "main", defaultSize: menuOpen ? 68 : 100, minSize: 30 },
                  ...(menuOpen
                    ? [
                        {
                          id: "contextmenu",
                          defaultSize: 32,
                          minSize: 20,
                          maxSize: 55,
                        },
                      ]
                    : []),
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
              <div className="shrink-0 w-20 h-full border-l border-studoborder/30 flex flex-col gap-5 py-5 items-center justify-start">
                <BaseTooltip content={"Ask Sven"} position={"left"}>
                  <BaseButton
                    onClick={() => setMenuOpen((prev) => !prev)}
                    variant={"outline_link"}
                    size={"icon"}
                  >
                    <HiSparkles />
                  </BaseButton>
                </BaseTooltip>
                <BaseTooltip content={"See in course"} position={"left"}>
                  <BaseButton
                    onClick={() => setMenuOpen((prev) => !prev)}
                    variant={"outline_link"}
                    size={"icon"}
                  >
                    <LuScanSearch />
                  </BaseButton>
                </BaseTooltip>
                <BaseTooltip content={"Quick actions"} position={"left"}>
                  <BaseButton
                    onClick={() => setMenuOpen((prev) => !prev)}
                    variant={"outline_link"}
                    size={"icon"}
                  >
                    <IoIosOptions />
                  </BaseButton>
                </BaseTooltip>
              </div>
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
