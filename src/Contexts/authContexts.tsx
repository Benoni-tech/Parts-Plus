// src/contexts/AuthContext.tsx - WITH USERDATA

import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { auth, db } from "../../Config/firebase";
import authService from "../services/authServices";
import {
  AuthContextType,
  AuthState,
  mapFirebaseUser,
  UserData,
} from "../types/auth.types";

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth Provider Component
 * Manages authentication state and provides auth methods to children
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    initialized: false,
  });

  const [userData, setUserData] = useState<UserData | null>(null);

  /**
   * Fetch user data from Firestore
   */
  const fetchUserData = async (uid: string): Promise<UserData | null> => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserData;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        console.log(
          "🔄 Auth state changed:",
          firebaseUser?.email,
          "Verified:",
          firebaseUser?.emailVerified,
        );

        if (firebaseUser) {
          // Fetch user data from Firestore
          const data = await fetchUserData(firebaseUser.uid);
          setUserData(data);

          setState({
            user: mapFirebaseUser(firebaseUser),
            loading: false,
            error: null,
            initialized: true,
          });
        } else {
          setUserData(null);
          setState({
            user: null,
            loading: false,
            error: null,
            initialized: true,
          });
        }
      },
      (error) => {
        console.error("Auth state change error:", error);
        setState({
          user: null,
          loading: false,
          error: error.message,
          initialized: true,
        });
      },
    );

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  /**
   * Sign up with email and password
   */
  const signUp = async (email: string, password: string): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      console.log("📝 Creating user account...");
      await authService.createUser(email, password);
      console.log("✅ User account created");
      // State will be updated by onAuthStateChanged
    } catch (error: any) {
      console.error("❌ Signup error:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      throw error;
    }
  };

  /**
   * Sign in with email and password
   */
  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await authService.signIn(email, password);

      // Reload the user to get fresh emailVerified status
      if (auth.currentUser) {
        await auth.currentUser.reload();
        console.log(
          "✅ User signed in, verified:",
          auth.currentUser.emailVerified,
        );
      }

      // State will be updated by onAuthStateChanged
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      throw error;
    }
  };

  /**
   * Sign out
   */
  const signOut = async (): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await authService.signOut();
      console.log("✅ User signed out");
      // State will be updated by onAuthStateChanged
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      throw error;
    }
  };

  /**
   * Send email verification
   */
  const sendEmailVerification = async (): Promise<void> => {
    try {
      console.log("📧 Sending verification email...");
      await authService.sendEmailVerification();
      console.log("✅ Verification email sent");
    } catch (error: any) {
      console.error("❌ Error sending verification:", error);
      setState((prev) => ({ ...prev, error: error.message }));
      throw error;
    }
  };

  /**
   * Check if email is verified
   */
  const checkEmailVerified = async (): Promise<boolean> => {
    try {
      const isVerified = await authService.checkEmailVerified();
      console.log("🔍 Email verification check:", isVerified);

      // Update user state if verified
      if (isVerified && auth.currentUser) {
        setState((prev) => ({
          ...prev,
          user: mapFirebaseUser(auth.currentUser!),
        }));
      }

      return isVerified;
    } catch (error: any) {
      setState((prev) => ({ ...prev, error: error.message }));
      throw error;
    }
  };

  /**
   * Reset password
   */
  const resetPassword = async (email: string): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await authService.resetPassword(email);
      setState((prev) => ({ ...prev, loading: false }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      throw error;
    }
  };

  /**
   * Refresh user data
   */
  const refreshUser = async (): Promise<void> => {
    try {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        const data = await fetchUserData(auth.currentUser.uid);
        setUserData(data);
        setState((prev) => ({
          ...prev,
          user: mapFirebaseUser(auth.currentUser!),
        }));
        console.log("🔄 User data refreshed");
      }
    } catch (error: any) {
      console.error("Error refreshing user:", error);
    }
  };

  const value: AuthContextType = {
    ...state,
    userData, // Add userData to context
    signUp,
    signIn,
    signOut,
    sendEmailVerification,
    checkEmailVerified,
    resetPassword,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
