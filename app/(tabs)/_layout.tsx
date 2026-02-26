// app/(tabs)/_layout.tsx

import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, useColorScheme, View } from "react-native";
import { AuthTheme, Colors } from "../../src/constants/colors";

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const T = isDark ? AuthTheme.dark : AuthTheme.light;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBar,
          {
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
              icon={focused ? "library" : "library-outline"}
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
              icon={focused ? "person" : "person-outline"}
              label="Profile"
              color={color}
            />
          ),
        }}
      />

      {/* ✅ Hide nested routes from tab bar completely — no ghost slots */}
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
      <Text style={[styles.tabLabel, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === "ios" ? 80 : 62,
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
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});
