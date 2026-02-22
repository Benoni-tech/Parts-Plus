// src/components/profile/ProfileBanner.tsx

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
    AuthThemeType,
    BorderRadius,
    Colors,
    FontSizes,
} from "../../../src/constants/colors";
import GridOverlay from "./GridOverlay";

type User = {
  displayName?: string | null;
  email?: string | null;
  emailVerified?: boolean;
  photoURL?: string | null;
};

export default function ProfileBanner({
  user,
  isDark,
  T,
  onEditPress,
}: {
  user: User | null;
  isDark: boolean;
  T: AuthThemeType;
  onEditPress: () => void;
}) {
  return (
    <View style={[styles.profileBanner, { backgroundColor: T.bannerBg }]}>
      {/* Grid on right half */}
      <View style={styles.bannerGridRight}>
        <GridOverlay isDark={isDark} />
      </View>

      {/* Content */}
      <View style={styles.bannerContent}>
        {/* Avatar */}
        <View
          style={[
            styles.avatarCircle,
            {
              backgroundColor: isDark ? "#2a2a2a" : "rgba(255,255,255,0.15)",
            },
          ]}
        >
          <Ionicons name="person" size={40} color="#ffffff" />
        </View>

        {/* Name + email + badge */}
        <View style={styles.bannerTextBlock}>
          <Text style={[styles.bannerName, { color: "#ffffff" }]}>
            {user?.displayName || "User"}
          </Text>
          <Text
            style={[styles.bannerEmail, { color: "rgba(255,255,255,0.65)" }]}
            numberOfLines={1}
          >
            {user?.email}
          </Text>
          {user?.emailVerified && (
            <View style={styles.verifiedBadge}>
              <Ionicons
                name="checkmark-circle"
                size={13}
                color={Colors.success}
              />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
        </View>

        {/* Edit shortcut */}
        <TouchableOpacity
          style={[
            styles.editButton,
            {
              backgroundColor: "rgba(255,255,255,0.15)",
              borderColor: "rgba(255,255,255,0.25)",
            },
          ]}
          onPress={onEditPress}
        >
          <Ionicons name="pencil-outline" size={15} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileBanner: {
    height: 200,
    overflow: "hidden",
    position: "relative",
  },
  bannerGridRight: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "55%",
  },
  bannerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 20,
    zIndex: 2,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    flexShrink: 0,
  },
  bannerTextBlock: {
    flex: 1,
  },
  bannerName: {
    fontSize: FontSizes.xl,
    fontWeight: "900",
    letterSpacing: 0.2,
    marginBottom: 3,
  },
  bannerEmail: {
    fontSize: FontSizes.xs,
    marginBottom: 6,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: `${Colors.success}22`,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  verifiedText: {
    fontSize: 11,
    color: Colors.success,
    fontWeight: "600",
  },
  editButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
});
