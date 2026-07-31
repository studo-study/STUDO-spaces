// Centralized react-query keys for the flow domain (boards / board / course).
// Shared by the query hooks, the server hydrator and the mutation hooks so
// optimistic cache writes always target the same entries.
export const flowKeys = {
  boards: ["flow", "boards"] as const,
  board: (id: string) => ["flow", "board", id] as const,
  course: (id: string) => ["flow", "course", id] as const,
};
