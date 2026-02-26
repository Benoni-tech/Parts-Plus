// app/(tabs)/library.tsx

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
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
} from "../../../src/constants/colors";
import { useAuth } from "../../../src/hooks/useAuth";
import { useHymns } from "../../../src/hooks/useHymns";
import playlistService, {
  Playlist,
} from "../../../src/services/playlistService";

// ─── Constants ────────────────────────────────────────────────────────────────
const capitalise = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

type Tab = "general" | "personal";

// General tag definitions — label shown on card, value used to filter hymns
const GENERAL_TAGS: {
  label: string;
  value: string;
  letter: string;
  colorIndex: number;
}[] = [
  {
    label: "Church Service",
    value: "church service",
    letter: "C",
    colorIndex: 0,
  },
  { label: "Wedding", value: "wedding", letter: "W", colorIndex: 1 },
  { label: "Funeral", value: "funeral", letter: "F", colorIndex: 2 },
  { label: "Trending", value: "trending", letter: "T", colorIndex: 3 },
  { label: "Nostalgic", value: "nostalgic", letter: "N", colorIndex: 4 },
  { label: "Worship", value: "worship", letter: "W", colorIndex: 5 },
  { label: "Praise", value: "praise", letter: "P", colorIndex: 6 },
  { label: "Easter", value: "easter", letter: "E", colorIndex: 7 },
];

// Fixed rotating colour palette — same order every time
const CARD_COLORS = [
  "#7C3AED", // purple
  "#059669", // green
  "#DC2626", // red
  "#D97706", // amber
  "#2563EB", // blue
  "#DB2777", // pink
  "#0891B2", // cyan
  "#65A30D", // lime
];

