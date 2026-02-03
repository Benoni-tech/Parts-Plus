// src/contexts/AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../Config/firebase';
import authService from '../services/authServices';
import { AuthContextType, AuthState, mapFirebaseUser } from '../types/auth.types';

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (firebaseUser) {
          setState({
            user: mapFirebaseUser(firebaseUser),
            loading: false,
            error: null,
            initialized: true,
          });
        } else {
          setState({
            user: null,
            loading: false,
            error: null,
            initialized: true,
          });
        }
      },
      (error) => {
        console.error('Auth state change error:', error);
        setState({
          user: null,
          loading: false,
          error: error.message,
          initialized: true,
        });
      }
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
      await authService.createUser(email, password);
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
   * Sign in with email and password
   */
  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await authService.signIn(email, password);
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
      await authService.sendEmailVerification();
    } catch (error: any) {
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
        setState((prev) => ({
          ...prev,
          user: mapFirebaseUser(auth.currentUser!),
        }));
      }
    } catch (error: any) {
      console.error('Error refreshing user:', error);
    }
  };

  const value: AuthContextType = {
    ...state,
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