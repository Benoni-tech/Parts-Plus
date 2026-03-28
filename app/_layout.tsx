import { Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { PlayerProvider, usePlayer } from "../src/Contexts/PlayerContext";
import { AuthProvider } from "../src/Contexts/authContexts";
import FullScreenPlayer from "../src/components/player/FullScreenPlayer";
import MiniPlayer from "../src/components/player/MiniPlayer";
import { useAuth } from "../src/hooks/useAuth";

SplashScreen.preventAutoHideAsync();

(Text as any).defaultProps = (Text as any).defaultProps || {};
(Text as any).defaultProps.maxFontSizeMultiplier = 1.2;

(TextInput as any).defaultProps = (TextInput as any).defaultProps || {};
(TextInput as any).defaultProps.maxFontSizeMultiplier = 1.2;

function RootLayoutNav() {
  const { user, loading, initialized } = useAuth();
  const { stop } = usePlayer();
  const segments = useSegments() as string[];
  const router = useRouter();
  const prevUserRef = useRef<string | null | undefined>(undefined);

  // Hide splash screen once auth is initialized and loading is done
  useEffect(() => {
    const hideSplash = async () => {
      if (initialized && !loading) {
        await SplashScreen.hideAsync();
      }
    };
    hideSplash();
  }, [initialized, loading]);

  // Stop player whenever user logs out (handles both manual and automatic sign-out)
  useEffect(() => {
    if (!initialized) return;
    const wasLoggedIn =
      prevUserRef.current !== null && prevUserRef.current !== undefined;
    const isNowLoggedOut = user === null;
    if (wasLoggedIn && isNowLoggedOut) {
      stop();
    }
    prevUserRef.current = user?.uid ?? null;
  }, [user, initialized]);

  // Navigation guard - this replaces the custom splash screen logic
  useEffect(() => {
    // Don't navigate until auth is initialized and splash is ready
    if (!initialized || loading) return;

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
      // Not signed in - go to welcome or auth
      if (!inWelcome && !inAuthGroup) {
        if (__DEV__) console.log("📍 Navigating to welcome (no user)");
        router.replace("/welcome");
      }
    } else {
      // Signed in
      if (user.emailVerified) {
        // Verified user - go to main app
        const onVerificationSuccess =
          inAuthGroup && segments[1] === "verification-success";
        if (!inTabsGroup && !inHymnDetail && !onVerificationSuccess) {
          if (__DEV__) console.log("📍 Navigating to tabs (verified user)");
          router.replace("/(tabs)" as any);
        }
      } else {
        // Unverified user - go to verify email
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
  }, [user, user?.emailVerified, segments, initialized, loading, router]);

  return (
    <View style={styles.root}>
      <Slot />
      <MiniPlayer />
      <FullScreenPlayer />
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <RootLayoutNav />
      </PlayerProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
