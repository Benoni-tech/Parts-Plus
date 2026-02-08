// src/components/player/AudioPlayer.tsx - MINI PLAYER (for detail screen)

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { FontSizes, Spacing } from "../../constants/colors";
import { Hymn, VoicePart } from "../../types/hymn.types";

interface AudioPlayerProps {
  hymn: Hymn;
  voicePart: VoicePart;
  onOpenFullPlayer?: () => void;
}

export default function AudioPlayer({
  hymn,
  voicePart,
  onOpenFullPlayer,
}: AudioPlayerProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const theme = {
    card: isDark ? "#1A1A1A" : "#F5F5F5",
    text: isDark ? "#FFFFFF" : "#000000",
    textSecondary: isDark ? "#999999" : "#666666",
  };

  const getVoicePartColor = () => {
    const colors: Record<VoicePart, string> = {
      soprano: "#FF6B6B",
      alto: "#4ECDC4",
      tenor: "#FFD93D",
      bass: "#A78BFA",
    };
    return colors[voicePart];
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.card }]}
      onPress={onOpenFullPlayer}
      activeOpacity={0.7}
    >
      {/* Now Playing Indicator */}
      <View style={styles.nowPlaying}>
        <View style={styles.pulseIndicator}>
          <View
            style={[styles.pulse, { backgroundColor: getVoicePartColor() }]}
          />
          <View
            style={[styles.pulse, { backgroundColor: getVoicePartColor() }]}
          />
          <View
            style={[styles.pulse, { backgroundColor: getVoicePartColor() }]}
          />
        </View>
        <Text style={[styles.nowPlayingText, { color: theme.textSecondary }]}>
          Tap to play{" "}
          <Text style={[styles.voicePartText, { color: getVoicePartColor() }]}>
            {voicePart.toUpperCase()}
          </Text>
        </Text>
      </View>

      {/* Play Button */}
      <TouchableOpacity
        style={[styles.playButton, { backgroundColor: getVoicePartColor() }]}
        onPress={onOpenFullPlayer}
      >
        <Ionicons name="play" size={24} color="#FFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    padding: Spacing.lg,
    marginVertical: Spacing.md,
    marginHorizontal: Spacing.lg,
  },
  nowPlaying: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  pulseIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  pulse: {
    width: 3,
    height: 16,
    borderRadius: 2,
    opacity: 0.7,
  },
  nowPlayingText: {
    fontSize: FontSizes.md,
    flex: 1,
  },
  voicePartText: {
    fontWeight: "700",
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
