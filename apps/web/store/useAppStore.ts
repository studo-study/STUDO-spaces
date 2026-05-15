import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createUISlice, UISlice } from "@/store/slices/ui/uiSlice";

type AppStore = UISlice; // voeg hier later meer slices toe met &

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
