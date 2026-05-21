import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createUISlice, UISlice } from "@/store/slices/ui/uiSlice";

type AppStore = UISlice;

export const useAppStore = create<AppStore>()(
  persist(
    (...a) => ({
      ...createUISlice(...a),
    }),
    {
      name: "studo-store",
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
      }),
    },
  ),
);
