// src/constants/theme.ts
import { useColorScheme } from "react-native";

// Color definitions for both themes
export const LightTheme = {
  background: "#FFFFFF",
  backgroundSecondary: "#F5F5F5",
  card: "#F5F5F5",
  cardElevated: "#FFFFFF",
  text: {
    primary: "#000000",
    secondary: "#666666",
    tertiary: "#999999",
    white: "#FFFFFF",
  },
  border: "rgba(0, 0, 0, 0.1)",
  searchBg: "#F0F0F0",
  overlay: "rgba(0, 0, 0, 0.3)",
  success: "#C1FF72",
  warning: "#FFD93D",
  error: "#FF6B6B",
  primary: "#9B59B6",
};

export const DarkTheme = {
  background: "#0A0A0A",
  backgroundSecondary: "#1A1A1A",
  card: "#1A1A1A",
  cardElevated: "#252525",
  text: {
    primary: "#FFFFFF",
    secondary: "#999999",
    tertiary: "#666666",
    white: "#FFFFFF",
  },
  border: "rgba(255, 255, 255, 0.1)",
  searchBg: "rgba(255, 255, 255, 0.1)",
  overlay: "rgba(0, 0, 0, 0.6)",
  success: "#C1FF72",
  warning: "#FFD93D",
  error: "#FF6B6B",
  primary: "#9B59B6",
};

// Gradient colors (same for both themes)
export const Gradients = {
  purple: ["#A78BFA", "#7C3AED"],
  blue: ["#4ECDC4", "#38B2AC"],
  red: ["#FF6B6B", "#FF5252"],
  yellow: ["#FFD93D", "#F9CA24"],
  green: ["#C1FF72", "#A8E063"],
  hero: ["#1A1A2E", "#16213E", "#0F3460"],
};

// Accent colors (used in both themes)
export const AccentColors = {
  red: "#FF6B6B",
  teal: "#4ECDC4",
  yellow: "#FFD93D",
  purple: "#A78BFA",
  green: "#C1FF72",
  orange: "#FFA500",
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
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
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

export const FontWeights = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
  extrabold: "800" as const,
};

// Shadow presets
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
};

// Hook to get current theme
export const useTheme = () => {
  const colorScheme = useColorScheme();
  return colorScheme === "dark" ? DarkTheme : LightTheme;
};

// Legacy Colors export for backward compatibility
export const Colors = {
  primary: "#9B59B6",
  secondary: "#000000",
  background: "#FFFFFF",
  text: {
    primary: "#000000",
    secondary: "#666666",
    light: "#999999",
    white: "#FFFFFF",
  },
  error: "#FF3B30",
  success: "#34C759",
  warning: "#FF9500",
  overlay: "rgba(0, 0, 0, 0.2)",
  overlayDark: "rgba(0, 0, 0, 0.5)",
  border: "#E5E5E5",
  inputBackground: "#F5F5F5",
};
