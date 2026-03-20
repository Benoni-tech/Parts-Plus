// app/auth/verify-email.tsx

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import {
  AuthTheme,
  BorderRadius,
  Colors,
  FontSizes,
  Spacing,
} from "../../src/constants/colors";
import { useAuth } from "../../src/hooks/useAuth";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const {
    user,
    userData,
    sendEmailVerification,
    checkEmailVerified,
    refreshUser,
    deleteAccount,
  } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const T = isDark ? AuthTheme.dark : AuthTheme.light;

  const [resending, setResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasNavigated = useRef(false);

  const displayUsername = userData?.username ?? user?.displayName ?? "";

  useEffect(() => {
    if (user?.emailVerified) {
      setIsVerified(true);
      return;
    }
    pollRef.current = setInterval(async () => {
      try {
        await refreshUser();
        const verified = await checkEmailVerified();
        if (verified && !hasNavigated.current) {
          setIsVerified(true);
          if (pollRef.current) clearInterval(pollRef.current);
          setTimeout(() => {
            hasNavigated.current = true;
            router.replace("/(tabs)" as any);
          }, 2000);
        }
      } catch (_) {}
    }, 10000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const handleGoHome = () => {
    if (!isVerified) return;
    hasNavigated.current = true;
    router.replace("/(tabs)" as any);
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await sendEmailVerification();
      Alert.alert(
        "Sent!",
        "Verification email sent. If you don't see it, check your spam folder.",
      );
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to send verification email",
      );
    } finally {
      setResending(false);
    }
  };

  const handleStartOver = () => {
    Alert.alert(
      "Start Over?",
      "This will permanently delete your current account. You'll need to sign up again. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete & Start Over",
          style: "destructive",
          onPress: async () => {
            setDeletingAccount(true);
            try {
              if (pollRef.current) clearInterval(pollRef.current);
              await deleteAccount();
              router.replace("/auth/signup" as any);
            } catch (error: any) {
              setDeletingAccount(false);
              Alert.alert(
                "Error",
                error.message || "Failed to delete account.",
              );
            }
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.mainBackground, { backgroundColor: T.mainBg }]}>
      <StatusBar style="light" />

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
          {/* ── Top banner — solid colour with logo, no grid ── */}
          <View style={[styles.topBanner, { backgroundColor: T.bannerBg }]}>
            {/* Logo centered */}
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
              // @ts-ignore
              tintColor="#ffffff"
            />

            {/* Title + subtitle inside banner */}
            <Animated.Text
              entering={FadeInUp.duration(500).delay(300)}
              style={styles.bannerTitle}
            >
              {displayUsername ? `Hi, ${displayUsername}!` : "Check Your Email"}
            </Animated.Text>
            <Animated.Text
              entering={FadeInUp.duration(500).delay(400)}
              style={styles.bannerSubtitle}
            >
              {isVerified
                ? "You're all verified!"
                : "Your account has been created"}
            </Animated.Text>
          </View>

          {/* ── Body ── */}
          <View style={styles.body}>
            {/* Message */}
            <Animated.Text
              entering={FadeInUp.duration(500).delay(450)}
              style={[styles.message, { color: T.labelColor }]}
            >
              {isVerified
                ? "Your email has been verified successfully. You're all set — tap the button below to start streaming."
                : "We've sent a verification link to the address above. Click the link in the email to activate your account and the button below will unlock automatically.\n\nCan't find it? Check your spam folder."}
            </Animated.Text>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: T.border }]} />

            {/* Go to Home button */}
            <Animated.View entering={FadeInUp.duration(500).delay(550)}>
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
                  {isVerified ? "Go to Home" : "Waiting for verification…"}
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
                  {isVerified ? (
                    <Ionicons
                      name="arrow-forward"
                      size={18}
                      color={T.btnArrow}
                    />
                  ) : (
                    <ActivityIndicator size="small" color="#9ca3af" />
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>

            {/* Resend */}
            {!isVerified && (
              <Animated.View
                entering={FadeInUp.duration(500).delay(650)}
                style={styles.actionRow}
              >
                <TouchableOpacity
                  onPress={handleResend}
                  disabled={resending}
                  style={[
                    styles.secondaryButton,
                    { borderColor: T.inputBorder, backgroundColor: T.inputBg },
                  ]}
                >
                  {resending ? (
                    <ActivityIndicator color={Colors.secondary} size="small" />
                  ) : (
                    <>
                      <Ionicons
                        name="refresh-outline"
                        size={16}
                        color={Colors.secondary}
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        style={[
                          styles.secondaryButtonText,
                          { color: Colors.secondary },
                        ]}
                      >
                        Resend Email
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </Animated.View>
            )}

            {/* Start over */}
            {!isVerified && (
              <Animated.View
                entering={FadeInUp.duration(500).delay(750)}
                style={styles.startOverRow}
              >
                <TouchableOpacity
                  onPress={handleStartOver}
                  disabled={deletingAccount}
                >
                  {deletingAccount ? (
                    <ActivityIndicator color="#ff6b6b" size="small" />
                  ) : (
                    <Text
                      style={[styles.startOverText, { color: T.labelColor }]}
                    >
                      Wrong email?{" "}
                      <Text style={styles.startOverLink}>Start Over</Text>
                    </Text>
                  )}
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
  outerScroll: { flexGrow: 1, alignItems: "center", paddingVertical: 48 },

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

  // ── Banner — solid colour, no grid ────────────────────────────────────────
  topBanner: {
    paddingTop: 36,
    paddingBottom: 32,
    paddingHorizontal: Spacing.xl,
    alignItems: "center",
    gap: 16,
  },
  logoImage: {
    width: 180,
    height: 72,
    marginBottom: 4,
  },
  bannerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "900",
    color: Colors.secondary,
    letterSpacing: 0.2,
    textAlign: "center",
  },
  bannerSubtitle: {
    fontSize: FontSizes.sm,
    color: "rgba(255,255,255,0.65)",
    lineHeight: FontSizes.sm * 1.5,
    textAlign: "center",
  },

  // ── Body ──────────────────────────────────────────────────────────────────
  body: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 36, gap: 16 },

  message: {
    fontSize: FontSizes.sm,
    lineHeight: FontSizes.sm * 1.6,
  },

  divider: { height: 1 },

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
    backgroundColor: "rgba(156,163,175,0.12)",
    borderWidth: 1,
    borderColor: "rgba(156,163,175,0.20)",
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: { fontSize: FontSizes.md, fontWeight: "600", flex: 1 },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  actionRow: { alignItems: "stretch" },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    paddingVertical: 14,
  },
  secondaryButtonText: { fontSize: FontSizes.sm, fontWeight: "700" },

  startOverRow: { alignItems: "center" },
  startOverText: { fontSize: FontSizes.sm, textAlign: "center" },
  startOverLink: { color: "#ff6b6b", fontWeight: "700" },
});
