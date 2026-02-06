// src/components/hymns/VoicePartSelector.tsx

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontSizes, Spacing } from "../../constants/colors";
import { VoicePart } from "../../types/hymn.types";

interface VoicePartSelectorProps {
  selectedPart: VoicePart;
  onSelectPart: (part: VoicePart) => void;
  availableParts?: VoicePart[];
}

const VOICE_PARTS: {
  part: VoicePart;
  label: string;
  icon: string;
  color: string;
}[] = [
  { part: "soprano", label: "Soprano", icon: "woman", color: "#FF6B6B" },
  { part: "alto", label: "Alto", icon: "musical-note", color: "#4ECDC4" },
  { part: "tenor", label: "Tenor", icon: "man", color: "#FFD93D" },
  { part: "bass", label: "Bass", icon: "musical-notes", color: "#A78BFA" },
];

export default function VoicePartSelector({
  selectedPart,
  onSelectPart,
  availableParts = ["soprano", "alto", "tenor", "bass"],
}: VoicePartSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Voice Part</Text>

      <View style={styles.partsGrid}>
        {VOICE_PARTS.filter((vp) => availableParts.includes(vp.part)).map(
          ({ part, label, icon, color }) => {
            const isSelected = selectedPart === part;

            return (
              <TouchableOpacity
                key={part}
                style={[
                  styles.partCard,
                  isSelected && {
                    ...styles.partCardSelected,
                    borderColor: color,
                  },
                ]}
                onPress={() => onSelectPart(part)}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: color + "20" },
                  ]}
                >
                  <Ionicons
                    name={icon as any}
                    size={24}
                    color={isSelected ? color : "#666"}
                  />
                </View>

                <Text
                  style={[
                    styles.partLabel,
                    isSelected && styles.partLabelSelected,
                  ]}
                >
                  {label}
                </Text>

                {isSelected && (
                  <View style={[styles.checkmark, { backgroundColor: color }]}>
                    <Ionicons name="checkmark" size={14} color="#FFF" />
                  </View>
                )}
              </TouchableOpacity>
            );
          },
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    backgroundColor: "#FFF",
    borderRadius: 16,
    marginVertical: Spacing.md,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    color: "#333",
    marginBottom: Spacing.md,
  },
  partsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  partCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    position: "relative",
  },
  partCardSelected: {
    backgroundColor: "#FFF",
    borderWidth: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  partLabel: {
    fontSize: FontSizes.md,
    fontWeight: "600",
    color: "#666",
  },
  partLabelSelected: {
    color: "#333",
  },
  checkmark: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
