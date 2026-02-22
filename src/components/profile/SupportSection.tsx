// src/components/profile/SupportSection.tsx

import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AuthThemeType, BorderRadius, FontSizes } from "../../constants/colors";
import MenuItem from "./MenuItem";
import SectionHeader from "./SectionHeader";

export default function SupportSection({
  isDark,
  T,
}: {
  isDark: boolean;
  T: AuthThemeType;
}) {
  const router = useRouter();

  const cardStyle = {
    backgroundColor: isDark ? "#1e1e1e" : "#f9f9f9",
    borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)",
  };

  return (
    <>
      <SectionHeader label="Support & Info" T={T} />
      <View style={[styles.sectionCard, cardStyle]}>
        <MenuItem
          icon="help-circle-outline"
          label="Help / FAQ"
          onPress={() => router.push("/(tabs)/profile/faq")}
          T={T}
          isDark={isDark}
        />
        <MenuItem
          icon="document-text-outline"
          label="Privacy Policy"
          onPress={() => router.push("/(tabs)/profile/privacy")}
          T={T}
          isDark={isDark}
        />
        <MenuItem
          icon="reader-outline"
          label="Terms of Service"
          onPress={() => router.push("/(tabs)/profile/terms")}
          T={T}
          isDark={isDark}
        />
        <MenuItem
          icon="information-circle-outline"
          label="App Version"
          T={T}
          isDark={isDark}
          isLast
          rightContent={
            <Text
              style={{
                fontSize: FontSizes.xs,
                color: T.inputPlaceholder,
                fontWeight: "500",
              }}
            >
              1.0.0
            </Text>
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: "hidden",
  },
});
