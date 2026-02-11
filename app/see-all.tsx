// app/see-all.tsx - SEE ALL PAGE (LIST VIEW)

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from "react-native";
import HymnCard from "../src/components/player/HymnCard";
import { Colors, FontSizes, Spacing } from "../src/constants/colors";
import { useHymns, useRecentHymns } from "../src/hooks/useHymns";

export default function SeeAllScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const section = params.section as string;

  // Determine which data to show
  const { hymns: allHymns, loading: allLoading } = useHymns({});
  const { hymns: recentHymns, loading: recentLoading } = useRecentHymns(50);

  let hymns: any[] = [];
  let loading = false;
  let title = "";

  switch (section) {
    case "recent":
      hymns = recentHymns;
      loading = recentLoading;
      title = "Recently Uploaded";
      break;
    case "played":
      hymns = allHymns
        .filter((h) => h.plays && h.plays > 0)
        .sort((a, b) => (b.plays || 0) - (a.plays || 0));
      loading = allLoading;
      title = "Recently Played";
      break;
    default:
      hymns = allHymns;
      loading = allLoading;
      title = "All Hymns";
  }

  const theme = {
    background: isDark ? "#0A0A0A" : "#FFFFFF",
    card: isDark ? "#1A1A1A" : "#F5F5F5",
    text: isDark ? "#FFFFFF" : "#000000",
    textSecondary: isDark ? "#999999" : "#666666",
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>{title}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : hymns.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="musical-notes-outline"
              size={64}
              color={theme.textSecondary}
            />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No hymns found
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            <Text style={[styles.count, { color: theme.textSecondary }]}>
              {hymns.length} hymns
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
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
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
  listContainer: {
    padding: Spacing.lg,
  },
  count: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.md,
  },
});
