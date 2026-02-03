// src/components/VerificationModal.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BorderRadius, Colors, FontSizes, Spacing } from '../constants/colors';
import { useAuth } from '../hooks/useAuth';

interface VerificationModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function VerificationModal({
  visible,
  onClose,
}: VerificationModalProps) {
  const router = useRouter();
  const { user, checkEmailVerified, sendEmailVerification } = useAuth();
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);

  /**
   * Check if email has been verified
   */
  const handleCheckVerification = async () => {
    try {
      setChecking(true);
      const isVerified = await checkEmailVerified();

      if (isVerified) {
        onClose();
        router.replace('/auth/verification-success');
      } else {
        Alert.alert(
          'Email Not Verified',
          'Please check your email and click the verification link before continuing.',
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setChecking(false);
    }
  };

  /**
   * Resend verification email
   */
  const handleResendEmail = async () => {
    try {
      setResending(true);
      await sendEmailVerification();
      Alert.alert(
        'Email Sent',
        'A new verification email has been sent to your inbox.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name="mail-outline" size={60} color={Colors.primary} />
          </View>

          {/* Title */}
          <Text style={styles.title}>Check Your Email</Text>

          {/* Message */}
          <Text style={styles.message}>
            We've sent a verification email to{'\n'}
            <Text style={styles.email}>{user?.email}</Text>
            {'\n\n'}
            Please click the verification link in the email to activate your
            account.
          </Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {/* I've Verified Button */}
            <TouchableOpacity
              style={[styles.verifyButton, checking && styles.buttonDisabled]}
              onPress={handleCheckVerification}
              disabled={checking}
              activeOpacity={0.8}
            >
              {checking ? (
                <ActivityIndicator color={Colors.secondary} />
              ) : (
                <Text style={styles.verifyButtonText}>I've Verified</Text>
              )}
            </TouchableOpacity>

            {/* Resend Email Button */}
            <TouchableOpacity
              style={[styles.resendButton, resending && styles.buttonDisabled]}
              onPress={handleResendEmail}
              disabled={resending}
              activeOpacity={0.8}
            >
              {resending ? (
                <ActivityIndicator color={Colors.primary} />
              ) : (
                <Text style={styles.resendButtonText}>Resend Email</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>I'll do this later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlayDark,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  modalContainer: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    elevation: 5,
    shadowColor: Colors.secondary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    backgroundColor: `${Colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  message: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  email: {
    fontWeight: '600',
    color: Colors.text.primary,
  },
  buttonContainer: {
    width: '100%',
    gap: Spacing.md,
  },
  verifyButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: Colors.secondary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  verifyButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.secondary,
  },
  resendButton: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  resendButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.primary,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  closeButton: {
    marginTop: Spacing.lg,
    padding: Spacing.sm,
  },
  closeButtonText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});