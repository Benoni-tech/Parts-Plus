// src/components/profile/GridOverlay.tsx

import React from "react";
import { StyleSheet, View } from "react-native";

export default function GridOverlay({ isDark }: { isDark: boolean }) {
  const cols = 8;
  const rows = 5;
  const lineColor = isDark ? "#ffffff" : "rgba(255,255,255,0.85)";

  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: cols }).map((_, i) => {
        const progress = i / (cols - 1);
        return (
          <View
            key={`v-${i}`}
            style={[
              styles.line,
              styles.vertical,
              {
                left: `${progress * 100}%` as any,
                opacity: isDark ? progress * 0.95 : progress * 0.6,
                backgroundColor: lineColor,
              },
            ]}
          />
        );
      })}
      {Array.from({ length: rows }).map((_, i) => (
        <View
          key={`h-${i}`}
          style={[
            styles.line,
            styles.horizontal,
            {
              top: `${(i / (rows - 1)) * 100}%` as any,
              opacity: isDark ? 0.3 : 0.22,
              backgroundColor: lineColor,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, overflow: "hidden" },
  line: { position: "absolute" },
  vertical: { top: 0, bottom: 0, width: 1 },
  horizontal: { left: 0, right: 0, height: 1 },
});
