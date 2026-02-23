// src/types/auth.types.ts

import { User as FirebaseUser } from "firebase/auth";

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  createdAt: string;
}

export interface UserData {
  uid: string;
  username: string;
  email: string | null;
  emailVerified: boolean;
  photoURL: string | null;
  createdAt?: any;
  updatedAt?: any;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

export interface AuthContextType extends AuthState {
  userData: UserData | null;

  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  updateUserProfile: (displayName?: string, photoURL?: string) => Promise<void>;
  sendEmailVerification: () => Promise<void>;
  checkEmailVerified: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const mapFirebaseUser = (firebaseUser: FirebaseUser): User => ({
  uid: firebaseUser.uid,
  email: firebaseUser.email,
  displayName: firebaseUser.displayName,
  photoURL: firebaseUser.photoURL,
  emailVerified: firebaseUser.emailVerified,
  createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
});
