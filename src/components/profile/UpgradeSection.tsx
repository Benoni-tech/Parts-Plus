// src/components/profile/UpgradeSection.tsx

import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
    AuthThemeType,
    BorderRadius,
    Colors,
    FontSizes,
} from "../../constants/colors";
import GridOverlay from "./GridOverlay";
import SectionHeader from "./SectionHeader";

type PlanId = "free" | "individual" | "group";

interface Plan {
  id: PlanId;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  icon: string;
}

const PLANS: Plan[] = [
  {
    id: "individual",
    name: "Individual",
    price: "GH₵ 19",
    period: "/ month",
    description: "Solo learners and worship leaders",
    features: [
      "Unlimited hymn streaming",
      "All voice parts access",
      "Offline downloads",
      "HD audio quality",
    ],
    icon: "person-outline",
  },
  {
    id: "group",
    name: "Group",
    price: "GH₵ 60",
    period: "/ month",
    description: "Choirs and groups of up to 5 members",
    features: [
      "Everything in Individual",
      "Up to 5 member accounts",
      "Shared playlist management",
      "Group practice tools",
    ],
    icon: "people-outline",
  },
];

export default function UpgradeSection({
  isDark,
  T,
  currentPlan = "free",
}: {
  isDark: boolean;
  T: AuthThemeType;
  currentPlan?: PlanId;
}) {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const cardBg = isDark ? "#1e1e1e" : "#f9f9f9";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const dividerColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";

  const isCurrentPlan = (planId: PlanId) => planId === currentPlan;

  return (
    <>
      {/* ── Plan Detail Modal ──────────────────────────────────────────── */}
      <Modal
        visible={selectedPlan !== null}
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
                <Ionicons
                  name={selectedPlan?.icon as any}
                  size={44}
                  color={Colors.secondary}
                />
              </View>
            </View>

            {/* Body */}
            <View style={styles.modalBody}>
              <Text style={[styles.modalTitle, { color: T.titleColor }]}>
                {selectedPlan?.name} Plan
              </Text>
              <Text style={[styles.modalSubtitle, { color: T.subtitleColor }]}>
                {selectedPlan?.description}
              </Text>

              {/* Price */}
              <View
                style={[
                  styles.modalPriceRow,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,163,3,0.08)"
                      : "rgba(255,163,3,0.08)",
                    borderColor: "rgba(255,163,3,0.20)",
                  },
                ]}
              >
                <Text style={[styles.modalPrice, { color: Colors.secondary }]}>
                  {selectedPlan?.price}
                </Text>
                <Text style={[styles.modalPeriod, { color: T.labelColor }]}>
                  {selectedPlan?.period}
                </Text>
              </View>

              {/* Features */}
              <View
                style={[
                  styles.featureList,
                  { backgroundColor: cardBg, borderColor: cardBorder },
                ]}
              >
                {selectedPlan?.features.map((feature, i) => (
                  <View key={i}>
                    <View style={styles.featureRow}>
                      <View
                        style={[
                          styles.featureIconWrap,
                          { backgroundColor: "rgba(255,163,3,0.12)" },
                        ]}
                      >
                        <Ionicons
                          name="checkmark"
                          size={14}
                          color={Colors.secondary}
                        />
                      </View>
                      <Text
                        style={[styles.featureText, { color: T.inputText }]}
                      >
                        {feature}
                      </Text>
                    </View>
                    {i < (selectedPlan?.features.length ?? 0) - 1 && (
                      <View
                        style={[
                          styles.featureDivider,
                          { backgroundColor: dividerColor },
                        ]}
                      />
                    )}
                  </View>
                ))}
              </View>

              {/* CTA or current plan badge */}
              {selectedPlan && isCurrentPlan(selectedPlan.id) ? (
                <View
                  style={[
                    styles.currentBadge,
                    {
                      backgroundColor: isDark
                        ? "rgba(52,199,89,0.10)"
                        : "rgba(52,199,89,0.08)",
                      borderColor: "rgba(52,199,89,0.25)",
                    },
                  ]}
                >
                  <Ionicons name="checkmark-circle" size={18} color="#34C759" />
                  <Text style={styles.currentBadgeText}>Your current plan</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: T.btnBg, shadowColor: T.shadow },
                  ]}
                  onPress={() => setSelectedPlan(null)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.modalButtonText, { color: T.btnText }]}>
                    Coming Soon
                  </Text>
                  <View
                    style={[
                      styles.modalArrowCircle,
                      { backgroundColor: T.btnArrowBg },
                    ]}
                  >
                    <Ionicons
                      name="arrow-forward"
                      size={18}
                      color={T.btnArrow}
                    />
                  </View>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedPlan(null)}
              >
                <Text style={[styles.closeText, { color: T.labelColor }]}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Section ────────────────────────────────────────────────────── */}
      <SectionHeader label="Premium" T={T} />

      {/* Single card — mirrors AccountSection style */}
      <View
        style={[
          styles.sectionCard,
          { backgroundColor: cardBg, borderColor: cardBorder },
        ]}
      >
        {/* Free plan status line — plain text, no box */}
        {currentPlan === "free" && (
          <>
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusIconWrap,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.05)",
                  },
                ]}
              >
                <Ionicons
                  name="musical-notes-outline"
                  size={18}
                  color={T.inputIcon}
                />
              </View>
              <View style={styles.statusTextBlock}>
                <Text style={[styles.statusLabel, { color: T.inputText }]}>
                  Current Plan
                </Text>
                <Text style={[styles.statusValue, { color: Colors.secondary }]}>
                  Free — upgrade to unlock all features
                </Text>
              </View>
            </View>
            <View style={[styles.divider, { backgroundColor: dividerColor }]} />
          </>
        )}

        {/* Plan rows */}
        {PLANS.map((plan, index) => {
          const isCurrent = isCurrentPlan(plan.id);
          const isLast = index === PLANS.length - 1;

          return (
            <View key={plan.id}>
              <TouchableOpacity
                style={styles.planRow}
                onPress={() => setSelectedPlan(plan)}
                activeOpacity={0.7}
              >
                {/* Left icon */}
                <View
                  style={[
                    styles.planIconWrap,
                    {
                      backgroundColor: isCurrent
                        ? "rgba(52,199,89,0.12)"
                        : isDark
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(0,0,0,0.05)",
                    },
                  ]}
                >
                  <Ionicons
                    name={plan.icon as any}
                    size={18}
                    color={isCurrent ? "#34C759" : T.inputIcon}
                  />
                </View>

                {/* Middle — name + description */}
                <View style={styles.planTextBlock}>
                  <View style={styles.planNameRow}>
                    <Text style={[styles.planName, { color: T.inputText }]}>
                      {plan.name}
                    </Text>
                    {isCurrent && (
                      <View style={styles.currentPill}>
                        <Text style={styles.currentPillText}>Active</Text>
                      </View>
                    )}
                  </View>
                  <Text
                    style={[styles.planDescription, { color: T.labelColor }]}
                  >
                    {plan.description}
                  </Text>
                </View>

                {/* Right — price + chevron */}
                <View style={styles.planRight}>
                  <Text
                    style={[
                      styles.planPrice,
                      {
                        color: isCurrent ? "#34C759" : Colors.secondary,
                      },
                    ]}
                  >
                    {plan.price}
                  </Text>
                  <Text style={[styles.planPeriod, { color: T.labelColor }]}>
                    {plan.period}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={T.inputPlaceholder}
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>

              {!isLast && (
                <View
                  style={[styles.divider, { backgroundColor: dividerColor }]}
                />
              )}
            </View>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  // ── Section card — mirrors AccountSection ─────────────────────────────────
  sectionCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: "hidden",
  },

  // ── Status row ────────────────────────────────────────────────────────────
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  statusIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  statusTextBlock: {
    flex: 1,
  },
  statusLabel: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    marginBottom: 2,
  },
  statusValue: {
    fontSize: FontSizes.xs,
    fontWeight: "500",
  },

  divider: {
    height: 1,
    marginHorizontal: 16,
  },

  // ── Plan rows ─────────────────────────────────────────────────────────────
  planRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  planIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  planTextBlock: {
    flex: 1,
  },
  planNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  planName: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
  },
  currentPill: {
    backgroundColor: "rgba(52,199,89,0.15)",
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  currentPillText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#34C759",
  },
  planDescription: {
    fontSize: FontSizes.xs,
    lineHeight: 16,
  },
  planRight: {
    alignItems: "flex-end",
    marginLeft: 8,
  },
  planPrice: {
    fontSize: FontSizes.sm,
    fontWeight: "800",
  },
  planPeriod: {
    fontSize: 10,
  },

  // ── Modal ─────────────────────────────────────────────────────────────────
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
  modalPriceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  modalPrice: {
    fontSize: FontSizes.xxl,
    fontWeight: "800",
  },
  modalPeriod: {
    fontSize: FontSizes.sm,
    fontWeight: "500",
  },
  featureList: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
  },
  featureIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  featureText: {
    fontSize: FontSizes.sm,
    fontWeight: "500",
    flex: 1,
  },
  featureDivider: {
    height: 1,
    marginHorizontal: 14,
  },
  currentBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingVertical: 13,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  currentBadgeText: {
    fontSize: FontSizes.sm,
    fontWeight: "700",
    color: "#34C759",
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
    marginBottom: 12,
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
  closeButton: {
    alignItems: "center",
    paddingVertical: 4,
  },
  closeText: {
    fontSize: FontSizes.sm,
    fontWeight: "500",
  },
});
