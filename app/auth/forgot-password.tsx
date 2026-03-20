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
  View,
} from "react-native";
import {
  AuthTheme,
  BorderRadius,
  Colors,
  FontSizes,
  Spacing,
} from "../../src/constants/colors";
import { useAuth } from "../../src/hooks/useAuth";

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

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const T = isDark ? AuthTheme.dark : AuthTheme.light;

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [sentToEmail, setSentToEmail] = useState("");

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

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
      setSentToEmail(email.trim());
      setShowSuccessModal(true);
    } catch (error: any) {
      setLoading(false);
      let msg = "Failed to send reset email";
      if (error.code === "auth/user-not-found")
        msg = "No account found with this email";
      else if (error.code === "auth/invalid-email")
        msg = "Invalid email address";
      else if (error.code === "auth/network-request-failed")
        msg = "Network error. Please check your connection";
      else if (error.message) msg = error.message;
      setError(msg);
    }
  };

  return (
    <View style={[styles.mainBackground, { backgroundColor: T.mainBg }]}>
      <StatusBar style={T.statusBar} />

      {/* ── Success Modal — matches verify-email style ── */}
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
            {/* Banner — solid colour, logo only — no grid, no icon circle */}
            <View style={[styles.modalBanner, { backgroundColor: T.bannerBg }]}>
              <Image
                source={require("../../assets/images/logo.png")}
                style={styles.modalLogo}
                resizeMode="contain"
                // @ts-ignore
                tintColor="#ffffff"
              />
              <Text style={styles.modalBannerTitle}>Check Your Email</Text>
              <Text style={styles.modalBannerSubtitle}>Reset link sent!</Text>
            </View>

            {/* Body */}
            <View style={styles.modalBody}>
              <Text style={[styles.modalMessage, { color: T.labelColor }]}>
                We've sent password reset instructions to the address above.
                Follow the link in the email to reset your password.{"\n\n"}
                Can't find it? Check your spam folder.
              </Text>

              <View style={[styles.divider, { backgroundColor: T.border }]} />

              {/* Button */}
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: T.btnBg, shadowColor: T.shadow },
                ]}
                onPress={() => {
                  setShowSuccessModal(false);
                  router.back();
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.modalButtonText, { color: T.btnText }]}>
                  Back to Sign In
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
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Main screen ── */}
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
            <View style={[styles.topBanner, { backgroundColor: T.bannerBg }]}>
              <View style={styles.bannerLeft}>
                <View style={styles.bannerTopRow}>
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
                  <Image
                    source={require("../../assets/images/logo.png")}
                    style={styles.logoImage}
                    resizeMode="contain"
                    // @ts-ignore
                    tintColor="#ffffff"
                  />
                </View>
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
              <View style={styles.bannerRight}>
                <GridOverlay isDark={isDark} />
              </View>
            </View>

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
                    onChangeText={(t) => {
                      setEmail(t);
                      setError("");
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </View>

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

const styles = StyleSheet.create({
  mainBackground: { flex: 1 },
  kavWrapper: { flex: 1 },
  outerScroll: { flexGrow: 1, alignItems: "center", paddingVertical: 48 },
  card: {
    width: "99%",
    maxWidth: 440,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.22,
    shadowRadius: 32,
    elevation: 20,
  },

  // ── Main screen banner ────────────────────────────────────────────────────
  topBanner: {
    borderRadius: 20,
    margin: 12,
    marginBottom: 0,
    minHeight: 180,
    flexDirection: "row",
    overflow: "hidden",
  },
  bannerLeft: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 20,
    justifyContent: "space-between",
    zIndex: 2,
  },
  bannerTopRow: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  backAbsolute: { position: "absolute", left: 0, top: 0, zIndex: 5 },
  backCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: { width: 200, height: 80 },
  bannerTextBlock: { marginTop: Spacing.sm },
  bannerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "700",
    letterSpacing: 0.2,
    marginBottom: 6,
  },
  bannerSubtitle: { fontSize: FontSizes.sm, lineHeight: FontSizes.sm * 1.5 },
  bannerRight: { width: 130, overflow: "hidden" },

  // ── Form ──────────────────────────────────────────────────────────────────
  form: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 36 },
  inputContainer: { marginBottom: 14 },
  label: {
    fontSize: FontSizes.xs,
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
  input: { flex: 1, fontSize: FontSizes.sm },
  errorText: {
    fontSize: FontSizes.xs,
    color: "#ff6b6b",
    marginTop: 4,
    marginLeft: 4,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 4,
    marginTop: 8,
  },
  infoText: { fontSize: FontSizes.xs, lineHeight: FontSizes.xs * 1.5, flex: 1 },
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
  resetButtonText: { fontSize: FontSizes.md, fontWeight: "600", flex: 1 },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  backToSignInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  backToSignInText: { fontSize: FontSizes.sm },
  backToSignInLink: { fontSize: FontSizes.sm, fontWeight: "700" },

  // ── Success modal ─────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 400,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.28,
    shadowRadius: 32,
    elevation: 24,
  },
  // Solid colour banner — no grid, centered content
  modalBanner: {
    paddingTop: 28,
    paddingBottom: 24,
    paddingHorizontal: Spacing.xl,
    alignItems: "center",
    gap: 12,
  },
  modalLogo: { width: 160, height: 84 },
  modalBannerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "900",
    color: Colors.secondary,
    letterSpacing: 0.2,
    textAlign: "center",
  },
  modalBannerSubtitle: {
    fontSize: FontSizes.sm,
    color: "rgba(255,255,255,0.65)",
    lineHeight: FontSizes.sm * 1.5,
    textAlign: "center",
  },
  modalBody: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
    gap: 14,
  },
  modalMessage: { fontSize: FontSizes.sm, lineHeight: FontSizes.sm * 1.6 },
  divider: { height: 1 },
  modalButton: {
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
  modalButtonText: { fontSize: FontSizes.md, fontWeight: "600", flex: 1 },
});
