// app/(tabs)/_layout.tsx

import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { Colors } from "../../src/constants/colors";

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const tabBarBg = isDark ? "#161616" : "#ffffff";
  const tabBarBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const shadowColor = isDark ? "#000000" : "#00000018";
  const inactiveColor = isDark ? Colors.text.secondary : "#aaaaaa";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: tabBarBg,
            borderColor: tabBarBorder,
            shadowColor,
          },
        ],
        tabBarItemStyle: styles.tabItem,
        tabBarLabelStyle: styles.label,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    height: 64,
    marginHorizontal: 50,
    borderRadius: 32,
    borderWidth: 1,
    paddingHorizontal: 2,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
    borderTopWidth: 1,
  },
  tabItem: {
    height: 50,
    borderRadius: 25,
    marginVertical: 7,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
  },
});
