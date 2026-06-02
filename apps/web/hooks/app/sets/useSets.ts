import { useSync } from "../useSync";

export function useSets() {
  const query = useSync();

  return {
    ...query,
    sets: query.studysets,
    visualsets: query.visualsets,
    stats: query.start?.stats ?? null,
    lastTen: query.lastTen,
  };
}
