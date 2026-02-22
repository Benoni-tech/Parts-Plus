// src/components/profile/SectionHeader.tsx

import React from "react";
import { StyleSheet, Text } from "react-native";
import { AuthThemeType } from "../../../src/constants/colors";

export default function SectionHeader({
  label,
  T,
}: {
  label: string;
  T: AuthThemeType;
}) {
  return <Text style={[styles.header, { color: T.labelColor }]}>{label}</Text>;
}

const styles = StyleSheet.create({
  header: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: 24,
    paddingHorizontal: 4,
  },
});
