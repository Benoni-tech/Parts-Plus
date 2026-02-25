// app/(tabs)/search.tsx

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

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const T = isDark ? AuthTheme.dark : AuthTheme.light;
  const router = useRouter();

  const [query, setQuery] = useState("");
  const { hymns, loading } = useHymns({});

  const filtered =
    query.trim().length > 0
      ? hymns.filter(
          (h) =>
            h.title?.toLowerCase().includes(query.toLowerCase()) ||
            h.composer?.toLowerCase().includes(query.toLowerCase()) ||
            h.category?.toLowerCase().includes(query.toLowerCase()),
        )
      : [];

  return (
    <View style={[styles.container, { backgroundColor: T.background }]}>
      <StatusBar style={T.statusBar} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.heading, { color: T.textPrimary }]}>Search</Text>
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
          placeholder="Hymns, composers, categories…"
          placeholderTextColor={T.inputPlaceholder}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Ionicons name="close-circle" size={18} color={T.inputIcon} />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.secondary} />
        </View>
      ) : query.trim().length === 0 ? (
        <View style={styles.centered}>
          <Ionicons
            name="musical-notes-outline"
            size={48}
            color={T.textSecondary}
          />
          <Text style={[styles.emptyText, { color: T.textSecondary }]}>
            Search for hymns, composers or categories
          </Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="search-outline" size={48} color={T.textSecondary} />
          <Text style={[styles.emptyText, { color: T.textSecondary }]}>
            No results for "{query}"
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id ?? item.title}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.resultRow, { borderBottomColor: T.border }]}
              onPress={() => router.push(`/hymn/${item.id}`)}
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
                {item.composer ? (
                  <Text
                    style={[styles.resultSub, { color: T.textSecondary }]}
                    numberOfLines={1}
                  >
                    {capitalise(item.composer)}
                  </Text>
                ) : null}
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
  header: { paddingTop: 60, paddingHorizontal: Spacing.lg, paddingBottom: 16 },
  heading: { fontSize: FontSizes.xxl, fontWeight: "800" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: Spacing.lg,
  },
  searchInput: { flex: 1, fontSize: FontSizes.sm },
  listContent: { paddingBottom: 160 },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  resultThumb: { width: 50, height: 50, borderRadius: BorderRadius.sm },
  resultTitle: { fontSize: FontSizes.sm, fontWeight: "700", marginBottom: 2 },
  resultSub: { fontSize: FontSizes.xs, fontWeight: "500" },
  emptyText: { fontSize: FontSizes.sm, textAlign: "center", lineHeight: 22 },
});
