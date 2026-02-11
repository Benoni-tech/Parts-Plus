// src/components/player/FullScreenPlayer.tsx - NEW FILE

import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FontSizes, Spacing } from "../../constants/colors";
import { HymnService } from "../../services/firebase.service";
import { Hymn, VoicePart } from "../../types/hymn.types";

interface FullScreenPlayerProps {
  hymn: Hymn;
  voicePart: VoicePart;
  onClose: () => void;
}

export default function FullScreenPlayer({
  hymn,
  voicePart,
  onClose,
}: FullScreenPlayerProps) {
  const router = useRouter();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showCredits, setShowCredits] = useState(false);

  useEffect(() => {
    loadAudio();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const loadAudio = async () => {
    try {
      setIsLoading(true);

      if (sound) {
        await sound.unloadAsync();
      }

      const audioUrl = hymn.voiceParts[voicePart];

      if (!audioUrl) {
        console.error("No audio URL for voice part:", voicePart);
        return;
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true },
        onPlaybackStatusUpdate,
      );

      setSound(newSound);
      setIsPlaying(true);

      if (hymn.id) {
        HymnService.incrementPlays(hymn.id);
      }
    } catch (error) {
      console.error("Error loading audio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);

      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
      }
    }
  };

  const togglePlayPause = async () => {
    if (!sound) {
      await loadAudio();
      return;
    }

    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const seekTo = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  const skipBackward = async () => {
    if (sound) {
      await sound.setPositionAsync(Math.max(0, position - 10000));
    }
  };

  const skipForward = async () => {
    if (sound) {
      await sound.setPositionAsync(Math.min(duration, position + 10000));
    }
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
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
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri:
            hymn.coverImage || "https://via.placeholder.com/400/9B59B6/FFFFFF",
        }}
        style={styles.headerBackground}
        blurRadius={20}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.9)"]}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <Ionicons name="chevron-down" size={28} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Now Playing</Text>
            <TouchableOpacity style={styles.moreButton}>
              <Ionicons name="ellipsis-vertical" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.albumContainer}>
            <Image
              source={{
                uri:
                  hymn.coverImage ||
                  `https://via.placeholder.com/300/9B59B6/FFFFFF?text=${hymn.title[0] || "H"}`,
              }}
              style={styles.albumArt}
            />
          </View>
        </LinearGradient>
      </ImageBackground>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <View style={styles.titleSection}>
              <Text style={styles.title} numberOfLines={2}>
                {hymn.title}
              </Text>
              <Text style={styles.artist} numberOfLines={1}>
                {hymn.composer}
              </Text>
              <View
                style={[
                  styles.voicePartBadge,
                  { backgroundColor: getVoicePartColor() + "20" },
                ]}
              >
                <Text
                  style={[styles.voicePartText, { color: getVoicePartColor() }]}
                >
                  {voicePart.toUpperCase()}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.favoriteButton}>
              <Ionicons name="heart-outline" size={28} color="#9B59B6" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.waveformContainer}>
          {Array.from({ length: 50 }).map((_, index) => {
            const progress = duration > 0 ? position / duration : 0;
            const isActive = index / 50 < progress;
            const height = Math.random() * 40 + 10;

            return (
              <View
                key={index}
                style={[
                  styles.waveformBar,
                  {
                    height,
                    backgroundColor: isActive ? getVoicePartColor() : "#E0E0E0",
                  },
                ]}
              />
            );
          })}
        </View>

        <View style={styles.progressSection}>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>

          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onSlidingComplete={seekTo}
            minimumTrackTintColor={getVoicePartColor()}
            maximumTrackTintColor="#E0E0E0"
            thumbTintColor={getVoicePartColor()}
          />
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="shuffle" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={skipBackward}>
            <Ionicons name="play-skip-back" size={32} color="#333" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.playButton,
              { backgroundColor: getVoicePartColor() },
            ]}
            onPress={togglePlayPause}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" size="large" />
            ) : (
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={40}
                color="#FFF"
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={skipForward}>
            <Ionicons name="play-skip-forward" size={32} color="#333" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="repeat" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.toggleButtons}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              showLyrics && styles.toggleButtonActive,
            ]}
            onPress={() => setShowLyrics(!showLyrics)}
          >
            <Ionicons
              name="document-text-outline"
              size={20}
              color={showLyrics ? "#FFF" : "#666"}
            />
            <Text
              style={[styles.toggleText, showLyrics && styles.toggleTextActive]}
            >
              Lyrics
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleButton,
              showCredits && styles.toggleButtonActive,
            ]}
            onPress={() => setShowCredits(!showCredits)}
          >
            <Ionicons
              name="people-outline"
              size={20}
              color={showCredits ? "#FFF" : "#666"}
            />
            <Text
              style={[
                styles.toggleText,
                showCredits && styles.toggleTextActive,
              ]}
            >
              Credits
            </Text>
          </TouchableOpacity>
        </View>

        {showLyrics && hymn.lyrics && (
          <View style={styles.lyricsContainer}>
            <Text style={styles.lyricsTitle}>Lyrics</Text>
            <Text style={styles.lyrics}>{hymn.lyrics}</Text>
          </View>
        )}

        {showCredits && (
          <View style={styles.creditsContainer}>
            <Text style={styles.creditsTitle}>Credits</Text>
            {Object.entries(hymn.credits).map(([role, name]) => (
              <View key={role} style={styles.creditRow}>
                <Text style={styles.creditRole}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Text>
                <Text style={styles.creditName}>{name}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF", // CHANGED
  },
  headerBackground: {
    width: "100%",
    height: 450,
  },
  headerGradient: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: FontSizes.md,
    fontWeight: "600",
    color: "#FFF",
  },
  moreButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  albumContainer: {
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  albumArt: {
    width: 280,
    height: 280,
    borderRadius: 32, // CHANGED (more rounded sides)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  content: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  infoContainer: {
    padding: Spacing.lg,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleSection: {
    flex: 1,
    marginRight: Spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  artist: {
    fontSize: FontSizes.md,
    color: "#666",
    marginBottom: 8,
  },
  voicePartBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  voicePartText: {
    fontSize: 12,
    fontWeight: "700",
  },
  favoriteButton: {
    padding: 8,
  },
  waveformContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  waveformBar: {
    width: 2,
    borderRadius: 1,
  },
  progressSection: {
    paddingHorizontal: Spacing.lg,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  timeText: {
    fontSize: 12,
    color: "#666",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  controlButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  toggleButtons: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  toggleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
  },
  toggleButtonActive: {
    backgroundColor: "#e9bf03",
  },
  toggleText: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    color: "#666",
  },
  toggleTextActive: {
    color: "#FFF",
  },
  lyricsContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: "#F9F9F9",
    marginHorizontal: Spacing.lg,
    borderRadius: 12,
    marginBottom: Spacing.lg,
  },
  lyricsTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    marginBottom: Spacing.md,
    color: "#000",
  },
  lyrics: {
    fontSize: FontSizes.md,
    lineHeight: 24,
    color: "#333",
  },
  creditsContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: "#F9F9F9",
    marginHorizontal: Spacing.lg,
    borderRadius: 12,
    marginBottom: Spacing.lg,
  },
  creditsTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    marginBottom: Spacing.md,
    color: "#000",
  },
  creditRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  creditRole: {
    fontSize: FontSizes.sm,
    color: "#666",
    fontWeight: "600",
  },
  creditName: {
    fontSize: FontSizes.sm,
    color: "#000000",
    fontWeight: "700",
  },
});
