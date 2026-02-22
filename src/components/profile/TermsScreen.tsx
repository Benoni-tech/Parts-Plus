// src/components/profile/TermsScreen.tsx

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
  isLast = false,
}: {
  title: string;
  children: React.ReactNode;
  T: AuthThemeType;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.section, isLast && { borderBottomWidth: 0 }]}>
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

export default function TermsScreen() {
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
                  name="reader-outline"
                  size={32}
                  color={T.btnArrowBg}
                />
              </View>
            </View>

            <View style={styles.bannerTextBlock}>
              <Text style={[styles.bannerTitle, { color: T.titleColor }]}>
                Terms of Service
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
            <Section title="Acceptance of Terms" T={T}>
              <Body
                T={T}
                text="By downloading, installing, or using the Parts Plus mobile application ('the App'), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the App. These terms constitute a legally binding agreement between you and Parts Plus."
              />
            </Section>

            <Section title="Account Responsibilities" T={T}>
              <Body
                T={T}
                text="When you create an account with Parts Plus, you agree to:"
              />
              <Bullet
                T={T}
                text="Provide accurate and complete registration information"
              />
              <Bullet
                T={T}
                text="Keep your password secure and not share it with others"
              />
              <Bullet
                T={T}
                text="Notify us immediately of any unauthorised use of your account"
              />
              <Bullet
                T={T}
                text="Be responsible for all activity that occurs under your account"
              />
              <Body
                T={T}
                text="Parts Plus reserves the right to suspend or terminate accounts that violate these terms."
              />
            </Section>

            <Section title="Content Usage" T={T}>
              <Body
                T={T}
                text="All music content available on Parts Plus is licensed for personal, non-commercial streaming only. By using the App you agree that you will not:"
              />
              <Bullet
                T={T}
                text="Download, copy, or reproduce any audio content from the App"
              />
              <Bullet
                T={T}
                text="Redistribute, resell, or publicly perform any content from the App"
              />
              <Bullet
                T={T}
                text="Use any automated tools to access, scrape, or download content"
              />
              <Bullet
                T={T}
                text="Circumvent any digital rights management or access controls"
              />
            </Section>

            <Section title="Intellectual Property" T={T}>
              <Body
                T={T}
                text="All content on Parts Plus, including but not limited to music recordings, arrangements, vocal parts, app design, logos, and software, is the property of Parts Plus or its content licensors and is protected by applicable copyright and intellectual property laws. Nothing in these terms grants you any ownership rights to any content."
              />
            </Section>

            <Section title="Acceptable Use" T={T}>
              <Body
                T={T}
                text="You agree to use Parts Plus only for lawful purposes. You must not:"
              />
              <Bullet
                T={T}
                text="Use the App in any way that violates Ghanaian law or any applicable regulations"
              />
              <Bullet
                T={T}
                text="Transmit any unsolicited or unauthorised advertising material"
              />
              <Bullet
                T={T}
                text="Attempt to gain unauthorised access to any part of the App or its systems"
              />
              <Bullet
                T={T}
                text="Interfere with or disrupt the integrity or performance of the App"
              />
            </Section>

            <Section title="Termination" T={T}>
              <Body
                T={T}
                text="You may delete your account at any time through the App settings. Parts Plus reserves the right to suspend or permanently terminate your access to the App at any time, with or without notice, if we believe you have violated these Terms of Service or for any other legitimate reason."
              />
            </Section>

            <Section title="Disclaimer of Warranties" T={T}>
              <Body
                T={T}
                text="Parts Plus is provided 'as is' and 'as available' without warranties of any kind, either express or implied. We do not warrant that the App will be uninterrupted, error-free, or completely secure. Your use of the App is at your own risk."
              />
            </Section>

            <Section title="Limitation of Liability" T={T}>
              <Body
                T={T}
                text="To the maximum extent permitted by Ghanaian law, Parts Plus shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the App or its content. Our total liability to you for any claim shall not exceed the amount you paid to use the App in the twelve months preceding the claim."
              />
            </Section>

            <Section title="Governing Law" T={T}>
              <Body
                T={T}
                text="These Terms of Service are governed by and construed in accordance with the laws of the Republic of Ghana. Any disputes arising under or in connection with these terms shall be subject to the exclusive jurisdiction of the courts of Ghana."
              />
            </Section>

            <Section title="Changes to These Terms" T={T}>
              <Body
                T={T}
                text="We may revise these Terms of Service at any time. We will notify you of material changes through the App or by email. Your continued use of Parts Plus after changes are posted constitutes your acceptance of the revised terms."
              />
            </Section>

            <Section title="Contact Us" T={T} isLast>
              <Body
                T={T}
                text="If you have any questions about these Terms of Service, please contact us:"
              />
              <Bullet T={T} text="Email: legal@partsplus.app" />
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
