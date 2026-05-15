import { useEffect, useRef } from "react";

export function useDebounce<T>(
  value: T,
  delay: number,
  callback: (value: T) => void,
) {
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    timeout.current = setTimeout(() => callback(value), delay);
    return () => clearTimeout(timeout.current);
  }, [callback, delay, value]);
}
