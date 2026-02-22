// app/auth/verification-success.tsx

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInUp, ZoomIn } from "react-native-reanimated";
import {
  AuthTheme,
  BorderRadius,
  Colors,
  FontSizes,
} from "../../src/constants/colors";

// ─── Grid overlay ─────────────────────────────────────────────────────────────
function GridOverlay({ isDark }: { isDark: boolean }) {
  const cols = 8;
  const rows = 5;
  const lineColor = isDark ? "#ffffff" : "rgba(255,255,255,0.85)";

  return (
    <View style={gridStyles.container} pointerEvents="none">
      {Array.from({ length: cols }).map((_, i) => {
        const progress = i / (cols - 1);
        return (
          <View
            key={`v-${i}`}
            style={[
              gridStyles.line,
              gridStyles.vertical,
              {
                left: `${progress * 100}%` as any,
                opacity: isDark ? progress * 0.95 : progress * 0.6,
                backgroundColor: lineColor,
              },
            ]}
          />
        );
      })}
      {Array.from({ length: rows }).map((_, i) => (
        <View
          key={`h-${i}`}
          style={[
            gridStyles.line,
            gridStyles.horizontal,
            {
              top: `${(i / (rows - 1)) * 100}%` as any,
              opacity: isDark ? 0.3 : 0.22,
              backgroundColor: lineColor,
            },
          ]}
        />
      ))}
    </View>
  );
}

const gridStyles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, overflow: "hidden" },
  line: { position: "absolute" },
  vertical: { top: 0, bottom: 0, width: 1 },
  horizontal: { left: 0, right: 0, height: 1 },
});

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function VerificationSuccessScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const T = isDark ? AuthTheme.dark : AuthTheme.light;

  return (
    <View style={[styles.mainBackground, { backgroundColor: T.mainBg }]}>
      <StatusBar style={T.statusBar} />

      <ScrollView
        contentContainerStyle={styles.outerScroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Animated.View
          entering={FadeIn.duration(500)}
          style={[
            styles.card,
            {
              backgroundColor: T.cardBg,
              borderColor: T.cardBorder,
              shadowColor: T.shadow,
            },
          ]}
        >
          {/* ── Top banner ───────────────────────────────────────────── */}
          <View style={[styles.topBanner, { backgroundColor: T.bannerBg }]}>
            <View style={styles.bannerLeft}>
              <Animated.View
                entering={ZoomIn.duration(500).delay(200)}
                style={styles.bannerIconRow}
              >
                <View
                  style={[
                    styles.successIconCircle,
                    { backgroundColor: `${Colors.success}22` },
                  ]}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={44}
                    color={Colors.success}
                  />
                </View>
              </Animated.View>

              <View style={styles.bannerTextBlock}>
                <Animated.Text
                  entering={FadeInUp.duration(500).delay(300)}
                  style={[styles.bannerTitle, { color: T.titleColor }]}
                >
                  Email Verified!
                </Animated.Text>
                <Animated.Text
                  entering={FadeInUp.duration(500).delay(400)}
                  style={[styles.bannerSubtitle, { color: T.subtitleColor }]}
                >
                  Your account is ready to go
                </Animated.Text>
              </View>
            </View>

            <View style={styles.bannerRight}>
              <GridOverlay isDark={isDark} />
            </View>
          </View>

          {/* ── Body ─────────────────────────────────────────────────── */}
          <View style={styles.body}>
            <Animated.Text
              entering={FadeInUp.duration(500).delay(450)}
              style={[styles.message, { color: T.labelColor }]}
            >
              Your email has been successfully verified. You can now access all
              features and start streaming.
            </Animated.Text>

            {/* Detail rows */}
            <Animated.View
              entering={FadeInUp.duration(500).delay(550)}
              style={[
                styles.detailsContainer,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(0,0,0,0.03)",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.10)"
                    : "rgba(0,0,0,0.07)",
                },
              ]}
            >
              <View style={styles.detailRow}>
                <View
                  style={[
                    styles.detailIconWrap,
                    { backgroundColor: `${Colors.success}18` },
                  ]}
                >
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={18}
                    color={Colors.success}
                  />
                </View>
                <Text style={[styles.detailText, { color: T.inputText }]}>
                  Account activated
                </Text>
                <Ionicons
                  name="checkmark"
                  size={16}
                  color={Colors.success}
                  style={styles.detailCheck}
                />
              </View>

              <View
                style={[
                  styles.detailDivider,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.07)"
                      : "rgba(0,0,0,0.06)",
                  },
                ]}
              />

              <View style={styles.detailRow}>
                <View
                  style={[
                    styles.detailIconWrap,
                    { backgroundColor: `${T.btnArrowBg}22` },
                  ]}
                >
                  <Ionicons
                    name="musical-notes-outline"
                    size={18}
                    color={T.btnArrowBg}
                  />
                </View>
                <Text style={[styles.detailText, { color: T.inputText }]}>
                  Ready to stream
                </Text>
                <Ionicons
                  name="checkmark"
                  size={16}
                  color={Colors.success}
                  style={styles.detailCheck}
                />
              </View>
            </Animated.View>

            {/* ── Go to Home button ── */}
            <Animated.View entering={FadeInUp.duration(500).delay(650)}>
              <TouchableOpacity
                style={[
                  styles.homeButton,
                  { backgroundColor: T.btnBg, shadowColor: T.shadow },
                ]}
                onPress={() => router.replace("/(tabs)" as any)}
                activeOpacity={0.8}
              >
                <Text style={[styles.homeButtonText, { color: T.btnText }]}>
                  Go to Home
                </Text>
                <View
                  style={[
                    styles.arrowCircle,
                    { backgroundColor: T.btnArrowBg },
                  ]}
                >
                  <Ionicons name="arrow-forward" size={18} color={T.btnArrow} />
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  mainBackground: { flex: 1 },
  outerScroll: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
  },
  card: {
    width: "98%",
    maxWidth: 440,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.22,
    shadowRadius: 32,
    elevation: 20,
  },
  topBanner: {
    borderRadius: 20,
    margin: 12,
    marginBottom: 0,
    height: 220,
    flexDirection: "row",
    overflow: "hidden",
  },
  bannerLeft: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
    justifyContent: "space-between",
    zIndex: 2,
  },
  bannerIconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  bannerTextBlock: {},
  bannerTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: "900",
    letterSpacing: 0.2,
    marginBottom: 5,
    marginTop: -15,
  },
  bannerSubtitle: {
    fontSize: 16.5,
    lineHeight: 18,
    marginBottom: 30,
  },
  bannerRight: {
    width: 150,
    overflow: "hidden",
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 36,
  },
  message: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
    marginBottom: 20,
  },
  detailsContainer: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: 24,
    overflow: "hidden",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  detailDivider: {
    height: 1,
    marginHorizontal: 16,
  },
  detailIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailText: {
    fontSize: FontSizes.sm,
    fontWeight: "500",
    flex: 1,
  },
  detailCheck: {
    marginLeft: 8,
  },
  homeButton: {
    borderRadius: BorderRadius.lg,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  homeButtonText: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});
