"use client"

import { Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { View, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useTheme } from "@/context/ThemeContext"

type TabBarIconRenderProps = {
  focused: boolean
  color: string
  size: number
}

type TabBarIconProps = {
  name: keyof typeof Ionicons.glyphMap
  color: string
  isCenter?: boolean
}

function TabBarIcon({ name, color, isCenter = false }: TabBarIconProps) {
  const { colors } = useTheme()

  if (isCenter) {
    return (
      <View style={styles.centerTabContainer}>
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={styles.centerTabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name={name} size={26} color="#FFFFFF" />
        </LinearGradient>
      </View>
    )
  }

  return <Ionicons name={name} size={24} color={color} />
}

export default function TabsLayout() {
  const { colors } = useTheme()

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          fontSize: 10,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }: TabBarIconRenderProps) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }: TabBarIconRenderProps) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "",
          tabBarIcon: ({ color }: TabBarIconRenderProps) => (
            <TabBarIcon name="flash" color={color} isCenter />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Alerts",
          tabBarIcon: ({ color, size }: TabBarIconRenderProps) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }: TabBarIconRenderProps) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  centerTabContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  centerTabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
})
