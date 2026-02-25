// src/components/player/FullScreenPlayer.tsx

import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { AuthTheme, Colors, FontSizes, Spacing } from "../../constants/colors";
import { usePlayer } from "../../Contexts/PlayerContext";

// ─── Lyrics parser ────────────────────────────────────────────────────────────
function parseLyrics(
  raw: string,
): { section: string | null; lines: string[] }[] {
  const result: { section: string | null; lines: string[] }[] = [];
  let currentSection: string | null = null;
  let currentLines: string[] = [];

  raw.split("\n").forEach((line) => {
    const match = line.match(/^\[(.+)\]$/);
    if (match) {
      if (currentLines.length > 0 || currentSection !== null) {
        result.push({ section: currentSection, lines: currentLines });
      }
      currentSection = match[1];
      currentLines = [];
    } else if (line.trim() !== "") {
      currentLines.push(line.trim());
    } else if (currentLines.length > 0) {
      currentLines.push("");
    }
  });

  if (currentLines.length > 0 || currentSection !== null) {
    result.push({ section: currentSection, lines: currentLines });
  }
  return result;
}

export default function FullScreenPlayer() {
  const {
    hymn,
    voicePart,
    isPlaying,
    isLoading,
    position,
    duration,
    availableParts,
    shuffleOn,
    repeatOn,
    isFullPlayerOpen,
    togglePlayPause,
    seekTo,
    skipForward,
    skipBackward,
    nextPart,
    prevPart,
    toggleShuffle,
    toggleRepeat,
    closeFullPlayer,
  } = usePlayer();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const T = isDark ? AuthTheme.dark : AuthTheme.light;

  const [activeView, setActiveView] = useState<"player" | "lyrics">("player");

  if (!hymn || !voicePart) return null;

  const progress = duration > 0 ? position / duration : 0;
  const parsedLyrics = hymn.lyrics ? parseLyrics(hymn.lyrics) : [];
  const canPrev = availableParts.indexOf(voicePart) > 0;
  const canNext = availableParts.indexOf(voicePart) < availableParts.length - 1;

  const formatTime = (millis: number) => {
    const s = Math.floor(millis / 1000);
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  };

  // ── Top bar ─────────────────────────────────────────────────────────────────
  const TopBar = () => (
    <View style={[styles.topBar, { borderBottomColor: T.border }]}>
      <TouchableOpacity onPress={closeFullPlayer} style={styles.navBtn}>
        <Ionicons name="chevron-down" size={26} color={T.textPrimary} />
      </TouchableOpacity>

      {/* Player / Lyrics pill toggle */}
      <View
        style={[
          styles.togglePill,
          { backgroundColor: isDark ? "#2a2a2a" : "#eeeeee" },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.toggleOption,
            activeView === "player" && { backgroundColor: Colors.secondary },
          ]}
          onPress={() => setActiveView("player")}
        >
          <Text
            style={[
              styles.toggleTxt,
              { color: activeView === "player" ? "#fff" : T.textSecondary },
            ]}
          >
            Player
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleOption,
            activeView === "lyrics" && { backgroundColor: Colors.secondary },
          ]}
          onPress={() => setActiveView("lyrics")}
        >
          <Text
            style={[
              styles.toggleTxt,
              { color: activeView === "lyrics" ? "#fff" : T.textSecondary },
            ]}
          >
            Lyrics
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.navBtn}>
        <Ionicons name="heart-outline" size={22} color={T.textPrimary} />
      </TouchableOpacity>
    </View>
  );

  // ── Mini bar (inside lyrics view) ──────────────────────────────────────────
  const MiniBar = () => (
    <View
      style={[
        styles.miniBar,
        { backgroundColor: T.background, borderTopColor: T.border },
      ]}
    >
      <Image
        source={{ uri: hymn.coverImage || `https://via.placeholder.com/40` }}
        style={styles.miniThumb}
      />
      <View style={styles.miniInfo}>
        <Text
          style={[styles.miniTitle, { color: T.textPrimary }]}
          numberOfLines={1}
        >
          {hymn.title}
        </Text>
        <View style={[styles.miniTrack, { backgroundColor: T.border }]}>
          <View
            style={[
              styles.miniFill,
              {
                width: `${progress * 100}%` as any,
                backgroundColor: Colors.secondary,
              },
            ]}
          />
        </View>
      </View>
      <TouchableOpacity onPress={togglePlayPause} style={styles.miniBtn}>
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.secondary} />
        ) : (
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={22}
            color={Colors.secondary}
          />
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={isFullPlayerOpen}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={closeFullPlayer}
    >
      <View style={[styles.root, { backgroundColor: T.background }]}>
        <TopBar />

        {/* ── PLAYER VIEW ────────────────────────────────────────────── */}
        {activeView === "player" && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={styles.playerScroll}
          >
            {/* Album art */}
            <View style={styles.artWrapper}>
              <Image
                source={{
                  uri: hymn.coverImage || `https://via.placeholder.com/280`,
                }}
                style={styles.albumArt}
              />
            </View>

            {/* Song info */}
            <View style={styles.infoRow}>
              <View style={{ flex: 1 }}>
                <Text
                  style={[styles.songTitle, { color: T.textPrimary }]}
                  numberOfLines={2}
                >
                  {hymn.title}
                </Text>
                <Text
                  style={[styles.composerText, { color: T.textSecondary }]}
                  numberOfLines={1}
                >
                  {hymn.composer}
                </Text>
              </View>
              <View
                style={[
                  styles.voiceBadge,
                  { backgroundColor: Colors.primary + "18" },
                ]}
              >
                <Text
                  style={[styles.voiceBadgeText, { color: Colors.primary }]}
                >
                  {voicePart.toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Progress */}
            <View style={styles.progressSection}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={duration || 1}
                value={position}
                onSlidingComplete={seekTo}
                minimumTrackTintColor={Colors.secondary}
                maximumTrackTintColor={T.border}
                thumbTintColor={Colors.secondary}
              />
              <View style={styles.timeRow}>
                <Text style={[styles.timeText, { color: T.textSecondary }]}>
                  {formatTime(position)}
                </Text>
                <Text style={[styles.timeText, { color: T.textSecondary }]}>
                  {formatTime(duration)}
                </Text>
              </View>
            </View>

            {/* ── Controls: Shuffle | PrevPart | Back10 | Play | Fwd10 | NextPart | Repeat ── */}
            <View style={styles.controls}>
              {/* Shuffle */}
              <TouchableOpacity style={styles.sideBtn} onPress={toggleShuffle}>
                <Ionicons
                  name="shuffle"
                  size={22}
                  color={shuffleOn ? Colors.secondary : T.textSecondary}
                />
              </TouchableOpacity>

              {/* Prev voice part */}
              <TouchableOpacity
                style={[styles.skipBtn, !canPrev && styles.disabled]}
                onPress={prevPart}
                disabled={!canPrev}
              >
                <Ionicons
                  name="play-skip-back"
                  size={24}
                  color={canPrev ? T.textPrimary : T.textSecondary}
                />
              </TouchableOpacity>

              {/* Back 10s */}
              <TouchableOpacity style={styles.seekBtn} onPress={skipBackward}>
                <Ionicons name="play-back" size={22} color={T.textPrimary} />
                <Text style={[styles.seekLabel, { color: T.textPrimary }]}>
                  10
                </Text>
              </TouchableOpacity>

              {/* Play / Pause */}
              <TouchableOpacity
                style={[styles.playBtn, { backgroundColor: Colors.primary }]}
                onPress={togglePlayPause}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="large" />
                ) : (
                  <Ionicons
                    name={isPlaying ? "pause" : "play"}
                    size={34}
                    color="#fff"
                  />
                )}
              </TouchableOpacity>

              {/* Fwd 10s */}
              <TouchableOpacity style={styles.seekBtn} onPress={skipForward}>
                <Ionicons name="play-forward" size={22} color={T.textPrimary} />
                <Text style={[styles.seekLabel, { color: T.textPrimary }]}>
                  10
                </Text>
              </TouchableOpacity>

              {/* Next voice part */}
              <TouchableOpacity
                style={[styles.skipBtn, !canNext && styles.disabled]}
                onPress={nextPart}
                disabled={!canNext}
              >
                <Ionicons
                  name="play-skip-forward"
                  size={24}
                  color={canNext ? T.textPrimary : T.textSecondary}
                />
              </TouchableOpacity>

              {/* Repeat */}
              <TouchableOpacity style={styles.sideBtn} onPress={toggleRepeat}>
                <Ionicons
                  name="repeat"
                  size={22}
                  color={repeatOn ? Colors.secondary : T.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* Part indicators */}
            {availableParts.length > 1 && (
              <View style={styles.partDots}>
                {availableParts.map((p) => (
                  <View
                    key={p}
                    style={[
                      styles.partDot,
                      {
                        backgroundColor:
                          p === voicePart ? Colors.secondary : T.border,
                        width: p === voicePart ? 18 : 6,
                      },
                    ]}
                  />
                ))}
              </View>
            )}

            {/* Credits */}
            {hymn.credits && Object.keys(hymn.credits).length > 0 && (
              <View style={[styles.creditsBox, { borderColor: T.border }]}>
                <Text
                  style={[styles.creditsHeading, { color: T.textSecondary }]}
                >
                  Credits
                </Text>
                {Object.entries(hymn.credits).map(([role, name], i, arr) => (
                  <View
                    key={role}
                    style={[
                      styles.creditRow,
                      i < arr.length - 1 && {
                        borderBottomWidth: 1,
                        borderBottomColor: T.border,
                      },
                    ]}
                  >
                    <Text
                      style={[styles.creditRole, { color: T.textSecondary }]}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Text>
                    <Text style={[styles.creditName, { color: T.textPrimary }]}>
                      {name as string}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            <View style={{ height: 60 }} />
          </ScrollView>
        )}

        {/* ── LYRICS VIEW ────────────────────────────────────────────── */}
        {activeView === "lyrics" && (
          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.lyricsContent}
            >
              {parsedLyrics.length > 0 ? (
                parsedLyrics.map((block, bi) => (
                  <View key={bi} style={styles.lyricsBlock}>
                    {block.section && (
                      <Text
                        style={[
                          styles.sectionLabel,
                          { color: T.textSecondary },
                        ]}
                      >
                        [{block.section}]
                      </Text>
                    )}
                    {block.lines.map((line, li) =>
                      line === "" ? (
                        <View key={li} style={{ height: 10 }} />
                      ) : (
                        <Text
                          key={li}
                          style={[styles.lyricLine, { color: T.textSecondary }]}
                        >
                          {line}
                        </Text>
                      ),
                    )}
                  </View>
                ))
              ) : (
                <Text style={[styles.noLyrics, { color: T.textSecondary }]}>
                  No lyrics available for this hymn.
                </Text>
              )}
              <View style={{ height: 130 }} />
            </ScrollView>
            <MiniBar />
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // ── Top bar ────────────────────────────────────────────────────────────────
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 52,
    paddingBottom: 12,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
  },
  navBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  togglePill: { flexDirection: "row", borderRadius: 20, padding: 3 },
  toggleOption: { paddingHorizontal: 20, paddingVertical: 7, borderRadius: 17 },
  toggleTxt: { fontSize: FontSizes.sm, fontWeight: "600" },

  // ── Player ─────────────────────────────────────────────────────────────────
  playerScroll: { paddingBottom: 20 },
  artWrapper: { alignItems: "center", paddingVertical: Spacing.xl },
  albumArt: { width: 260, height: 260, borderRadius: 24 },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  songTitle: { fontSize: 22, fontWeight: "800", marginBottom: 4 },
  composerText: { fontSize: FontSizes.sm, fontWeight: "500" },
  voiceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
  },
  voiceBadgeText: { fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },

  // ── Progress ───────────────────────────────────────────────────────────────
  progressSection: { paddingHorizontal: Spacing.md, marginBottom: 4 },
  slider: { width: "100%", height: 36 },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginTop: -4,
  },
  timeText: { fontSize: 12, fontWeight: "500" },

  // ── Controls ───────────────────────────────────────────────────────────────
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  sideBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  skipBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  seekBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  seekLabel: {
    position: "absolute",
    bottom: 2,
    fontSize: 9,
    fontWeight: "800",
  },
  playBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  disabled: { opacity: 0.3 },

  // ── Part dots ──────────────────────────────────────────────────────────────
  partDots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginBottom: Spacing.lg,
  },
  partDot: {
    height: 6,
    borderRadius: 3,
  },

  // ── Credits ────────────────────────────────────────────────────────────────
  creditsBox: {
    marginHorizontal: Spacing.lg,
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    marginTop: 4,
  },
  creditsHeading: {
    fontSize: FontSizes.xs,
    fontWeight: "700",
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  creditRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 11,
    paddingHorizontal: 16,
  },
  creditRole: { fontSize: FontSizes.sm, fontWeight: "600" },
  creditName: { fontSize: FontSizes.sm, fontWeight: "700" },

  // ── Lyrics ─────────────────────────────────────────────────────────────────
  lyricsContent: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl },
  lyricsBlock: { marginBottom: Spacing.xl },
  sectionLabel: {
    fontSize: FontSizes.xs,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  lyricLine: { fontSize: FontSizes.md, lineHeight: 28 },
  noLyrics: { fontSize: FontSizes.md, textAlign: "center", marginTop: 80 },

  // ── Mini bar ───────────────────────────────────────────────────────────────
  miniBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingTop: 14,
    paddingBottom: 36,
    borderTopWidth: 1,
    gap: 12,
  },
  miniThumb: { width: 40, height: 40, borderRadius: 10 },
  miniInfo: { flex: 1, gap: 6 },
  miniTitle: { fontSize: FontSizes.sm, fontWeight: "700" },
  miniTrack: { height: 3, borderRadius: 2, overflow: "hidden" },
  miniFill: { height: "100%", borderRadius: 2 },
  miniBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
});
