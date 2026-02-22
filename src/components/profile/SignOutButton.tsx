// src/components/profile/SignOutButton.tsx

import React from "react";
import { StyleSheet, View } from "react-native";
import { AuthThemeType, BorderRadius } from "../../../src/constants/colors";
import MenuItem from "./MenuItem";

export default function SignOutButton({
  isDark,
  T,
  onSignOut,
}: {
  isDark: boolean;
  T: AuthThemeType;
  onSignOut: () => void;
}) {
  const cardStyle = {
    backgroundColor: isDark ? "#1e1e1e" : "#f9f9f9",
    borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)",
  };

  return (
    <View style={[styles.card, cardStyle, { marginTop: 24 }]}>
      <MenuItem
        icon="log-out-outline"
        label="Sign Out"
        onPress={onSignOut}
        T={T}
        isDark={isDark}
        isLast
        destructive
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: "hidden",
  },
});
