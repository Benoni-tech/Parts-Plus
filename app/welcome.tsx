// app/welcome.tsx

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import {
  AuthTheme,
  BorderRadius,
  Colors,
  FontSizes,
  Spacing,
} from "../src/constants/colors";

const { width, height } = Dimensions.get("window");

const CIRCLE_SIZE = width * 0.72;
const CIRCLE_RADIUS = CIRCLE_SIZE / 2;
const ARC_STROKE = 2.5;
// SVG circumference for the arc ring
const ARC_CIRCUMFERENCE = 2 * Math.PI * (CIRCLE_RADIUS - ARC_STROKE / 2 - 4);

// ─── Grid background ──────────────────────────────────────────────────────────
function GridBackground({ isDark }: { isDark: boolean }) {
  const cols = 14;
  const rows = 22;
  const lineColor = isDark ? "rgba(255,255,255,1)" : "rgba(24,47,72,1)";

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {Array.from({ length: cols }).map((_, i) => {
        const xProgress = i / (cols - 1);
        return (
          <View
            key={`v-${i}`}
            style={{
              position: "absolute",
              left: `${xProgress * 100}%` as any,
              top: 0,
              bottom: 0,
              width: 1,
              backgroundColor: lineColor,
              opacity: xProgress * 0.06,
            }}
          />
        );
      })}
      {Array.from({ length: rows }).map((_, i) => {
        const yProgress = i / (rows - 1);
        return (
          <View
            key={`h-${i}`}
            style={{
              position: "absolute",
              top: `${yProgress * 100}%` as any,
              left: 0,
              right: 0,
              height: 1,
              backgroundColor: lineColor,
              opacity: yProgress * 0.06,
            }}
          />
        );
      })}
    </View>
  );
}

