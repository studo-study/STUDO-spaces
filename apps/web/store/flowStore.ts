// stores/flowStore.ts
import { create } from 'zustand';
import { FlowBoardOverview } from '@studo/types';

interface FlowStore {
    boards: FlowBoardOverview[];
    setBoards: (boards: FlowBoardOverview[]) => void;
    addBoard: (board: FlowBoardOverview) => void;
    removeBoard: (id: string) => void;
}

export const useFlowStore = create<FlowStore>((set) => ({
    boards: [],
    setBoards: (boards) => set({ boards }),
    addBoard: (board) => set((state) => ({ boards: [...state.boards, board] })),
    removeBoard: (id) => set((state) => ({ boards: state.boards.filter((b) => b.id !== id) })),
}));