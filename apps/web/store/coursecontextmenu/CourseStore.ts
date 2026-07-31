import { create } from "zustand";

export type MenuOrigin =
  | "chat"
  | "chat_history"
  | "course"
  | "quick_actions"
  | "pomodoro"
  | "settings"
  | "widgets";
export interface menuInfo {
  isOpen: boolean;
  origin: MenuOrigin | null;
  chat_id?: string | null;
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
    chat_id: null,
  },
  setMenuInfo: (input) =>
    set((state) => ({
      menuInfo: {
        ...state.menuInfo,
        ...input,
      },
    })),
}));
