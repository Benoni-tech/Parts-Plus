// app/auth/verify-email.tsx

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInUp, ZoomIn } from "react-native-reanimated";
import { AuthTheme, BorderRadius, FontSizes } from "../../src/constants/colors";
import { useAuth } from "../../src/hooks/useAuth";

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
export default function VerifyEmailScreen() {
  const router = useRouter();
  const {
    user,
    userData,
    sendEmailVerification,
    checkEmailVerified,
    refreshUser,
  } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const T = isDark ? AuthTheme.dark : AuthTheme.light;

  const [resending, setResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Read from context — no route params needed ──────────────────────────────
  const displayEmail = user?.email ?? "";
  const displayUsername = userData?.username ?? "";

  // ── Poll for verification every 4 seconds ──────────────────────────────────
  useEffect(() => {
    // If already verified when screen mounts (e.g. user returns to app)
    if (user?.emailVerified) {
      setIsVerified(true);
      return;
    }

    pollRef.current = setInterval(async () => {
      try {
        await refreshUser();
        const verified = await checkEmailVerified();
        if (verified) {
          setIsVerified(true);
          if (pollRef.current) clearInterval(pollRef.current);
        }
      } catch (_) {
        // silently ignore poll errors — will retry next interval
      }
    }, 4000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const handleGoHome = () => {
    router.replace("/(tabs)" as any);
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await sendEmailVerification();
      Alert.alert("Sent!", "Verification email sent. Please check your inbox.");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to send verification email",
      );
    } finally {
      setResending(false);
    }
  };

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
                    styles.iconCircle,
                    {
                      backgroundColor: isVerified
                        ? "rgba(34,197,94,0.15)"
                        : `${T.btnArrowBg}22`,
                    },
                  ]}
                >
                  <Ionicons
                    name={isVerified ? "checkmark-circle" : "mail-open-outline"}
                    size={44}
                    color={isVerified ? "#22c55e" : T.btnArrowBg}
                  />
                </View>
              </Animated.View>

              <View style={styles.bannerTextBlock}>
                <Animated.Text
                  entering={FadeInUp.duration(500).delay(300)}
                  style={[styles.bannerTitle, { color: T.titleColor }]}
                >
                  {displayUsername
                    ? `Hi, ${displayUsername}!`
                    : "Check Your Email"}
                </Animated.Text>
                <Animated.Text
                  entering={FadeInUp.duration(500).delay(400)}
                  style={[styles.bannerSubtitle, { color: T.subtitleColor }]}
                >
                  {isVerified
                    ? "Email verified!"
                    : "Your account has been created"}
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
              {isVerified
                ? "Your email has been verified. You're all set — tap the button below to start streaming."
                : "We've sent a verification link to your email address. Click the link in your inbox to activate your account. The button below will unlock automatically once verified."}
            </Animated.Text>

            {/* Email + status card */}
            <Animated.View
              entering={FadeInUp.duration(500).delay(500)}
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
                    { backgroundColor: `${T.btnArrowBg}22` },
                  ]}
                >
                  <Ionicons
                    name="mail-outline"
                    size={18}
                    color={T.btnArrowBg}
                  />
                </View>
                <Text
                  style={[styles.detailText, { color: T.inputText }]}
                  numberOfLines={1}
                >
                  {displayEmail}
                </Text>
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
                    {
                      backgroundColor: isVerified
                        ? "rgba(34,197,94,0.15)"
                        : "rgba(255,163,3,0.15)",
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      isVerified ? "shield-checkmark-outline" : "time-outline"
                    }
                    size={18}
                    color={isVerified ? "#22c55e" : "#ffa303"}
                  />
                </View>
                <Text style={[styles.detailText, { color: T.inputText }]}>
                  {isVerified ? "Email verified" : "Awaiting verification"}
                </Text>
                <Ionicons
                  name={isVerified ? "checkmark" : "ellipsis-horizontal"}
                  size={16}
                  color={isVerified ? "#22c55e" : "#ffa303"}
                  style={styles.detailCheck}
                />
              </View>
            </Animated.View>

            {/* ── Go to Home button ── */}
            <Animated.View entering={FadeInUp.duration(500).delay(600)}>
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  isVerified
                    ? { backgroundColor: T.btnBg, shadowColor: T.shadow }
                    : styles.buttonDisabled,
                ]}
                onPress={handleGoHome}
                activeOpacity={isVerified ? 0.8 : 1}
                disabled={!isVerified}
              >
                <Text
                  style={[
                    styles.primaryButtonText,
                    { color: isVerified ? T.btnText : "#9ca3af" },
                  ]}
                >
                  Go to Home
                </Text>
                <View
                  style={[
                    styles.arrowCircle,
                    {
                      backgroundColor: isVerified
                        ? T.btnArrowBg
                        : isDark
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(0,0,0,0.08)",
                    },
                  ]}
                >
                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color={isVerified ? T.btnArrow : "#9ca3af"}
                  />
                </View>
              </TouchableOpacity>
            </Animated.View>

            {/* ── Resend — hidden once verified ── */}
            {!isVerified && (
              <Animated.View
                entering={FadeInUp.duration(500).delay(700)}
                style={styles.resendRow}
              >
                <TouchableOpacity
                  onPress={handleResend}
                  disabled={resending}
                  style={styles.resendButton}
                >
                  {resending ? (
                    <ActivityIndicator color={T.btnArrowBg} size="small" />
                  ) : (
                    <Text style={[styles.resendText, { color: T.labelColor }]}>
                      Didn't receive it?{" "}
                      <Text style={{ color: T.btnArrowBg, fontWeight: "700" }}>
                        Resend Email
                      </Text>
                    </Text>
                  )}
                </TouchableOpacity>
              </Animated.View>
            )}

            {/* ── Back to sign in — hidden once verified ── */}
            {!isVerified && (
              <Animated.View entering={FadeInUp.duration(500).delay(800)}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => router.replace("/auth/signin")}
                >
                  <Text style={[styles.backText, { color: T.subtitleColor }]}>
                    Back to Sign In
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainBackground: { flex: 1 },
  outerScroll: {
    flexGrow: 1,
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
  bannerIconRow: { flexDirection: "row", alignItems: "center" },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  bannerTextBlock: {},
  bannerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "900",
    letterSpacing: 0.2,
    marginBottom: 15,
    marginTop: 15,
  },
  bannerSubtitle: { fontSize: 16.5, lineHeight: 18, marginBottom: 30 },
  bannerRight: { width: 150, overflow: "hidden" },
  body: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 36 },
  message: { fontSize: FontSizes.sm, lineHeight: 20, marginBottom: 20 },
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
  detailDivider: { height: 1, marginHorizontal: 16 },
  detailIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailText: { fontSize: FontSizes.sm, fontWeight: "500", flex: 1 },
  detailCheck: { marginLeft: 8 },
  primaryButton: {
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
  buttonDisabled: {
    backgroundColor: "rgba(156,163,175,0.15)",
    borderWidth: 1,
    borderColor: "rgba(156,163,175,0.25)",
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: { fontSize: 15, fontWeight: "600", flex: 1 },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  resendRow: { alignItems: "center", marginTop: 16 },
  resendButton: { paddingVertical: 8 },
  resendText: { fontSize: FontSizes.sm, textAlign: "center" },
  backButton: { marginTop: 12, paddingVertical: 8, alignItems: "center" },
  backText: { fontSize: FontSizes.sm },
});
