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

export default function HymnDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const T = isDark ? AuthTheme.dark : AuthTheme.light;

  // ✅ usePlayer now works because PlayerProvider is in _layout.tsx
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

  // A part is "active" if this hymn is the one currently loaded in the player
  const isThisHymnActive = activeHymn?.id === hymn.id;

  return (
    <View style={[styles.container, { backgroundColor: T.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Top section ─────────────────────────────────────────────────── */}
      <View style={[styles.topSection, { backgroundColor: T.bannerBg }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <View
            style={[
              styles.backRect,
              { backgroundColor: T.backRectBg, borderColor: T.backRectBorder },
            ]}
          >
            <Ionicons name="arrow-back" size={20} color={T.backArrow} />
          </View>
        </TouchableOpacity>

        <Text
          style={[styles.topTitle, { color: T.titleColor }]}
          numberOfLines={2}
        >
          {hymn.title}
        </Text>
        {hymn.composer ? (
          <Text style={[styles.topComposer, { color: T.subtitleColor }]}>
            {hymn.composer}
          </Text>
        ) : null}

        <Image source={{ uri: coverImage }} style={styles.coverImage} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Voice parts ─────────────────────────────────────────────── */}
        <View style={[styles.voiceContainer, { backgroundColor: T.cardBg }]}>
          {/* Timeline line */}
          <View style={[styles.timeline, { backgroundColor: T.border }]} />

          {VOICE_PARTS.map((vp) => {
            const isSelected = isThisHymnActive && activePart === vp.part;
            const hasAudio = !!hymn.voiceParts?.[vp.part];

            return (
              <TouchableOpacity
                key={vp.part}
                style={styles.voiceRow}
                onPress={() => {
                  if (hasAudio) {
                    // ✅ Calls global play — stops any existing audio first
                    play(hymn, vp.part);
                  }
                }}
                activeOpacity={hasAudio ? 0.75 : 1}
              >
                {/* Timeline dot */}
                <View
                  style={[
                    styles.timelineDot,
                    {
                      backgroundColor: isSelected ? Colors.secondary : T.border,
                      borderColor: isSelected
                        ? Colors.secondary
                        : T.inputBorder,
                    },
                  ]}
                />

                {/* Card */}
                <View
                  style={[
                    styles.voiceCard,
                    {
                      backgroundColor: isSelected
                        ? isDark
                          ? "rgba(255,163,3,0.10)"
                          : "rgba(255,163,3,0.08)"
                        : T.inputBg,
                      borderColor: isSelected ? Colors.secondary : T.cardBorder,
                    },
                  ]}
                >
                  <Image
                    source={{ uri: coverImage }}
                    style={styles.voiceImage}
                  />

                  <View style={{ flex: 1 }}>
                    <Text style={[styles.voiceTitle, { color: T.inputText }]}>
                      {hymn.title}
                    </Text>
                    <Text
                      style={[
                        styles.voiceSubtitle,
                        { color: isSelected ? Colors.secondary : T.labelColor },
                      ]}
                    >
                      {vp.name}
                    </Text>
                  </View>

                  {/* State indicator */}
                  {isSelected ? (
                    <View
                      style={[
                        styles.playingBadge,
                        { backgroundColor: Colors.secondary },
                      ]}
                    >
                      <Ionicons name="musical-note" size={12} color="#fff" />
                    </View>
                  ) : hasAudio ? (
                    <View
                      style={[
                        styles.playIcon,
                        { backgroundColor: T.inputBorder },
                      ]}
                    >
                      <Ionicons name="play" size={14} color={T.inputIcon} />
                    </View>
                  ) : (
                    <Text
                      style={[
                        styles.unavailableText,
                        { color: T.inputPlaceholder },
                      ]}
                    >
                      Soon
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Related songs ────────────────────────────────────────────── */}
        {relatedSongs.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: T.textPrimary }]}>
              Related Songs
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
                    {song.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Bottom padding — extra space so MiniPlayer doesn't cover content */}
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },

  // ── Top section ───────────────────────────────────────────────────────────
  topSection: {
    paddingTop: 52,
    paddingBottom: 28,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 52,
    left: Spacing.lg,
  },
  backRect: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 4,
    marginTop: 4,
    paddingHorizontal: 48,
  },
  topComposer: {
    fontSize: FontSizes.sm,
    fontWeight: "500",
    marginBottom: 20,
  },
  coverImage: {
    width: 150,
    height: 150,
    borderRadius: BorderRadius.lg,
  },

  // ── Voice parts ────────────────────────────────────────────────────────────
  voiceContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 24,
    paddingLeft: 56,
    paddingRight: Spacing.lg,
    paddingBottom: 8,
    marginTop: -20,
  },
  timeline: {
    position: "absolute",
    left: 28,
    top: 24,
    bottom: 24,
    width: 2,
  },
  timelineDot: {
    position: "absolute",
    left: 20,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    top: 20,
  },
  voiceRow: {
    marginBottom: 16,
  },
  voiceCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: 12,
    gap: 12,
  },
  voiceImage: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.sm,
  },
  voiceTitle: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    marginBottom: 3,
  },
  voiceSubtitle: {
    fontSize: FontSizes.xs,
    fontWeight: "500",
  },
  playingBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  playIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  unavailableText: {
    fontSize: FontSizes.xs,
    fontWeight: "600",
  },

  // ── Related songs ──────────────────────────────────────────────────────────
  section: {
    marginTop: 24,
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    marginBottom: 12,
  },
  relatedGrid: {
    flexDirection: "row",
    gap: 12,
  },
  relatedCard: { flex: 1 },
  relatedImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: BorderRadius.md,
    marginBottom: 6,
  },
  relatedTitle: {
    fontSize: FontSizes.xs,
    fontWeight: "600",
  },
});
