// app/welcome.tsx

import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  BorderRadius,
  Colors,
  FontSizes,
  Spacing,
} from "../src/constants/colors";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ImageBackground
        source={require("../assets/images/back.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Black overlay with 0.2 opacity */}
        <View style={styles.overlay} />

        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
              contentFit="contain"
            />
          </View>

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.appName}>Parts Plus</Text>
          </View>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Stream the favorite parts of your favorite hymns, choruses
            effortlessly.
          </Text>

          {/* Spacer */}
          <View style={styles.spacer} />

          {/* Get Started Button */}
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => router.push("/auth/signup")}
            activeOpacity={0.8}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
            <View style={styles.arrowCircle}>
              <Ionicons
                name="arrow-forward"
                size={20}
                color={Colors.text.white}
              />
            </View>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/auth/signin")}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay, // Black with 0.2 opacity
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: 80,
    paddingBottom: 60,
    justifyContent: "space-between",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  logo: {
    width: 120,
    height: 120,
  },
  titleContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  welcomeText: {
    fontSize: FontSizes.xl,
    color: Colors.text.white,
    fontWeight: "400",
    marginBottom: 8,
  },
  appName: {
    fontSize: FontSizes.xxxl,
    color: Colors.primary, // Yellow
    fontWeight: "bold",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.text.white,
    textAlign: "center",
    lineHeight: 24,
    marginTop: 20,
    paddingHorizontal: Spacing.md,
  },
  spacer: {
    flex: 1,
  },
  getStartedButton: {
    backgroundColor: Colors.primary, // Yellow background
    borderRadius: BorderRadius.lg,
    paddingVertical: 18,
    paddingHorizontal: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 5,
    shadowColor: Colors.secondary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  getStartedText: {
    fontSize: FontSizes.lg,
    color: Colors.secondary, // Black text
    fontWeight: "600",
    flex: 1,
  },
  arrowCircle: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.secondary, // Black circle
    justifyContent: "center",
    alignItems: "center",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.lg,
  },
  loginText: {
    fontSize: FontSizes.md,
    color: Colors.text.white,
  },
  loginLink: {
    fontSize: FontSizes.md,
    color: Colors.primary, // Yellow
    fontWeight: "600",
  },
});
