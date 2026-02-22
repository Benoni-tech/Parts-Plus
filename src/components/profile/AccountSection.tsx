// src/components/profile/AccountSection.tsx

import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AuthThemeType, BorderRadius, FontSizes } from "../../constants/colors";
import GridOverlay from "./GridOverlay";
import MenuItem from "./MenuItem";
import SectionHeader from "./SectionHeader";

type Router = { push: (path: any) => void };

type User = {
  displayName?: string | null;
  email?: string | null;
};

export default function AccountSection({
  user,
  isDark,
  T,
  router,
}: {
  user: User | null;
  isDark: boolean;
  T: AuthThemeType;
  router: Router;
}) {
  const [showEditModal, setShowEditModal] = useState(false);

  const cardStyle = {
    backgroundColor: isDark ? "#1e1e1e" : "#f9f9f9",
    borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)",
  };

  return (
    <>
      {/* ── Edit Profile Modal ─────────────────────────────────────────── */}
      <Modal
        visible={showEditModal}
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
                <Text style={styles.modalEmoji}>✏️</Text>
              </View>
            </View>

            {/* Body */}
            <View style={styles.modalBody}>
              <Text style={[styles.modalTitle, { color: T.titleColor }]}>
                Edit Profile
              </Text>
              <Text style={[styles.modalSubtitle, { color: T.subtitleColor }]}>
                Update your name and avatar
              </Text>

              {/* Placeholder — full implementation in sub-screen */}
              <Text style={[styles.placeholderText, { color: T.labelColor }]}>
                Full edit profile functionality coming soon. This will include
                display name and avatar upload.
              </Text>

              {/* Close button */}
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: T.btnBg, shadowColor: T.shadow },
                ]}
                onPress={() => setShowEditModal(false)}
                activeOpacity={0.8}
              >
                <Text style={[styles.modalButtonText, { color: T.btnText }]}>
                  Close
                </Text>
                <View
                  style={[
                    styles.modalArrowCircle,
                    { backgroundColor: T.btnArrowBg },
                  ]}
                >
                  <Ionicons name="close" size={18} color={T.btnArrow} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Section ────────────────────────────────────────────────────── */}
      <SectionHeader label="Account" T={T} />
      <View style={[styles.sectionCard, cardStyle]}>
        <MenuItem
          icon="person-outline"
          label="Edit Profile"
          onPress={() => setShowEditModal(true)}
          T={T}
          isDark={isDark}
        />
        <MenuItem
          icon="lock-closed-outline"
          label="Change Password"
          onPress={() => router.push("/auth/forgot-password")}
          T={T}
          isDark={isDark}
        />
        <MenuItem
          icon="shield-checkmark-outline"
          label="Connected Account"
          T={T}
          isDark={isDark}
          isLast
          rightContent={
            <Text
              style={{
                fontSize: FontSizes.xs,
                color: T.inputPlaceholder,
                fontWeight: "500",
              }}
            >
              Email
            </Text>
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
  placeholderText: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
    marginBottom: 24,
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
