// app/index.tsx

import React, { useRef } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { AuthTheme, Colors } from "../src/constants/colors";

export default function Index() {
  const progress = useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const T = isDark ? AuthTheme.dark : AuthTheme.light;

  React.useEffect(() => {
    Animated.timing(progress, {
      toValue: 120,
      duration: 3000,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: T.background }]}>
      <View style={styles.logoContainer}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={[
            styles.logo,
            { tintColor: isDark ? "#ffffff" : Colors.primary },
          ]}
        />
      </View>
      <Text style={[styles.title, { color: T.textPrimary }]}>PARTS PLUS</Text>
      <Text style={[styles.subtitle, { color: T.textSecondary }]}>
        MASTER YOUR PART
      </Text>
      <View style={styles.bottomContainer}>
        <Text style={[styles.initializingText, { color: T.textSecondary }]}>
          INITIALIZING STUDIO
        </Text>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progress,
              backgroundColor: Colors.secondary,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 14,
    letterSpacing: 2,
    marginTop: 8,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 80,
    alignItems: "center",
  },
  initializingText: {
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 15,
  },
  progressBar: {
    height: 3,
    borderRadius: 2,
  },
});
