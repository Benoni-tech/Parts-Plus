// app/(tabs)/_layout.tsx

import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthTheme, Colors } from "../../src/constants/colors";

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const T = isDark ? AuthTheme.dark : AuthTheme.light;
  const insets = useSafeAreaInsets();

  // ── Tab bar height ────────────────────────────────────────────────────────
  // insets.bottom = gesture nav bar height (0 on button nav, ~24-34px on gesture nav)
  // We add that to our base height so the bar always clears the system UI.
  const TAB_BAR_BASE = Platform.OS === "ios" ? 50 : 54;
  const TAB_BAR_HEIGHT = TAB_BAR_BASE + insets.bottom;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBar,
          {
            height: TAB_BAR_HEIGHT,
            paddingBottom: insets.bottom, // pushes icons above system nav
            backgroundColor: T.cardBg,
            borderTopColor: T.border,
            shadowColor: isDark ? "#000" : "#00000018",
          },
        ],
        tabBarActiveTintColor: Colors.secondary,
        tabBarInactiveTintColor: T.textSecondary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={focused ? "home" : "home-outline"}
              label="Home"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={focused ? "search" : "search-outline"}
              label="Search"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="library/index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={focused ? "albums" : "albums-outline"}
              label="Library"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={focused ? "person-circle" : "person-circle-outline"}
              label="Profile"
              color={color}
            />
          ),
        }}
      />

      {/* Hide nested routes from tab bar — no ghost slots */}
      <Tabs.Screen name="library/[tag]" options={{ href: null }} />
      <Tabs.Screen name="library/playlist/[id]" options={{ href: null }} />
    </Tabs>
  );
}

function TabIcon({
  icon,
  label,
  color,
}: {
  icon: any;
  label: string;
  color: string;
}) {
  return (
    <View style={styles.tabItem}>
      <Ionicons name={icon} size={24} color={color} />
      <Text style={[styles.tabLabel, { color }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    paddingTop: 8,
    borderRadius: 0,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 12,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    minWidth: 60,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.2,
    textAlign: "center",
    includeFontPadding: false,
  },
});
