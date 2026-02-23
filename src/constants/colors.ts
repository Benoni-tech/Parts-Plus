// src/constants/colors.ts

export const Colors = {
  // ─── Brand Primitives ────────────────────────────────────────────────────────
  primary: "#182F48", // navy — main backgrounds, banners, cards in light mode
  secondary: "#ffa303", // orange — buttons, active states, accents, links

  // ─── Semantic ────────────────────────────────────────────────────────────────
  error: "#FF3B30",
  success: "#34C759",
  warning: "#FF9500",

  // ─── Gradients (static — never mode-aware) ───────────────────────────────────
  gradients: {
    primary: ["#182F48", "#0f1f30"] as const,
    hero: ["#1A1A2E", "#16213E", "#0F3460"] as const,
    purple: ["#A78BFA", "#7C3AED"] as const,
    red: ["#FF6B6B", "#FF5252"] as const,
    teal: ["#4ECDC4", "#38B2AC"] as const,
    yellow: ["#FFD93D", "#F9CA24"] as const,
    orange: ["#ffa303", "#e08c00"] as const,
  },

  // ─── Accents (static) ────────────────────────────────────────────────────────
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
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

// ─── Shadow Presets ───────────────────────────────────────────────────────────
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

// ─── Animation Durations ──────────────────────────────────────────────────────
export const AnimationDurations = {
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 800,
};

// ─── Z-index Layers ───────────────────────────────────────────────────────────
export const ZIndex = {
  background: -1,
  base: 0,
  elevated: 10,
  modal: 100,
  toast: 1000,
  tooltip: 10000,
};

// ─── Auth Theme Type ──────────────────────────────────────────────────────────
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
  // ─── App-wide tokens ──────────────────────────────────────────────────────
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

// ─── App-wide Theme Tokens ────────────────────────────────────────────────────
// Single source of truth for all mode-aware colours across the entire app.
// Usage: const T = useColorScheme() === "dark" ? AuthTheme.dark : AuthTheme.light;

export const AuthTheme = {
  dark: {
    // Backgrounds
    mainBg: "#0a0a0a",
    cardBg: "#161616",
    cardBorder: "rgba(255,255,255,0.10)",

    // Banner
    bannerBg: "#222222",
    backRectBg: "rgba(255,255,255,0.12)",
    backRectBorder: "rgba(255,255,255,0.22)",
    backArrow: "#ffffff",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255,255,255,0.60)",

    // Grid lines
    gridLine: "rgb(255,255,255)",
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

    // Buttons
    btnBg: "#ffa303",
    btnText: "#0a0a0a",
    btnArrowBg: "#ffa303",
    btnArrow: "#0a0a0a",

    // Links
    signInText: "rgba(255,255,255,0.45)",
    signInLink: "#ffa303",

    // ─── App-wide ───────────────────────────────────────────────────────────
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

    // Buttons
    btnBg: "#ffa303",
    btnText: "#ffffff",
    btnArrowBg: "#ffa303",
    btnArrow: "#182F48",

    // Links
    signInText: "#999999",
    signInLink: "#182F48",

    // ─── App-wide ───────────────────────────────────────────────────────────
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
