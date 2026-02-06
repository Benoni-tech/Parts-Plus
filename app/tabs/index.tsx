// app/(tabs)/index.tsx - FIXED IMPORTS (player folder)

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { FontSizes, Spacing } from "../../src/constants/colors";
import { useAuth } from "../../src/hooks/useAuth";
import {
  useComposers,
  useHymns,
  usePopularHymns,
  useRecentHymns,
  useTags,
} from "../../src/hooks/useHymns";
import { HymnFilter } from "../../src/types/hymn.types";

// CORRECTED IMPORTS - from player folder
import HymnCard from "../../src/components/player/HymnCard";
import TagFilter from "../../src/components/player/TagFilter";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Filter state
  const [filter, setFilter] = useState<HymnFilter>({});

  // Fetch data from Firebase
  const { hymns, loading, error, refresh } = useHymns(filter);
  const { tags, loading: tagsLoading } = useTags();
  const { hymns: popularHymns } = usePopularHymns(5);
  const { hymns: recentHymns } = useRecentHymns(3);
  const { composers } = useComposers();

  // Dynamic theme colors
  const theme = {
    background: isDark ? "#0A0A0A" : "#FFFFFF",
    card: isDark ? "#1A1A1A" : "#F5F5F5",
    text: isDark ? "#FFFFFF" : "#000000",
    textSecondary: isDark ? "#999999" : "#666666",
    border: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    searchBg: isDark ? "rgba(255, 255, 255, 0.1)" : "#F0F0F0",
  };

  const handleTagsChange = (selectedTags: string[]) => {
    setFilter({ ...filter, tags: selectedTags });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refresh} />
      }
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={{
              uri:
                user?.photoURL ||
                "https://via.placeholder.com/50/9B59B6/FFFFFF?text=" +
                  (user?.email?.[0] || "U"),
            }}
            style={styles.profileImage}
          />
          <View style={styles.greetingContainer}>
            <Text style={[styles.greetingText, { color: theme.textSecondary }]}>
              Good {getTimeOfDay()}
            </Text>
            <Text style={[styles.userName, { color: theme.text }]}>
              {getUserName(user?.email)}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={theme.text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/tabs/profile")}
          >
            <Ionicons name="ellipsis-vertical" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <TouchableOpacity
          style={[styles.searchBar, { backgroundColor: theme.searchBg }]}
          onPress={() => {
            console.log("Search pressed");
          }}
        >
          <Ionicons name="search" size={20} color={theme.textSecondary} />
          <Text
            style={[styles.searchPlaceholder, { color: theme.textSecondary }]}
          >
            Search hymns, composers...
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: theme.searchBg }]}
        >
          <Ionicons name="options-outline" size={20} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Tag Filter */}
      {!tagsLoading && tags.length > 0 && (
        <TagFilter
          availableTags={tags}
          selectedTags={filter.tags || []}
          onTagsChange={handleTagsChange}
        />
      )}

      {/* Popular Composers Section */}
      {composers.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Popular Composers
            </Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.artistsScroll}
          >
            {composers.slice(0, 10).map((composer, index) => (
              <TouchableOpacity
                key={index}
                style={styles.artistCard}
                onPress={() => setFilter({ ...filter, searchTerm: composer })}
              >
                <View style={styles.artistImagePlaceholder}>
                  <Text style={styles.artistInitial}>{composer.charAt(0)}</Text>
                </View>
                <Text
                  style={[styles.artistName, { color: theme.text }]}
                  numberOfLines={2}
                >
                  {composer}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Recently Added Section */}
      {recentHymns.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Recently Added
            </Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.hymnsList}>
            {recentHymns.map((hymn) => (
              <HymnCard key={hymn.id} hymn={hymn} />
            ))}
          </View>
        </View>
      )}

      {/* Popular Hymns Section */}
      {popularHymns.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Most Played
            </Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.hymnsList}>
            {popularHymns.map((hymn) => (
              <HymnCard key={hymn.id} hymn={hymn} />
            ))}
          </View>
        </View>
      )}

      {/* All Hymns Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {filter.tags?.length || filter.searchTerm
              ? "Filtered Results"
              : "All Hymns"}
          </Text>
          <Text style={[styles.countText, { color: theme.textSecondary }]}>
            {hymns.length} hymns
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#9B59B6" />
            <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
              Loading hymns...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color="#FF6B6B" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refresh}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : hymns.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="musical-notes-outline" size={64} color="#999" />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No hymns found
            </Text>
            {(filter.tags?.length || filter.searchTerm) && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setFilter({})}
              >
                <Text style={styles.clearButtonText}>Clear Filters</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.hymnsList}>
            {hymns.map((hymn) => (
              <HymnCard key={hymn.id} hymn={hymn} />
            ))}
          </View>
        )}
      </View>

      {/* Made for You Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Discover
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.featuredCard, { backgroundColor: theme.card }]}
        >
          <LinearGradient
            colors={["#A78BFA", "#7C3AED"]}
            style={styles.featuredGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.featuredContent}>
              <Ionicons name="sparkles" size={28} color="#FFF" />
              <View style={styles.featuredTextContainer}>
                <Text style={styles.featuredTitle}>Explore by Category</Text>
                <Text style={styles.featuredSubtitle}>
                  Browse hymns, choruses & more
                </Text>
              </View>
              <TouchableOpacity style={styles.featuredPlayButton}>
                <Ionicons name="arrow-forward" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

// Helper Functions
function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

function getUserName(email?: string | null): string {
  if (!email) return "Guest";
  const name = email.split("@")[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: Spacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: Spacing.md,
  },
  greetingContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: FontSizes.sm,
    marginBottom: 2,
  },
  userName: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
  },
  headerRight: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  iconButton: {
    padding: Spacing.xs,
  },

  // Search Section
  searchSection: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderRadius: 12,
    gap: Spacing.sm,
  },
  searchPlaceholder: {
    fontSize: FontSizes.md,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  // Section Styles
  section: {
    marginTop: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
  },
  seeAllText: {
    fontSize: FontSizes.sm,
    color: "#9B59B6",
    fontWeight: "600",
  },
  countText: {
    fontSize: FontSizes.sm,
  },

  // Popular Composers
  artistsScroll: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  artistCard: {
    alignItems: "center",
    width: 80,
  },
  artistImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#9B59B6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  artistInitial: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFF",
  },
  artistName: {
    fontSize: FontSizes.xs,
    fontWeight: "500",
    textAlign: "center",
  },

  // Hymns List
  hymnsList: {
    paddingHorizontal: Spacing.lg,
  },

  // Loading State
  loadingContainer: {
    padding: Spacing.xl,
    alignItems: "center",
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSizes.md,
  },

  // Error State
  errorContainer: {
    padding: Spacing.xl,
    alignItems: "center",
  },
  errorText: {
    marginTop: Spacing.md,
    fontSize: FontSizes.md,
    color: "#FF6B6B",
    textAlign: "center",
  },
  retryButton: {
    marginTop: Spacing.md,
    backgroundColor: "#9B59B6",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFF",
    fontWeight: "700",
  },

  // Empty State
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    marginTop: Spacing.md,
    fontSize: FontSizes.md,
  },
  clearButton: {
    marginTop: Spacing.md,
    backgroundColor: "#9B59B6",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
  },
  clearButtonText: {
    color: "#FFF",
    fontWeight: "700",
  },

  // Featured Card
  featuredCard: {
    marginHorizontal: Spacing.lg,
    borderRadius: 16,
    overflow: "hidden",
  },
  featuredGradient: {
    padding: Spacing.lg,
  },
  featuredContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  featuredTextContainer: {
    flex: 1,
  },
  featuredTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  featuredSubtitle: {
    fontSize: FontSizes.sm,
    color: "rgba(255, 255, 255, 0.8)",
  },
  featuredPlayButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#C1FF72",
    justifyContent: "center",
    alignItems: "center",
  },

  bottomSpacing: {
    height: Spacing.xl,
  },
});
