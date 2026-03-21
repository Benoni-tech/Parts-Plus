// src/components/player/MiniPlayer.tsx

import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AuthTheme,
  BorderRadius,
  Colors,
  FontSizes,
  Spacing,
} from "../../constants/colors";
import { usePlayer } from "../../Contexts/PlayerContext";

const TAB_BAR_BASE = 54; // matches (tabs)/_layout.tsx base

export default function MiniPlayer() {
  const {
    hymn,
    voicePart,
    isPlaying,
    position,
    duration,
    togglePlayPause,
    nextPart,
    openFullPlayer,
    availableParts,
    stop,
  } = usePlayer();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const T = isDark ? AuthTheme.dark : AuthTheme.light;
  const insets = useSafeAreaInsets();

  // Sits 8px above the tab bar — accounts for system gesture nav inset
  const BOTTOM_OFFSET = TAB_BAR_BASE + insets.bottom + 8;

  const slideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: hymn ? 0 : 100,
      tension: 60,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, [hymn]);

  if (!hymn || !voicePart) return null;

  const progress = duration > 0 ? position / duration : 0;
  const canNext = availableParts.indexOf(voicePart) < availableParts.length - 1;

  const capitalise = (s: string) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: T.cardBg,
          borderColor: T.border,
          shadowColor: isDark ? "#000" : "#00000020",
          bottom: BOTTOM_OFFSET,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Progress strip */}
      <View style={[styles.progressTrack, { backgroundColor: T.border }]}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${progress * 100}%` as any,
              backgroundColor: Colors.secondary,
            },
          ]}
        />
      </View>

      {/* Content */}
      <TouchableOpacity
        style={styles.contentRow}
        onPress={openFullPlayer}
        activeOpacity={0.85}
      >
        {/* Thumbnail */}
        <Image
          source={{
            uri:
              hymn.coverImage ||
              `https://via.placeholder.com/44/${Colors.primary.replace("#", "")}/FFFFFF`,
          }}
          style={styles.thumb}
        />

        {/* Info */}
        <View style={styles.info}>
          <Text
            style={[styles.title, { color: T.textPrimary }]}
            numberOfLines={1}
          >
            {capitalise(hymn.title)}
          </Text>
          <Text
            style={[styles.part, { color: T.textSecondary }]}
            numberOfLines={1}
          >
            {capitalise(voicePart)}
          </Text>
        </View>

        {/* Controls: Next | Play/Pause | Close */}
        <View style={styles.controls}>
          {/* Next part */}
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              nextPart();
            }}
            style={[styles.ctrlBtn, !canNext && { opacity: 0.3 }]}
            disabled={!canNext}
          >
            <Ionicons
              name="play-skip-forward"
              size={18}
              color={T.textPrimary}
            />
          </TouchableOpacity>

          {/* Play / Pause */}
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            style={[styles.playBtn, { backgroundColor: Colors.secondary }]}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={17}
              color="#fff"
            />
          </TouchableOpacity>

          {/* Close — stops playback and hides mini player */}
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              stop();
            }}
            style={styles.ctrlBtn}
          >
            <Ionicons name="close" size={20} color={T.textSecondary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: Spacing.md,
    right: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  progressTrack: { height: 2, width: "100%" },
  progressFill: { height: "100%" },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    gap: 10,
  },
  thumb: { width: 40, height: 40, borderRadius: BorderRadius.sm },
  info: { flex: 1 },
  title: { fontSize: FontSizes.sm, fontWeight: "700", marginBottom: 2 },
  part: { fontSize: FontSizes.xs, fontWeight: "500" },
  controls: { flexDirection: "row", alignItems: "center", gap: 6 },
  ctrlBtn: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});
