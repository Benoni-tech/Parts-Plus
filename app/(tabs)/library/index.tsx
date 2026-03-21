// app/(tabs)/library/index.tsx

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
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
} from "../../../src/constants/colors";
import { useAuth } from "../../../src/hooks/useAuth";
import playlistService, {
  Playlist,
} from "../../../src/services/playlistService";

const capitalise = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

// ─── Grid overlay ─────────────────────────────────────────────────────────────
function GridOverlay() {
  const cols = 8;
  const rows = 5;
  return (
    <View style={gridStyles.container} pointerEvents="none">
      {Array.from({ length: cols }).map((_, i) => {
        const progress = i / (cols - 1);
        return (
          <View
            key={`v-${i}`}
            style={[
              gridStyles.line,
              gridStyles.vertical,
              {
                left: `${progress * 100}%` as any,
                opacity: progress * 0.3,
                backgroundColor: "rgba(255,255,255,0.85)",
              },
            ]}
          />
        );
      })}
      {Array.from({ length: rows }).map((_, i) => (
        <View
          key={`h-${i}`}
          style={[
            gridStyles.line,
            gridStyles.horizontal,
            {
              top: `${(i / (rows - 1)) * 100}%` as any,
              opacity: 0.1,
              backgroundColor: "rgba(255,255,255,0.85)",
            },
          ]}
        />
      ))}
    </View>
  );
}

const gridStyles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, overflow: "hidden" },
  line: { position: "absolute" },
  vertical: { top: 0, bottom: 0, width: 1 },
  horizontal: { left: 0, right: 0, height: 1 },
});

