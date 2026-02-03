// app/_layout.tsx

import React, { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthProvider } from '../src/Contexts/authContexts';
import { useAuth } from '../src/hooks/useAuth';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../src/constants/colors';

function RootLayoutNav() {
  const { user, loading, initialized } = useAuth();
  const segments = useSegments() as string[];  // Move this OUTSIDE useEffect
  const router = useRouter();

  useEffect(() => {
    if (!initialized || loading) {
      return;
    }

    const inAuthGroup = segments[0] === 'auth';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!user) {
      // User is not signed in
      if (!segments.includes('welcome') && 
          !segments.includes('signup') && 
          !segments.includes('signin')) {
        router.replace('/welcome');
      }
    } else if (!user.emailVerified) {
      // User signed in but not verified - stay where they are
    } else {
      // User is signed in and verified
      if (!inTabsGroup) {
        router.replace('/tabs');
      }
    }
  }, [user, segments, initialized, loading]);

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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});