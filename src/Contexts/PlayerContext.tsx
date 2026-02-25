// src/contexts/PlayerContext.tsx

import { Audio } from "expo-av";
import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { HymnService } from "../services/firebase.service";
import { Hymn, VoicePart } from "../types/hymn.types";

// ─── Voice part order ─────────────────────────────────────────────────────────
const VOICE_PART_ORDER: VoicePart[] = ["soprano", "alto", "tenor", "bass"];

interface PlayerState {
  hymn: Hymn | null;
  voicePart: VoicePart | null;
  isPlaying: boolean;
  isLoading: boolean;
  position: number;
  duration: number;
  isFullPlayerOpen: boolean;
  // Available parts for the current hymn (parts that have a URL)
  availableParts: VoicePart[];
}

interface PlayerContextType extends PlayerState {
  play: (hymn: Hymn, voicePart: VoicePart) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seekTo: (millis: number) => Promise<void>;
  skipForward: () => Promise<void>;
  skipBackward: () => Promise<void>;
  nextPart: () => Promise<void>;
  prevPart: () => Promise<void>;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  shuffleOn: boolean;
  repeatOn: boolean;
  openFullPlayer: () => void;
  closeFullPlayer: () => void;
  stop: () => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const soundRef = useRef<Audio.Sound | null>(null);

  const [hymn, setHymn] = useState<Hymn | null>(null);
  const [voicePart, setVoicePart] = useState<VoicePart | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);
  const [availableParts, setAvailableParts] = useState<VoicePart[]>([]);
  const [shuffleOn, setShuffleOn] = useState(false);
  const [repeatOn, setRepeatOn] = useState(false);

  // ── Cleanup on unmount ─────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  // ── Playback status callback ───────────────────────────────────────────────
  const onPlaybackStatusUpdate = useCallback(
    (status: any) => {
      if (!status.isLoaded) return;
      setPosition(status.positionMillis ?? 0);
      setDuration(status.durationMillis ?? 0);
      setIsPlaying(status.isPlaying ?? false);

      if (status.didJustFinish) {
        if (repeatOn) {
          soundRef.current?.replayAsync();
        } else {
          setIsPlaying(false);
          setPosition(0);
        }
      }
    },
    [repeatOn],
  );

  const loadAndPlay = useCallback(
    async (targetHymn: Hymn, targetPart: VoicePart) => {
      try {
        setIsLoading(true);

        if (soundRef.current) {
          await soundRef.current.stopAsync().catch(() => {});
          await soundRef.current.unloadAsync().catch(() => {});
          soundRef.current = null;
        }

        setPosition(0);
        setDuration(0);
        setIsPlaying(false);

        const audioUrl = targetHymn.voiceParts[targetPart];
        if (!audioUrl) {
          console.warn(`No audio URL for ${targetPart}`);
          setIsLoading(false);
          return;
        }

        await Audio.setAudioModeAsync({
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
        });

        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: true },
          onPlaybackStatusUpdate,
        );

        soundRef.current = sound;
        setHymn(targetHymn);
        setVoicePart(targetPart);
        setIsPlaying(true);

        // Determine available parts
        const parts = VOICE_PART_ORDER.filter(
          (p) => !!targetHymn.voiceParts[p],
        );
        setAvailableParts(parts);

        if (targetHymn.id) {
          HymnService.incrementPlays(targetHymn.id).catch(() => {});
        }
      } catch (e) {
        if (__DEV__) console.error("PlayerContext loadAndPlay error:", e);
      } finally {
        setIsLoading(false);
      }
    },
    [onPlaybackStatusUpdate],
  );

  // ── Public API ────────────────────────────────────────────────────────────

  const play = useCallback(
    async (newHymn: Hymn, newPart: VoicePart) => {
      await loadAndPlay(newHymn, newPart);
      setIsFullPlayerOpen(true);
    },
    [loadAndPlay],
  );

  const togglePlayPause = useCallback(async () => {
    if (!soundRef.current) return;
    if (isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }
  }, [isPlaying]);

  const seekTo = useCallback(async (millis: number) => {
    if (soundRef.current) await soundRef.current.setPositionAsync(millis);
  }, []);

  const skipForward = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(
        Math.min(duration, position + 10000),
      );
    }
  }, [position, duration]);

  const skipBackward = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(Math.max(0, position - 10000));
    }
  }, [position]);

  const nextPart = useCallback(async () => {
    if (!hymn || !voicePart || availableParts.length < 2) return;
    const currentIndex = availableParts.indexOf(voicePart);
    const nextIndex = (currentIndex + 1) % availableParts.length;
    await loadAndPlay(hymn, availableParts[nextIndex]);
  }, [hymn, voicePart, availableParts, loadAndPlay]);

  const prevPart = useCallback(async () => {
    if (!hymn || !voicePart || availableParts.length < 2) return;
    const currentIndex = availableParts.indexOf(voicePart);
    const prevIndex =
      (currentIndex - 1 + availableParts.length) % availableParts.length;
    await loadAndPlay(hymn, availableParts[prevIndex]);
  }, [hymn, voicePart, availableParts, loadAndPlay]);

  const toggleShuffle = useCallback(() => setShuffleOn((s) => !s), []);
  const toggleRepeat = useCallback(() => setRepeatOn((r) => !r), []);

  const openFullPlayer = useCallback(() => setIsFullPlayerOpen(true), []);
  const closeFullPlayer = useCallback(() => setIsFullPlayerOpen(false), []);

  const stop = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync().catch(() => {});
      await soundRef.current.unloadAsync().catch(() => {});
      soundRef.current = null;
    }
    setHymn(null);
    setVoicePart(null);
    setIsPlaying(false);
    setPosition(0);
    setDuration(0);
    setIsFullPlayerOpen(false);
  }, []);

  const value: PlayerContextType = {
    hymn,
    voicePart,
    isPlaying,
    isLoading,
    position,
    duration,
    isFullPlayerOpen,
    availableParts,
    shuffleOn,
    repeatOn,
    play,
    togglePlayPause,
    seekTo,
    skipForward,
    skipBackward,
    nextPart,
    prevPart,
    toggleShuffle,
    toggleRepeat,
    openFullPlayer,
    closeFullPlayer,
    stop,
  };

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerContextType {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
