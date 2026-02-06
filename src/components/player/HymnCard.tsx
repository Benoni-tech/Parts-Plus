// src/components/player/HymnCard.tsx - FIXED VERSION

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontSizes, Spacing } from "../../constants/colors";
import { Hymn } from "../../types/hymn.types";

interface HymnCardProps {
  hymn: Hymn;
  onPress?: () => void;
}

export default function HymnCard({ hymn, onPress }: HymnCardProps) {
  const router = useRouter();

  const handlePress = () => {
    console.log("🎵 HymnCard pressed:", hymn.id, hymn.title);
    console.log("🧭 Attempting navigation to:", `/hymn/${hymn.id}`);

    if (onPress) {
      onPress();
    } else {
      // Navigate to hymn detail
      router.push(`/hymn/${hymn.id}`);
      console.log("✅ router.push executed");
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Cover Image */}
      <Image
        source={{
          uri:
            hymn.coverImage ||
            "https://via.placeholder.com/60/9B59B6/FFFFFF?text=" +
              (hymn.title[0] || "H"),
        }}
        style={styles.coverImage}
      />

      {/* Hymn Info */}
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {hymn.title}
          </Text>
          {hymn.number && (
            <View style={styles.numberBadge}>
              <Text style={styles.numberText}>#{hymn.number}</Text>
            </View>
          )}
        </View>

        <Text style={styles.composer} numberOfLines={1}>
          {hymn.composer}
        </Text>

        {/* Tags */}
        {hymn.tags && hymn.tags.length > 0 && (
          <View style={styles.tags}>
            {hymn.tags.slice(0, 2).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            {hymn.tags.length > 2 && (
              <Text style={styles.moreText}>+{hymn.tags.length - 2}</Text>
            )}
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <View style={styles.stats}>
          <Ionicons name="play-circle" size={14} color="#999" />
          <Text style={styles.playsText}>{hymn.plays || 0}</Text>
        </View>

        <View style={styles.playButton}>
          <Ionicons name="play" size={18} color="#FFF" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    alignItems: "center",
    gap: Spacing.md,
  },
  coverImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 8,
  },
  title: {
    fontSize: FontSizes.md,
    fontWeight: "700",
    color: "#FFF",
    flex: 1,
  },
  numberBadge: {
    backgroundColor: "rgba(155, 89, 182, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  numberText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9B59B6",
  },
  composer: {
    fontSize: FontSizes.sm,
    color: "#999",
    marginBottom: 6,
  },
  tags: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  tag: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 11,
    color: "#999",
  },
  moreText: {
    fontSize: 11,
    color: "#666",
  },
  actions: {
    alignItems: "flex-end",
    gap: 8,
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  playsText: {
    fontSize: 12,
    color: "#999",
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#9B59B6",
    justifyContent: "center",
    alignItems: "center",
  },
});
