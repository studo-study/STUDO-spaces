import { useEffect, useCallback } from "react";

type Modifiers = {
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  always?: boolean;
};

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  modifiers: Modifiers = {},
) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const { ctrl = false, shift = false, alt = false, always } = modifiers;
      if (!always) {
        const tag = (e.target as HTMLElement).tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
        if ((e.target as HTMLElement).isContentEditable) return;
      }

      if (
        e.key.toLowerCase() === key.toLowerCase() &&
        (e.ctrlKey || e.metaKey) === ctrl &&
        e.shiftKey === shift &&
        e.altKey === alt
      ) {
        e.preventDefault();
        callback();
      }
    },
    [key, callback, modifiers],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
