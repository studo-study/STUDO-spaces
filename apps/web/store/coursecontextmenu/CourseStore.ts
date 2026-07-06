import { create } from "zustand";

export type MenuOrigin =
  | "chat"
  | "course"
  | "quick_actions"
  | "Pomodoro"
  | "Settings";
export interface menuInfo {
  isOpen: boolean;
  origin: MenuOrigin | null;
}

interface SideMenuStore {
  menuInfo: menuInfo;
  setMenuInfo: (input: Partial<menuInfo>) => void;
  pdf_url?: string;
}
export const useSideMenu = create<SideMenuStore>((set) => ({
  menuInfo: {
    isOpen: false,
    origin: null,
  },
  setMenuInfo: (input) =>
    set((state) => ({
      menuInfo: {
        ...state.menuInfo,
        ...input,
      },
    })),
}));
