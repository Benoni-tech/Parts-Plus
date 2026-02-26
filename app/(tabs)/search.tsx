// app/(tabs)/search.tsx

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
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
} from "../../src/constants/colors";
import { useHymns } from "../../src/hooks/useHymns";

const capitalise = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

// ─── Filter chips ─────────────────────────────────────────────────────────────
const FILTERS = [
  { id: "all", label: "All" },
  { id: "hymns", label: "Hymns" },
  { id: "chorus", label: "Chorus" },
  { id: "spiritual", label: "Spiritual" },
  { id: "soprano", label: "Soprano" },
  { id: "alto", label: "Alto" },
  { id: "tenor", label: "Tenor" },
  { id: "bass", label: "Bass" },
];

const MAX_RECENT = 6;

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const T = isDark ? AuthTheme.dark : AuthTheme.light;
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);

  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const { hymns, loading } = useHymns({});

  // ── Filtered results ───────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    let results = hymns.filter(
      (h) =>
        h.title?.toLowerCase().includes(q) ||
        h.composer?.toLowerCase().includes(q) ||
        h.category?.toLowerCase().includes(q) ||
        h.tags?.some((t: string) => t.toLowerCase().includes(q)),
    );

    if (activeFilter !== "all") {
      const isVoicePart = ["soprano", "alto", "tenor", "bass"].includes(
        activeFilter,
      );
      if (isVoicePart) {
        results = results.filter(
          (h) => !!(h.voiceParts as any)?.[activeFilter],
        );
      } else {
        results = results.filter(
          (h) =>
            h.category?.toLowerCase() === activeFilter ||
            h.tags?.some((t: string) => t.toLowerCase() === activeFilter),
        );
      }
    }

    return results;
  }, [hymns, query, activeFilter]);

  const topResult = filtered[0] ?? null;
  const otherResults = filtered.slice(1);
  const isTyping = query.trim().length > 0;

  // ── Recent searches ────────────────────────────────────────────────────────
  const addToRecent = useCallback((term: string) => {
    if (!term.trim()) return;
    setRecentSearches((prev) => {
      const without = prev.filter((r) => r !== term);
      return [term, ...without].slice(0, MAX_RECENT);
    });
  }, []);

  const handleResultPress = (item: any) => {
    addToRecent(query.trim());
    router.push(`/hymn/${item.id}`);
  };

  const handleRecentTap = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  // ── Top Result card ────────────────────────────────────────────────────────
  const TopResultCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.topCard,
        { backgroundColor: T.cardBg, borderColor: T.border },
      ]}
      onPress={() => handleResultPress(item)}
      activeOpacity={0.82}
    >
      <Image
        source={{
          uri:
            item.coverImage ||
            `https://via.placeholder.com/100/${Colors.primary.replace("#", "")}/FFFFFF?text=${item.title[0]}`,
        }}
        style={styles.topCardImage}
      />
      <View style={styles.topCardMeta}>
        <Text
          style={[styles.topCardTitle, { color: T.textPrimary }]}
          numberOfLines={2}
        >
          {capitalise(item.title)}
        </Text>
        <Text
          style={[styles.topCardSub, { color: T.textSecondary }]}
          numberOfLines={1}
        >
          {[
            item.category && capitalise(item.category),
            item.composer && capitalise(item.composer),
          ]
            .filter(Boolean)
            .join(" · ")}
        </Text>

        {/* Badge row */}
        <View style={styles.badgeRow}>
          {item.voiceParts && Object.keys(item.voiceParts).length > 0 && (
            <View
              style={[styles.badge, { backgroundColor: Colors.primary + "22" }]}
            >
              <Text style={[styles.badgeText, { color: Colors.primary }]}>
                {Object.keys(item.voiceParts)
                  .map((p) => p.toUpperCase().slice(0, 1))
                  .join(" · ")}
              </Text>
            </View>
          )}
          <View style={[styles.badge, { backgroundColor: Colors.secondary }]}>
            <Text style={[styles.badgeText, { color: "#fff" }]}>ADVANCED</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <View style={[styles.container, { backgroundColor: T.background }]}>
      <StatusBar style={T.statusBar as any} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.heading, { color: T.textPrimary }]}>Search</Text>
      </View>

      {/* Search bar */}
      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: T.inputBg,
            borderColor: isFocused ? Colors.secondary : T.inputBorder,
          },
        ]}
      >
        <Ionicons
          name="search-outline"
          size={18}
          color={isFocused ? Colors.secondary : T.inputIcon}
          style={{ marginRight: 8 }}
        />
        <TextInput
          ref={inputRef}
          style={[styles.searchInput, { color: T.inputText }]}
          placeholder="Songs, artists, or voices"
          placeholderTextColor={T.inputPlaceholder}
          value={query}
          onChangeText={setQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onSubmitEditing={() => {
            if (query.trim()) addToRecent(query.trim());
          }}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity
            onPress={() => setQuery("")}
            hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          >
            <Ionicons name="close-circle" size={18} color={T.inputIcon} />
          </TouchableOpacity>
        )}
      </View>

      {/* Horizontal filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
        style={{ flexGrow: 0, marginBottom: 4 }}
      >
        {FILTERS.map((f) => {
          const active = activeFilter === f.id;
          return (
            <TouchableOpacity
              key={f.id}
              style={[
                styles.chip,
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
                  styles.chipText,
                  { color: active ? "#fff" : T.textSecondary },
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Body states ── */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.secondary} />
        </View>
      ) : !isTyping ? (
        /* Idle — recent searches */
        <FlatList
          data={recentSearches}
          keyExtractor={(item) => item}
          contentContainerStyle={[
            styles.listContent,
            recentSearches.length === 0 && { flex: 1 },
          ]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            recentSearches.length > 0 ? (
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: T.textPrimary }]}>
                  Recent Searches
                </Text>
                <TouchableOpacity onPress={() => setRecentSearches([])}>
                  <Text style={[styles.clearAll, { color: Colors.secondary }]}>
                    Clear all
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Ionicons
                name="musical-notes-outline"
                size={48}
                color={T.textSecondary}
              />
              <Text style={[styles.emptyText, { color: T.textSecondary }]}>
                Search for hymns, composers or voices
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.recentRow, { borderBottomColor: T.border }]}
              onPress={() => handleRecentTap(item)}
              activeOpacity={0.75}
            >
              <Ionicons
                name="time-outline"
                size={18}
                color={T.textSecondary}
                style={{ marginRight: 12 }}
              />
              <Text
                style={[styles.recentText, { color: T.textPrimary }]}
                numberOfLines={1}
              >
                {item}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setRecentSearches((p) => p.filter((r) => r !== item))
                }
                hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                style={{ marginLeft: "auto" }}
              >
                <Ionicons name="close" size={16} color={T.textSecondary} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      ) : filtered.length === 0 ? (
        /* No results */
        <View style={styles.centered}>
          <Ionicons name="search-outline" size={48} color={T.textSecondary} />
          <Text style={[styles.emptyText, { color: T.textSecondary }]}>
            No results for "{query}"
          </Text>
        </View>
      ) : (
        /* Results — top card + list */
        <FlatList
          data={otherResults}
          keyExtractor={(item) => item.id ?? item.title}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              {topResult && (
                <View style={{ marginBottom: Spacing.lg }}>
                  <Text style={[styles.sectionTitle, { color: T.textPrimary }]}>
                    Top Result
                  </Text>
                  <TopResultCard item={topResult} />
                </View>
              )}
              {otherResults.length > 0 && (
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: T.textPrimary, marginBottom: 0 },
                  ]}
                >
                  Songs
                </Text>
              )}
            </>
          }
          ItemSeparatorComponent={() => (
            <View style={[styles.separator, { backgroundColor: T.border }]} />
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultRow}
              onPress={() => handleResultPress(item)}
              activeOpacity={0.75}
            >
              <Image
                source={{
                  uri:
                    item.coverImage ||
                    `https://via.placeholder.com/50/${Colors.primary.replace("#", "")}/FFFFFF?text=${item.title[0]}`,
                }}
                style={styles.resultThumb}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[styles.resultTitle, { color: T.textPrimary }]}
                  numberOfLines={1}
                >
                  {capitalise(item.title)}
                </Text>
                <Text
                  style={[styles.resultSub, { color: T.textSecondary }]}
                  numberOfLines={1}
                >
                  {[
                    item.composer && capitalise(item.composer),
                    item.category && capitalise(item.category),
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={T.textSecondary}
              />
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

  header: {
    paddingTop: 60,
    paddingHorizontal: Spacing.lg,
    paddingBottom: 12,
  },
  heading: { fontSize: FontSizes.xxl, fontWeight: "800" },

  // ── Search bar ────────────────────────────────────────────────────────────
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: FontSizes.sm },

  // ── Filter chips ──────────────────────────────────────────────────────────
  chipsRow: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 14,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: { fontSize: FontSizes.xs, fontWeight: "600" },

  // ── Section ───────────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: FontSizes.sm,
    fontWeight: "800",
    letterSpacing: 0.3,
    marginBottom: 14,
  },
  clearAll: { fontSize: FontSizes.xs, fontWeight: "600" },

  // ── Top result card ────────────────────────────────────────────────────────
  topCard: {
    flexDirection: "row",
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: 16,
    gap: 14,
    alignItems: "flex-start",
  },
  topCardImage: {
    width: 90,
    height: 90,
    borderRadius: BorderRadius.md,
  },
  topCardMeta: { flex: 1, paddingTop: 2 },
  topCardTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "800",
    marginBottom: 4,
    lineHeight: 24,
  },
  topCardSub: { fontSize: FontSizes.sm, fontWeight: "500", marginBottom: 10 },
  badgeRow: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },

  // ── Results list ──────────────────────────────────────────────────────────
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 180,
    paddingTop: Spacing.md,
  },
  separator: { height: 1 },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  resultThumb: { width: 50, height: 50, borderRadius: BorderRadius.sm },
  resultTitle: { fontSize: FontSizes.sm, fontWeight: "700", marginBottom: 2 },
  resultSub: { fontSize: FontSizes.xs, fontWeight: "500" },

  // ── Recent searches ────────────────────────────────────────────────────────
  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  recentText: { fontSize: FontSizes.sm, fontWeight: "500", flex: 1 },

  // ── Empty ─────────────────────────────────────────────────────────────────
  emptyText: { fontSize: FontSizes.sm, textAlign: "center", lineHeight: 22 },
});
