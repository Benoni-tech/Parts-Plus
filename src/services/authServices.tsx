// src/services/authService.ts

import {
  createUserWithEmailAndPassword,
  sendEmailVerification as firebaseSendEmailVerification,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  reload,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../../Config/firebase';

/**
 * Auth Service - Handles all Firebase authentication operations
 */
class AuthService {
  /**
   * Create a new user with email and password
   */
  async createUser(email: string, password: string): Promise<FirebaseUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Create user document in Firestore
      await this.createUserDocument(userCredential.user);

      // Send email verification
      await this.sendEmailVerification(userCredential.user);

      return userCredential.user;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<FirebaseUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Send email verification to current user
   */
  async sendEmailVerification(user?: FirebaseUser): Promise<void> {
    try {
      const currentUser = user || auth.currentUser;
      if (!currentUser) {
        throw new Error('No user is currently signed in');
      }

      // Send verification email without custom URL - let Firebase handle it
      await firebaseSendEmailVerification(currentUser);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Check if user's email is verified
   */
  async checkEmailVerified(): Promise<boolean> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user is currently signed in');
      }

      // Reload user to get latest email verification status
      await reload(user);
      return user.emailVerified;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<void> {
    try {
      // Send password reset email without custom URL
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(
    displayName?: string,
    photoURL?: string
  ): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user is currently signed in');
      }

      await updateProfile(user, {
        ...(displayName && { displayName }),
        ...(photoURL && { photoURL }),
      });
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Create user document in Firestore
   */
  private async createUserDocument(user: FirebaseUser): Promise<void> {
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || null,
        photoURL: user.photoURL || null,
        emailVerified: user.emailVerified,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error: any) {
      console.error('Error creating user document:', error);
      // Don't throw error here as user is already created in Auth
    }
  }

  /**
   * Handle Firebase auth errors
   */
  private handleAuthError(error: any): Error {
    let message = 'An error occurred. Please try again.';

    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'This email is already registered. Please sign in instead.';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address.';
        break;
      case 'auth/operation-not-allowed':
        message = 'Email/password sign-in is not enabled.';
        break;
      case 'auth/weak-password':
        message = 'Password is too weak. Please choose a stronger password.';
        break;
      case 'auth/user-disabled':
        message = 'This account has been disabled.';
        break;
      case 'auth/user-not-found':
        message = 'No account found with this email.';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password. Please try again.';
        break;
      case 'auth/invalid-credential':
        message = 'Invalid email or password. Please try again.';
        break;
      case 'auth/too-many-requests':
        message = 'Too many attempts. Please try again later.';
        break;
      case 'auth/network-request-failed':
        message = 'Network error. Please check your connection.';
        break;
      case 'auth/unauthorized-continue-url':
        message = 'Email verification will be sent. Please check your inbox.';
        break;
      default:
        message = error.message || message;
    }

    return new Error(message);
  }

  /**
   * Get current user
   */
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }
}

export default new AuthService();