// ─── Floating badge ───────────────────────────────────────────────────────────
function FloatingBadge({
  label,
  sublabel,
  style,
  isDark,
}: {
  label: string;
  sublabel: string;
  style?: any;
  isDark: boolean;
}) {
  return (
    <View
      style={[
        styles.floatingBadge,
        {
          backgroundColor: isDark
            ? "rgba(255,255,255,0.10)"
            : "rgba(24,47,72,0.08)",
          borderColor: isDark
            ? "rgba(255,255,255,0.18)"
            : "rgba(24,47,72,0.14)",
        },
        style,
      ]}
    >
      <Text style={[styles.floatingBadgeLabel, { color: Colors.secondary }]}>
        {label}
      </Text>
      <Text
        style={[
          styles.floatingBadgeSub,
          { color: isDark ? "rgba(255,255,255,0.55)" : "rgba(24,47,72,0.55)" },
        ]}
      >
        {sublabel}
      </Text>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function WelcomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const T = isDark ? AuthTheme.dark : AuthTheme.light;

  // ── Entrance animations ───────────────────────────────────────────────────
  const heroAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const arcAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(140, [
      Animated.spring(heroAnim, {
        toValue: 1,
        tension: 50,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(arcAnim, {
        toValue: 1,
        tension: 50,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(textAnim, {
        toValue: 1,
        tension: 50,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(buttonAnim, {
        toValue: 1,
        tension: 50,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const makeAnim = (anim: Animated.Value, y = 24) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [y, 0],
        }),
      },
    ],
  });

  // ── Circle colours ────────────────────────────────────────────────────────
  const circleOuterBg = isDark
    ? "rgba(255,255,255,0.06)"
    : "rgba(24,47,72,0.06)";
  const circleMiddleBg = isDark
    ? "rgba(255,255,255,0.09)"
    : "rgba(24,47,72,0.09)";
  const circleInnerBg = isDark
    ? "rgba(255,255,255,0.14)"
    : "rgba(24,47,72,0.12)";
  const circleBorder = isDark
    ? "rgba(255,255,255,0.16)"
    : "rgba(24,47,72,0.16)";
  const iconColor = isDark ? "#ffffff" : Colors.primary;
  const arcColor = Colors.secondary;

  // Dash: 75% of circumference visible, 25% gap
  const arcDash = ARC_CIRCUMFERENCE * 0.75;
  const arcGap = ARC_CIRCUMFERENCE * 0.25;

  return (
    <View style={[styles.container, { backgroundColor: T.background }]}>
      <StatusBar style={T.statusBar} />
      <GridBackground isDark={isDark} />

      {/* ── Hero zone ────────────────────────────────────────────────── */}
      <Animated.View style={[styles.heroZone, makeAnim(heroAnim, 30)]}>
        {/* Arc ring — sits behind the circle */}
        <Animated.View style={[styles.arcWrapper, makeAnim(arcAnim, 0)]}>
          <Svg
            width={CIRCLE_SIZE + 24}
            height={CIRCLE_SIZE + 24}
            style={StyleSheet.absoluteFillObject}
          >
            {/* Faint full ring */}
            <Circle
              cx={(CIRCLE_SIZE + 24) / 2}
              cy={(CIRCLE_SIZE + 24) / 2}
              r={CIRCLE_RADIUS + 8}
              stroke={isDark ? "rgba(255,255,255,0.08)" : "rgba(24,47,72,0.08)"}
              strokeWidth={ARC_STROKE}
              fill="none"
            />
            {/* Coloured partial arc */}
            <Circle
              cx={(CIRCLE_SIZE + 24) / 2}
              cy={(CIRCLE_SIZE + 24) / 2}
              r={CIRCLE_RADIUS + 8}
              stroke={arcColor}
              strokeWidth={ARC_STROKE}
              fill="none"
              strokeDasharray={`${arcDash} ${arcGap}`}
              strokeDashoffset={ARC_CIRCUMFERENCE * 0.12}
              strokeLinecap="round"
              rotation="-90"
              origin={`${(CIRCLE_SIZE + 24) / 2}, ${(CIRCLE_SIZE + 24) / 2}`}
            />
          </Svg>
        </Animated.View>

        {/* Outer frosted ring */}
        <View
          style={[
            styles.circleOuter,
            {
              width: CIRCLE_SIZE,
              height: CIRCLE_SIZE,
              borderRadius: CIRCLE_RADIUS,
              backgroundColor: circleOuterBg,
              borderColor: circleBorder,
            },
          ]}
        >
          {/* Middle ring */}
          <View
            style={[
              styles.circleMiddle,
              {
                backgroundColor: circleMiddleBg,
                borderColor: isDark
                  ? "rgba(255,255,255,0.12)"
                  : "rgba(24,47,72,0.12)",
              },
            ]}
          >
            {/* Inner core */}
            <View
              style={[
                styles.circleInner,
                {
                  backgroundColor: circleInnerBg,
                  borderColor: isDark
                    ? "rgba(255,255,255,0.22)"
                    : "rgba(24,47,72,0.20)",
                },
              ]}
            >
              <Ionicons
                name="headset"
                size={CIRCLE_SIZE * 0.36}
                color={iconColor}
              />
            </View>
          </View>
        </View>

        {/* Floating badges */}
        <FloatingBadge
          label="4.9 ★"
          sublabel="Top Rated"
          isDark={isDark}
          style={styles.badgeLeft}
        />
        <FloatingBadge
          label="10K+"
          sublabel="Hymns"
          isDark={isDark}
          style={styles.badgeRight}
        />

        {/* App name pill */}
        <View
          style={[
            styles.appPill,
            {
              backgroundColor: isDark
                ? "rgba(255,255,255,0.10)"
                : "rgba(24,47,72,0.08)",
              borderColor: isDark
                ? "rgba(255,255,255,0.18)"
                : "rgba(24,47,72,0.14)",
            },
          ]}
        >
          <Ionicons
            name="musical-notes"
            size={13}
            color={Colors.secondary}
            style={{ marginRight: 5 }}
          />
          <Text
            style={[
              styles.appPillText,
              { color: isDark ? "#ffffff" : Colors.primary },
            ]}
          >
            Parts Plus
          </Text>
        </View>
      </Animated.View>

      {/* ── Bottom content ────────────────────────────────────────────── */}
      <View style={styles.bottomZone}>
        {/* Headline */}
        <Animated.View style={makeAnim(textAnim, 22)}>
          <Text style={[styles.headline, { color: T.textPrimary }]}>
            Stream your{"\n"}favourite hymns.
          </Text>
          <Text style={[styles.subtext, { color: T.textSecondary }]}>
            Practice every voice part of your favourite{"\n"}hymns and choruses,
            effortlessly.
          </Text>
        </Animated.View>

        {/* Buttons */}
        <Animated.View style={[styles.buttonBlock, makeAnim(buttonAnim, 18)]}>
          <TouchableOpacity
            style={[styles.primaryButton, { shadowColor: Colors.secondary }]}
            onPress={() => router.push("/auth/signup")}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
            <View
              style={[styles.arrowCircle, { backgroundColor: Colors.primary }]}
            >
              <Ionicons name="arrow-forward" size={18} color="#ffffff" />
            </View>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: T.textSecondary }]}>
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/auth/signin")}>
              <Text style={[styles.loginLink, { color: Colors.secondary }]}>
                Log In
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: height * 0.1,
  },

  // ── Hero ──────────────────────────────────────────────────────────────────
  heroZone: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: height * 0.1,
    paddingBottom: Spacing.xl,
  },
  arcWrapper: {
    position: "absolute",
    width: CIRCLE_SIZE + 24,
    height: CIRCLE_SIZE + 24,
    alignSelf: "center",
  },
  circleOuter: {
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  circleMiddle: {
    width: "78%",
    aspectRatio: 1,
    borderRadius: 9999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  circleInner: {
    width: "78%",
    aspectRatio: 1,
    borderRadius: 9999,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Floating badges ───────────────────────────────────────────────────────
  floatingBadge: {
    position: "absolute",
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
    minWidth: 72,
  },
  floatingBadgeLabel: {
    fontSize: FontSizes.sm,
    fontWeight: "800",
  },
  floatingBadgeSub: {
    fontSize: FontSizes.xs - 1,
    fontWeight: "500",
    marginTop: 2,
  },
  badgeLeft: {
    left: width * 0.04,
    top: "35%",
  },
  badgeRight: {
    right: width * 0.04,
    top: "45%",
  },

  // ── App name pill ─────────────────────────────────────────────────────────
  appPill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginTop: Spacing.lg,
  },
  appPillText: {
    fontSize: FontSizes.xs,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  // ── Bottom ────────────────────────────────────────────────────────────────
  bottomZone: {
    width: "100%",
    paddingHorizontal: Spacing.xl,
  },
  headline: {
    fontSize: FontSizes.xxl + 2,
    fontWeight: "900",
    letterSpacing: 0.2,
    lineHeight: (FontSizes.xxl + 2) * 1.2,
    marginBottom: 12,
  },
  subtext: {
    fontSize: FontSizes.sm,
    lineHeight: FontSizes.sm * 1.6,
    marginBottom: Spacing.xl,
  },
  buttonBlock: {
    width: "100%",
    alignItems: "center",
  },
  primaryButton: {
    width: "100%",
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.lg,
    paddingVertical: 17,
    paddingHorizontal: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: Spacing.md,
  },
  primaryButtonText: {
    fontSize: FontSizes.md,
    color: "#ffffff",
    fontWeight: "700",
    flex: 1,
  },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: { fontSize: FontSizes.sm },
  loginLink: { fontSize: FontSizes.sm, fontWeight: "700" },
});
