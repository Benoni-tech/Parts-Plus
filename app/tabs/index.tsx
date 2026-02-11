// app/tabs/index.tsx - FINAL FIXED VERSION

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme
} from "react-native";
import {
  BorderRadius,
  FontSizes,
  Spacing
} from "../../src/constants/colors";
import { useAuth } from "../../src/hooks/useAuth";
import {
  useHymns,
  usePopularHymns,
  useRecentHymns,
} from "../../src/hooks/useHymns";

const { width } = Dimensions.get("window");
const BANNER_WIDTH = width - Spacing.lg * 2;

export default function HomeScreen() {
  const { user, userData } = useAuth(); // Now userData exists!
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [activeSlide, setActiveSlide] = useState(0);
  const bannerScrollRef = useRef<FlatList>(null);

  // Fetch data
  const { hymns: allHymns, loading, refresh } = useHymns({});
  const { hymns: popularHymns } = usePopularHymns(3);
  const { hymns: recentHymns } = useRecentHymns(10);

  // Get recently played
  const recentlyPlayed = allHymns
    .filter((h) => h.plays && h.plays > 0)
    .sort((a, b) => (b.plays || 0) - (a.plays || 0))
    .slice(0, 10);

  const theme = {
    background: isDark ? "#0A0A0A" : "#FFFFFF",
    card: isDark ? "#1A1A1A" : "#F5F5F5",
    text: isDark ? "#FFFFFF" : "#000000",
    textSecondary: isDark ? "#999999" : "#666666",
  };

  // Get display name (username from Firestore or fallback)
  const displayName =
    userData?.username || user?.email?.split("@")[0] || "Guest";
  const profileInitial = displayName.charAt(0).toUpperCase();

  const categories = [
    { id: "hymn", name: "Hymns", icon: "musical-notes" },
    { id: "chorus", name: "Choruses", icon: "mic" },
    { id: "spiritual", name: "Spiritual Songs", icon: "heart" },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* Profile Picture */}
          <View style={styles.profilePic}>
            {userData?.photoURL ? (
              <Image
                source={{ uri: userData.photoURL }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Text style={styles.profileInitial}>{profileInitial}</Text>
              </View>
            )}
          </View>

          {/* Greeting */}
          <View style={styles.greetingContainer}>
            <Text style={[styles.greeting, { color: theme.text }]}>
              Hello, {displayName}
            </Text>
            <Text style={[styles.subGreeting, { color: theme.textSecondary }]}>
              What would you like to do today?
            </Text>
          </View>
        </View>

        {/* Notification Bell */}
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <TouchableOpacity
          style={[styles.searchBar, { backgroundColor: theme.card }]}
          onPress={() => router.push("/search" as any)}
        >
          <Ionicons name="search" size={20} color={theme.textSecondary} />
          <Text
            style={[styles.searchPlaceholder, { color: theme.textSecondary }]}
          >
            Search hymns, composers...
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Popular Banner */}
      {popularHymns.length > 0 && (
        <View style={styles.bannerSection}>
          <FlatList
            ref={bannerScrollRef}
            data={popularHymns}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const slideIndex = Math.round(
                e.nativeEvent.contentOffset.x / BANNER_WIDTH,
              );
              setActiveSlide(slideIndex);
            }}
            renderItem={({ item }) => (
              <View style={styles.bannerSlide}>
                <Image
                  source={{
                    uri:
                      item.coverImage ||
                      `https://via.placeholder.com/400/14213D/FFFFFF?text=${item.title[0]}`,
                  }}
                  style={styles.bannerImage}
                  blurRadius={15}
                />
                <View style={styles.bannerOverlay} />
                <View style={styles.bannerContent}>
                  <Text style={styles.bannerTitle}>{item.title}</Text>
                  <Text style={styles.bannerDescription}>
                    {item.composer} • {item.category}
                  </Text>
                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={() => router.push(`/hymn/${item.id}` as any)}
                  >
                    <Text style={styles.playButtonText}>Play</Text>
                  </TouchableOpacity>
                </View>
                {/* Dots */}
                <View style={styles.dotsContainer}>
                  {popularHymns.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.dot,
                        index === activeSlide && styles.dotActive,
                      ]}
                    />
                  ))}
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}

      {/* Categories */}
      <View style={styles.categoriesSection}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryCard}
            onPress={() =>
              router.push(`/search?category=${category.id}` as any)
            }
          >
            <View style={styles.categoryIconContainer}>
              <Ionicons name={category.icon as any} size={24} color="#FCA311" />
            </View>
            <Text style={[styles.categoryName, { color: theme.text }]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recently Uploaded */}
      {recentHymns.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Recently Uploaded
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/see-all?section=recent" as any)}
            >
              <Text style={styles.seeAllText}>See All →</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {recentHymns.slice(0, 10).map((hymn) => (
              <TouchableOpacity
                key={hymn.id}
                style={styles.hymnCard}
                onPress={() => router.push(`/hymn/${hymn.id}` as any)}
              >
                <Image
                  source={{
                    uri:
                      hymn.coverImage ||
                      `https://via.placeholder.com/160/14213D/FFFFFF?text=${hymn.title[0]}`,
                  }}
                  style={styles.hymnCardImage}
                />
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{hymn.category}</Text>
                </View>
                <View style={styles.hymnCardInfo}>
                  <Text
                    style={[styles.hymnCardTitle, { color: theme.text }]}
                    numberOfLines={1}
                  >
                    {hymn.title}
                  </Text>
                  <Text
                    style={[
                      styles.hymnCardMeta,
                      { color: theme.textSecondary },
                    ]}
                    numberOfLines={1}
                  >
                    {hymn.composer}
                  </Text>
                  {hymn.lyricist && (
                    <Text
                      style={[
                        styles.hymnCardMeta,
                        { color: theme.textSecondary },
                      ]}
                      numberOfLines={1}
                    >
                      {hymn.lyricist}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Recently Played */}
      {recentlyPlayed.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Recently Played
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/see-all?section=played" as any)}
            >
              <Text style={styles.seeAllText}>See All →</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {recentlyPlayed.map((hymn) => (
              <TouchableOpacity
                key={hymn.id}
                style={styles.hymnCard}
                onPress={() => router.push(`/hymn/${hymn.id}` as any)}
              >
                <Image
                  source={{
                    uri:
                      hymn.coverImage ||
                      `https://via.placeholder.com/160/14213D/FFFFFF?text=${hymn.title[0]}`,
                  }}
                  style={styles.hymnCardImage}
                />
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{hymn.category}</Text>
                </View>
                <View style={styles.hymnCardInfo}>
                  <Text
                    style={[styles.hymnCardTitle, { color: theme.text }]}
                    numberOfLines={1}
                  >
                    {hymn.title}
                  </Text>
                  <Text
                    style={[
                      styles.hymnCardMeta,
                      { color: theme.textSecondary },
                    ]}
                    numberOfLines={1}
                  >
                    {hymn.composer}
                  </Text>
                  {hymn.lyricist && (
                    <Text
                      style={[
                        styles.hymnCardMeta,
                        { color: theme.textSecondary },
                      ]}
                      numberOfLines={1}
                    >
                      {hymn.lyricist}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  profilePic: {
    marginRight: Spacing.md,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profilePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FCA311",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitial: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  greetingContainer: { flex: 1 },
  greeting: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    marginBottom: 2,
  },
  subGreeting: {
    fontSize: FontSizes.sm,
  },
  notificationButton: {
    padding: Spacing.xs,
  },
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
    height: 50,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  searchPlaceholder: {
    fontSize: FontSizes.md,
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.md,
    backgroundColor: "#FCA311",
    justifyContent: "center",
    alignItems: "center",
  },
  bannerSection: {
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  bannerSlide: {
    width: BANNER_WIDTH,
    height: 180,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    position: "relative",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  bannerContent: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
  },
  bannerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: Spacing.xs,
  },
  bannerDescription: {
    fontSize: FontSizes.sm,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: Spacing.md,
  },
  playButton: {
    alignSelf: "flex-start",
    backgroundColor: "#FCA311",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  playButtonText: {
    fontSize: FontSizes.md,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: Spacing.md,
    left: 0,
    right: 0,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  dotActive: {
    backgroundColor: "#FCA311",
    width: 24,
  },
  categoriesSection: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: "#E5E5E5",
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: "center",
  },
  categoryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(252, 163, 17, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  categoryName: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    textAlign: "center",
  },
  section: {
    marginBottom: Spacing.lg,
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
    color: "#FCA311",
    fontWeight: "600",
  },
  horizontalScroll: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  hymnCard: {
    width: 160,
    position: "relative",
  },
  hymnCardImage: {
    width: 160,
    height: 160,
    borderRadius: BorderRadius.md,
    backgroundColor: "#E5E5E5",
  },
  categoryBadge: {
    position: "absolute",
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: "#FCA311",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  hymnCardInfo: {
    marginTop: Spacing.sm,
  },
  hymnCardTitle: {
    fontSize: FontSizes.md,
    fontWeight: "700",
    marginBottom: 2,
  },
  hymnCardMeta: {
    fontSize: FontSizes.xs,
  },
});
