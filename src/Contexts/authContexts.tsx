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

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    initialized: false,
  });

  const [userData, setUserData] = useState<UserData | null>(null);

  const fetchUserData = async (uid: string): Promise<UserData | null> => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) return userDoc.data() as UserData;
      return null;
    } catch (error) {
      if (__DEV__) console.error("Error fetching user data:", error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (firebaseUser) {
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
        setState({
          user: null,
          loading: false,
          error: error.message,
          initialized: true,
        });
      },
    );
    return () => unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    username: string,
  ): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await authService.createUser(email, password, username);
      const currentUser = auth.currentUser;
      if (currentUser) {
        const data = await fetchUserData(currentUser.uid);
        setUserData(data);
      }
    } catch (error: any) {
      setState((prev) => ({ ...prev, loading: false, error: error.message }));
      throw error;
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await authService.signIn(email, password);
    } catch (error: any) {
      setState((prev) => ({ ...prev, loading: false, error: error.message }));
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await authService.signOut();
    } catch (error: any) {
      setState((prev) => ({ ...prev, loading: false, error: error.message }));
      throw error;
    }
  };

  const deleteAccount = async (): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await authService.deleteAccount();
    } catch (error: any) {
      setState((prev) => ({ ...prev, loading: false, error: error.message }));
      throw error;
    }
  };

  /**
   * Change password — verifies old password then sets new one
   */
  const changePassword = async (
    oldPassword: string,
    newPassword: string,
  ): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await authService.changePassword(oldPassword, newPassword);
      setState((prev) => ({ ...prev, loading: false }));
    } catch (error: any) {
      setState((prev) => ({ ...prev, loading: false, error: error.message }));
      throw error;
    }
  };

  const sendEmailVerification = async (): Promise<void> => {
    await authService.sendEmailVerification();
  };

  const checkEmailVerified = async (): Promise<boolean> => {
    return await authService.checkEmailVerified();
  };

  const resetPassword = async (email: string): Promise<void> => {
    await authService.resetPassword(email);
  };

  const refreshUser = async (): Promise<void> => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      const data = await fetchUserData(auth.currentUser.uid);
      setUserData(data);
      setState((prev) => ({
        ...prev,
        user: mapFirebaseUser(auth.currentUser!),
      }));
    }
  };

  const updateUserProfile = async (
    displayName?: string,
    photoURL?: string,
  ): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await authService.updateUserProfile(displayName, photoURL);
      if (auth.currentUser) {
        const data = await fetchUserData(auth.currentUser.uid);
        setUserData(data);
        setState((prev) => ({
          ...prev,
          loading: false,
          user: mapFirebaseUser(auth.currentUser!),
        }));
      }
    } catch (error: any) {
      setState((prev) => ({ ...prev, loading: false, error: error.message }));
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    userData,
    signUp,
    signIn,
    signOut,
    deleteAccount,
    changePassword,
    updateUserProfile,
    sendEmailVerification,
    checkEmailVerified,
    resetPassword,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
