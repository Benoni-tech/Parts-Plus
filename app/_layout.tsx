import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Colors } from "../src/constants/colors";
import { AuthProvider } from "../src/Contexts/authContexts";
import { useAuth } from "../src/hooks/useAuth";

function RootLayoutNav() {
  const { user, loading, initialized } = useAuth();
  const segments = useSegments() as string[];
  const router = useRouter();
  const [splashDone, setSplashDone] = useState(false);

  // Start splash timer
  useEffect(() => {
    const timer = setTimeout(() => setSplashDone(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!initialized || loading || !splashDone) return;

    const inAuthGroup = segments[0] === "auth";
    const inTabsGroup = segments[0] === "(tabs)" || segments[0] === "tabs";
    const inHymnDetail = segments[0] === "hymn";
    const inWelcome = segments[0] === "welcome";
    const inRoot = segments.length === 0;

    console.log("Auth state:", {
      user: user?.email,
      emailVerified: user?.emailVerified,
      segments,
      inRoot,
    });

    if (!user) {
      if (!inWelcome && !inAuthGroup) {
        console.log("📍 Navigating to welcome (no user)");
        router.replace("/welcome");
      }
    } else {
      if (user.emailVerified) {
        if (!inTabsGroup && !inHymnDetail) {
          console.log("📍 Navigating to tabs (verified user)");
          router.replace("/tabs");
        }
      } else {
        if (!inAuthGroup || segments[1] !== "verify-email") {
          console.log("📍 Navigating to verify-email (unverified user)");
          router.replace("/auth/verify-email");
        }
      }
    }
  }, [user, user?.emailVerified, segments, initialized, loading, splashDone]);

  if (!initialized || !splashDone) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
});
