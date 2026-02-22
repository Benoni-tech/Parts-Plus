// src/components/profile/AppPreferencesSection.tsx

import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
    AuthThemeType,
    BorderRadius,
    FontSizes,
} from "../../../src/constants/colors";
import GridOverlay from "./GridOverlay";
import MenuItem from "./MenuItem";
import SectionHeader from "./SectionHeader";

type ThemeOption = "light" | "dark" | "system";

const THEME_OPTIONS: { value: ThemeOption; label: string; icon: string }[] = [
  { value: "light", label: "Light", icon: "sunny-outline" },
  { value: "dark", label: "Dark", icon: "moon-outline" },
  { value: "system", label: "System", icon: "phone-portrait-outline" },
];

export default function AppPreferencesSection({
  isDark,
  T,
}: {
  isDark: boolean;
  T: AuthThemeType;
}) {
  const [themePreference, setThemePreference] = useState<ThemeOption>("system");
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const cardStyle = {
    backgroundColor: isDark ? "#1e1e1e" : "#f9f9f9",
    borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)",
  };

  const currentThemeLabel =
    THEME_OPTIONS.find((o) => o.value === themePreference)?.label ?? "System";

  return (
    <>
      {/* ── Theme Picker Modal ─────────────────────────────────────────── */}
      <Modal
        visible={showThemePicker}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: T.cardBg,
                borderColor: T.cardBorder,
                shadowColor: T.shadow,
              },
            ]}
          >
            {/* Banner */}
            <View style={[styles.modalBanner, { backgroundColor: T.bannerBg }]}>
              <GridOverlay isDark={isDark} />
              <View style={styles.modalBannerContent} pointerEvents="none">
                <Text style={styles.modalEmoji}>🎨</Text>
              </View>
            </View>

            <View style={styles.modalBody}>
              <Text style={[styles.modalTitle, { color: T.titleColor }]}>
                App Theme
              </Text>
              <Text style={[styles.modalSubtitle, { color: T.subtitleColor }]}>
                Choose your preferred appearance
              </Text>

              {/* Options */}
              <View
                style={[
                  styles.themeOptions,
                  {
                    borderColor: isDark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.07)",
                    backgroundColor: isDark ? "#1e1e1e" : "#f9f9f9",
                  },
                ]}
              >
                {THEME_OPTIONS.map((opt, i) => {
                  const selected = themePreference === opt.value;
                  const isLastOpt = i === THEME_OPTIONS.length - 1;
                  return (
                    <TouchableOpacity
                      key={opt.value}
                      style={[
                        styles.themeOption,
                        !isLastOpt && {
                          borderBottomWidth: 1,
                          borderBottomColor: isDark
                            ? "rgba(255,255,255,0.07)"
                            : "rgba(0,0,0,0.06)",
                        },
                      ]}
                      onPress={() => setThemePreference(opt.value)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.themeIconWrap,
                          {
                            backgroundColor: selected
                              ? `${T.btnArrowBg}22`
                              : isDark
                                ? "rgba(255,255,255,0.08)"
                                : "rgba(0,0,0,0.05)",
                          },
                        ]}
                      >
                        <Ionicons
                          name={opt.icon as any}
                          size={18}
                          color={selected ? T.btnArrowBg : T.inputIcon}
                        />
                      </View>
                      <Text
                        style={[
                          styles.themeOptionLabel,
                          {
                            color: selected ? T.btnArrowBg : T.inputText,
                            fontWeight: selected ? "700" : "500",
                          },
                        ]}
                      >
                        {opt.label}
                      </Text>
                      {selected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={T.btnArrowBg}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Done button */}
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: T.btnBg, shadowColor: T.shadow },
                ]}
                onPress={() => setShowThemePicker(false)}
                activeOpacity={0.8}
              >
                <Text style={[styles.modalButtonText, { color: T.btnText }]}>
                  Done
                </Text>
                <View
                  style={[
                    styles.modalArrowCircle,
                    { backgroundColor: T.btnArrowBg },
                  ]}
                >
                  <Ionicons name="checkmark" size={18} color={T.btnArrow} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Section ────────────────────────────────────────────────────── */}
      <SectionHeader label="App Preferences" T={T} />
      <View style={[styles.sectionCard, cardStyle]}>
        <MenuItem
          icon="color-palette-outline"
          label="Theme"
          onPress={() => setShowThemePicker(true)}
          T={T}
          isDark={isDark}
          rightContent={
            <View style={styles.themeValueRow}>
              <Text
                style={{
                  fontSize: FontSizes.xs,
                  color: T.inputPlaceholder,
                  fontWeight: "500",
                  marginRight: 4,
                }}
              >
                {currentThemeLabel}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={T.inputPlaceholder}
              />
            </View>
          }
        />
        <MenuItem
          icon="notifications-outline"
          label="Notifications"
          T={T}
          isDark={isDark}
          isLast
          rightContent={
            <TouchableOpacity
              onPress={() => setNotificationsEnabled(!notificationsEnabled)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.toggle,
                  {
                    backgroundColor: notificationsEnabled
                      ? T.btnArrowBg
                      : isDark
                        ? "rgba(255,255,255,0.15)"
                        : "rgba(0,0,0,0.12)",
                  },
                ]}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    {
                      transform: [
                        { translateX: notificationsEnabled ? 18 : 2 },
                      ],
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  themeValueRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggle: {
    width: 42,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },

  // ── Modal ───────────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.72)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.28,
    shadowRadius: 32,
    elevation: 24,
  },
  modalBanner: {
    height: 110,
    overflow: "hidden",
  },
  modalBannerContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  modalEmoji: {
    fontSize: 48,
  },
  modalBody: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
  },
  modalTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "900",
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: FontSizes.sm,
    fontWeight: "500",
    marginBottom: 16,
  },
  themeOptions: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 20,
  },
  themeOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  themeIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  themeOptionLabel: {
    flex: 1,
    fontSize: FontSizes.sm,
  },
  modalButton: {
    borderRadius: BorderRadius.lg,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },
  modalArrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});
