// app/hymn/[id].tsx - SPOTIFY STYLE

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

  // Get related songs based on tags
  const relatedFilter = hymn?.tags?.length
    ? { tags: [hymn.tags[0]] }
    : { category: hymn?.category };
  const { hymns: relatedHymns } = useHymns(relatedFilter);
  const relatedSongs = relatedHymns
    .filter((h) => h.id !== hymn?.id)
    .slice(0, 4);

  const theme = {
    background: isDark ? "#121212" : "#FFFFFF",
    card: isDark ? "#1E1E1E" : "#F5F5F5",
    text: isDark ? "#FFFFFF" : "#000000",
    textSecondary: isDark ? "#B3B3B3" : "#666666",
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9B59B6" />
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

  const voiceParts = [
    {
      part: "soprano",
      name: "Soprano",
      singer: hymn.credits.soprano,
      icon: "woman",
      color: "#FF6B6B",
    },
    {
      part: "alto",
      name: "Alto",
      singer: hymn.credits.alto,
      icon: "musical-note",
      color: "#4ECDC4",
    },
    {
      part: "tenor",
      name: "Tenor",
      singer: hymn.credits.tenor,
      icon: "man",
      color: "#FFD93D",
    },
    {
      part: "bass",
      name: "Bass",
      singer: hymn.credits.bass,
      icon: "musical-notes",
      color: "#A78BFA",
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header with Cover Image Background */}
      <View style={styles.header}>
        {/* Blurred Background */}
        <Image
          source={{
            uri:
              hymn.coverImage ||
              `https://via.placeholder.com/400/9B59B6/FFFFFF?text=${hymn.title[0]}`,
          }}
          style={styles.headerBackground}
          blurRadius={50}
        />
        <View style={styles.headerOverlay} />

        {/* Header Buttons */}
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.iconButton}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Cover Image */}
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

        {/* Title and Badge */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{hymn.title}</Text>
          {hymn.number && (
            <View style={styles.numberBadge}>
              <Text style={styles.badgeText}>#{hymn.number}</Text>
            </View>
          )}
        </View>

        {/* Description */}
        <Text style={styles.description}>
          Composed by {hymn.composer} • {hymn.yearWritten || "Traditional"}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Harmony Parts Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Harmony Parts
          </Text>

          {voiceParts.map((vp, index) => (
            <TouchableOpacity
              key={vp.part}
              style={[styles.partRow, { borderBottomColor: theme.card }]}
              onPress={() => {
                setSelectedVoicePart(vp.part as VoicePart);
                setShowFullPlayer(true);
              }}
            >
              <View style={styles.partLeft}>
                {/* Part Icon */}
                <View
                  style={[
                    styles.partIcon,
                    { backgroundColor: vp.color + "20" },
                  ]}
                >
                  <Ionicons name={vp.icon as any} size={24} color={vp.color} />
                </View>

                {/* Part Info */}
                <View style={styles.partInfo}>
                  <Text style={[styles.partName, { color: theme.text }]}>
                    {vp.name}
                  </Text>
                  <Text
                    style={[styles.partCredit, { color: theme.textSecondary }]}
                  >
                    Credit: {vp.singer}
                  </Text>
                </View>
              </View>

              {/* More Button */}
              <TouchableOpacity>
                <Ionicons
                  name="ellipsis-horizontal"
                  size={20}
                  color={theme.textSecondary}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* Related Songs Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Related Songs
            </Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {relatedSongs.length > 0 ? (
            relatedSongs.map((song, index) => (
              <View key={song.id} style={styles.relatedSongRow}>
                <View style={styles.relatedLeft}>
                  <Text
                    style={[
                      styles.relatedNumber,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {index + 1}
                  </Text>
                  <Image
                    source={{
                      uri:
                        song.coverImage ||
                        `https://via.placeholder.com/50/9B59B6/FFFFFF?text=${song.title[0]}`,
                    }}
                    style={styles.relatedCover}
                  />
                  <View style={styles.relatedInfo}>
                    <Text
                      style={[styles.relatedTitle, { color: theme.text }]}
                      numberOfLines={1}
                    >
                      {song.title}
                    </Text>
                    <Text
                      style={[
                        styles.relatedComposer,
                        { color: theme.textSecondary },
                      ]}
                      numberOfLines={1}
                    >
                      {song.composer}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => router.push(`/hymn/${song.id}`)}
                >
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={[styles.noRelated, { color: theme.textSecondary }]}>
              No related songs found
            </Text>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Full Screen Player Modal */}
      <Modal
        visible={showFullPlayer}
        animationType="slide"
        presentationStyle="fullScreen"
      >
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
  container: {
    flex: 1,
  },

  // Header with Cover
  header: {
    height: 400,
    position: "relative",
  },
  headerBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  headerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  coverContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  coverImage: {
    width: 180,
    height: 180,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingHorizontal: 20,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFF",
    textAlign: "center",
  },
  numberBadge: {
    backgroundColor: "#9B59B6",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFF",
  },
  description: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 20,
  },

  // Content
  content: {
    flex: 1,
  },

  // Section
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  viewAll: {
    fontSize: 14,
    color: "#9B59B6",
    fontWeight: "600",
  },

  // Harmony Parts
  partRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  partLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  partIcon: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  partInfo: {
    flex: 1,
  },
  partName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  partCredit: {
    fontSize: 13,
  },

  // Related Songs
  relatedSongRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  relatedLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  relatedNumber: {
    fontSize: 16,
    fontWeight: "600",
    width: 20,
  },
  relatedCover: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  relatedInfo: {
    flex: 1,
  },
  relatedTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  relatedComposer: {
    fontSize: 13,
  },
  noRelated: {
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 20,
  },

  // Loading & Error
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#FF6B6B",
    textAlign: "center",
  },
  backButton: {
    marginTop: 20,
    backgroundColor: "#9B59B6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#FFF",
    fontWeight: "700",
  },
});
