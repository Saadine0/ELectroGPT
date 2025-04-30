"use client"

import type React from "react"

import { View, StyleSheet, type ViewStyle } from "react-native"
import { useTheme } from "../context/ThemeContext"

type CardProps = {
  children: React.ReactNode
  style?: ViewStyle
}

export default function Card({ children, style }: CardProps) {
  const { colors } = useTheme()

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
})
