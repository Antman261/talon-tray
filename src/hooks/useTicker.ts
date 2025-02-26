import { useEffect } from "preact/hooks";

export const useTicker = (fn: () => unknown, ms: number) => {
  useEffect(() => {
    const interval = setInterval(fn, ms)
    return () => clearInterval(interval)
  });
};