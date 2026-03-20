// src/constants/colors.ts

import { Dimensions, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BASE_WIDTH = 390;
const scale = Math.min(Math.max(SCREEN_WIDTH / BASE_WIDTH, 0.85), 1.2);

const normalize = (size: number): number =>
  Math.round(PixelRatio.roundToNearestPixel(size * scale));

export const Colors = {
  primary: "#182F48",
  secondary: "#ffa303",
  error: "#FF3B30",
  success: "#34C759",
  warning: "#FF9500",
  gradients: {
    primary: ["#182F48", "#0f1f30"] as const,
    hero: ["#1A1A2E", "#16213E", "#0F3460"] as const,
    purple: ["#A78BFA", "#7C3AED"] as const,
    red: ["#FF6B6B", "#FF5252"] as const,
    teal: ["#4ECDC4", "#38B2AC"] as const,
    yellow: ["#FFD93D", "#F9CA24"] as const,
    orange: ["#ffa303", "#e08c00"] as const,
  },
  accents: {
    red: "#FF6B6B",
    teal: "#4ECDC4",
    yellow: "#FFD93D",
    purple: "#A78BFA",
    orange: "#ffa303",
    navy: "#182F48",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 84,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const FontSizes = {
  xs: normalize(12),
  sm: normalize(14),
  md: normalize(16),
  lg: normalize(18),
  xl: normalize(22),
  xxl: normalize(28),
  xxxl: normalize(36),
};

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
    shadowColor: "#ffa303",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const AnimationDurations = {
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 800,
};

export const ZIndex = {
  background: -1,
  base: 0,
  elevated: 10,
  modal: 100,
  toast: 1000,
  tooltip: 10000,
};

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
  background: string;
  card: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  overlay: string;
  overlayDark: string;
  statusBar: "light" | "dark";
  shadow: string;
};

export const AuthTheme = {
  dark: {
    mainBg: "#0a0a0a",
    cardBg: "#161616",
    cardBorder: "rgba(255,255,255,0.10)",
    bannerBg: "#222222",
    backRectBg: "rgba(255,255,255,0.12)",
    backRectBorder: "rgba(255,255,255,0.22)",
    backArrow: "#ffffff",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255,255,255,0.60)",
    gridLine: "rgb(255,255,255)",
    gridLineTint: "#e8e0d0",
    labelColor: "rgba(255,255,255,0.55)",
    inputBg: "#2a2a2a",
    inputBorder: "rgba(255,255,255,0.22)",
    inputBorderFocus: "rgba(255,255,255,0.50)",
    inputText: "#ffffff",
    inputPlaceholder: "rgba(255,255,255,0.38)",
    inputIcon: "rgba(255,255,255,0.50)",
    checkboxBorder: "rgba(255,255,255,0.30)",
    rememberText: "rgba(255,255,255,0.45)",
    // ✅ Navy button in dark mode — orange arrow circle accent
    btnBg: "#182F48",
    btnText: "#ffffff",
    btnArrowBg: "#ffa303",
    btnArrow: "#182F48",
    signInText: "rgba(255,255,255,0.45)",
    signInLink: "#ffa303",
    background: "#0a0a0a",
    card: "#161616",
    textPrimary: "#ffffff",
    textSecondary: "rgba(255,255,255,0.55)",
    border: "rgba(255,255,255,0.10)",
    overlay: "rgba(0,0,0,0.55)",
    overlayDark: "rgba(0,0,0,0.80)",
    statusBar: "light" as const,
    shadow: "#000000",
  },

  light: {
    mainBg: "#ffffff",
    cardBg: "#ffffff",
    cardBorder: "rgba(0,0,0,0.07)",
    bannerBg: "#182F48",
    backRectBg: "rgba(255,255,255,0.15)",
    backRectBorder: "rgba(255,255,255,0.30)",
    backArrow: "#ffffff",
    titleColor: "#ffa303",
    subtitleColor: "rgba(255,255,255,0.65)",
    gridLine: "rgba(255,255,255,0.55)",
    gridLineTint: "#ffffff",
    labelColor: "#666666",
    inputBg: "#f5f5f5",
    inputBorder: "#d8d8d8",
    inputBorderFocus: "#aaaaaa",
    inputText: "#111111",
    inputPlaceholder: "#bbbbbb",
    inputIcon: "#aaaaaa",
    checkboxBorder: "#cccccc",
    rememberText: "#999999",
    // ✅ Navy button in light mode too — orange arrow circle accent
    btnBg: "#182F48",
    btnText: "#ffffff",
    btnArrowBg: "#ffa303",
    btnArrow: "#182F48",
    signInText: "#999999",
    signInLink: "#182F48",
    background: "#f5f5f5",
    card: "#ffffff",
    textPrimary: "#111111",
    textSecondary: "#666666",
    border: "rgba(0,0,0,0.07)",
    overlay: "rgba(0,0,0,0.30)",
    overlayDark: "rgba(0,0,0,0.60)",
    statusBar: "dark" as const,
    shadow: "#00000018",
  },
};
