// app/_layout.tsx - COMPLETE FIXED VERSION

import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Colors } from "../src/constants/colors";
import { AuthProvider } from "../src/Contexts/authContexts";
import { useAuth } from "../src/hooks/useAuth";

function RootLayoutNav() {
  const { user, loading, initialized } = useAuth();
  const segments = useSegments() as string[];
  const router = useRouter();

  useEffect(() => {
    if (!initialized || loading) {
      return;
    }

    const inAuthGroup = segments[0] === "auth";
    const inTabsGroup = segments[0] === "(tabs)" || segments[0] === "tabs";
    const inHymnDetail = segments[0] === "hymn";

    console.log("Auth state:", {
      user: user?.email,
      emailVerified: user?.emailVerified,
      segments,
    });

    if (!user) {
      // User is not signed in - redirect to welcome
      if (!inAuthGroup && segments[0] !== "welcome") {
        router.replace("/welcome");
      }
    } else {
      // User is signed in
      if (user.emailVerified) {
        // Email is verified - allow navigation to hymn details or tabs
        if (!inTabsGroup && !inHymnDetail && segments[0] !== "welcome") {
          router.replace("/tabs");
        }
      } else {
        // Email not verified - stay on current auth screen
        console.log("User not verified yet");
      }
    }
  }, [user, user?.emailVerified, segments, initialized, loading]);

  if (!initialized || loading) {
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
