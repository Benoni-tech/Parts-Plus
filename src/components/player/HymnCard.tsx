// src/components/player/HymnCard.tsx - WITH GRID & LIST VARIANTS

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { FontSizes, Spacing } from "../../constants/colors";
import { Hymn } from "../../types/hymn.types";

interface HymnCardProps {
  hymn: Hymn;
  variant?: "list" | "grid";
  onPress?: () => void;
}

export default function HymnCard({
  hymn,
  variant = "list",
  onPress,
}: HymnCardProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const theme = {
    card: isDark ? "#1A1A1A" : "#F5F5F5",
    text: isDark ? "#FFFFFF" : "#000000",
    textSecondary: isDark ? "#999999" : "#666666",
  };

  const handlePress = () => {
    console.log("🎵 HymnCard pressed:", hymn.id, hymn.title);

    if (onPress) {
      onPress();
    } else {
      router.push(`/hymn/${hymn.id}`);
    }
  };

  // GRID VARIANT (Compact Square Card)
  if (variant === "grid") {
    return (
      <TouchableOpacity
        style={styles.gridCard}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        {/* Cover Image */}
        <Image
          source={{
            uri:
              hymn.coverImage ||
              `https://via.placeholder.com/150/9B59B6/FFFFFF?text=${hymn.title[0] || "H"}`,
          }}
          style={styles.gridImage}
        />

        {/* Play Button Overlay */}
        <View style={styles.gridPlayOverlay}>
          <View style={styles.gridPlayButton}>
            <Ionicons name="play" size={20} color="#FFF" />
          </View>
        </View>

        {/* Info */}
        <View style={styles.gridInfo}>
          <Text
            style={[styles.gridTitle, { color: theme.text }]}
            numberOfLines={1}
          >
            {hymn.title}
          </Text>
          <Text
            style={[styles.gridCategory, { color: theme.textSecondary }]}
            numberOfLines={1}
          >
            {hymn.category}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  // LIST VARIANT (Horizontal Card - Original)
  return (
    <TouchableOpacity
      style={[styles.listCard, { backgroundColor: theme.card }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Cover Image */}
      <Image
        source={{
          uri:
            hymn.coverImage ||
            `https://via.placeholder.com/60/9B59B6/FFFFFF?text=${hymn.title[0] || "H"}`,
        }}
        style={styles.listImage}
      />

      {/* Hymn Info */}
      <View style={styles.listInfo}>
        <View style={styles.titleRow}>
          <Text
            style={[styles.listTitle, { color: theme.text }]}
            numberOfLines={1}
          >
            {hymn.title}
          </Text>
          {hymn.number && (
            <View style={styles.numberBadge}>
              <Text style={styles.numberText}>#{hymn.number}</Text>
            </View>
          )}
        </View>

        <Text
          style={[styles.listComposer, { color: theme.textSecondary }]}
          numberOfLines={1}
        >
          {hymn.composer}
        </Text>

        {/* Category Badge */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{hymn.category}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.listActions}>
        <View style={styles.stats}>
          <Ionicons name="play-circle" size={14} color="#999" />
          <Text style={styles.playsText}>{hymn.plays || 0}</Text>
        </View>

        <View style={styles.listPlayButton}>
          <Ionicons name="play" size={18} color="#FFF" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // ===== GRID VARIANT STYLES =====
  gridCard: {
    width: 160,
    marginRight: Spacing.md,
  },
  gridImage: {
    width: 160,
    height: 160,
    borderRadius: 12,
    backgroundColor: "#2A2A2A",
  },
  gridPlayOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 12,
  },
  gridPlayButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(155, 89, 182, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  gridInfo: {
    marginTop: Spacing.sm,
  },
  gridTitle: {
    fontSize: FontSizes.md,
    fontWeight: "700",
    marginBottom: 4,
  },
  gridCategory: {
    fontSize: FontSizes.sm,
    textTransform: "capitalize",
  },

  // ===== LIST VARIANT STYLES =====
  listCard: {
    flexDirection: "row",
    borderRadius: 12,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    alignItems: "center",
    gap: Spacing.md,
  },
  listImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#2A2A2A",
  },
  listInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 8,
  },
  listTitle: {
    fontSize: FontSizes.md,
    fontWeight: "700",
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
  listComposer: {
    fontSize: FontSizes.sm,
    marginBottom: 4,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(155, 89, 182, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    color: "#9B59B6",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  listActions: {
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
  listPlayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#9B59B6",
    justifyContent: "center",
    alignItems: "center",
  },
});
