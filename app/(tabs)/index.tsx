"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, StatusBar } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import Card from "../../components/Card"
import { useTheme } from "@/context/ThemeContext"
import { useUser } from "@/context/UserContext"
import Input from "../../components/Input"
import Button from "@/components/Button"
import NearbyRepairsMap from "@/components/NearbyRepairsMap"

export default function HomeScreen() {
  const { colors } = useTheme()
  const { user } = useUser()
  const [repairIssue, setRepairIssue] = useState("")
  const [showMap, setShowMap] = useState(false)

  const recentRepairs = [
    {
      id: "1",
      title: "Laptop Screen Repair",
      status: "In Progress",
      date: "Today",
      professional: "Alex Tech",
    },
    {
      id: "2",
      title: "iPhone Battery Replacement",
      status: "Completed",
      date: "Yesterday",
      professional: "Mobile Fix Pro",
    },
  ]

  const handleSubmitIssue = () => {
    if (repairIssue.trim()) {
      router.push({
        pathname: "/chat",
        params: { initialMessage: repairIssue },
      })
    }
  }

  const handleOpenMap = () => {
    setShowMap(true)
  }

  const handleCloseMap = () => {
    setShowMap(false)
  }

  const renderRepairItem = ({ item }) => (
    <Card style={styles.repairCard}>
      <View style={styles.repairHeader}>
        <View>
          <Text style={[styles.repairTitle, { color: colors.text }]}>{item.title}</Text>
          <View style={styles.repairInfoContainer}>
            <Ionicons name="time-outline" size={12} color={colors.muted} />
            <Text style={[styles.repairInfo, { color: colors.muted }]}>{item.date}</Text>
            <Text style={[styles.repairDot, { color: colors.muted }]}>•</Text>
            <Text style={[styles.repairInfo, { color: colors.muted }]}>{item.professional}</Text>
          </View>
        </View>
        <View style={styles.repairStatusContainer}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: item.status === "Completed" ? `${colors.success}20` : `${colors.info}20`,
              },
            ]}
          >
            <Text style={[styles.statusText, { color: item.status === "Completed" ? colors.success : colors.info }]}>
              {item.status}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() =>
              router.push({
                pathname: "/chat",
                params: { repairId: item.id },
              })
            }
          >
            <Ionicons name="chatbubble-outline" size={16} color={colors.muted} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.text === "#FFFFFF" ? "light-content" : "dark-content"} />
      <View style={styles.header}>
        <Text style={[styles.appTitle, { color: colors.primary }]}>ElectroGpt</Text>
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Ionicons name="settings-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Find Nearby Repairs Button */}
        <TouchableOpacity style={[styles.mapButton, { backgroundColor: colors.primary }]} onPress={handleOpenMap}>
          <Ionicons name="location" size={20} color="#FFFFFF" />
          <Text style={styles.mapButtonText}>Find Nearby Electronic Repairs</Text>
        </TouchableOpacity>

        {/* Greeting and Input Card - Border removed */}
        <Card style={[styles.greetingCard, { borderWidth: 0 }]}>
          <View style={styles.greetingHeader}>
            <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.iconContainer}>
              <Ionicons name="construct-outline" size={28} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.greetingTextContainer}>
              <Text style={[styles.aiAssistantLabel, { color: colors.primary }]}>AI ASSISTANT</Text>
              <Text style={[styles.greeting, { color: colors.text }]}>Hey, {user?.name} 👋</Text>
              <Text style={[styles.greetingSubtext, { color: colors.muted }]}>
                I'm your assistant. Describe your issue to get connected with repair professionals.
              </Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Input
              value={repairIssue}
              onChangeText={setRepairIssue}
              placeholder="My Laptop shows a blue screen"
              rightIcon={
                <TouchableOpacity onPress={handleSubmitIssue} disabled={!repairIssue.trim()}>
                  <Ionicons name="send" size={20} color={repairIssue.trim() ? colors.primary : colors.muted} />
                </TouchableOpacity>
              }
              style={styles.input}
            />
          </View>
        </Card>

        {/* Recent Repairs */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Repairs</Text>
          <TouchableOpacity>
            <View style={styles.viewAllContainer}>
              <Text style={[styles.viewAllText, { color: colors.primary }]}>View all</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.primary} />
            </View>
          </TouchableOpacity>
        </View>

        {recentRepairs.length > 0 ? (
          <FlatList
            data={recentRepairs}
            renderItem={renderRepairItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.repairsList}
          />
        ) : (
          <Card style={styles.emptyRepairsCard}>
            <Text style={[styles.emptyRepairsText, { color: colors.muted }]}>No repair history yet</Text>
            <Button
              title="Start your first repair"
              variant="outline"
              size="small"
              onPress={() => router.push("/chat")}
            />
          </Card>
        )}

        {/* Quick Tips */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Tips</Text>
        </View>

        <Card style={styles.tipsCard}>
          <TouchableOpacity style={styles.tipItem}>
            <Text style={[styles.tipText, { color: colors.text }]}>How to take better photos for diagnosis</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.muted} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity style={styles.tipItem}>
            <Text style={[styles.tipText, { color: colors.text }]}>Common device troubleshooting steps</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.muted} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity style={styles.tipItem}>
            <Text style={[styles.tipText, { color: colors.text }]}>Understanding repair pricing</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.muted} />
          </TouchableOpacity>
        </Card>
      </ScrollView>

      {/* Map Modal */}
      {showMap && <NearbyRepairsMap onClose={handleCloseMap} />}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  mapButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 8,
  },
  greetingCard: {
    marginBottom: 24,
    shadowOpacity: 0.1,
  },
  greetingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  greetingTextContainer: {
    flex: 1,
  },
  aiAssistantLabel: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  greetingSubtext: {
    fontSize: 14,
    lineHeight: 20,
  },
  inputContainer: {
    marginTop: 8,
  },
  input: {
    marginBottom: 0,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  viewAllContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 14,
    marginRight: 4,
  },
  repairsList: {
    marginTop: 8,
  },
  repairCard: {
    marginBottom: 12,
  },
  repairHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  repairTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  repairInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  repairInfo: {
    fontSize: 12,
    marginLeft: 4,
  },
  repairDot: {
    fontSize: 12,
    marginHorizontal: 4,
  },
  repairStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "500",
  },
  chatButton: {
    padding: 4,
  },
  emptyRepairsCard: {
    alignItems: "center",
    padding: 24,
  },
  emptyRepairsText: {
    marginBottom: 12,
  },
  tipsCard: {
    padding: 0,
  },
  tipItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  tipText: {
    fontSize: 14,
  },
  divider: {
    height: 1,
  },
})
