// src/components/profile/FAQScreen.tsx

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    LayoutAnimation,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    useColorScheme,
    View,
} from "react-native";
import {
    AuthTheme,
    AuthThemeType,
    BorderRadius,
    FontSizes,
    Spacing,
} from "../../constants/colors";
import GridOverlay from "./GridOverlay";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQ_ITEMS = [
  {
    question: "What is Parts Plus?",
    answer:
      "Parts Plus is a music streaming app that lets you listen to hymns and spiritual songs separated by vocal parts — Soprano, Alto, Tenor and Bass — so you can learn and practise your specific part at your own pace.",
  },
  {
    question: "What vocal parts are available?",
    answer:
      "Most songs include Soprano, Alto, Tenor and Bass. Some songs may include additional harmony parts depending on the arrangement. Each part is clearly labelled on the song page.",
  },
  {
    question: "Can I listen to all parts together?",
    answer:
      "Yes. You can stream the full mixed version or isolate any single part at any time directly from the player screen.",
  },
  {
    question: "Do I need an account to use Parts Plus?",
    answer:
      "You need an account to stream and save your favourites. Creating one is completely free and only takes a minute.",
  },
  {
    question: "How do I verify my email?",
    answer:
      "After signing up, check your inbox for a verification link from Parts Plus. If you didn't receive it, go to your profile and tap 'Resend Verification Email'.",
  },
  {
    question: "Can I download songs for offline use?",
    answer:
      "Offline listening is coming in a future update. Currently all streaming requires an active internet connection.",
  },
  {
    question: "How do I change my vocal part while a song is playing?",
    answer:
      "You can switch between parts directly on the player screen while a song is playing. Simply tap the part selector and choose your preferred vocal part.",
  },
  {
    question: "How do I reset my password?",
    answer:
      "Tap 'Forgot Password' on the Sign In screen and we'll send a reset link to your registered email address. Check your spam folder if it doesn't arrive within a few minutes.",
  },
];

function AccordionItem({
  item,
  isOpen,
  onToggle,
  isDark,
  T,
  isLast,
}: {
  item: { question: string; answer: string };
  isOpen: boolean;
  onToggle: () => void;
  isDark: boolean;
  T: AuthThemeType;
  isLast: boolean;
}) {
  const dividerColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";

  return (
    <View
      style={[
        styles.accordionItem,
        !isLast && { borderBottomWidth: 1, borderBottomColor: dividerColor },
      ]}
    >
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.questionText,
            { color: isOpen ? T.btnArrowBg : T.inputText },
          ]}
        >
          {item.question}
        </Text>
        <View
          style={[
            styles.chevronWrap,
            {
              backgroundColor: isOpen
                ? `${T.btnArrowBg}22`
                : isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.05)",
            },
          ]}
        >
          <Ionicons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={15}
            color={isOpen ? T.btnArrowBg : T.inputIcon}
          />
        </View>
      </TouchableOpacity>

      {isOpen && (
        <Text style={[styles.answerText, { color: T.labelColor }]}>
          {item.answer}
        </Text>
      )}
    </View>
  );
}

export default function FAQScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const T = isDark ? AuthTheme.dark : AuthTheme.light;

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIndex(openIndex === index ? null : index);
  };

  const cardStyle = {
    backgroundColor: isDark ? "#1e1e1e" : "#f9f9f9",
    borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)",
  };

  return (
    <View style={[styles.mainBackground, { backgroundColor: T.mainBg }]}>
      <StatusBar style={T.statusBar} />

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={[styles.topBanner, { backgroundColor: T.bannerBg }]}>
          <View style={styles.bannerLeft}>
            <TouchableOpacity
              style={[
                styles.backCircle,
                styles.backAbsolute,
                {
                  backgroundColor: T.backRectBg,
                  borderColor: T.backRectBorder,
                },
              ]}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={16} color={T.backArrow} />
            </TouchableOpacity>

            <View style={styles.bannerIconRow}>
              <View
                style={[
                  styles.bannerIconCircle,
                  { backgroundColor: `${T.btnArrowBg}22` },
                ]}
              >
                <Ionicons
                  name="help-circle-outline"
                  size={32}
                  color={T.btnArrowBg}
                />
              </View>
            </View>

            <View style={styles.bannerTextBlock}>
              <Text style={[styles.bannerTitle, { color: T.titleColor }]}>
                Help & FAQ
              </Text>
              <Text style={[styles.bannerSubtitle, { color: T.subtitleColor }]}>
                Answers to common questions
              </Text>
            </View>
          </View>

          <View style={styles.bannerRight}>
            <GridOverlay isDark={isDark} />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={[styles.sectionLabel, { color: T.labelColor }]}>
            Frequently Asked Questions
          </Text>

          <View style={[styles.card, cardStyle]}>
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem
                key={index}
                item={item}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
                isDark={isDark}
                T={T}
                isLast={index === FAQ_ITEMS.length - 1}
              />
            ))}
          </View>

          <View
            style={[
              styles.helpCard,
              {
                backgroundColor: isDark ? "#1e1e1e" : "#f9f9f9",
                borderColor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.07)",
              },
            ]}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={22}
              color={T.btnArrowBg}
              style={{ marginBottom: 8 }}
            />
            <Text style={[styles.helpTitle, { color: T.inputText }]}>
              Still need help?
            </Text>
            <Text style={[styles.helpText, { color: T.labelColor }]}>
              Reach out to us at{" "}
              <Text style={{ color: T.btnArrowBg, fontWeight: "600" }}>
                support@partsplus.app
              </Text>
            </Text>
          </View>

          <View style={{ height: 48 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainBackground: { flex: 1 },
  topBanner: { height: 220, flexDirection: "row", overflow: "hidden" },
  bannerLeft: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
    justifyContent: "space-between",
    zIndex: 2,
  },
  backAbsolute: { position: "absolute", left: 18, top: 18, zIndex: 5 },
  backCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bannerIconRow: { flexDirection: "row", alignItems: "center", marginTop: 44 },
  bannerIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  bannerTextBlock: {},
  bannerTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: "900",
    letterSpacing: 0.2,
    marginBottom: 5,
    marginTop: -15,
  },
  bannerSubtitle: { fontSize: 16.5, lineHeight: 18, marginBottom: 30 },
  bannerRight: { width: 150, overflow: "hidden" },
  content: { paddingHorizontal: 16 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: 24,
    paddingHorizontal: 4,
  },
  card: { borderRadius: BorderRadius.md, borderWidth: 1, overflow: "hidden" },
  accordionItem: { paddingHorizontal: 16 },
  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  questionText: {
    flex: 1,
    fontSize: FontSizes.sm,
    fontWeight: "600",
    marginRight: 12,
    lineHeight: 20,
  },
  chevronWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  answerText: { fontSize: FontSizes.sm, lineHeight: 22, paddingBottom: 16 },
  helpCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.lg,
    marginTop: 16,
    alignItems: "center",
  },
  helpTitle: { fontSize: FontSizes.sm, fontWeight: "700", marginBottom: 6 },
  helpText: { fontSize: FontSizes.sm, textAlign: "center", lineHeight: 20 },
});
