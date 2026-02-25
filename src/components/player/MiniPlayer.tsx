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

// TAB_BAR_HEIGHT + safe area — mini player sits just above the tab bar
const TAB_BAR_HEIGHT = 60;
const BOTTOM_OFFSET = TAB_BAR_HEIGHT + 8;

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
  const canPrev = availableParts.indexOf(voicePart) > 0;
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
        <Image
          source={{
            uri:
              hymn.coverImage ||
              `https://via.placeholder.com/44/${Colors.primary.replace("#", "")}/FFFFFF`,
          }}
          style={styles.thumb}
        />

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

        <View style={styles.controls}>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              prevPart();
            }}
            style={[styles.ctrlBtn, !canPrev && { opacity: 0.3 }]}
            disabled={!canPrev}
          >
            <Ionicons name="play-skip-back" size={18} color={T.textPrimary} />
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
              size={17}
              color="#fff"
            />
          </TouchableOpacity>

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
