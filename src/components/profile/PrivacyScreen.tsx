// src/components/profile/PrivacyScreen.tsx

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import {
  AuthTheme,
  AuthThemeType,
  BorderRadius,
  FontSizes,
} from "../../constants/colors";
import GridOverlay from "./GridOverlay";

function Section({
  title,
  children,
  T,
}: {
  title: string;
  children: React.ReactNode;
  T: AuthThemeType;
}) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: T.inputText }]}>{title}</Text>
      {children}
    </View>
  );
}

function Body({ text, T }: { text: string; T: AuthThemeType }) {
  return <Text style={[styles.bodyText, { color: T.labelColor }]}>{text}</Text>;
}

function Bullet({ text, T }: { text: string; T: AuthThemeType }) {
  return (
    <View style={styles.bulletRow}>
      <View style={styles.bulletDot} />
      <Text style={[styles.bulletText, { color: T.labelColor }]}>{text}</Text>
    </View>
  );
}

export default function PrivacyScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const T = isDark ? AuthTheme.dark : AuthTheme.light;

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
                  name="document-text-outline"
                  size={32}
                  color={T.btnArrowBg}
                />
              </View>
            </View>

            <View style={styles.bannerTextBlock}>
              <Text style={[styles.bannerTitle, { color: T.titleColor }]}>
                Privacy Policy
              </Text>
              <Text style={[styles.bannerSubtitle, { color: T.subtitleColor }]}>
                Last updated: January 2025
              </Text>
            </View>
          </View>

          <View style={styles.bannerRight}>
            <GridOverlay isDark={isDark} />
          </View>
        </View>

        <View style={styles.content}>
          <View style={[styles.card, cardStyle]}>
            <Section title="Introduction" T={T}>
              <Body
                T={T}
                text="Parts Plus ('we', 'us', or 'our') is committed to protecting your personal information in accordance with the Data Protection Act, 2012 (Act 843) of Ghana. This Privacy Policy explains how we collect, use, store, and protect your data when you use the Parts Plus mobile application."
              />
            </Section>

            <Section title="Information We Collect" T={T}>
              <Body
                T={T}
                text="We collect the following personal data when you create and use your account:"
              />
              <Bullet
                T={T}
                text="Email address — used for account authentication and communication"
              />
              <Bullet
                T={T}
                text="Display name — shown on your profile within the app"
              />
              <Bullet
                T={T}
                text="Profile photo — if you choose to upload one"
              />
              <Bullet
                T={T}
                text="Usage data — songs played, parts selected, and app interactions, used to improve your experience"
              />
              <Bullet
                T={T}
                text="Device information — device type and operating system, used for technical support"
              />
            </Section>

            <Section title="How We Use Your Information" T={T}>
              <Body
                T={T}
                text="Your data is used solely to operate and improve Parts Plus:"
              />
              <Bullet T={T} text="To create and manage your account" />
              <Bullet T={T} text="To personalise your streaming experience" />
              <Bullet
                T={T}
                text="To send important account communications such as email verification and password reset"
              />
              <Bullet T={T} text="To analyse app usage and improve features" />
              <Bullet T={T} text="To respond to your support requests" />
            </Section>

            <Section title="Third-Party Services" T={T}>
              <Body
                T={T}
                text="Parts Plus uses Firebase (Google LLC) for authentication, cloud storage, and analytics. Firebase processes data in accordance with Google's Privacy Policy. We do not sell your personal data to any third party."
              />
            </Section>

            <Section title="Data Storage & Security" T={T}>
              <Body
                T={T}
                text="Your data is stored securely on Firebase servers. We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, loss, or disclosure. Access to your data is restricted to authorised personnel only."
              />
            </Section>

            <Section title="Your Rights" T={T}>
              <Body
                T={T}
                text="Under the Data Protection Act, 2012 (Act 843), you have the right to:"
              />
              <Bullet T={T} text="Access the personal data we hold about you" />
              <Bullet T={T} text="Request correction of inaccurate data" />
              <Bullet
                T={T}
                text="Request deletion of your account and associated data"
              />
              <Bullet
                T={T}
                text="Withdraw consent for data processing at any time"
              />
              <Body
                T={T}
                text="To exercise any of these rights, contact us at privacy@partsplus.app."
              />
            </Section>

            <Section title="Data Retention" T={T}>
              <Body
                T={T}
                text="We retain your personal data for as long as your account is active. If you delete your account, your personal data will be permanently removed from our systems within 30 days, except where retention is required by law."
              />
            </Section>

            <Section title="Children's Privacy" T={T}>
              <Body
                T={T}
                text="Parts Plus is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with their data, please contact us immediately."
              />
            </Section>

            <Section title="Changes to This Policy" T={T}>
              <Body
                T={T}
                text="We may update this Privacy Policy from time to time. We will notify you of significant changes through the app or by email. Continued use of Parts Plus after changes are posted constitutes your acceptance of the updated policy."
              />
            </Section>

            <Section title="Contact Us" T={T}>
              <Body
                T={T}
                text="If you have any questions about this Privacy Policy or how we handle your data, please contact us:"
              />
              <Bullet T={T} text="Email: privacy@partsplus.app" />
              <Bullet T={T} text="App: Parts Plus — Ghana" />
            </Section>
          </View>
          <View style={{ height: 48 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainBackground: { flex: 1 },
  topBanner: { height: 280, flexDirection: "row", overflow: "hidden" },
  bannerLeft: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 88,
    paddingBottom: 5,
    justifyContent: "space-between",
    zIndex: 2,
  },
  backAbsolute: { position: "absolute", left: 18, top: 68, zIndex: 5 },
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
  content: { paddingHorizontal: 16, paddingTop: 24 },
  card: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: "hidden",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  section: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(128,128,128,0.1)",
  },
  sectionTitle: {
    fontSize: FontSizes.sm,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  bodyText: { fontSize: FontSizes.sm, lineHeight: 22, marginBottom: 6 },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
    paddingLeft: 4,
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#ffa303",
    marginTop: 8,
    marginRight: 10,
    flexShrink: 0,
  },
  bulletText: { flex: 1, fontSize: FontSizes.sm, lineHeight: 22 },
});
