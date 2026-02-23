// app/welcome.tsx

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
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
} from "../src/constants/colors";

const { width, height } = Dimensions.get("window");

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
              // ✅ Max opacity reduced from 0.18 → 0.06 — very faint
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
              // ✅ Max opacity reduced from 0.18 → 0.06 — very faint
              opacity: yProgress * 0.06,
            }}
          />
        );
      })}
    </View>
  );
}

// ─── Animated equaliser wave ──────────────────────────────────────────────────
const BAR_HEIGHTS = [4, 7, 12, 18, 26, 34, 42, 52, 42, 34, 26, 18, 12, 7, 4];
const BAR_WIDTH = 5;
const BAR_GAP = 5;

function AnimatedWave({ isDark }: { isDark: boolean }) {
  const anims = useRef(BAR_HEIGHTS.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    const animations = anims.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 60),
          Animated.timing(anim, {
            toValue: 0.35,
            duration: 500 + i * 40,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 500 + i * 40,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ),
    );
    Animated.parallel(animations).start();
    return () => animations.forEach((a) => a.stop());
  }, []);

  const maxBarHeight = Math.max(...BAR_HEIGHTS);

  const getBarColor = (index: number) => {
    const t = index / (BAR_HEIGHTS.length - 1);
    if (isDark) {
      if (t < 0.5) return `rgba(255,${Math.round(163 + t * 60)},3,0.95)`;
      return `rgba(255,${Math.round(193 - (t - 0.5) * 80)},30,0.90)`;
    } else {
      if (t < 0.5)
        return `rgba(${Math.round(24 + t * 18)},${Math.round(47 + t * 60)},${Math.round(72 + t * 80)},0.90)`;
      return `rgba(${Math.round(42 - (t - 0.5) * 10)},${Math.round(107 - (t - 0.5) * 40)},${Math.round(152 - (t - 0.5) * 40)},0.85)`;
    }
  };

  const totalWidth = BAR_HEIGHTS.length * (BAR_WIDTH + BAR_GAP) - BAR_GAP;

  return (
    <View
      style={{
        width: totalWidth,
        height: maxBarHeight * 2,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {BAR_HEIGHTS.map((barH, i) => (
        <Animated.View
          key={i}
          style={{
            width: BAR_WIDTH,
            height: barH * 2,
            borderRadius: BAR_WIDTH / 2,
            backgroundColor: getBarColor(i),
            marginRight: i < BAR_HEIGHTS.length - 1 ? BAR_GAP : 0,
            transform: [{ scaleY: anims[i] }],
          }}
        />
      ))}
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function WelcomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const T = isDark ? AuthTheme.dark : AuthTheme.light;

  const logoAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(160, [
      Animated.spring(logoAnim, {
        toValue: 1,
        tension: 55,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(waveAnim, {
        toValue: 1,
        tension: 55,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(textAnim, {
        toValue: 1,
        tension: 55,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(buttonAnim, {
        toValue: 1,
        tension: 55,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const makeAnimStyle = (anim: Animated.Value, yOffset = 26) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [yOffset, 0],
        }),
      },
    ],
  });

  return (
    <View style={[styles.container, { backgroundColor: T.background }]}>
      <StatusBar style={T.statusBar} />

      <GridBackground isDark={isDark} />

      {/* ── Top section: logo + wave + text ─────────────────────────── */}
      <View style={styles.topSection}>
        {/* Logo */}
        <Animated.View style={[styles.logoZone, makeAnimStyle(logoAnim, 30)]}>
          <View
            style={[
              styles.logoGlow,
              {
                backgroundColor: isDark
                  ? "rgba(255,163,3,0.09)"
                  : "rgba(24,47,72,0.07)",
              },
            ]}
          />
          <View
            style={[
              styles.logoGlowInner,
              {
                backgroundColor: isDark
                  ? "rgba(255,163,3,0.14)"
                  : "rgba(24,47,72,0.10)",
              },
            ]}
          />
          <Image
            source={require("../assets/images/logo.png")}
            style={[
              styles.logo,
              { tintColor: isDark ? "#ffffff" : Colors.primary },
            ]}
            resizeMode="contain"
          />
        </Animated.View>

        {/* ✅ Explicit gap between logo glow and wave */}
        <Animated.View style={[styles.waveZone, makeAnimStyle(waveAnim, 18)]}>
          <AnimatedWave isDark={isDark} />
        </Animated.View>

        {/* Text */}
        <Animated.View style={[styles.textBlock, makeAnimStyle(textAnim, 22)]}>
          <Text style={[styles.welcomeText, { color: T.textSecondary }]}>
            Welcome to
          </Text>
          <Text style={[styles.appName, { color: T.textPrimary }]}>
            Parts Plus
          </Text>
          <Text style={[styles.subtitle, { color: T.textSecondary }]}>
            Stream the favorite parts of your favorite{"\n"}hymns and choruses
            effortlessly.
          </Text>
        </Animated.View>
      </View>

      {/* ── Bottom section: buttons pinned to bottom ─────────────────── */}
      <Animated.View
        style={[styles.buttonBlock, makeAnimStyle(buttonAnim, 18)]}
      >
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between", //
    paddingHorizontal: Spacing.xl,
    paddingTop: height * 0.15,
    paddingBottom: height * 0.09, //
  },

  // ── Top section ───────────────────────────────────────────────────────────
  topSection: {
    alignItems: "center",
  },

  // ── Logo ──────────────────────────────────────────────────────────────────
  logoZone: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xxxl,
  },
  logoGlow: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 105,
  },
  logoGlowInner: {
    position: "absolute",
    width: 145,
    height: 145,
    borderRadius: 73,
  },
  logo: {
    width: 115,
    height: 115,
  },

  // ── Wave ──────────────────────────────────────────────────────────────────
  waveZone: {
    alignItems: "center",
    marginBottom: Spacing.xs, // ✅ gap between wave and text
  },

  // ── Text ──────────────────────────────────────────────────────────────────
  textBlock: {
    alignItems: "center",
  },
  welcomeText: {
    fontSize: FontSizes.md,
    fontWeight: "400",
    marginBottom: 4,
    marginTop: 44,
    letterSpacing: 0.3,
  },
  appName: {
    fontSize: FontSizes.xxl + 4,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    textAlign: "center",
    lineHeight: 22,
  },

  // ── Buttons ───────────────────────────────────────────────────────────────
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
  loginText: {
    fontSize: FontSizes.sm,
  },
  loginLink: {
    fontSize: FontSizes.sm,
    fontWeight: "700",
  },
});
