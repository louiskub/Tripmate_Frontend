import { useCallback, useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    if (typeof window === "undefined") return; // ป้องกัน SSR
    const stored = window.localStorage.getItem(key);
    if (stored !== null) {
      try {
        setValue(JSON.parse(stored));
      } catch {
        setValue(stored as T);
      }
    }
  }, [key]);

  const setStoredValue = useCallback(
    (newValue: T) => {
      setValue(newValue);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(newValue));
      }
    },
    [key]
  );

  const removeStoredValue = useCallback(() => {
    setValue(defaultValue);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
    }
  }, [key, defaultValue]);

  return [value, setStoredValue, removeStoredValue] as const;
}
