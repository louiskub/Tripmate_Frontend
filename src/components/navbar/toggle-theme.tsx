"use client"

import { useState, useEffect } from "react"

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    if (savedTheme) {
        setIsDark(savedTheme == "dark")
    }
    else if (prefersDark) {
        setIsDark(true)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
  }

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark")
        localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [isDark])

  return (
    <button
      onClick={toggleTheme}
      className={`relative h-8 w-16 rounded-full transition-all duration-300 hover:cursor-pointer hover:scale-102 ${
        isDark ? "bg-toggle-blue focus:ring-toggle-blue" : "bg-orange-400 focus:ring-orange-500"
      }`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Toggle Knob */}
      <div
        className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center ${
          isDark ? "translate-x-1" : "translate-x-9"
        }`}
      >
        {/* Sun Icon */}
        <svg
          className={`h-4 w-4 transition-all duration-300 ${
            isDark ? "rotate-90 scale-0 opacity-0 text-orange-500" : "rotate-0 scale-100 opacity-100 text-orange-500"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>

        {/* Moon Icon */}
        <svg
          className={`absolute h-4 w-4 transition-all duration-300 ${
            isDark ? "rotate-0 scale-100 opacity-100 text-toggle-blue" : "-rotate-90 scale-0 opacity-0 text-indigo-600"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </div>
    </button>
  )
}
