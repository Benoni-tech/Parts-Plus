// app/auth/signin.tsx

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
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
  FontSizes,
  Spacing,
} from "../../src/constants/colors";
import { useAuth } from "../../src/hooks/useAuth";
import { SignInFormData, signInSchema } from "../../src/schemas/authSchemas";

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
export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const T = isDark ? AuthTheme.dark : AuthTheme.light;

  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<SignInFormData>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    try {
      signInSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const fieldErrors: Partial<SignInFormData> = {};
      error.errors.forEach((err: any) => {
        fieldErrors[err.path[0] as keyof SignInFormData] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await signIn(formData.email, formData.password);
      // Navigation handled by auth state change
    } catch (error: any) {
      setLoading(false);
      let msg = "Failed to sign in";
      if (error.code === "auth/user-not-found") {
        msg = "No account found with this email";
      } else if (error.code === "auth/wrong-password") {
        msg = "Incorrect password";
      } else if (error.code === "auth/invalid-email") {
        msg = "Invalid email address";
      } else if (error.code === "auth/user-disabled") {
        msg = "This account has been disabled";
      } else if (error.code === "auth/network-request-failed") {
        msg = "Network error. Please check your connection";
      } else if (error.message) {
        msg = error.message;
      }
      Alert.alert("Sign In Failed", msg);
    }
  };

  // ── Reusable input renderer ──────────────────────────────────────────────
  const renderInput = (
    label: string,
    icon: string,
    value: string,
    onChange: (t: string) => void,
    options: {
      placeholder: string;
      keyboardType?: any;
      autoCapitalize?: any;
      secure?: boolean;
      toggleSecure?: () => void;
      showSecure?: boolean;
      error?: string;
    },
  ) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: T.labelColor }]}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: T.inputBg,
            borderColor: options.error ? "#ff6b6b" : T.inputBorder,
          },
        ]}
      >
        <Ionicons
          name={icon as any}
          size={18}
          color={T.inputIcon}
          style={styles.inputIcon}
        />
        <TextInput
          style={[styles.input, { color: T.inputText }]}
          placeholder={options.placeholder}
          placeholderTextColor={T.inputPlaceholder}
          value={value}
          onChangeText={onChange}
          keyboardType={options.keyboardType ?? "default"}
          autoCapitalize={options.autoCapitalize ?? "none"}
          autoCorrect={false}
          secureTextEntry={options.secure && !options.showSecure}
        />
        {options.toggleSecure && (
          <TouchableOpacity
            onPress={options.toggleSecure}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={options.showSecure ? "eye-outline" : "eye-off-outline"}
              size={18}
              color={T.inputIcon}
            />
          </TouchableOpacity>
        )}
      </View>
      {options.error && <Text style={styles.errorText}>{options.error}</Text>}
    </View>
  );

  return (
    <View style={[styles.mainBackground, { backgroundColor: T.mainBg }]}>
      <StatusBar style={T.statusBar} />

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
                {/* Row 1: back button absolutely positioned + logo independently */}
                <View style={styles.bannerTopRow}>
                  {/* Back button — absolutely pinned to top-left, decoupled from logo */}
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

                  {/* Logo sits independently to the right of the absolute button space */}
                  <Image
                    source={require("../../assets/images/logo.png")}
                    style={styles.logoImage}
                    resizeMode="contain"
                    // @ts-ignore
                    tintColor="#ffffff"
                  />
                </View>

                {/* Row 2: text block pinned to bottom of banner */}
                <View style={styles.bannerTextBlock}>
                  <Text style={[styles.bannerTitle, { color: T.titleColor }]}>
                    Welcome Back
                  </Text>
                  <Text
                    style={[styles.bannerSubtitle, { color: T.subtitleColor }]}
                  >
                    Sign in to continue streaming
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
              {renderInput(
                "Email",
                "mail-outline",
                formData.email,
                (t) => setFormData({ ...formData, email: t }),
                {
                  placeholder: "johndoe@gmail.com",
                  keyboardType: "email-address",
                  error: errors.email,
                },
              )}
              {renderInput(
                "Password",
                "lock-closed-outline",
                formData.password,
                (t) => setFormData({ ...formData, password: t }),
                {
                  placeholder: "Enter Your Password",
                  secure: true,
                  showSecure: showPassword,
                  toggleSecure: () => setShowPassword(!showPassword),
                  error: errors.password,
                },
              )}

              {/* Forgot Password Link */}
              <TouchableOpacity
                style={styles.forgotPasswordContainer}
                onPress={() => router.push("/auth/forgot-password" as any)}
              >
                <Text
                  style={[styles.forgotPasswordText, { color: T.signInLink }]}
                >
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              {/* ── Button ──────────────────────────────────────────── */}
              <View style={styles.buttonSpacer} />
              <TouchableOpacity
                style={[
                  styles.signInButton,
                  { backgroundColor: T.btnBg, shadowColor: T.shadow },
                  loading && styles.buttonDisabled,
                ]}
                onPress={handleSignIn}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color={T.btnText} style={{ flex: 1 }} />
                ) : (
                  <>
                    <Text
                      style={[styles.signInButtonText, { color: T.btnText }]}
                    >
                      Sign In
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

              {/* Sign Up link */}
              <View style={styles.signUpContainer}>
                <Text style={[styles.signUpText, { color: T.signInText }]}>
                  Don't have an account?{" "}
                </Text>
                <TouchableOpacity onPress={() => router.push("/auth/signup")}>
                  <Text style={[styles.signUpLink, { color: T.signInLink }]}>
                    Sign Up
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
    height: 220, // fixed height — matches signup
    flexDirection: "row",
    overflow: "hidden",
  },
  bannerLeft: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
    justifyContent: "space-between", // pins top row to top, text block to bottom
    zIndex: 2,
  },
  bannerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  // Back button absolutely positioned within bannerTopRow so it
  // doesn't affect the logo's own position — mirrors signup.tsx
  backAbsolute: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 5,
  },
  backCircle: {
    width: 34,
    height: 34,
    borderRadius: 17, // full circle
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: 220, // matches signup.tsx logo width
    height: 110, // proportional to banner height
  },
  // Text block pushed to bottom via parent's space-between
  bannerTextBlock: {
    marginTop: Spacing.sm,
  },
  bannerTitle: {
    fontSize: FontSizes.xl,
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
  eyeIcon: { padding: 6 },
  errorText: { fontSize: 11, color: "#ff6b6b", marginTop: 4, marginLeft: 4 },

  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginTop: 8,
    marginBottom: 4,
  },
  forgotPasswordText: {
    fontSize: 13,
    fontWeight: "600",
  },

  // ── Button ────────────────────────────────────────────────────────────────
  buttonSpacer: { height: 18 },
  signInButton: {
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
  signInButtonText: { fontSize: 15, fontWeight: "600", flex: 1 },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  // ── Footer link ───────────────────────────────────────────────────────────
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  signUpText: { fontSize: 13 },
  signUpLink: { fontSize: 13, fontWeight: "700" },
});
