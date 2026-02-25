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
import {
    AuthTheme,
    BorderRadius,
    Colors,
    FontSizes,
    Spacing,
} from "../../constants/colors";
import { usePlayer } from "../../Contexts/PlayerContext";

export default function MiniPlayer() {
  const {
    hymn,
    voicePart,
    isPlaying,
    isLoading,
    position,
    duration,
    togglePlayPause,
    nextPart,
    prevPart,
    openFullPlayer,
    availableParts,
  } = usePlayer();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const T = isDark ? AuthTheme.dark : AuthTheme.light;

  const slideAnim = useRef(new Animated.Value(80)).current;

  // Slide up when a hymn is loaded, slide down when nothing playing
  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: hymn ? 0 : 80,
      tension: 60,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, [hymn]);

  if (!hymn || !voicePart) return null;

  const progress = duration > 0 ? position / duration : 0;
  const canPrev = availableParts.indexOf(voicePart) > 0;
  const canNext = availableParts.indexOf(voicePart) < availableParts.length - 1;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: T.cardBg,
          borderTopColor: T.border,
          shadowColor: isDark ? "#000" : "#00000022",
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* ── Progress strip at the very top ────────────────────────────── */}
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

      {/* ── Content row ───────────────────────────────────────────────── */}
      <TouchableOpacity
        style={styles.contentRow}
        onPress={openFullPlayer}
        activeOpacity={0.8}
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
            {hymn.title}
          </Text>
          <Text
            style={[styles.part, { color: T.textSecondary }]}
            numberOfLines={1}
          >
            {voicePart.charAt(0).toUpperCase() + voicePart.slice(1)}
          </Text>
        </View>

        {/* Controls — stop propagation so tapping them doesn't open player */}
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              prevPart();
            }}
            style={[styles.ctrlBtn, !canPrev && styles.ctrlBtnDisabled]}
            disabled={!canPrev}
          >
            <Ionicons
              name="play-skip-back"
              size={18}
              color={canPrev ? T.textPrimary : T.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            style={[styles.playBtn, { backgroundColor: Colors.secondary }]}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={18}
              color="#ffffff"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              nextPart();
            }}
            style={[styles.ctrlBtn, !canNext && styles.ctrlBtnDisabled]}
            disabled={!canNext}
          >
            <Ionicons
              name="play-skip-forward"
              size={18}
              color={canNext ? T.textPrimary : T.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
  },
  progressTrack: {
    height: 2,
    width: "100%",
  },
  progressFill: {
    height: "100%",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    paddingBottom: 22, // extra for bottom safe area
    gap: 12,
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: FontSizes.sm,
    fontWeight: "700",
    marginBottom: 2,
  },
  part: {
    fontSize: FontSizes.xs,
    fontWeight: "500",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ctrlBtn: {
    width: 34,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
  },
  ctrlBtnDisabled: {
    opacity: 0.35,
  },
  playBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
});
