// app/(tabs)/library/playlist/[id].tsx

import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
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
import {
    AuthTheme,
    BorderRadius,
    Colors,
    FontSizes,
    Spacing,
} from "../../../../src/constants/colors";
import { usePlayer } from "../../../../src/Contexts/PlayerContext";
import { useAuth } from "../../../../src/hooks/useAuth";
import { useHymns } from "../../../../src/hooks/useHymns";
import playlistService, {
    Playlist,
} from "../../../../src/services/playlistService";

const capitalise = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

export default function PlaylistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const T = isDark ? AuthTheme.dark : AuthTheme.light;
  const { user } = useAuth();
  const { play, hymn: activeHymn } = usePlayer();

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { hymns, loading: hymnsLoading } = useHymns({});

  // Subscribe to this specific playlist
  useEffect(() => {
    if (!user?.uid) return;
    const unsub = playlistService.subscribeToPlaylists(user.uid, (all) => {
      const found = all.find((p) => p.id === id);
      if (found) setPlaylist(found);
    });
    return () => unsub();
  }, [user?.uid, id]);

  // Hymns in this playlist
  const playlistHymns = useMemo(() => {
    if (!playlist) return [];
    return hymns.filter((h) => playlist.hymnIds.includes(h.id ?? ""));
  }, [hymns, playlist]);

  // Search results for adding hymns
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return hymns
      .filter(
        (h) =>
          !playlist?.hymnIds.includes(h.id ?? "") &&
          (h.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            h.composer?.toLowerCase().includes(searchQuery.toLowerCase())),
      )
      .slice(0, 20);
  }, [hymns, searchQuery, playlist]);

  const handleAddHymn = async (hymnId: string) => {
    if (!id) return;
    try {
      await playlistService.addHymn(id, hymnId);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  const handleRemoveHymn = (hymnId: string, hymnTitle: string) => {
    Alert.alert(
      "Remove Hymn",
      `Remove "${capitalise(hymnTitle)}" from this playlist?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => playlistService.removeHymn(id!, hymnId),
        },
      ],
    );
  };

  if (!playlist) {
    return (
      <View style={[styles.container, { backgroundColor: T.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.secondary} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: T.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style={T.statusBar as any} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: T.border }]}>
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/library")}
          style={styles.navBtn}
        >
          <Ionicons name="chevron-back" size={26} color={T.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text
            style={[styles.heading, { color: T.textPrimary }]}
            numberOfLines={1}
          >
            {playlist.name}
          </Text>
          <Text style={[styles.subheading, { color: T.textSecondary }]}>
            {playlist.hymnIds.length} hymn
            {playlist.hymnIds.length !== 1 ? "s" : ""} · All Parts
          </Text>
        </View>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => setShowSearch(true)}
        >
          <Ionicons name="add" size={26} color={Colors.secondary} />
        </TouchableOpacity>
      </View>

      {/* Playlist hymns */}
      {playlistHymns.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons
            name="musical-notes-outline"
            size={52}
            color={T.textSecondary}
          />
          <Text style={[styles.emptyTitle, { color: T.textPrimary }]}>
            Playlist is empty
          </Text>
          <Text style={[styles.emptySubtitle, { color: T.textSecondary }]}>
            Tap + to search and add hymns
          </Text>
          <TouchableOpacity
            style={[styles.addFirstBtn, { backgroundColor: Colors.secondary }]}
            onPress={() => setShowSearch(true)}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.addFirstBtnText}>Add Hymns</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={playlistHymns}
          keyExtractor={(item) => item.id ?? item.title}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View style={[styles.separator, { backgroundColor: T.border }]} />
          )}
          renderItem={({ item }) => {
            const isActive = activeHymn?.id === item.id;
            return (
              <TouchableOpacity
                style={styles.hymnRow}
                onPress={() => router.push(`/hymn/${item.id}`)}
                activeOpacity={0.75}
              >
                <Image
                  source={{
                    uri:
                      item.coverImage ||
                      `https://via.placeholder.com/56/${Colors.primary.replace("#", "")}/FFFFFF?text=${item.title[0]}`,
                  }}
                  style={styles.thumb}
                />
                <View style={styles.hymnInfo}>
                  <Text
                    style={[
                      styles.hymnTitle,
                      { color: isActive ? Colors.secondary : T.textPrimary },
                    ]}
                    numberOfLines={1}
                  >
                    {capitalise(item.title)}
                  </Text>
                  {item.composer ? (
                    <Text
                      style={[styles.hymnComposer, { color: T.textSecondary }]}
                      numberOfLines={1}
                    >
                      {capitalise(item.composer)}
                    </Text>
                  ) : null}
                  <Text
                    style={[styles.allParts, { color: T.inputPlaceholder }]}
                  >
                    All Parts
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleRemoveHymn(item.id!, item.title)}
                  style={styles.removeBtn}
                  hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                >
                  <Ionicons
                    name="remove-circle-outline"
                    size={22}
                    color={T.textSecondary}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* Add hymns search modal */}
      <Modal
        visible={showSearch}
        animationType="slide"
        onRequestClose={() => {
          setShowSearch(false);
          setSearchQuery("");
        }}
      >
        <View style={[styles.container, { backgroundColor: T.background }]}>
          {/* Modal header */}
          <View style={[styles.header, { borderBottomColor: T.border }]}>
            <TouchableOpacity
              style={styles.navBtn}
              onPress={() => {
                setShowSearch(false);
                setSearchQuery("");
              }}
            >
              <Ionicons name="close" size={24} color={T.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.heading, { color: T.textPrimary }]}>
              Add Hymns
            </Text>
            <View style={styles.navBtn} />
          </View>

          {/* Search input */}
          <View
            style={[
              styles.searchBar,
              { backgroundColor: T.inputBg, borderColor: T.inputBorder },
            ]}
          >
            <Ionicons
              name="search-outline"
              size={18}
              color={T.inputIcon}
              style={{ marginRight: 8 }}
            />
            <TextInput
              style={[styles.searchInput, { color: T.inputText }]}
              placeholder="Search hymns to add…"
              placeholderTextColor={T.inputPlaceholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
              autoCorrect={false}
              autoCapitalize="none"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={18} color={T.inputIcon} />
              </TouchableOpacity>
            )}
          </View>

          {searchQuery.trim().length === 0 ? (
            <View style={styles.centered}>
              <Ionicons
                name="search-outline"
                size={48}
                color={T.textSecondary}
              />
              <Text style={[styles.emptySubtitle, { color: T.textSecondary }]}>
                Search for a hymn to add to this playlist
              </Text>
            </View>
          ) : searchResults.length === 0 ? (
            <View style={styles.centered}>
              <Text style={[styles.emptySubtitle, { color: T.textSecondary }]}>
                No results — try a different search
              </Text>
            </View>
          ) : (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id ?? item.title}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => (
                <View
                  style={[styles.separator, { backgroundColor: T.border }]}
                />
              )}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.hymnRow}
                  onPress={() => handleAddHymn(item.id!)}
                  activeOpacity={0.75}
                >
                  <Image
                    source={{
                      uri:
                        item.coverImage ||
                        `https://via.placeholder.com/56/${Colors.primary.replace("#", "")}/FFFFFF?text=${item.title[0]}`,
                    }}
                    style={styles.thumb}
                  />
                  <View style={styles.hymnInfo}>
                    <Text
                      style={[styles.hymnTitle, { color: T.textPrimary }]}
                      numberOfLines={1}
                    >
                      {capitalise(item.title)}
                    </Text>
                    {item.composer ? (
                      <Text
                        style={[
                          styles.hymnComposer,
                          { color: T.textSecondary },
                        ]}
                        numberOfLines={1}
                      >
                        {capitalise(item.composer)}
                      </Text>
                    ) : null}
                  </View>
                  <View
                    style={[
                      styles.addChip,
                      { backgroundColor: Colors.secondary },
                    ]}
                  >
                    <Ionicons name="add" size={16} color="#fff" />
                    <Text style={styles.addChipText}>Add</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 56,
    paddingBottom: 14,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
  },
  navBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: { flex: 1, alignItems: "center" },
  heading: { fontSize: FontSizes.lg, fontWeight: "800" },
  subheading: { fontSize: FontSizes.xs, fontWeight: "500", marginTop: 2 },
  listContent: { paddingHorizontal: Spacing.lg, paddingBottom: 180 },
  separator: { height: 1 },
  hymnRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 14,
  },
  thumb: { width: 56, height: 56, borderRadius: BorderRadius.sm },
  hymnInfo: { flex: 1 },
  hymnTitle: { fontSize: FontSizes.sm, fontWeight: "700", marginBottom: 2 },
  hymnComposer: { fontSize: FontSizes.xs, fontWeight: "500", marginBottom: 2 },
  allParts: { fontSize: 10, fontWeight: "500" },
  removeBtn: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  addFirstBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
    marginTop: 8,
  },
  addFirstBtnText: { color: "#fff", fontSize: FontSizes.sm, fontWeight: "700" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    height: 48,
    marginTop: 12,
    marginBottom: Spacing.lg,
  },
  searchInput: { flex: 1, fontSize: FontSizes.sm },
  addChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BorderRadius.md,
  },
  addChipText: { color: "#fff", fontSize: FontSizes.xs, fontWeight: "700" },
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
