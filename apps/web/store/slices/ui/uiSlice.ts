import {StateCreator} from "zustand/vanilla";

export interface UISlice {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
}

export const createUISlice: StateCreator<UISlice> = (set) => ({
    sidebarOpen: true,
    toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
});