// app/search.tsx - SEARCH RESULTS PAGE

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
} from "react-native";
import HymnCard from "../src/components/player/HymnCard";
import {
    BorderRadius,
    Colors,
    FontSizes,
    Spacing,
} from "../src/constants/colors";
import { useHymns } from "../src/hooks/useHymns";
import { HymnFilter } from "../src/types/hymn.types";

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<HymnFilter>({});

  const { hymns, loading } = useHymns(filter);

  const theme = {
    background: isDark ? "#0A0A0A" : "#FFFFFF",
    card: isDark ? "#1A1A1A" : "#F5F5F5",
    text: isDark ? "#FFFFFF" : "#000000",
    textSecondary: isDark ? "#999999" : "#666666",
  };

  // Handle category filter from params
  useEffect(() => {
    if (params.category) {
      setFilter({ category: params.category as any });
    }
  }, [params.category]);

  const handleSearch = () => {
    setFilter({ ...filter, searchTerm: searchQuery });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Search</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={[styles.searchBar, { backgroundColor: theme.card }]}>
          <Ionicons name="search" size={20} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search hymns, composers..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : hymns.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="search-outline"
              size={64}
              color={theme.textSecondary}
            />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              {searchQuery ? "No results found" : "Search for hymns"}
            </Text>
          </View>
        ) : (
          <View style={styles.resultsList}>
            <Text style={[styles.resultsCount, { color: theme.textSecondary }]}>
              {hymns.length} results
            </Text>
            {hymns.map((hymn) => (
              <HymnCard key={hymn.id} hymn={hymn} variant="list" />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "700",
  },
  searchSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    height: 50,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSizes.md,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    padding: Spacing.xl,
    alignItems: "center",
  },
  emptyContainer: {
    padding: Spacing.xxl,
    alignItems: "center",
  },
  emptyText: {
    marginTop: Spacing.md,
    fontSize: FontSizes.md,
  },
  resultsList: {
    padding: Spacing.lg,
  },
  resultsCount: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.md,
  },
});
