// app/auth/forgot-password.tsx

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import {
  AuthTheme,
  BorderRadius,
  FontSizes,
  Spacing,
} from "../../src/constants/colors";
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
export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const T = isDark ? AuthTheme.dark : AuthTheme.light;

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Success modal state ──────────────────────────────────────────────────
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [sentToEmail, setSentToEmail] = useState("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async () => {
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email.trim());
      // Store email for modal display, then show modal instead of Alert
      setSentToEmail(email.trim());
      setShowSuccessModal(true);
    } catch (error: any) {
      setLoading(false);
      let msg = "Failed to send reset email";
      if (error.code === "auth/user-not-found") {
        msg = "No account found with this email";
      } else if (error.code === "auth/invalid-email") {
        msg = "Invalid email address";
      } else if (error.code === "auth/network-request-failed") {
        msg = "Network error. Please check your connection";
      } else if (error.message) {
        msg = error.message;
      }
      setError(msg);
    }
  };

  const handleModalConfirm = () => {
    setShowSuccessModal(false);
    router.back();
  };

  return (
    <View style={[styles.mainBackground, { backgroundColor: T.mainBg }]}>
      <StatusBar style={T.statusBar} />

      {/* ── Success Modal ─────────────────────────────────────────────────── */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: T.cardBg,
                borderColor: T.cardBorder,
                shadowColor: T.shadow,
              },
            ]}
          >
            {/* Modal banner — bannerBg + grid, envelope icon centered */}
            <View style={[styles.modalBanner, { backgroundColor: T.bannerBg }]}>
              <GridOverlay isDark={isDark} />
              <View style={styles.modalBannerContent} pointerEvents="none">
                <Text style={styles.modalEmoji}>📧</Text>
              </View>
            </View>

            {/* Modal body */}
            <View style={styles.modalBody}>
              <Text style={[styles.modalTitle, { color: T.titleColor }]}>
                Check Your Email
              </Text>
              <Text style={[styles.modalSubtitle, { color: T.subtitleColor }]}>
                Reset link sent!
              </Text>
              <Text style={[styles.modalMessage, { color: T.labelColor }]}>
                We've sent password reset instructions to{" "}
                <Text style={{ color: T.signInLink, fontWeight: "600" }}>
                  {sentToEmail}
                </Text>
                . Please check your inbox and follow the link to reset your
                password.
              </Text>

              {/* Confirm button — same pill style as auth screens */}
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: T.btnBg, shadowColor: T.shadow },
                ]}
                onPress={handleModalConfirm}
                activeOpacity={0.8}
              >
                <Text style={[styles.modalButtonText, { color: T.btnText }]}>
                  Back to Sign In
                </Text>
                <View
                  style={[
                    styles.modalArrowCircle,
                    { backgroundColor: T.btnArrowBg },
                  ]}
                >
                  <Ionicons name="arrow-forward" size={18} color={T.btnArrow} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.kavWrapper}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.outerScroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* ── Card ─────────────────────────────────────────────────── */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: T.cardBg,
                borderColor: T.cardBorder,
                shadowColor: T.shadow,
              },
            ]}
          >
            {/* ── Top banner ─────────────────────────────────────────── */}
            <View style={[styles.topBanner, { backgroundColor: T.bannerBg }]}>
              {/* Left column */}
              <View style={styles.bannerLeft}>
                {/* Row 1: back button absolutely positioned, logo independent */}
                <View style={styles.bannerTopRow}>
                  {/* Back button — absolutely pinned top-left, decoupled from logo */}
                  <TouchableOpacity
                    style={[
                      styles.backCircle,
                      styles.backAbsolute,
                      {
                        backgroundColor: T.backRectBg,
                        borderColor: T.backRectBorder,
                      },
                    ]}
                    onPress={() => router.back()}
                  >
                    <Ionicons name="arrow-back" size={16} color={T.backArrow} />
                  </TouchableOpacity>

                  {/* Logo sits independently beside the absolute button space */}
                  <Image
                    source={require("../../assets/images/logo.png")}
                    style={styles.logoImage}
                    resizeMode="contain"
                    // @ts-ignore
                    tintColor="#ffffff"
                  />
                </View>

                {/* Row 2: text block pinned to bottom via parent space-between */}
                <View style={styles.bannerTextBlock}>
                  <Text style={[styles.bannerTitle, { color: T.titleColor }]}>
                    Reset Password
                  </Text>
                  <Text
                    style={[styles.bannerSubtitle, { color: T.subtitleColor }]}
                  >
                    Enter your email to receive reset instructions
                  </Text>
                </View>
              </View>

              {/* Right column: fading grid */}
              <View style={styles.bannerRight}>
                <GridOverlay isDark={isDark} />
              </View>
            </View>

            {/* ── Form ───────────────────────────────────────────────── */}
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: T.labelColor }]}>
                  Email Address
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: T.inputBg,
                      borderColor: error ? "#ff6b6b" : T.inputBorder,
                    },
                  ]}
                >
                  <Ionicons
                    name="mail-outline"
                    size={18}
                    color={T.inputIcon}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, { color: T.inputText }]}
                    placeholder="johndoe@gmail.com"
                    placeholderTextColor={T.inputPlaceholder}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setError("");
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </View>

              {/* Info message */}
              <View style={styles.infoContainer}>
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color={T.subtitleColor}
                  style={{ marginRight: 8 }}
                />
                <Text style={[styles.infoText, { color: T.subtitleColor }]}>
                  We'll send you an email with instructions to reset your
                  password
                </Text>
              </View>

              {/* ── Button ──────────────────────────────────────────── */}
              <View style={styles.buttonSpacer} />
              <TouchableOpacity
                style={[
                  styles.resetButton,
                  { backgroundColor: T.btnBg, shadowColor: T.shadow },
                  loading && styles.buttonDisabled,
                ]}
                onPress={handleResetPassword}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color={T.btnText} style={{ flex: 1 }} />
                ) : (
                  <>
                    <Text
                      style={[styles.resetButtonText, { color: T.btnText }]}
                    >
                      Send Reset Link
                    </Text>
                    <View
                      style={[
                        styles.arrowCircle,
                        { backgroundColor: T.btnArrowBg },
                      ]}
                    >
                      <Ionicons
                        name="arrow-forward"
                        size={18}
                        color={T.btnArrow}
                      />
                    </View>
                  </>
                )}
              </TouchableOpacity>

              {/* Back to Sign In link */}
              <View style={styles.backToSignInContainer}>
                <Text
                  style={[styles.backToSignInText, { color: T.signInText }]}
                >
                  Remember your password?{" "}
                </Text>
                <TouchableOpacity onPress={() => router.back()}>
                  <Text
                    style={[styles.backToSignInLink, { color: T.signInLink }]}
                  >
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  mainBackground: {
    flex: 1,
  },
  kavWrapper: {
    flex: 1,
  },
  outerScroll: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
  },

  // ── Card ─────────────────────────────────────────────────────────────────
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

  // ── Banner ────────────────────────────────────────────────────────────────
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
  bannerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  backAbsolute: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 5,
  },
  backCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: 220,
    height: 110,
  },
  bannerTextBlock: {
    marginTop: Spacing.sm,
  },
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

  // ── Form ─────────────────────────────────────────────────────────────────
  form: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 36,
  },
  inputContainer: { marginBottom: 14 },
  label: {
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 6,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 14 },
  errorText: { fontSize: 11, color: "#ff6b6b", marginTop: 4, marginLeft: 4 },

  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 4,
    marginTop: 8,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },

  // ── Button ────────────────────────────────────────────────────────────────
  buttonSpacer: { height: 22 },
  resetButton: {
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
  buttonDisabled: { opacity: 0.55 },
  resetButtonText: { fontSize: 15, fontWeight: "600", flex: 1 },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  // ── Footer link ───────────────────────────────────────────────────────────
  backToSignInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  backToSignInText: { fontSize: 13 },
  backToSignInLink: { fontSize: 13, fontWeight: "700" },

  // ── Success Modal ─────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.72)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.28,
    shadowRadius: 32,
    elevation: 24,
  },
  modalBanner: {
    height: 110,
    overflow: "hidden",
  },
  modalBannerContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  modalEmoji: {
    fontSize: 48,
  },
  modalBody: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
  },
  modalTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "900",
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: FontSizes.md,
    fontWeight: "600",
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButton: {
    borderRadius: BorderRadius.lg,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },
  modalArrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});
