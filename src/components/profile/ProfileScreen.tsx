// src/components/profile/ProfileScreen.tsx

import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    useColorScheme,
    View,
} from "react-native";
import { AuthTheme } from "../../constants/colors";
import { useAuth } from "../../hooks/useAuth";
import AccountSection from "./AccountSection";
import AppPreferencesSection from "./AppPreferencesSection";
import ProfileBanner from "./ProfileBanner";
import SignOutButton from "./SignOutButton";
import SupportSection from "./SupportSection";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const T = isDark ? AuthTheme.dark : AuthTheme.light;

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            router.replace("/auth/signin" as any);
          } catch (error: any) {
            Alert.alert("Error", error.message);
          }
        },
      },
    ]);
  };

  return (
    <View style={[styles.mainBackground, { backgroundColor: T.mainBg }]}>
      <StatusBar style={T.statusBar} />

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* ── Banner ─────────────────────────────────────────────────────── */}
        <ProfileBanner
          user={user}
          isDark={isDark}
          T={T}
          onEditPress={() => router.push("/profile/edit" as any)}
        />

        {/* ── Sections ───────────────────────────────────────────────────── */}
        <View style={styles.sectionsContainer}>
          <AccountSection user={user} isDark={isDark} T={T} router={router} />
          <AppPreferencesSection isDark={isDark} T={T} />
          <SupportSection isDark={isDark} T={T} />
          <SignOutButton isDark={isDark} T={T} onSignOut={handleSignOut} />
          <View style={{ height: 48 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainBackground: {
    flex: 1,
  },
  sectionsContainer: {
    paddingHorizontal: 16,
  },
});
