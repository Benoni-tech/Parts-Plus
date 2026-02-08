// src/components/player/VoicePartSelector.tsx - REDESIGNED

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FontSizes, Spacing } from "../../constants/colors";
import { Hymn, VoicePart } from "../../types/hymn.types";

interface VoicePartSelectorProps {
  hymn: Hymn;
  onSelectPart: (part: VoicePart) => void;
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
  hymn,
  onSelectPart,
}: VoicePartSelectorProps) {
  return (
    <View style={styles.container}>
      {/* Cover Image Background */}
      <ImageBackground
        source={{
          uri:
            hymn.coverImage || "https://via.placeholder.com/400/9B59B6/FFFFFF",
        }}
        style={styles.coverBackground}
        blurRadius={10}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]}
          style={styles.coverGradient}
        >
          <Image
            source={{
              uri:
                hymn.coverImage ||
                `https://via.placeholder.com/200/9B59B6/FFFFFF?text=${hymn.title[0] || "H"}`,
            }}
            style={styles.coverImage}
          />
          <Text style={styles.playlistTitle}>{hymn.title}</Text>
          <Text style={styles.playlistSubtitle}>By {hymn.composer}</Text>
        </LinearGradient>
      </ImageBackground>

      {/* Voice Parts List */}
      <View style={styles.partsContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Select Voice Part</Text>
          <Text style={styles.headerCount}>{VOICE_PARTS.length} parts</Text>
        </View>

        {VOICE_PARTS.map(({ part, label, icon, color }, index) => (
          <TouchableOpacity
            key={part}
            style={styles.partRow}
            onPress={() => onSelectPart(part)}
            activeOpacity={0.7}
          >
            <View style={styles.partLeft}>
              <View
                style={[styles.partIcon, { backgroundColor: color + "20" }]}
              >
                <Ionicons name={icon as any} size={24} color={color} />
              </View>
              <View style={styles.partInfo}>
                <Text style={styles.partLabel}>{label}</Text>
                <Text style={styles.partArtist}>
                  {hymn.credits[part] || "Unknown"}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.playButton}>
              <Ionicons name="play-circle" size={40} color={color} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coverBackground: {
    width: "100%",
    height: 350,
  },
  coverGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  coverImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
    marginBottom: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 16,
  },
  playlistTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 4,
  },
  playlistSubtitle: {
    fontSize: FontSizes.sm,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
  partsContainer: {
    flex: 1,
    backgroundColor: "#000",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingTop: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    color: "#FFF",
  },
  headerCount: {
    fontSize: FontSizes.sm,
    color: "#999",
  },
  partRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  partLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  partIcon: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  partInfo: {
    flex: 1,
  },
  partLabel: {
    fontSize: FontSizes.md,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 2,
  },
  partArtist: {
    fontSize: FontSizes.sm,
    color: "#999",
  },
  playButton: {
    padding: 4,
  },
});
