// app/hymn/[id].tsx

import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
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
} from "../../src/constants/colors";
import { usePlayer } from "../../src/Contexts/PlayerContext";
import { useHymn, useHymns } from "../../src/hooks/useHymns";
import { VoicePart } from "../../src/types/hymn.types";

const VOICE_PARTS: { part: VoicePart; name: string }[] = [
  { part: "soprano", name: "Soprano" },
  { part: "alto", name: "Alto" },
  { part: "tenor", name: "Tenor" },
  { part: "bass", name: "Bass" },
];

const capitalise = (str: string) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : str;

export default function HymnDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const T = isDark ? AuthTheme.dark : AuthTheme.light;

  const { play, voicePart: activePart, hymn: activeHymn } = usePlayer();
  const { hymn, loading, error } = useHymn(id as string);

  const relatedFilter = hymn?.tags?.length
    ? { tags: [hymn.tags[0]] }
    : { category: hymn?.category };
  const { hymns: relatedHymns } = useHymns(relatedFilter);
  const relatedSongs = relatedHymns
    .filter((h) => h.id !== hymn?.id)
    .slice(0, 3);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: T.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.secondary} />
        </View>
      </View>
    );
  }

  if (error || !hymn) {
    return (
      <View style={[styles.container, { backgroundColor: T.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.centered}>
          <Text style={{ color: Colors.error, fontSize: FontSizes.md }}>
            {error || "Hymn not found"}
          </Text>
        </View>
      </View>
    );
  }

  const coverImage =
    hymn.coverImage ||
    `https://via.placeholder.com/300/${Colors.primary.replace("#", "")}/FFFFFF?text=${hymn.title[0]}`;

  const isThisHymnActive = activeHymn?.id === hymn.id;

  return (
    <View style={[styles.container, { backgroundColor: T.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <View style={[styles.topBar, { borderBottomColor: T.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <Ionicons name="chevron-down" size={26} color={T.textPrimary} />
        </TouchableOpacity>
        <View style={styles.topBarCenter}>
          <Text style={[styles.topBarLabel, { color: T.textSecondary }]}>
            Now Playing
          </Text>
          <Text
            style={[styles.topBarTitle, { color: T.textPrimary }]}
            numberOfLines={1}
          >
            {capitalise(hymn.title)}
          </Text>
        </View>
        <TouchableOpacity style={styles.navBtn}>
          <Ionicons name="heart-outline" size={22} color={T.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* ── Album art ─────────────────────────────────────────────────── */}
        <View style={styles.artWrapper}>
          <Image source={{ uri: coverImage }} style={styles.albumArt} />
        </View>

        {/* ── Song info ─────────────────────────────────────────────────── */}
        <View style={styles.infoRow}>
          <View style={{ flex: 1 }}>
            <Text
              style={[styles.songTitle, { color: T.textPrimary }]}
              numberOfLines={2}
            >
              {capitalise(hymn.title)}
            </Text>
            {hymn.composer ? (
              <Text style={[styles.composerText, { color: T.textSecondary }]}>
                {capitalise(hymn.composer)}
              </Text>
            ) : null}
          </View>
          {hymn.category ? (
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: Colors.primary + "18" },
              ]}
            >
              <Text style={[styles.categoryText, { color: Colors.primary }]}>
                {capitalise(hymn.category)}
              </Text>
            </View>
          ) : null}
        </View>

        {/* ── Voice parts ───────────────────────────────────────────────── */}
        <View style={styles.partsSection}>
          <Text style={[styles.partsHeading, { color: T.textSecondary }]}>
            SELECT A PART
          </Text>

          <View
            style={[
              styles.partsCard,
              { backgroundColor: T.cardBg, borderColor: T.border },
            ]}
          >
            {/* Timeline line */}
            <View style={[styles.timeline, { backgroundColor: T.border }]} />

            {VOICE_PARTS.map((vp, index) => {
              const isSelected = isThisHymnActive && activePart === vp.part;
              const hasAudio = !!hymn.voiceParts?.[vp.part];
              const isLast = index === VOICE_PARTS.length - 1;

              return (
                <View key={vp.part}>
                  <TouchableOpacity
                    style={styles.voiceRow}
                    onPress={() => {
                      if (hasAudio) play(hymn, vp.part);
                    }}
                    activeOpacity={hasAudio ? 0.75 : 1}
                  >
                    {/* Timeline dot */}
                    <View
                      style={[
                        styles.timelineDot,
                        {
                          backgroundColor: isSelected
                            ? Colors.secondary
                            : T.background,
                          borderColor: isSelected ? Colors.secondary : T.border,
                        },
                      ]}
                    />

                    {/* Row content */}
                    <View style={styles.voiceContent}>
                      <View
                        style={[
                          styles.voiceIconWrap,
                          {
                            backgroundColor: isSelected
                              ? "rgba(255,163,3,0.12)"
                              : isDark
                                ? "rgba(255,255,255,0.06)"
                                : "rgba(0,0,0,0.05)",
                          },
                        ]}
                      >
                        <Ionicons
                          name={
                            isSelected
                              ? "musical-note"
                              : "musical-notes-outline"
                          }
                          size={18}
                          color={isSelected ? Colors.secondary : T.inputIcon}
                        />
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text
                          style={[styles.voiceName, { color: T.textPrimary }]}
                        >
                          {vp.name}
                        </Text>
                        {isSelected && (
                          <Text
                            style={[
                              styles.nowPlayingTag,
                              { color: Colors.secondary },
                            ]}
                          >
                            Now playing
                          </Text>
                        )}
                      </View>

                      {isSelected ? (
                        <View
                          style={[
                            styles.activePill,
                            { backgroundColor: Colors.secondary },
                          ]}
                        >
                          <Ionicons name="volume-high" size={13} color="#fff" />
                        </View>
                      ) : hasAudio ? (
                        <View
                          style={[styles.playPill, { borderColor: T.border }]}
                        >
                          <Ionicons name="play" size={13} color={T.inputIcon} />
                        </View>
                      ) : (
                        <Text
                          style={[
                            styles.soonText,
                            { color: T.inputPlaceholder },
                          ]}
                        >
                          Soon
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>

                  {!isLast && (
                    <View
                      style={[styles.rowDivider, { backgroundColor: T.border }]}
                    />
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* ── Related songs ─────────────────────────────────────────────── */}
        {relatedSongs.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={[styles.partsHeading, { color: T.textSecondary }]}>
              RELATED
            </Text>
            <View style={styles.relatedGrid}>
              {relatedSongs.map((song) => (
                <TouchableOpacity
                  key={song.id}
                  style={styles.relatedCard}
                  onPress={() => router.push(`/hymn/${song.id}`)}
                >
                  <Image
                    source={{
                      uri:
                        song.coverImage ||
                        `https://via.placeholder.com/150/${Colors.primary.replace("#", "")}/FFFFFF?text=${song.title[0]}`,
                    }}
                    style={styles.relatedImage}
                  />
                  <Text
                    style={[styles.relatedTitle, { color: T.textPrimary }]}
                    numberOfLines={1}
                  >
                    {capitalise(song.title)}
                  </Text>
                  {song.composer ? (
                    <Text
                      style={[
                        styles.relatedComposer,
                        { color: T.textSecondary },
                      ]}
                      numberOfLines={1}
                    >
                      {capitalise(song.composer)}
                    </Text>
                  ) : null}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Space for MiniPlayer + tab bar */}
        <View style={{ height: 160 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },

  // ── Top bar ───────────────────────────────────────────────────────────────
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
  topBarCenter: { flex: 1, alignItems: "center" },
  topBarLabel: {
    fontSize: FontSizes.xs,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  topBarTitle: { fontSize: FontSizes.sm, fontWeight: "700" },

  // ── Art ───────────────────────────────────────────────────────────────────
  artWrapper: { alignItems: "center", paddingVertical: Spacing.xl },
  albumArt: { width: 220, height: 220, borderRadius: BorderRadius.lg },

  // ── Info ──────────────────────────────────────────────────────────────────
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  songTitle: { fontSize: FontSizes.xl, fontWeight: "800", marginBottom: 4 },
  composerText: { fontSize: FontSizes.sm, fontWeight: "500" },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
  },
  categoryText: { fontSize: 11, fontWeight: "800", letterSpacing: 0.4 },

  // ── Parts ─────────────────────────────────────────────────────────────────
  partsSection: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.xl },
  partsHeading: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  partsCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: "hidden",
    paddingLeft: 44,
  },
  timeline: {
    position: "absolute",
    left: 20,
    top: 28,
    bottom: 28,
    width: 2,
  },
  timelineDot: {
    position: "absolute",
    left: -31,
    top: 18,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  voiceRow: { paddingVertical: 14, paddingRight: 16 },
  voiceContent: { flexDirection: "row", alignItems: "center", gap: 12 },
  voiceIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  voiceName: { fontSize: FontSizes.sm, fontWeight: "600", marginBottom: 2 },
  nowPlayingTag: { fontSize: FontSizes.xs, fontWeight: "500" },
  activePill: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  playPill: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  soonText: { fontSize: FontSizes.xs, fontWeight: "600" },
  rowDivider: { height: 1, marginLeft: 0 },

  // ── Related ───────────────────────────────────────────────────────────────
  relatedSection: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.xl },
  relatedGrid: { flexDirection: "row", gap: 12 },
  relatedCard: { flex: 1 },
  relatedImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: BorderRadius.md,
    marginBottom: 6,
  },
  relatedTitle: { fontSize: FontSizes.xs, fontWeight: "700" },
  relatedComposer: { fontSize: 10, fontWeight: "500", marginTop: 1 },
});
