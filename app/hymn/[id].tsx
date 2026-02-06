// app/hymn/[id].tsx - Single File Hymn Detail (CORRECTED IMPORTS)

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
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
import { FontSizes, Spacing } from "../../src/constants/colors";
import { useHymn } from "../../src/hooks/useHymns";
import { VoicePart } from "../../src/types/hymn.types";
// CORRECTED IMPORTS - from player folder
import AudioPlayer from "../../src/components/player/AudioPlayer";
import VoicePartSelector from "../../src/components/player/VoicePartsSelector";

console.log("📄 HymnDetailScreen file loaded");

export default function HymnDetailScreen() {
  console.log("🚀 HymnDetailScreen component rendering");

  console.log("🚀 HymnDetailScreen component rendering");

  const { id } = useLocalSearchParams(); // ← ONLY ONCE!
  console.log("🆔 Hymn ID from params:", id);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const { hymn, loading, error } = useHymn(id as string);
  const [selectedVoicePart, setSelectedVoicePart] =
    useState<VoicePart>("soprano");
  const [showLyrics, setShowLyrics] = useState(false);
  const [showCredits, setShowCredits] = useState(false);

  const theme = {
    background: isDark ? "#0A0A0A" : "#FFFFFF",
    card: isDark ? "#1A1A1A" : "#F5F5F5",
    text: isDark ? "#FFFFFF" : "#000000",
    textSecondary: isDark ? "#999999" : "#666666",
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9B59B6" />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            Loading hymn...
          </Text>
        </View>
      </View>
    );
  }

  if (error || !hymn) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#FF6B6B" />
          <Text style={styles.errorText}>{error || "Hymn not found"}</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // CREDITS VIEW
  if (showCredits) {
    const VOICE_PART_ICONS: Record<string, { icon: string; color: string }> = {
      soprano: { icon: "woman", color: "#FF6B6B" },
      alto: { icon: "musical-note", color: "#4ECDC4" },
      tenor: { icon: "man", color: "#FFD93D" },
      bass: { icon: "musical-notes", color: "#A78BFA" },
      pianist: { icon: "piano", color: "#9B59B6" },
    };

    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Stack.Screen options={{ headerShown: false }} />

        {/* Credits Header */}
        <View style={[styles.creditsHeader, { backgroundColor: "#9B59B6" }]}>
          <TouchableOpacity
            onPress={() => setShowCredits(false)}
            style={styles.headerButton}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Credits</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Song Info */}
          <View style={styles.songInfo}>
            <Text style={[styles.title, { color: theme.text }]}>
              {hymn.title}
            </Text>
            {hymn.number && (
              <Text style={[styles.songNumber, { color: theme.textSecondary }]}>
                Hymn #{hymn.number}
              </Text>
            )}
          </View>

          {/* Composer */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="create" size={20} color="#9B59B6" />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Composition
              </Text>
            </View>
            <View style={[styles.card, { backgroundColor: theme.card }]}>
              <View style={styles.creditRow}>
                <Text
                  style={[styles.creditLabel, { color: theme.textSecondary }]}
                >
                  Composed by
                </Text>
                <Text style={[styles.creditValue, { color: theme.text }]}>
                  {hymn.composer}
                </Text>
              </View>
              {hymn.yearWritten && (
                <View style={styles.creditRow}>
                  <Text
                    style={[styles.creditLabel, { color: theme.textSecondary }]}
                  >
                    Year Written
                  </Text>
                  <Text style={[styles.creditValue, { color: theme.text }]}>
                    {hymn.yearWritten}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Performers */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="people" size={20} color="#9B59B6" />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Performers
              </Text>
            </View>
            <View style={[styles.card, { backgroundColor: theme.card }]}>
              {Object.entries(hymn.credits).map(([role, name]) => {
                const iconData =
                  VOICE_PART_ICONS[role] || VOICE_PART_ICONS.pianist;
                return (
                  <View key={role} style={styles.performerRow}>
                    <View
                      style={[
                        styles.performerIcon,
                        { backgroundColor: iconData.color + "20" },
                      ]}
                    >
                      <Ionicons
                        name={iconData.icon as any}
                        size={24}
                        color={iconData.color}
                      />
                    </View>
                    <View style={styles.performerInfo}>
                      <Text
                        style={[
                          styles.performerRole,
                          { color: theme.textSecondary },
                        ]}
                      >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </Text>
                      <Text
                        style={[styles.performerName, { color: theme.text }]}
                      >
                        {name}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    );
  }

  // MAIN DETAIL VIEW
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header with Gradient */}
      <LinearGradient
        colors={["#9B59B6", "#7C3AED"]}
        style={styles.headerGradient}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerButton}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="share-outline" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="heart-outline" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.coverContainer}>
          <Image
            source={{
              uri:
                hymn.coverImage ||
                `https://via.placeholder.com/200/9B59B6/FFFFFF?text=${hymn.title[0]}`,
            }}
            style={styles.coverImage}
          />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hymn Info */}
        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: theme.text }]}>
              {hymn.title}
            </Text>
            {hymn.number && (
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>#{hymn.number}</Text>
              </View>
            )}
          </View>

          <Text style={[styles.composer, { color: theme.textSecondary }]}>
            Composed by {hymn.composer}
          </Text>

          {hymn.yearWritten && (
            <Text style={[styles.year, { color: theme.textSecondary }]}>
              {hymn.yearWritten}
            </Text>
          )}

          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Ionicons name="play-circle" size={20} color="#9B59B6" />
              <Text style={[styles.statText, { color: theme.textSecondary }]}>
                {hymn.plays || 0} plays
              </Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="musical-notes" size={20} color="#9B59B6" />
              <Text style={[styles.statText, { color: theme.textSecondary }]}>
                {hymn.category}
              </Text>
            </View>
          </View>

          {/* Tags */}
          {hymn.tags && hymn.tags.length > 0 && (
            <View style={styles.tags}>
              {hymn.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Voice Part Selector */}
        <VoicePartSelector
          selectedPart={selectedVoicePart}
          onSelectPart={setSelectedVoicePart}
        />

        {/* Audio Player */}
        <AudioPlayer hymn={hymn} voicePart={selectedVoicePart} />

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.card }]}
            onPress={() => setShowCredits(true)}
          >
            <Ionicons name="people" size={24} color="#9B59B6" />
            <Text style={[styles.actionButtonText, { color: theme.text }]}>
              View Credits
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.card }]}
            onPress={() => setShowLyrics(!showLyrics)}
          >
            <Ionicons
              name={showLyrics ? "document-text" : "document-text-outline"}
              size={24}
              color="#9B59B6"
            />
            <Text style={[styles.actionButtonText, { color: theme.text }]}>
              {showLyrics ? "Hide" : "Show"} Lyrics
            </Text>
          </TouchableOpacity>
        </View>

        {/* Lyrics */}
        {showLyrics && hymn.lyrics && (
          <View
            style={[styles.lyricsContainer, { backgroundColor: theme.card }]}
          >
            <Text style={[styles.lyricsTitle, { color: theme.text }]}>
              Lyrics
            </Text>
            <Text style={[styles.lyrics, { color: theme.textSecondary }]}>
              {hymn.lyrics}
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header Gradient
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerActions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  coverContainer: {
    alignItems: "center",
  },
  coverImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },

  // Content
  content: {
    flex: 1,
  },
  infoSection: {
    padding: Spacing.lg,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    flex: 1,
  },
  numberBadge: {
    backgroundColor: "rgba(155, 89, 182, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  numberText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#9B59B6",
  },
  composer: {
    fontSize: FontSizes.lg,
    marginBottom: 4,
  },
  year: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.md,
  },
  stats: {
    flexDirection: "row",
    gap: Spacing.lg,
    marginBottom: Spacing.md,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: FontSizes.sm,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: Spacing.sm,
  },
  tag: {
    backgroundColor: "rgba(155, 89, 182, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    color: "#9B59B6",
    fontWeight: "600",
  },

  // Action Buttons
  actionButtons: {
    flexDirection: "row",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: FontSizes.md,
    fontWeight: "600",
  },

  // Lyrics
  lyricsContainer: {
    margin: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: 16,
  },
  lyricsTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    marginBottom: Spacing.md,
  },
  lyrics: {
    fontSize: FontSizes.md,
    lineHeight: 24,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSizes.md,
  },

  // Error
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  errorText: {
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    fontSize: FontSizes.md,
    color: "#FF6B6B",
    textAlign: "center",
  },
  backButton: {
    backgroundColor: "#9B59B6",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#FFF",
    fontWeight: "700",
  },

  // Credits View
  creditsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: Spacing.lg,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
  },
  songInfo: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(155, 89, 182, 0.1)",
  },
  songNumber: {
    fontSize: FontSizes.sm,
    marginTop: 4,
  },
  section: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
    gap: 8,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
  },
  card: {
    borderRadius: 16,
    padding: Spacing.md,
  },
  creditRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  creditLabel: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
  },
  creditValue: {
    fontSize: FontSizes.sm,
    fontWeight: "700",
  },
  performerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
    gap: Spacing.md,
  },
  performerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  performerInfo: {
    flex: 1,
  },
  performerRole: {
    fontSize: 12,
    marginBottom: 2,
  },
  performerName: {
    fontSize: FontSizes.md,
    fontWeight: "700",
  },
});
