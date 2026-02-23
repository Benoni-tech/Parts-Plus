// src/components/profile/AccountSection.tsx

import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AuthThemeType,
  BorderRadius,
  FontSizes
} from "../../constants/colors";
import { useAuth } from "../../hooks/useAuth";
import GridOverlay from "./GridOverlay";
import MenuItem from "./MenuItem";
import SectionHeader from "./SectionHeader";

type Router = { push: (path: any) => void };
type User = { displayName?: string | null; email?: string | null };

// ─── Password stage type ─────────────────────────────────────────────────────
type PasswordStage = "old" | "new";

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
  const { userData, updateUserProfile, changePassword, resetPassword } =
    useAuth();

  // ── Edit Profile state ────────────────────────────────────────────────────
  const [showEditModal, setShowEditModal] = useState(false);
  const [username, setUsername] = useState(userData?.username ?? "");
  const [savingProfile, setSavingProfile] = useState(false);

  // ── Change Password state ─────────────────────────────────────────────────
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordStage, setPasswordStage] = useState<PasswordStage>("old");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const cardStyle = {
    backgroundColor: isDark ? "#1e1e1e" : "#f9f9f9",
    borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)",
  };

  const inputStyle = {
    backgroundColor: T.inputBg,
    borderColor: T.inputBorder,
    color: T.inputText,
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const resetPasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordStage("old");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setShowOld(false);
    setShowNew(false);
    setShowConfirm(false);
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSaveProfile = async () => {
    if (!username.trim()) {
      Alert.alert("Error", "Username cannot be empty.");
      return;
    }
    setSavingProfile(true);
    try {
      await updateUserProfile(username.trim());
      setShowEditModal(false);
      Alert.alert("Saved", "Your profile has been updated.");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleVerifyOldPassword = async () => {
    if (!oldPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }
    setPasswordLoading(true);
    setPasswordError("");
    try {
      // We call changePassword with a dummy new password just to verify —
      // but actually we split the service so we just re-auth here.
      // Simpler: attempt changePassword with same password to test re-auth,
      // then on stage "new" do the real update.
      // Instead: try a test re-auth via changePassword(old, old) — if it passes
      // we know the password is correct, then move to stage new.
      // To avoid actually changing password, we expose re-auth separately.
      // Since we don't have a separate reAuth method, we try changePassword
      // with the old password as both args — Firebase will reauth fine and
      // "change" to the same password, which is a no-op effectively.
      // Then on stage new we call changePassword(old, new).
      // The cleanest approach: just store oldPassword and move to stage "new".
      // We validate it for real when the user submits the new password.
      setPasswordStage("new");
    } catch (error: any) {
      setPasswordError("Incorrect password. Please try again.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword) {
      setPasswordError("Please enter a new password.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    if (newPassword === oldPassword) {
      setPasswordError(
        "New password must be different from your current password.",
      );
      return;
    }
    setPasswordLoading(true);
    setPasswordError("");
    try {
      await changePassword(oldPassword, newPassword);
      resetPasswordModal();
      Alert.alert("Success", "Your password has been updated.");
    } catch (error: any) {
      // If re-auth fails here it means old password was wrong
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        setPasswordStage("old");
        setPasswordError("Incorrect current password. Please try again.");
      } else {
        setPasswordError(error.message || "Failed to change password.");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!user?.email) return;
    try {
      await resetPassword(user.email);
      Alert.alert(
        "Email Sent",
        `A password reset link has been sent to ${user.email}.`,
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to send reset email.");
    }
  };

  // ── Shared input renderer ─────────────────────────────────────────────────
  const renderInput = (
    value: string,
    onChange: (t: string) => void,
    placeholder: string,
    secure?: boolean,
    showSecure?: boolean,
    toggleSecure?: () => void,
  ) => (
    <View style={[styles.inputWrapper, inputStyle]}>
      <TextInput
        style={[styles.input, { color: T.inputText }]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={T.inputPlaceholder}
        secureTextEntry={secure && !showSecure}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {toggleSecure && (
        <TouchableOpacity onPress={toggleSecure} style={styles.eyeIcon}>
          <Ionicons
            name={showSecure ? "eye-outline" : "eye-off-outline"}
            size={18}
            color={T.inputIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );

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
            <View style={[styles.modalBanner, { backgroundColor: T.bannerBg }]}>
              <GridOverlay isDark={isDark} />
              <View style={styles.modalBannerContent} pointerEvents="none">
                <Text style={styles.modalEmoji}>✏️</Text>
              </View>
            </View>

            <View style={styles.modalBody}>
              <Text style={[styles.modalTitle, { color: T.titleColor }]}>
                Edit Profile
              </Text>
              <Text style={[styles.modalSubtitle, { color: T.subtitleColor }]}>
                Update your username
              </Text>

              <Text style={[styles.fieldLabel, { color: T.labelColor }]}>
                USERNAME
              </Text>
              {renderInput(username, setUsername, "Enter username")}

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[
                    styles.modalButtonSecondary,
                    { borderColor: T.inputBorder },
                  ]}
                  onPress={() => setShowEditModal(false)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.modalButtonSecondaryText,
                      { color: T.labelColor },
                    ]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    {
                      backgroundColor: T.btnBg,
                      shadowColor: T.shadow,
                      flex: 1,
                    },
                    savingProfile && { opacity: 0.6 },
                  ]}
                  onPress={handleSaveProfile}
                  activeOpacity={0.8}
                  disabled={savingProfile}
                >
                  {savingProfile ? (
                    <ActivityIndicator color={T.btnText} style={{ flex: 1 }} />
                  ) : (
                    <>
                      <Text
                        style={[styles.modalButtonText, { color: T.btnText }]}
                      >
                        Save
                      </Text>
                      <View
                        style={[
                          styles.modalArrowCircle,
                          { backgroundColor: T.btnArrowBg },
                        ]}
                      >
                        <Ionicons
                          name="checkmark"
                          size={18}
                          color={T.btnArrow}
                        />
                      </View>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Change Password Modal ──────────────────────────────────────── */}
      <Modal
        visible={showPasswordModal}
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
            <View style={[styles.modalBanner, { backgroundColor: T.bannerBg }]}>
              <GridOverlay isDark={isDark} />
              <View style={styles.modalBannerContent} pointerEvents="none">
                <Text style={styles.modalEmoji}>
                  {passwordStage === "old" ? "🔐" : "🔑"}
                </Text>
              </View>
            </View>

            <View style={styles.modalBody}>
              <Text style={[styles.modalTitle, { color: T.titleColor }]}>
                {passwordStage === "old" ? "Verify Identity" : "New Password"}
              </Text>
              <Text style={[styles.modalSubtitle, { color: T.subtitleColor }]}>
                {passwordStage === "old"
                  ? "Enter your current password to continue"
                  : "Choose a strong new password"}
              </Text>

              {/* ── Stage: old password ── */}
              {passwordStage === "old" && (
                <>
                  <Text style={[styles.fieldLabel, { color: T.labelColor }]}>
                    CURRENT PASSWORD
                  </Text>
                  {renderInput(
                    oldPassword,
                    setOldPassword,
                    "Enter current password",
                    true,
                    showOld,
                    () => setShowOld(!showOld),
                  )}
                </>
              )}

              {/* ── Stage: new password ── */}
              {passwordStage === "new" && (
                <>
                  <Text style={[styles.fieldLabel, { color: T.labelColor }]}>
                    NEW PASSWORD
                  </Text>
                  {renderInput(
                    newPassword,
                    setNewPassword,
                    "Enter new password",
                    true,
                    showNew,
                    () => setShowNew(!showNew),
                  )}
                  <Text
                    style={[
                      styles.fieldLabel,
                      { color: T.labelColor, marginTop: 12 },
                    ]}
                  >
                    CONFIRM NEW PASSWORD
                  </Text>
                  {renderInput(
                    confirmPassword,
                    setConfirmPassword,
                    "Confirm new password",
                    true,
                    showConfirm,
                    () => setShowConfirm(!showConfirm),
                  )}
                </>
              )}

              {/* Error */}
              {passwordError !== "" && (
                <Text style={styles.errorText}>{passwordError}</Text>
              )}

              {/* Actions */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[
                    styles.modalButtonSecondary,
                    { borderColor: T.inputBorder },
                  ]}
                  onPress={resetPasswordModal}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.modalButtonSecondaryText,
                      { color: T.labelColor },
                    ]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    {
                      backgroundColor: T.btnBg,
                      shadowColor: T.shadow,
                      flex: 1,
                    },
                    passwordLoading && { opacity: 0.6 },
                  ]}
                  onPress={
                    passwordStage === "old"
                      ? handleVerifyOldPassword
                      : handleChangePassword
                  }
                  activeOpacity={0.8}
                  disabled={passwordLoading}
                >
                  {passwordLoading ? (
                    <ActivityIndicator color={T.btnText} style={{ flex: 1 }} />
                  ) : (
                    <>
                      <Text
                        style={[styles.modalButtonText, { color: T.btnText }]}
                      >
                        {passwordStage === "old"
                          ? "Continue"
                          : "Update Password"}
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
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* Forgot password link */}
              <TouchableOpacity
                style={styles.forgotButton}
                onPress={handleForgotPassword}
              >
                <Text style={[styles.forgotText, { color: T.signInLink }]}>
                  Forgot your password?
                </Text>
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
          onPress={() => {
            setUsername(userData?.username ?? "");
            setShowEditModal(true);
          }}
          T={T}
          isDark={isDark}
        />
        <MenuItem
          icon="lock-closed-outline"
          label="Change Password"
          onPress={() => {
            setPasswordStage("old");
            setShowPasswordModal(true);
          }}
          T={T}
          isDark={isDark}
          isLast
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

  // ── Modal shared ─────────────────────────────────────────────────────────
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
  modalEmoji: { fontSize: 48 },
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
  fieldLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    height: 50,
  },
  input: { flex: 1, fontSize: FontSizes.sm },
  eyeIcon: { padding: 6 },
  errorText: {
    fontSize: FontSizes.xs,
    color: "#ff6b6b",
    marginTop: 10,
    marginBottom: 4,
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  modalButton: {
    borderRadius: BorderRadius.lg,
    paddingVertical: 15,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  modalArrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonSecondary: {
    borderRadius: BorderRadius.lg,
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonSecondaryText: {
    fontSize: 14,
    fontWeight: "600",
  },
  forgotButton: {
    alignItems: "center",
    marginTop: 16,
    paddingVertical: 4,
  },
  forgotText: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
  },
});
