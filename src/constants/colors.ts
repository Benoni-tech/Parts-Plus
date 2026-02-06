// src/constants/colors.ts - Complete Updated Version

export const Colors = {
  primary: "#FFD700", // Gold
  secondary: "#000000", // Black
  background: "#0A0A0A", // Rich Dark Background
  card: "#1A1A1A", // Card Background

  text: {
    primary: "#FFFFFF",
    secondary: "#999999",
    light: "#666666",
    white: "#FFFFFF",
  },

  // Gradient Colors - Using as const for TypeScript
  gradients: {
    primary: ["#FFD700", "#FFA500"] as const,
    hero: ["#1A1A2E", "#16213E", "#0F3460"] as const,
    purple: ["#A78BFA", "#7C3AED"] as const,
    red: ["#FF6B6B", "#FF5252"] as const,
    teal: ["#4ECDC4", "#38B2AC"] as const,
    yellow: ["#FFD93D", "#F9CA24"] as const,
  },

  // Accent Colors
  accents: {
    red: "#FF6B6B",
    teal: "#4ECDC4",
    yellow: "#FFD93D",
    purple: "#A78BFA",
    orange: "#FFA500",
  },

  error: "#FF3B30",
  success: "#34C759",
  warning: "#FF9500",

  overlay: "rgba(0, 0, 0, 0.3)",
  overlayDark: "rgba(0, 0, 0, 0.6)",
  overlayLight: "rgba(255, 255, 255, 0.05)",

  border: "rgba(255, 255, 255, 0.1)",
  borderLight: "rgba(255, 255, 255, 0.05)",

  inputBackground: "rgba(255, 255, 255, 0.1)",
  glass: "rgba(255, 255, 255, 0.1)",
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

// Shadow Presets
export const Shadows = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
};

// Animation Durations
export const AnimationDurations = {
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 800,
};

// Z-index layers
export const ZIndex = {
  background: -1,
  base: 0,
  elevated: 10,
  modal: 100,
  toast: 1000,
  tooltip: 10000,
};
