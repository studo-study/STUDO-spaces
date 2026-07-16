import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

export default function usePortalMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true, // client
    () => false, // server
  );
}
