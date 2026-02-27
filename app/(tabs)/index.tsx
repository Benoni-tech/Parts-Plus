// app/(tabs)/index.tsx

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
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
  useColorScheme,
} from "react-native";
import {
  AuthTheme,
  BorderRadius,
  Colors,
  FontSizes,
  Spacing,
} from "../../src/constants/colors";
import { usePlayer } from "../../src/Contexts/PlayerContext";
import { useAuth } from "../../src/hooks/useAuth";
import {
  useHymns,
  usePopularHymns,
  useRecentHymns,
} from "../../src/hooks/useHymns";

const { width } = Dimensions.get("window");
const BANNER_WIDTH = width - Spacing.lg * 2;

const capitalise = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

export default function HomeScreen() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const T = isDark ? AuthTheme.dark : AuthTheme.light;
  const { play } = usePlayer();

  const [activeSlide, setActiveSlide] = useState(0);
  const bannerRef = useRef<FlatList>(null);

  const { hymns: allHymns, loading, refresh } = useHymns({});
  const { hymns: featuredHymns } = usePopularHymns(3);
  const { hymns: recentHymns } = useRecentHymns(10);

  // Trending Chorus — category or tag matches chorus, sorted by plays
  const trendingChorus = allHymns
    .filter(
      (h) =>
        h.category?.toLowerCase().includes("chorus") ||
        (h.tags as string[] | undefined)?.some(
          (t) => t.toLowerCase() === "chorus",
        ),
    )
    .sort((a, b) => (b.plays || 0) - (a.plays || 0))
    .slice(0, 10);

  // Made For You — top by play count
  const madeForYou = [...allHymns]
    .sort((a, b) => (b.plays || 0) - (a.plays || 0))
    .slice(0, 10);

  const displayName =
    userData?.username || user?.email?.split("@")[0] || "Guest";
  const profileInitial = displayName.charAt(0).toUpperCase();

  return (
    <View style={[styles.root, { backgroundColor: T.background }]}>
      <StatusBar style={T.statusBar as any} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            tintColor={Colors.secondary}
          />
        }
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        {/* ── Header ──────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/profile" as any)}
            >
              {userData?.photoURL ? (
                <Image
                  source={{ uri: userData.photoURL }}
                  style={styles.avatar}
                />
              ) : (
                <View
                  style={[
                    styles.avatarPlaceholder,
                    { backgroundColor: Colors.secondary },
                  ]}
                >
                  <Text style={styles.avatarInitial}>{profileInitial}</Text>
                </View>
              )}
            </TouchableOpacity>
            <View style={{ marginLeft: Spacing.md }}>
              <Text style={[styles.greeting, { color: T.textSecondary }]}>
                Hello, {capitalise(displayName)}
              </Text>
              <Text style={[styles.subGreeting, { color: T.textSecondary }]}>
                What would you like to do today?
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.notifBtn,
              { backgroundColor: T.inputBg, borderColor: T.border },
            ]}
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color={T.textPrimary}
            />
          </TouchableOpacity>
        </View>

        {/* ── Featured Today banner ────────────────────────────────────── */}
        {featuredHymns.length > 0 && (
          <View style={styles.bannerSection}>
            <FlatList
              ref={bannerRef}
              data={featuredHymns}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                setActiveSlide(
                  Math.round(e.nativeEvent.contentOffset.x / BANNER_WIDTH),
                );
              }}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.bannerSlide}>
                  <Image
                    source={{
                      uri:
                        item.coverImage ||
                        `https://via.placeholder.com/400/${Colors.primary.replace("#", "")}/FFFFFF?text=${item.title[0]}`,
                    }}
                    style={styles.bannerImage}
                    blurRadius={15}
                  />
                  <View style={styles.bannerOverlay} />
                  <View style={styles.bannerContent}>
                    {/* Featured Today label */}
                    <View style={styles.featuredBadge}>
                      <Text style={styles.featuredBadgeText}>
                        Featured Today
                      </Text>
                    </View>
                    <Text style={styles.bannerTitle} numberOfLines={2}>
                      {capitalise(item.title)}
                    </Text>
                    <Text style={styles.bannerDescription} numberOfLines={1}>
                      {[item.composer, item.category]
                        .filter(Boolean)
                        .map(capitalise)
                        .join(" · ")}
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.playButton,
                        { backgroundColor: Colors.secondary },
                      ]}
                      onPress={() => play(item, "soprano")}
                    >
                      <Ionicons name="play" size={14} color="#fff" />
                      <Text style={styles.playButtonText}>Play</Text>
                    </TouchableOpacity>
                  </View>
                  {/* Dots */}
                  <View style={styles.dotsContainer}>
                    {featuredHymns.map((_, index) => (
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
            />
          </View>
        )}

        {/* ── Recently Uploaded ────────────────────────────────────────── */}
        {recentHymns.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: T.textPrimary }]}>
              Recently Uploaded
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hScroll}
            >
              {recentHymns.map((hymn) => (
                <TouchableOpacity
                  key={hymn.id}
                  style={styles.squareCard}
                  onPress={() => router.push(`/hymn/${hymn.id}` as any)}
                  activeOpacity={0.82}
                >
                  <Image
                    source={{
                      uri:
                        hymn.coverImage ||
                        `https://via.placeholder.com/160/${Colors.primary.replace("#", "")}/FFFFFF?text=${hymn.title[0]}`,
                    }}
                    style={styles.squareCardImage}
                  />
                  {hymn.category && (
                    <View
                      style={[
                        styles.squareBadge,
                        { backgroundColor: Colors.secondary },
                      ]}
                    >
                      <Text style={styles.squareBadgeText}>
                        {capitalise(hymn.category)}
                      </Text>
                    </View>
                  )}
                  <Text
                    style={[styles.squareCardTitle, { color: T.textPrimary }]}
                    numberOfLines={1}
                  >
                    {capitalise(hymn.title)}
                  </Text>
                  <Text
                    style={[styles.squareCardSub, { color: T.textSecondary }]}
                    numberOfLines={1}
                  >
                    {capitalise(hymn.composer || "")}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* ── Trending Chorus — list style ─────────────────────────────── */}
        {trendingChorus.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: T.textPrimary }]}>
              Trending Chorus
            </Text>
            <View
              style={[
                styles.listCard,
                { backgroundColor: T.cardBg, borderColor: T.border },
              ]}
            >
              {trendingChorus.map((hymn, index) => (
                <View key={hymn.id}>
                  <TouchableOpacity
                    style={styles.listRow}
                    onPress={() => router.push(`/hymn/${hymn.id}` as any)}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.listRank, { color: T.textSecondary }]}>
                      {String(index + 1).padStart(2, "0")}
                    </Text>
                    <Image
                      source={{
                        uri:
                          hymn.coverImage ||
                          `https://via.placeholder.com/48/${Colors.primary.replace("#", "")}/FFFFFF?text=${hymn.title[0]}`,
                      }}
                      style={styles.listThumb}
                    />
                    <View style={styles.listInfo}>
                      <Text
                        style={[styles.listTitle, { color: T.textPrimary }]}
                        numberOfLines={1}
                      >
                        {capitalise(hymn.title)}
                      </Text>
                      <Text
                        style={[styles.listSub, { color: T.textSecondary }]}
                        numberOfLines={1}
                      >
                        {capitalise(hymn.composer || "")}
                        {hymn.plays ? ` · ${hymn.plays} plays` : ""}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => play(hymn, "soprano")}
                      style={[
                        styles.listPlayBtn,
                        { backgroundColor: Colors.secondary + "20" },
                      ]}
                    >
                      <Ionicons
                        name="play"
                        size={14}
                        color={Colors.secondary}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                  {index < trendingChorus.length - 1 && (
                    <View
                      style={[
                        styles.listDivider,
                        { backgroundColor: T.border },
                      ]}
                    />
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── Made For You — cover image cards ────────────────────────── */}
        {madeForYou.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: T.textPrimary }]}>
              Made For You
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hScroll}
            >
              {madeForYou.map((hymn) => (
                <TouchableOpacity
                  key={hymn.id}
                  style={styles.squareCard}
                  onPress={() => router.push(`/hymn/${hymn.id}` as any)}
                  activeOpacity={0.82}
                >
                  <Image
                    source={{
                      uri:
                        hymn.coverImage ||
                        `https://via.placeholder.com/160/${Colors.primary.replace("#", "")}/FFFFFF?text=${hymn.title[0]}`,
                    }}
                    style={styles.squareCardImage}
                  />
                  {hymn.category && (
                    <View
                      style={[
                        styles.squareBadge,
                        { backgroundColor: Colors.primary + "cc" },
                      ]}
                    >
                      <Text style={styles.squareBadgeText}>
                        {capitalise(hymn.category)}
                      </Text>
                    </View>
                  )}
                  <Text
                    style={[styles.squareCardTitle, { color: T.textPrimary }]}
                    numberOfLines={1}
                  >
                    {capitalise(hymn.title)}
                  </Text>
                  <Text
                    style={[styles.squareCardSub, { color: T.textSecondary }]}
                    numberOfLines={1}
                  >
                    {capitalise(hymn.composer || "")}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: Spacing.md,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: { fontSize: 20, fontWeight: "700", color: "#fff" },
  greeting: { fontSize: FontSizes.lg, fontWeight: "700", marginBottom: 2 },
  subGreeting: { fontSize: FontSizes.sm },
  notifBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },

  // ── Banner ────────────────────────────────────────────────────────────────
  bannerSection: { marginBottom: Spacing.lg },
  bannerSlide: {
    width: BANNER_WIDTH,
    height: 200,
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
    backgroundColor: "rgba(0,0,0,0.52)",
  },
  bannerContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: Spacing.lg,
    gap: 4,
  },
  featuredBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
  },
  featuredBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "800",
    color: "#fff",
    lineHeight: 26,
  },
  bannerDescription: {
    fontSize: FontSizes.sm,
    color: "rgba(255,255,255,0.8)",
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    marginTop: 6,
  },
  playButtonText: {
    fontSize: FontSizes.md,
    fontWeight: "700",
    color: "#fff",
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
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  dotActive: {
    backgroundColor: Colors.secondary,
    width: 18,
  },

  // ── Section ───────────────────────────────────────────────────────────────
  section: { marginBottom: Spacing.xl },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "800",
    marginBottom: 14,
    paddingHorizontal: Spacing.lg,
  },
  hScroll: { paddingHorizontal: Spacing.lg, gap: 12 },

  // ── Square cards (Recently Uploaded & Made For You) ───────────────────────
  squareCard: { width: 148 },
  squareCardImage: {
    width: 148,
    height: 148,
    borderRadius: BorderRadius.md,
    marginBottom: 8,
    backgroundColor: "#e5e7eb",
  },
  squareBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  squareBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.3,
  },
  squareCardTitle: {
    fontSize: FontSizes.sm,
    fontWeight: "700",
    marginBottom: 2,
  },
  squareCardSub: { fontSize: FontSizes.xs, fontWeight: "500" },

  // ── Trending Chorus list ───────────────────────────────────────────────────
  listCard: {
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  listRank: {
    width: 22,
    fontSize: FontSizes.xs,
    fontWeight: "800",
    textAlign: "center",
  },
  listThumb: { width: 46, height: 46, borderRadius: BorderRadius.sm },
  listInfo: { flex: 1 },
  listTitle: { fontSize: FontSizes.sm, fontWeight: "700", marginBottom: 2 },
  listSub: { fontSize: FontSizes.xs, fontWeight: "500" },
  listPlayBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  listDivider: { height: 1, marginLeft: 16 + 22 + 12 + 46 + 12 },
});
