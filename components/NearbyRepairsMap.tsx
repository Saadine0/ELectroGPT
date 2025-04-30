"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
  Linking,
  FlatList,
} from "react-native"
import { useTheme } from "../context/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import * as Location from "expo-location"
import Card from "./Card"

const { width, height } = Dimensions.get("window")

// Mock data for repair shops
const MOCK_REPAIR_SHOPS = [
  {
    id: "shop1",
    name: "TechWorld Electronics",
    rating: 4.7,
    vicinity: "123 Main St, Downtown",
    distance: "0.8 miles",
    coordinate: { latitude: 0, longitude: 0 }, // Will be updated based on user location
  },
  {
    id: "shop2",
    name: "Mobile Repair Center",
    rating: 4.5,
    vicinity: "456 Oak Ave, Westside",
    distance: "1.2 miles",
    coordinate: { latitude: 0, longitude: 0 },
  },
  {
    id: "shop3",
    name: "Electronics Megastore",
    rating: 4.8,
    vicinity: "789 Tech Blvd, Eastside",
    distance: "2.5 miles",
    coordinate: { latitude: 0, longitude: 0 },
  },
  {
    id: "shop4",
    name: "Quick Fix Tech",
    rating: 4.6,
    vicinity: "321 Pine St, Northside",
    distance: "3.1 miles",
    coordinate: { latitude: 0, longitude: 0 },
  },
]

type Shop = {
  id: string
  name: string
  rating: number
  vicinity: string
  distance: string
  coordinate: {
    latitude: number
    longitude: number
  }
}

type NearbyRepairsMapProps = {
  onClose: () => void
}

export default function NearbyRepairsMap({ onClose }: NearbyRepairsMapProps) {
  const { colors } = useTheme()
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null)
  const [repairShops, setRepairShops] = useState<Shop[]>([])

  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied")
        setLoading(false)
        return
      }

      try {
        const location = await Location.getCurrentPositionAsync({})
        setLocation(location)

        // Update mock shop coordinates based on user's location
        const shopsWithCoordinates = MOCK_REPAIR_SHOPS.map((shop, index) => {
          // Position shops at different offsets from the user's location
          const latOffset = 0.01 * Math.cos((index * Math.PI) / 2)
          const lngOffset = 0.01 * Math.sin((index * Math.PI) / 2)

          return {
            ...shop,
            coordinate: {
              latitude: location.coords.latitude + latOffset,
              longitude: location.coords.longitude + lngOffset,
            },
          }
        })

        setRepairShops(shopsWithCoordinates)
        setLoading(false)
      } catch (error) {
        setErrorMsg("Could not fetch location")
        setLoading(false)
      }
    })()
  }, [])

  const openDirections = (shop: Shop) => {
    const scheme = Platform.select({ ios: "maps:0,0?q=", android: "geo:0,0?q=" })
    const latLng = `${shop.coordinate.latitude},${shop.coordinate.longitude}`
    const label = shop.name
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    })

    if (url) {
      Linking.openURL(url)
    }
  }

  const handleCallShop = () => {
    // In a real app, you would use the shop's phone number
    const phoneNumber = "5551234567"
    Linking.openURL(`tel:${phoneNumber}`)
  }

  const handleVisitWebsite = () => {
    // In a real app, you would use the shop's website URL
    Linking.openURL("https://example.com")
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Nearby Electronic Repairs</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Finding repair shops near you...</Text>
        </View>
      ) : errorMsg ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.text }]}>{errorMsg}</Text>
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: colors.primary }]} onPress={onClose}>
            <Text style={styles.retryButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      ) : location ? (
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation
            showsMyLocationButton
          >
            {repairShops.map((shop) => (
              <Marker
                key={shop.id}
                coordinate={shop.coordinate}
                title={shop.name}
                description={`${shop.rating} ★ • ${shop.vicinity}`}
                pinColor="#00c6ff"
                onPress={() => setSelectedShop(shop)}
              />
            ))}
          </MapView>

          {selectedShop ? (
            <Card style={[styles.shopDetailCard, { backgroundColor: colors.card }]}>
              <View style={styles.shopHeader}>
                <View>
                  <Text style={[styles.shopName, { color: colors.text }]}>{selectedShop.name}</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={[styles.ratingText, { color: colors.text }]}>{selectedShop.rating}</Text>
                    <Text style={[styles.shopDistance, { color: colors.muted }]}>• {selectedShop.distance} away</Text>
                  </View>
                  <Text style={[styles.shopAddress, { color: colors.muted }]}>{selectedShop.vicinity}</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedShop(null)}>
                  <Ionicons name="close-circle-outline" size={24} color={colors.muted} />
                </TouchableOpacity>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.primary }]}
                  onPress={() => openDirections(selectedShop)}
                >
                  <Ionicons name="navigate" size={18} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Directions</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.background, borderColor: colors.border }]}
                  onPress={handleCallShop}
                >
                  <Ionicons name="call" size={18} color={colors.primary} />
                  <Text style={[styles.actionButtonTextAlt, { color: colors.text }]}>Call</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.background, borderColor: colors.border }]}
                  onPress={handleVisitWebsite}
                >
                  <Ionicons name="globe" size={18} color={colors.primary} />
                  <Text style={[styles.actionButtonTextAlt, { color: colors.text }]}>Website</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ) : (
            <View style={[styles.shopsList, { backgroundColor: colors.card }]}>
              <Text style={[styles.shopsListTitle, { color: colors.text }]}>
                {repairShops.length} repair shops found
              </Text>
              <FlatList
                data={repairShops}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.shopsListContent}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.shopItem, { backgroundColor: colors.background, borderColor: colors.border }]}
                    onPress={() => setSelectedShop(item)}
                  >
                    <Text style={[styles.shopItemName, { color: colors.text }]}>{item.name}</Text>
                    <View style={styles.shopItemRating}>
                      <Ionicons name="star" size={12} color="#FFD700" />
                      <Text style={{ color: colors.text, marginLeft: 4 }}>{item.rating}</Text>
                    </View>
                    <Text style={[styles.shopItemDistance, { color: colors.muted }]}>{item.distance} away</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  shopDetailCard: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shopHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  shopName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ratingText: {
    marginLeft: 4,
    marginRight: 4,
  },
  shopDistance: {
    fontSize: 14,
  },
  shopAddress: {
    fontSize: 14,
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "transparent",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
    marginLeft: 4,
  },
  actionButtonTextAlt: {
    fontWeight: "500",
    marginLeft: 4,
  },
  shopsList: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shopsListTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  shopsListContent: {
    paddingRight: 8,
  },
  shopItem: {
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
    width: 150,
  },
  shopItemName: {
    fontWeight: "500",
    marginBottom: 4,
  },
  shopItemRating: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  shopItemDistance: {
    fontSize: 12,
  },
})