// ─── Playlist row ─────────────────────────────────────────────────────────────
function PlaylistRow({
  playlist,
  index,
  onPress,
  onDelete,
  T,
  isDark,
  isLast,
}: {
  playlist: Playlist;
  index: number;
  onPress: () => void;
  onDelete: () => void;
  T: any;
  isDark: boolean;
  isLast: boolean;
}) {
  const dotColor = index % 2 === 0 ? Colors.primary : Colors.secondary;

  return (
    <TouchableOpacity
      style={[
        styles.playlistRow,
        { borderBottomColor: T.border },
        !isLast && { borderBottomWidth: 1 },
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Colour dot */}
      <View style={[styles.playlistDot, { backgroundColor: dotColor }]}>
        <Ionicons name="musical-notes" size={16} color="#fff" />
      </View>

      {/* Info */}
      <View style={styles.playlistInfo}>
        <Text
          style={[styles.playlistName, { color: T.textPrimary }]}
          numberOfLines={1}
        >
          {capitalise(playlist.name)}
        </Text>
        <Text style={[styles.playlistCount, { color: T.textSecondary }]}>
          {playlist.hymnIds.length} hymn
          {playlist.hymnIds.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.rowActions}>
        <TouchableOpacity
          onPress={onDelete}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          style={styles.deleteBtn}
        >
          <Ionicons name="trash-outline" size={17} color={T.textSecondary} />
        </TouchableOpacity>
        <Ionicons name="chevron-forward" size={18} color={T.textSecondary} />
      </View>
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function PlaylistScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const T = isDark ? AuthTheme.dark : AuthTheme.light;
  const router = useRouter();
  const { user, userData } = useAuth();
  const insets = useSafeAreaInsets();

  // First part of username — "Kojo Mensah" → "Kojo"
  const firstName = userData?.username ? userData.username.split(" ")[0] : null;
  const bannerTitle = firstName ? `${firstName}'s Playlists` : "My Playlists";

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    const unsub = playlistService.subscribeToPlaylists(
      user.uid,
      (data) => {
        setPlaylists(data);
        setLoading(false);
      },
      () => setLoading(false),
    );
    return () => unsub();
  }, [user?.uid]);

  const handleCreate = async () => {
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

  const handleDelete = (playlist: Playlist) => {
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

  return (
    <View style={[styles.container, { backgroundColor: T.background }]}>
      <StatusBar style="light" />

      {/* ── Banner ───────────────────────────────────────────────────── */}
      <View
        style={[
          styles.banner,
          { backgroundColor: Colors.primary, paddingTop: insets.top + 16 },
        ]}
      >
        <GridOverlay />
        <View style={styles.bannerInner}>
          <Image
            source={require("../../../assets/images/logo.png")}
            style={styles.bannerLogo}
            resizeMode="contain"
            // @ts-ignore
            tintColor="#ffffff"
          />
          <Text style={styles.bannerTitle}>{bannerTitle}</Text>
          <Text style={styles.bannerSubtitle}>
            {playlists.length > 0
              ? `${playlists.length} playlist${playlists.length !== 1 ? "s" : ""}`
              : "Create your first playlist"}
          </Text>
          <TouchableOpacity
            style={[styles.bannerAddBtn, { backgroundColor: Colors.secondary }]}
            onPress={() => setShowCreateModal(true)}
          >
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── List ─────────────────────────────────────────────────────── */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.secondary} />
        </View>
      ) : playlists.length === 0 ? (
        <View style={styles.centered}>
          <View
            style={[
              styles.emptyIcon,
              { backgroundColor: Colors.primary + "14" },
            ]}
          >
            <Ionicons
              name="musical-notes-outline"
              size={40}
              color={Colors.primary}
            />
          </View>
          <Text style={[styles.emptyTitle, { color: T.textPrimary }]}>
            No playlists yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: T.textSecondary }]}>
            Create your first playlist and add hymns to it
          </Text>
          <TouchableOpacity
            style={[styles.emptyBtn, { backgroundColor: Colors.secondary }]}
            onPress={() => setShowCreateModal(true)}
          >
            <Ionicons
              name="add"
              size={18}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.emptyBtnText}>New Playlist</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={playlists}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 140 },
          ]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <PlaylistRow
              playlist={item}
              index={index}
              isLast={index === playlists.length - 1}
              T={T}
              isDark={isDark}
              onPress={() =>
                router.push(`/(tabs)/library/playlist/${item.id}` as any)
              }
              onDelete={() => handleDelete(item)}
            />
          )}
        />
      )}

      {/* ── Create modal ──────────────────────────────────────────────── */}
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
              {
                backgroundColor: T.cardBg,
                borderColor: T.cardBorder,
                shadowColor: T.shadow,
              },
            ]}
          >
            {/* Banner — solid navy + grid + logo */}
            <View
              style={[styles.modalBanner, { backgroundColor: Colors.primary }]}
            >
              <GridOverlay />
              <View style={styles.modalBannerInner} pointerEvents="none">
                <Image
                  source={require("../../../assets/images/logo.png")}
                  style={styles.modalLogo}
                  resizeMode="contain"
                  // @ts-ignore
                  tintColor="#ffffff"
                />
                <Text style={styles.modalBannerTitle}>New Playlist</Text>
                <Text style={styles.modalBannerSubtitle}>
                  Give your playlist a name
                </Text>
              </View>
            </View>

            {/* Body */}
            <View style={styles.modalBody}>
              <Text style={[styles.fieldLabel, { color: T.labelColor }]}>
                PLAYLIST NAME
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: T.inputBg, borderColor: T.inputBorder },
                ]}
              >
                <Ionicons
                  name="musical-notes-outline"
                  size={18}
                  color={T.inputIcon}
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  style={[styles.input, { color: T.inputText }]}
                  placeholder="e.g. Sunday Morning"
                  placeholderTextColor={T.inputPlaceholder}
                  value={newPlaylistName}
                  onChangeText={setNewPlaylistName}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleCreate}
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
                    {
                      backgroundColor: T.btnBg,
                      shadowColor: T.shadow,
                      flex: 1,
                    },
                    creating && { opacity: 0.6 },
                  ]}
                  onPress={handleCreate}
                  disabled={creating}
                >
                  {creating ? (
                    <ActivityIndicator color={T.btnText} style={{ flex: 1 }} />
                  ) : (
                    <>
                      <Text
                        style={[
                          styles.modalBtnPrimaryText,
                          { color: T.btnText },
                        ]}
                      >
                        Create
                      </Text>
                      <View
                        style={[
                          styles.arrowCircle,
                          { backgroundColor: T.btnArrowBg },
                        ]}
                      >
                        <Ionicons
                          name="arrow-forward"
                          size={16}
                          color={T.btnArrow}
                        />
                      </View>
                    </>
                  )}
                </TouchableOpacity>
              </View>
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
    gap: 14,
    paddingHorizontal: 40,
  },

  // ── Banner ────────────────────────────────────────────────────────────────
  banner: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 32,
    overflow: "hidden",
  },
  bannerInner: {
    alignItems: "center",
    gap: 6,
    zIndex: 2,
  },
  bannerLogo: { width: 120, height: 52, marginBottom: 4 },
  bannerText: {},
  bannerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "900",
    color: Colors.secondary,
    letterSpacing: 0.2,
    textAlign: "center",
  },
  bannerSubtitle: {
    fontSize: FontSizes.xs,
    color: "rgba(255,255,255,0.65)",
    marginTop: 4,
    textAlign: "center",
  },
  bannerAddBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  // ── List ──────────────────────────────────────────────────────────────────
  listContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
  playlistRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 14,
  },
  playlistDot: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  playlistInfo: { flex: 1 },
  playlistName: { fontSize: FontSizes.md, fontWeight: "700", marginBottom: 3 },
  playlistCount: { fontSize: FontSizes.xs, fontWeight: "500" },
  rowActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  deleteBtn: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },

  // ── Empty state ───────────────────────────────────────────────────────────
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
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
  emptyBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
    marginTop: 6,
  },
  emptyBtnText: { color: "#fff", fontSize: FontSizes.sm, fontWeight: "700" },

  // ── Create modal ──────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.72)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 400,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.28,
    shadowRadius: 32,
    elevation: 24,
  },
  modalBanner: {
    height: 140,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBannerInner: {
    alignItems: "center",
    gap: 6,
    zIndex: 2,
  },
  modalLogo: { width: 130, height: 52 },
  modalBannerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "900",
    color: Colors.secondary,
    letterSpacing: 0.2,
  },
  modalBannerSubtitle: {
    fontSize: FontSizes.xs,
    color: "rgba(255,255,255,0.65)",
  },
  modalBody: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 28 },
  fieldLabel: {
    fontSize: FontSizes.xs,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 20,
  },
  input: { flex: 1, fontSize: FontSizes.sm },
  modalActions: { flexDirection: "row", gap: 10 },
  modalBtnSecondary: {
    borderWidth: 1.5,
    borderRadius: BorderRadius.lg,
    paddingVertical: 14,
    paddingHorizontal: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBtnSecondaryText: { fontSize: FontSizes.sm, fontWeight: "600" },
  modalBtnPrimary: {
    borderRadius: BorderRadius.lg,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  modalBtnPrimaryText: { fontSize: FontSizes.sm, fontWeight: "700", flex: 1 },
  arrowCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});
