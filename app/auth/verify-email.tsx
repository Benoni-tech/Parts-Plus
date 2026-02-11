// app/auth/verify-email.tsx - EMAIL VERIFICATION SCREEN

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import {
  BorderRadius,
  Colors,
  FontSizes,
  Spacing,
} from "../../src/constants/colors";
import { useAuth } from "../../src/hooks/useAuth";

const { width } = Dimensions.get("window");

export default function VerifyEmail() {
  const router = useRouter();
  const { user, checkEmailVerified, sendEmailVerification } = useAuth();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleCheckVerification = async () => {
    if (!user) {
      Alert.alert("Error", "No user found");
      return;
    }

    setLoading(true);
    try {
      const isVerified = await checkEmailVerified();

      if (isVerified) {
        // Show success and navigate
        router.replace("/auth/verification-success");
      } else {
        Alert.alert(
          "Not Verified Yet",
          "Please check your email and click the verification link, then try again.",
        );
      }
    } catch (error: any) {
      Alert.alert("Error", "Could not check verification status");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await sendEmailVerification();
      Alert.alert(
        "Success",
        "Verification email sent! Please check your inbox.",
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

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Animated.View entering={FadeIn.duration(800)} style={styles.content}>
        {/* Mail Icon */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(200)}
          style={styles.iconContainer}
        >
          <View style={styles.mailCircle}>
            <Ionicons
              name="mail-open-outline"
              size={80}
              color={Colors.primary}
            />
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.Text
          entering={FadeInUp.duration(600).delay(400)}
          style={styles.title}
        >
          Verify Your Email
        </Animated.Text>

        {/* Message */}
        <Animated.Text
          entering={FadeInUp.duration(600).delay(600)}
          style={styles.message}
        >
          We've sent a verification link to
        </Animated.Text>

        <Animated.Text
          entering={FadeInUp.duration(600).delay(700)}
          style={styles.email}
        >
          {user?.email}
        </Animated.Text>

        <Animated.Text
          entering={FadeInUp.duration(600).delay(800)}
          style={styles.instructions}
        >
          Please check your inbox and click the link to verify your account.
        </Animated.Text>

        {/* Check Verification Button */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(1000)}
          style={styles.buttonContainer}
        >
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={handleCheckVerification}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={Colors.text.primary} />
            ) : (
              <>
                <Text style={styles.verifyButtonText}>
                  I've Verified My Email
                </Text>
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={Colors.text.primary}
                />
              </>
            )}
          </TouchableOpacity>

          {/* Resend Link */}
          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleResend}
            disabled={resending}
          >
            {resending ? (
              <ActivityIndicator color={Colors.primary} size="small" />
            ) : (
              <Text style={styles.resendText}>
                Didn't receive the email?{" "}
                <Text style={styles.resendLink}>Resend</Text>
              </Text>
            )}
          </TouchableOpacity>

          {/* Back to Sign In */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace("/auth/signin")}
          >
            <Text style={styles.backText}>Back to Sign In</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing.xxl,
  },
  mailCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text.white,
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  message: {
    fontSize: FontSizes.md,
    color: Colors.text.light,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  email: {
    fontSize: FontSizes.lg,
    color: Colors.primary,
    fontWeight: "600",
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  instructions: {
    fontSize: FontSizes.md,
    color: Colors.text.light,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: Spacing.xxl,
    paddingHorizontal: Spacing.md,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 320,
  },
  verifyButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: Spacing.lg,
  },
  verifyButtonText: {
    fontSize: FontSizes.lg,
    color: Colors.text.primary,
    fontWeight: "600",
  },
  resendButton: {
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  resendText: {
    fontSize: FontSizes.sm,
    color: Colors.text.light,
    textAlign: "center",
  },
  resendLink: {
    color: Colors.primary,
    fontWeight: "700",
  },
  backButton: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  backText: {
    fontSize: FontSizes.md,
    color: Colors.text.light,
  },
});
