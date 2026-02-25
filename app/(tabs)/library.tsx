// app/(tabs)/library.tsx

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
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
} from "../../src/constants/colors";
import { useHymns } from "../../src/hooks/useHymns";

const capitalise = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

type FilterType = "all" | "recent" | "favourites";

const FILTERS: { id: FilterType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "recent", label: "Recently Played" },
  { id: "favourites", label: "Favourites" },
];

export default function LibraryScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const T = isDark ? AuthTheme.dark : AuthTheme.light;
  const router = useRouter();

  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const { hymns, loading } = useHymns({});

  // Favourites and recent are placeholders until you wire up
  // persistent storage — for now "all" shows everything,
  // the other filters show empty state with a helpful message.
  const listData = activeFilter === "all" ? hymns : [];

  const EmptyState = () => (
    <View style={styles.centered}>
      <Ionicons
        name={activeFilter === "favourites" ? "heart-outline" : "time-outline"}
        size={48}
        color={T.textSecondary}
      />
      <Text style={[styles.emptyTitle, { color: T.textPrimary }]}>
        {activeFilter === "favourites"
          ? "No favourites yet"
          : "Nothing here yet"}
      </Text>
      <Text style={[styles.emptySubtitle, { color: T.textSecondary }]}>
        {activeFilter === "favourites"
          ? "Tap the heart on any hymn to save it here"
          : "Hymns you play will appear here"}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: T.background }]}>
      <StatusBar style={T.statusBar} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.heading, { color: T.textPrimary }]}>
          Your Library
        </Text>
        <TouchableOpacity style={styles.sortBtn}>
          <Ionicons name="options-outline" size={22} color={T.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Filter chips */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => {
          const active = activeFilter === f.id;
          return (
            <TouchableOpacity
              key={f.id}
              style={[
                styles.filterChip,
                {
                  backgroundColor: active
                    ? Colors.secondary
                    : isDark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.06)",
                  borderColor: active ? Colors.secondary : "transparent",
                },
              ]}
              onPress={() => setActiveFilter(f.id)}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.filterLabel,
                  { color: active ? "#fff" : T.textSecondary },
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.secondary} />
        </View>
      ) : listData.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={listData}
          keyExtractor={(item) => item.id ?? item.title}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View style={[styles.separator, { backgroundColor: T.border }]} />
          )}
          renderItem={({ item }) => (
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
                  style={[styles.hymnTitle, { color: T.textPrimary }]}
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
                {item.category ? (
                  <View
                    style={[
                      styles.categoryPill,
                      { backgroundColor: Colors.primary + "14" },
                    ]}
                  >
                    <Text
                      style={[styles.categoryText, { color: Colors.primary }]}
                    >
                      {capitalise(item.category)}
                    </Text>
                  </View>
                ) : null}
              </View>
              <TouchableOpacity style={styles.moreBtn}>
                <Ionicons
                  name="ellipsis-vertical"
                  size={18}
                  color={T.textSecondary}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
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
    paddingBottom: 16,
  },
  heading: { fontSize: FontSizes.xxl, fontWeight: "800" },
  sortBtn: {
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
  },

  // ── Filter chips ──────────────────────────────────────────────────────────
  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterLabel: { fontSize: FontSizes.xs, fontWeight: "600" },

  // ── List ──────────────────────────────────────────────────────────────────
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
  hymnComposer: { fontSize: FontSizes.xs, fontWeight: "500", marginBottom: 4 },
  categoryPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  categoryText: { fontSize: 10, fontWeight: "700", letterSpacing: 0.3 },
  moreBtn: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },

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
