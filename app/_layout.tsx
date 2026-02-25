// app/_layout.tsx

import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { PlayerProvider } from "../src/Contexts/PlayerContext";
import { AuthProvider } from "../src/Contexts/authContexts";
import FullScreenPlayer from "../src/components/player/FullScreenPlayer";
import MiniPlayer from "../src/components/player/MiniPlayer";
import { useAuth } from "../src/hooks/useAuth";

function RootLayoutNav() {
  const { user, loading, initialized } = useAuth();
  const segments = useSegments() as string[];
  const router = useRouter();
  const [splashDone, setSplashDone] = useState(false);

  // 4 second splash gate
  useEffect(() => {
    const timer = setTimeout(() => setSplashDone(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Navigation guard
  useEffect(() => {
    if (!initialized || loading || !splashDone) return;

    const inAuthGroup = segments[0] === "auth";
    const inTabsGroup = segments[0] === "(tabs)";
    const inHymnDetail = segments[0] === "hymn";
    const inWelcome = segments[0] === "welcome";
    const inRoot = segments.length === 0;

    if (__DEV__) {
      console.log("Auth state:", {
        user: user?.email,
        emailVerified: user?.emailVerified,
        segments,
        inRoot,
      });
    }

    if (!user) {
      if (!inWelcome && !inAuthGroup) {
        if (__DEV__) console.log("📍 Navigating to welcome (no user)");
        router.replace("/welcome");
      }
    } else {
      if (user.emailVerified) {
        const onVerificationSuccess =
          inAuthGroup && segments[1] === "verification-success";
        if (!inTabsGroup && !inHymnDetail && !onVerificationSuccess) {
          if (__DEV__) console.log("📍 Navigating to tabs (verified user)");
          router.replace("/(tabs)" as any);
        }
      } else {
        const onVerifyEmail = inAuthGroup && segments[1] === "verify-email";
        const onVerifySuccess =
          inAuthGroup && segments[1] === "verification-success";
        if (!onVerifyEmail && !onVerifySuccess) {
          if (__DEV__)
            console.log("📍 Navigating to verify-email (unverified user)");
          router.replace("/auth/verify-email");
        }
      }
    }
  }, [user, user?.emailVerified, segments, initialized, loading, splashDone]);

  return (
    <View style={styles.root}>
      {/* All screens */}
      <Slot />

      {/* ✅ MiniPlayer and FullScreenPlayer live here — above all screens,
          persistent across all navigation */}
      <MiniPlayer />
      <FullScreenPlayer />
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      {/* PlayerProvider wraps the entire app so any screen can trigger playback */}
      <PlayerProvider>
        <RootLayoutNav />
      </PlayerProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
