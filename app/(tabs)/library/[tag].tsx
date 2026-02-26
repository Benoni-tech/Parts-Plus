// app/(tabs)/library/[tag].tsx

import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useMemo } from "react";
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
} from "../../../src/constants/colors";
import { usePlayer } from "../../../src/Contexts/PlayerContext";
import { useHymns } from "../../../src/hooks/useHymns";

const capitalise = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

export default function TagHymnsScreen() {
  const { tag } = useLocalSearchParams<{ tag: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const T = isDark ? AuthTheme.dark : AuthTheme.light;
  const { play, hymn: activeHymn, voicePart: activePart } = usePlayer();

  const { hymns, loading } = useHymns({});

  const tagValue = decodeURIComponent(tag ?? "");

  // Filter hymns by tag value — checks both tags array and category string
  const filtered = useMemo(() => {
    return hymns.filter((h) => {
      const inTags = Array.isArray(h.tags)
        ? h.tags.some((t: string) => t.toLowerCase() === tagValue.toLowerCase())
        : false;
      const inCategory =
        typeof h.category === "string" &&
        h.category.toLowerCase() === tagValue.toLowerCase();
      return inTags || inCategory;
    });
  }, [hymns, tagValue]);

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
          <Text style={[styles.heading, { color: T.textPrimary }]}>
            {capitalise(tagValue)}
          </Text>
          <Text style={[styles.subheading, { color: T.textSecondary }]}>
            {filtered.length} hymn{filtered.length !== 1 ? "s" : ""} · All Parts
          </Text>
        </View>
        <View style={styles.navBtn} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.secondary} />
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons
            name="musical-notes-outline"
            size={52}
            color={T.textSecondary}
          />
          <Text style={[styles.emptyTitle, { color: T.textPrimary }]}>
            No hymns found
          </Text>
          <Text style={[styles.emptySubtitle, { color: T.textSecondary }]}>
            No hymns are tagged with "{capitalise(tagValue)}" yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
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
                {isActive ? (
                  <Ionicons
                    name="volume-high"
                    size={18}
                    color={Colors.secondary}
                  />
                ) : (
                  <TouchableOpacity
                    onPress={() => play(item, "soprano")}
                    style={[
                      styles.quickPlay,
                      { backgroundColor: Colors.secondary },
                    ]}
                  >
                    <Ionicons name="play" size={14} color="#fff" />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            );
          }}
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
  quickPlay: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
});
