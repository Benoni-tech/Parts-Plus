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

// ─── Auth Theme Type ──────────────────────────────────────────────────────────
// Use this type for any component prop that accepts a theme token object.
// Avoids TypeScript union narrowing errors caused by statusBar literal types.
export type AuthThemeType = {
  mainBg: string;
  cardBg: string;
  cardBorder: string;
  bannerBg: string;
  backRectBg: string;
  backRectBorder: string;
  backArrow: string;
  titleColor: string;
  subtitleColor: string;
  gridLine: string;
  gridLineTint: string;
  labelColor: string;
  inputBg: string;
  inputBorder: string;
  inputBorderFocus: string;
  inputText: string;
  inputPlaceholder: string;
  inputIcon: string;
  checkboxBorder: string;
  rememberText: string;
  btnBg: string;
  btnText: string;
  btnArrowBg: string;
  btnArrow: string;
  signInText: string;
  signInLink: string;
  statusBar: "light" | "dark";
  shadow: string;
};

// ─── Auth Screen Theme Tokens ─────────────────────────────────────────────────
// Used by signup, signin, and any other auth screens.
// Import: import { AuthTheme } from "../../src/constants/colors";
// Usage:  const T = useColorScheme() === "dark" ? AuthTheme.dark : AuthTheme.light;

export const AuthTheme = {
  dark: {
    // Backgrounds
    mainBg: "#0a0a0a", // near-black outer shell
    cardBg: "#161616", // slightly lifted card — not pure black
    cardBorder: "rgba(255, 255, 255, 0.10)",

    // Banner (top accent block inside card)
    bannerBg: "#222222", // lighter-black for contrast against card
    backRectBg: "rgba(255,255,255,0.12)",
    backRectBorder: "rgba(255,255,255,0.22)",
    backArrow: "#ffffff",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255,255,255,0.60)",

    // Grid lines
    gridLine: "rgb(255, 255, 255)",
    gridLineTint: "#e8e0d0",

    // Form labels
    labelColor: "rgba(255,255,255,0.55)",

    // Input fields
    inputBg: "#2a2a2a",
    inputBorder: "rgba(255,255,255,0.22)",
    inputBorderFocus: "rgba(255,255,255,0.50)",
    inputText: "#ffffff",
    inputPlaceholder: "rgba(255,255,255,0.38)",
    inputIcon: "rgba(255,255,255,0.50)",

    // Misc
    checkboxBorder: "rgba(255,255,255,0.30)",
    rememberText: "rgba(255,255,255,0.45)",

    // Button — orange accent replaces white, arrow flips to contrast
    btnBg: "#ffa303", // orange pill background
    btnText: "#0a0a0a", // black text on orange
    btnArrowBg: "#ffa303", // orange arrow circle
    btnArrow: "#0a0a0a", // black arrow icon on orange

    // Links
    signInText: "rgba(255,255,255,0.45)",
    signInLink: "#ffa303", // orange accent for action links

    statusBar: "light" as const,
    shadow: "#000000",
  },

  light: {
    // Backgrounds
    mainBg: "#ffffff",
    cardBg: "#ffffff",
    cardBorder: "rgba(0,0,0,0.07)",

    // Banner
    bannerBg: "#182F48",
    backRectBg: "rgba(255,255,255,0.15)",
    backRectBorder: "rgba(255,255,255,0.30)",
    backArrow: "#ffffff",
    titleColor: "#ffa303",
    subtitleColor: "rgba(255,255,255,0.65)",

    // Grid lines
    gridLine: "rgba(255,255,255,0.55)",
    gridLineTint: "#ffffff",

    // Labels
    labelColor: "#666666",

    // Input fields
    inputBg: "#f5f5f5",
    inputBorder: "#d8d8d8",
    inputBorderFocus: "#aaaaaa",
    inputText: "#111111",
    inputPlaceholder: "#bbbbbb",
    inputIcon: "#aaaaaa",

    // Misc
    checkboxBorder: "#cccccc",
    rememberText: "#999999",

    // Button
    btnBg: "#182F48",
    btnText: "#ffffff",
    btnArrowBg: "#ffa303",
    btnArrow: "#182F48",

    // Links
    signInText: "#999999",
    signInLink: "#111111",

    statusBar: "dark" as const,
    shadow: "#00000018",
  },
};
