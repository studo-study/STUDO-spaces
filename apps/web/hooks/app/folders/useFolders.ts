import { useSync } from "../useSync";

export function useFolders() {
  const query = useSync();

  return {
    ...query,
    data: { folders: query.folders },
  };
}