// ─── Small card component ──────────────────────────────────────────────────────
function GridCard({
  letter,
  label,
  subtitle,
  colorIndex,
  onPress,
  onMore,
}: {
  letter: string;
  label: string;
  subtitle: string;
  colorIndex: number;
  onPress: () => void;
  onMore?: () => void;
}) {
  const bg = CARD_COLORS[colorIndex % CARD_COLORS.length];
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: bg }]}
      onPress={onPress}
      activeOpacity={0.82}
    >
      {/* Top row */}
      <View style={styles.cardTopRow}>
        <View style={styles.cardAvatar}>
          <Text style={styles.cardAvatarLetter}>{letter.toUpperCase()}</Text>
        </View>
        {onMore ? (
          <TouchableOpacity
            onPress={onMore}
            style={styles.cardMoreBtn}
            hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          >
            <Ionicons
              name="ellipsis-horizontal"
              size={16}
              color="rgba(255,255,255,0.8)"
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.cardMoreBtn} />
        )}
      </View>
      {/* Bottom info */}
      <View style={styles.cardBottom}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {label}
        </Text>
        <Text style={styles.cardSubtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function LibraryScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const T = isDark ? AuthTheme.dark : AuthTheme.light;
  const router = useRouter();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [playlistsLoading, setPlaylistsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [creating, setCreating] = useState(false);

  // Load all hymns to get counts per tag
  const { hymns } = useHymns({});

  // Subscribe to personal playlists
  useEffect(() => {
    if (!user?.uid) return;
    const unsub = playlistService.subscribeToPlaylists(user.uid, (data) => {
      setPlaylists(data);
      setPlaylistsLoading(false);
    });
    return () => unsub();
  }, [user?.uid]);

  // Count hymns matching a tag — checks both tags[] array and category string
  const countForTag = (tagValue: string) => {
    return hymns.filter((h) => {
      const inTags = Array.isArray(h.tags)
        ? h.tags.some((t: string) => t.toLowerCase() === tagValue.toLowerCase())
        : false;
      const inCategory =
        typeof h.category === "string" &&
        h.category.toLowerCase() === tagValue.toLowerCase();
      return inTags || inCategory;
    }).length;
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) {
      Alert.alert("Error", "Please enter a playlist name.");
      return;
    }
    if (!user?.uid) return;
    setCreating(true);
    try {
      const id = await playlistService.createPlaylist(
        user.uid,
        newPlaylistName,
      );
      setShowCreateModal(false);
      setNewPlaylistName("");
      router.push(`/(tabs)/library/playlist/${id}` as any);
    } catch (e: any) {
      Alert.alert("Error", e.message || "Could not create playlist.");
    } finally {
      setCreating(false);
    }
  };

  const handleDeletePlaylist = (playlist: Playlist) => {
    Alert.alert(
      "Delete Playlist",
      `Delete "${playlist.name}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => playlistService.deletePlaylist(playlist.id),
        },
      ],
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <View style={[styles.container, { backgroundColor: T.background }]}>
      <StatusBar style={T.statusBar as any} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.heading, { color: T.textPrimary }]}>
          Your Library
        </Text>
        <TouchableOpacity style={styles.searchBtn}>
          <Ionicons name="search-outline" size={22} color={T.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Tab switcher */}
      <View style={[styles.tabRow, { borderBottomColor: T.border }]}>
        {(["general", "personal"] as Tab[]).map((tab) => {
          const active = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={styles.tabBtn}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: active ? Colors.secondary : T.textSecondary,
                    fontWeight: active ? "700" : "500",
                  },
                ]}
              >
                {capitalise(tab)}
              </Text>
              {active && (
                <View
                  style={[
                    styles.tabIndicator,
                    { backgroundColor: Colors.secondary },
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── GENERAL TAB ── */}
      {activeTab === "general" && (
        <FlatList
          data={GENERAL_TAGS}
          keyExtractor={(item) => item.value}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const count = countForTag(item.value);
            return (
              <GridCard
                letter={item.letter}
                label={item.label}
                subtitle={`${count} hymn${count !== 1 ? "s" : ""} · All Parts`}
                colorIndex={item.colorIndex}
                onPress={() =>
                  router.push(
                    `/(tabs)/library/${encodeURIComponent(item.value)}` as any,
                  )
                }
              />
            );
          }}
        />
      )}

      {/* ── PERSONAL TAB ── */}
      {activeTab === "personal" && (
        <>
          {playlistsLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator color={Colors.secondary} />
            </View>
          ) : playlists.length === 0 ? (
            <View style={styles.centered}>
              <Ionicons
                name="musical-notes-outline"
                size={52}
                color={T.textSecondary}
              />
              <Text style={[styles.emptyTitle, { color: T.textPrimary }]}>
                No playlists yet
              </Text>
              <Text style={[styles.emptySubtitle, { color: T.textSecondary }]}>
                Create your first playlist and add hymns to it
              </Text>
            </View>
          ) : (
            <FlatList
              data={playlists}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.gridRow}
              contentContainerStyle={styles.gridContent}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <GridCard
                  letter={item.name.charAt(0)}
                  label={item.name}
                  subtitle={`${item.hymnIds.length} hymn${item.hymnIds.length !== 1 ? "s" : ""} · All Parts`}
                  colorIndex={index}
                  onPress={() =>
                    router.push(`/(tabs)/library/playlist/${item.id}` as any)
                  }
                  onMore={() => handleDeletePlaylist(item)}
                />
              )}
            />
          )}

          {/* Add playlist button */}
          <TouchableOpacity
            style={[styles.addBtn, { borderColor: T.border }]}
            onPress={() => setShowCreateModal(true)}
            activeOpacity={0.75}
          >
            <Ionicons
              name="add-circle-outline"
              size={22}
              color={Colors.secondary}
            />
            <Text style={[styles.addBtnText, { color: Colors.secondary }]}>
              Add Playlist
            </Text>
          </TouchableOpacity>
        </>
      )}

      {/* ── Create playlist modal ── */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: T.cardBg, borderColor: T.cardBorder },
            ]}
          >
            <Text style={[styles.modalTitle, { color: T.titleColor }]}>
              New Playlist
            </Text>
            <Text style={[styles.modalSubtitle, { color: T.subtitleColor }]}>
              Give your playlist a name
            </Text>

            <View
              style={[
                styles.inputWrapper,
                { backgroundColor: T.inputBg, borderColor: T.inputBorder },
              ]}
            >
              <TextInput
                style={[styles.input, { color: T.inputText }]}
                placeholder="e.g. Sunday Morning"
                placeholderTextColor={T.inputPlaceholder}
                value={newPlaylistName}
                onChangeText={setNewPlaylistName}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleCreatePlaylist}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[
                  styles.modalBtnSecondary,
                  { borderColor: T.inputBorder },
                ]}
                onPress={() => {
                  setShowCreateModal(false);
                  setNewPlaylistName("");
                }}
              >
                <Text
                  style={[
                    styles.modalBtnSecondaryText,
                    { color: T.labelColor },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalBtnPrimary,
                  { backgroundColor: T.btnBg, shadowColor: T.shadow },
                  creating && { opacity: 0.6 },
                ]}
                onPress={handleCreatePlaylist}
                disabled={creating}
              >
                {creating ? (
                  <ActivityIndicator color={T.btnText} />
                ) : (
                  <Text
                    style={[styles.modalBtnPrimaryText, { color: T.btnText }]}
                  >
                    Create
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 40,
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingHorizontal: Spacing.lg,
    paddingBottom: 12,
  },
  heading: { fontSize: FontSizes.xxl, fontWeight: "800" },
  searchBtn: {
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
  },

  // ── Tabs ──────────────────────────────────────────────────────────────────
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    marginBottom: Spacing.lg,
  },
  tabBtn: {
    marginRight: Spacing.xl,
    paddingBottom: 10,
    position: "relative",
  },
  tabLabel: { fontSize: FontSizes.md },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 1,
  },

  // ── Grid ──────────────────────────────────────────────────────────────────
  gridContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 180,
    gap: 12,
  },
  gridRow: { gap: 12 },

  // ── Card ──────────────────────────────────────────────────────────────────
  card: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    padding: 14,
    aspectRatio: 1,
    justifyContent: "space-between",
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardAvatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardAvatarLetter: {
    fontSize: FontSizes.md,
    fontWeight: "800",
    color: "#ffffff",
  },
  cardMoreBtn: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  cardBottom: { gap: 2 },
  cardTitle: {
    fontSize: FontSizes.sm,
    fontWeight: "800",
    color: "#ffffff",
    lineHeight: 20,
  },
  cardSubtitle: {
    fontSize: FontSizes.xs,
    fontWeight: "500",
    color: "rgba(255,255,255,0.75)",
  },

  // ── Add playlist button ────────────────────────────────────────────────────
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: Spacing.lg,
    marginBottom: 160,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderStyle: "dashed",
  },
  addBtnText: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
  },

  // ── Create modal ──────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.72)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: 24,
  },
  modalTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "900",
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: FontSizes.sm,
    marginBottom: 20,
  },
  inputWrapper: {
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
  },
  input: { fontSize: FontSizes.sm },
  modalActions: { flexDirection: "row", gap: 10 },
  modalBtnSecondary: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: BorderRadius.lg,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBtnSecondaryText: { fontSize: FontSizes.sm, fontWeight: "600" },
  modalBtnPrimary: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  modalBtnPrimaryText: { fontSize: FontSizes.sm, fontWeight: "700" },

  // ── Empty state ───────────────────────────────────────────────────────────
  emptyTitle: {
    fontSize: FontSizes.md,
    fontWeight: "700",
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: FontSizes.sm,
    textAlign: "center",
    lineHeight: 22,
  },
});
