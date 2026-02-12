import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
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
import FullScreenPlayer from "../../src/components/player/FullScreenPlayer";
import { useHymn, useHymns } from "../../src/hooks/useHymns";
import { VoicePart } from "../../src/types/hymn.types";

export default function HymnDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const { hymn, loading, error } = useHymn(id as string);
  const [selectedVoicePart, setSelectedVoicePart] =
    useState<VoicePart>("soprano");
  const [showFullPlayer, setShowFullPlayer] = useState(false);

  const relatedFilter = hymn?.tags?.length
    ? { tags: [hymn.tags[0]] }
    : { category: hymn?.category };

  const { hymns: relatedHymns } = useHymns(relatedFilter);
  const relatedSongs = relatedHymns
    .filter((h) => h.id !== hymn?.id)
    .slice(0, 3);

  const theme = {
    background: "#E5E7EB",
    card: "#F3F4F6",
    text: "#111827",
    textSecondary: "#6B7280",
    primary: "#7C3AED",
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </View>
    );
  }

  if (error || !hymn) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || "Hymn not found"}</Text>
        </View>
      </View>
    );
  }

  const voiceParts = [
    { part: "soprano", name: "Soprano" },
    { part: "alto", name: "Alto" },
    { part: "tenor", name: "Tenor" },
    { part: "bass", name: "Bass" },
  ];

  const coverImage =
    hymn.coverImage ||
    `https://via.placeholder.com/300/9B59B6/FFFFFF?text=${hymn.title[0]}`;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* TOP SECTION */}
      <View style={styles.topSection}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>

        <Text style={styles.title}>{hymn.title}</Text>
        <Image source={{ uri: coverImage }} style={styles.coverImage} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* VOICE PARTS */}
        <View style={styles.voiceContainer}>
          <View style={styles.timeline} />

          {voiceParts.map((vp) => {
            const selected = selectedVoicePart === vp.part;

            return (
              <TouchableOpacity
                key={vp.part}
                style={styles.voiceRow}
                onPress={() => {
                  setSelectedVoicePart(vp.part as VoicePart);
                  setShowFullPlayer(true);
                }}
              >
                <View
                  style={[
                    styles.timelineDot,
                    selected && styles.timelineDotActive,
                  ]}
                />

                <View
                  style={[styles.voiceCard, selected && styles.voiceCardActive]}
                >
                  <Image
                    source={{ uri: coverImage }}
                    style={styles.voiceImage}
                  />
                  <View>
                    <Text
                      style={[
                        styles.voiceTitle,
                        selected && styles.voiceTitleActive,
                      ]}
                    >
                      {hymn.title}
                    </Text>
                    <Text
                      style={[
                        styles.voiceSubtitle,
                        selected && styles.voiceSubtitleActive,
                      ]}
                    >
                      {vp.name}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* RELATED SONGS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Related Songs</Text>

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
                      `https://via.placeholder.com/150/9B59B6/FFFFFF?text=${song.title[0]}`,
                  }}
                  style={styles.relatedImage}
                />
                <Text style={styles.relatedTitle} numberOfLines={1}>
                  {song.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FULL PLAYER */}
      <Modal visible={showFullPlayer} animationType="slide">
        <FullScreenPlayer
          hymn={hymn}
          voicePart={selectedVoicePart}
          onClose={() => setShowFullPlayer(false)}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  topSection: {
    height: "30%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  coverImage: {
    width: 160,
    height: 160,
    borderRadius: 20,
  },

  voiceContainer: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 24,
    paddingLeft: 56,
  },
  timeline: {
    position: "absolute",
    left: 28,
    top: 24,
    bottom: 24,
    width: 2,
    backgroundColor: "#D1D5DB",
  },
  timelineDot: {
    position: "absolute",
    left: 20,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#9CA3AF",
  },
  timelineDotActive: {
    backgroundColor: "#7C3AED",
  },
  voiceRow: {
    marginBottom: 20,
  },
  voiceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    padding: 12,
    marginRight: 16,
  },
  voiceCardActive: {
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#7C3AED",
  },
  voiceImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginRight: 12,
  },
  voiceTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  voiceTitleActive: {
    color: "#4C1D95",
  },
  voiceSubtitle: {
    fontSize: 13,
    color: "#6B7280",
  },
  voiceSubtitleActive: {
    color: "#7C3AED",
  },

  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  relatedGrid: {
    flexDirection: "row",
    gap: 12,
  },
  relatedCard: {
    flex: 1,
  },
  relatedImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 6,
  },
  relatedTitle: {
    fontSize: 13,
    fontWeight: "600",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
});
