import { Text, View, StyleSheet, Animated, Image } from "react-native";
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import React from "react";

export default function Index() {
  const router = useRouter();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 120,
      duration: 3000,
      useNativeDriver: false,
    }).start(() => {
      router.replace('/welcome');
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
      <Image source={require('@/assets/images/logo.png')} style={{width: 100, height: 100, tintColor: 'white'}} />
      </View>
      <Text style={styles.title}>PARTS PLUS</Text>
      <Text style={styles.subtitle}>MASTER YOUR PART</Text>
      <View style={styles.bottomContainer}>
        <Text style={styles.initializingText}>INITIALIZING STUDIO</Text>
        <Animated.View style={[styles.progressBar, { width: progress }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  subtitle: {
    color: '#AAA',
    fontSize: 14,
    letterSpacing: 2,
    marginTop: 8,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
  },
  initializingText: {
    color: '#888',
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 15,
  },
  progressBar: {
    height: 3,
    backgroundColor: '#FFD700',
    borderRadius: 2,
  },
});
