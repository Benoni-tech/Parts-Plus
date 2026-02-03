// app/verification-success.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { BorderRadius, Colors, FontSizes, Spacing } from '../../src/constants/colors';

const { width } = Dimensions.get('window');

export default function VerificationSuccessScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <Animated.View entering={FadeIn.duration(800)} style={styles.content}>
        {/* Success Icon */}
        <Animated.View
          entering={ZoomIn.duration(600).delay(200)}
          style={styles.iconContainer}
        >
          <View style={styles.checkmarkCircle}>
            <Ionicons
              name="checkmark-circle"
              size={120}
              color={Colors.success}
            />
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.Text
          entering={FadeInUp.duration(600).delay(400)}
          style={styles.title}
        >
          Email Verified!
        </Animated.Text>

        {/* Message */}
        <Animated.Text
          entering={FadeInUp.duration(600).delay(600)}
          style={styles.message}
        >
          Your email has been successfully verified. You can now access all
          features of Parts Plus and start streaming your favorite hymns.
        </Animated.Text>

        {/* Success Details */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(800)}
          style={styles.detailsContainer}
        >
          <View style={styles.detailRow}>
            <Ionicons
              name="shield-checkmark-outline"
              size={24}
              color={Colors.success}
            />
            <Text style={styles.detailText}>Account activated</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons
              name="musical-notes-outline"
              size={24}
              color={Colors.primary}
            />
            <Text style={styles.detailText}>Ready to stream</Text>
          </View>
        </Animated.View>

        {/* Go to Home Button */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(1000)}
          style={styles.buttonContainer}
        >
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => router.replace('/tabs')}
            activeOpacity={0.8}
          >
            <Text style={styles.homeButtonText}>Go to Home</Text>
            <View style={styles.arrowCircle}>
              <Ionicons
                name="arrow-forward"
                size={20}
                color={Colors.text.white}
              />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing.xl,
  },
  checkmarkCircle: {
    width: 140,
    height: 140,
    borderRadius: BorderRadius.full,
    backgroundColor: `${Colors.success}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  message: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  detailsContainer: {
    backgroundColor: Colors.inputBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.xxl,
    width: '100%',
    maxWidth: 320,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  detailText: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    marginLeft: Spacing.md,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 320,
  },
  homeButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: 18,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: Colors.secondary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  homeButtonText: {
    fontSize: FontSizes.lg,
    color: Colors.secondary,
    fontWeight: '600',
    flex: 1,
  },
  arrowCircle: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});