// app/_layout.tsx

import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { AuthProvider } from "../src/Contexts/authContexts";
import { useAuth } from "../src/hooks/useAuth";

function RootLayoutNav() {
  const { user, loading, initialized } = useAuth();
  const segments = useSegments() as string[];
  const router = useRouter();
  const [splashDone, setSplashDone] = useState(false);

  // ── 4 second splash gate — matches index.tsx progress bar duration ────────
  useEffect(() => {
    const timer = setTimeout(() => setSplashDone(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  // ── Navigation guard — only fires once splash and auth are both ready ─────
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

  // ── Always render Slot — index.tsx is the splash screen ──────────────────
  // No ActivityIndicator here. index.tsx handles the visual splash experience.
  // The splashDone timer gates navigation, not rendering.
  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({});
