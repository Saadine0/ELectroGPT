"use client"

import type React from "react"

import { createContext, useState, useContext, useEffect } from "react"
import { useColorScheme } from "react-native"
import Colors from "../constants/Colors"

type Theme = "light" | "dark"

type ThemeContextType = {
  theme: Theme
  colors: typeof Colors.light
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const deviceTheme = (useColorScheme() as Theme) || "light"
  const [theme, setTheme] = useState<Theme>(deviceTheme)
  const [colors, setColors] = useState(theme === "dark" ? Colors.dark : Colors.light)

  useEffect(() => {
    setColors(theme === "dark" ? Colors.dark : Colors.light)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
