"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { useColorScheme } from "react-native"

// Define theme colors
const lightTheme = {
  background: "#FFFFFF",
  card: "#FFFFFF",
  text: "#000000",
  border: "#E5E5E5",
  muted: "#6B7280",
  primary: "#00C6FF",
  secondary: "#0072FF",
  accent: "#00C6FF",
  success: "#10B981",
  error: "#EF4444",
  info: "#3B82F6",
}

const darkTheme = {
  background: "#121212",
  card: "#1E1E1E",
  text: "#FFFFFF",
  border: "#2A2A2A",
  muted: "#9CA3AF",
  primary: "#00C6FF",
  secondary: "#0072FF",
  accent: "#00C6FF",
  success: "#10B981",
  error: "#EF4444",
  info: "#3B82F6",
}

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const deviceTheme = useColorScheme()
  const [theme, setTheme] = useState("light")
  const [colors, setColors] = useState(lightTheme)

  useEffect(() => {
    // Set initial theme based on device preference
    setTheme(deviceTheme || "light")
  }, [deviceTheme])

  useEffect(() => {
    // Update colors when theme changes
    setColors(theme === "dark" ? darkTheme : lightTheme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
