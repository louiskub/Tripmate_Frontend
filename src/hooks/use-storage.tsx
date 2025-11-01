"use client"
import { useState, useEffect } from "react";

export const useLocalStorage = <T = unknown>(key: string, defaultValue: T) => {
    // Create state variable to store 
    // localStorage value in state
    const [localStorageValue, setLocalStorageValue] = useState<T | null>(null)

    useEffect(() => {
      try {
          const value = localStorage.getItem(key)
          if (value) {
              setLocalStorageValue(JSON.parse(value))
          } else {
              localStorage.setItem(key, JSON.stringify(defaultValue));
              setLocalStorageValue(defaultValue)
          }
      } catch (error) {
          localStorage.setItem(key, JSON.stringify(defaultValue));
          setLocalStorageValue(defaultValue)
      }
    }, []);

    // this method update our localStorage and our state
    const setLocalStorageStateValue = (valueOrFn: T | ((prev: T | null) => T)) => {
        let newValue: T;
        if (typeof valueOrFn === 'function') {
            const fn = valueOrFn as (prev: T | null) => T;
            newValue = fn(localStorageValue)
        }
        else {
            newValue = valueOrFn as T;
        }
        localStorage.setItem(key, JSON.stringify(newValue));
        setLocalStorageValue(newValue)
    }

    const remove = () => {
        localStorage.removeItem(key);
        setLocalStorageValue(null);
    }
    return [localStorageValue, setLocalStorageStateValue, remove] as const
}

