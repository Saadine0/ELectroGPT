"use client"

import type React from "react"

import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  type ViewStyle,
  type TextStyle,
} from "react-native"
import { useTheme } from "../context/ThemeContext"

type ButtonProps = {
  title?: string
  onPress: () => void
  variant?: "primary" | "outline" | "ghost"
  size?: "small" | "medium" | "large"
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  style?: ViewStyle
  textStyle?: TextStyle
  children?: React.ReactNode
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  children,
}: ButtonProps) {
  const { colors } = useTheme()

  const getVariantStyles = () => {
    switch (variant) {
      case "outline":
        return {
          backgroundColor: "transparent",
          borderColor: colors.accent,
          borderWidth: 1,
        }
      case "ghost":
        return {
          backgroundColor: "transparent",
          borderWidth: 0,
        }
      case "primary":
      default:
        return {
          backgroundColor: colors.accent,
        }
    }
  }

  const getTextColor = () => {
    switch (variant) {
      case "outline":
      case "ghost":
        return colors.accent
      case "primary":
      default:
        return "#FFFFFF"
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: 8,
        }
      case "large":
        return {
          paddingVertical: 14,
          paddingHorizontal: 20,
          borderRadius: 12,
        }
      case "medium":
      default:
        return {
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 10,
        }
    }
  }

  return (
    <TouchableOpacity
      style={[styles.button, getVariantStyles(), getSizeStyles(), disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          {title && (
            <Text style={[styles.text, { color: getTextColor() }, size === "small" && { fontSize: 12 }, textStyle]}>
              {title}
            </Text>
          )}
          {children}
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  iconContainer: {
    marginRight: 8,
  },
})
