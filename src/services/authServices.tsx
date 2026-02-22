import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendEmailVerification as firebaseSendEmailVerification,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  reload,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../Config/firebase";

class AuthService {
  /**
   * Create user with email, password, and username
   */
  async createUser(
    email: string,
    password: string,
    username: string,
  ): Promise<FirebaseUser> {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const user = userCredential.user;

    await updateProfile(user, {
      displayName: username.trim(),
    });

    await reload(user);

    await this.createUserDocument(user, username.trim());

    await this.sendEmailVerification(user);

    return user;
  }

  /**
   * Sign in user
   */
  async signIn(email: string, password: string): Promise<FirebaseUser> {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const user = userCredential.user;

    await user.getIdToken(true);
    await this.syncEmailVerificationStatus(user);

    return user;
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  }

  /**
   * Delete account — Firestore first, then Firebase Auth
   * Must delete Firestore before Auth because once Auth account
   * is deleted we lose permission to write to Firestore
   */
  async deleteAccount(): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user is currently signed in");
    }

    // Step 1 — delete Firestore document first
    await deleteDoc(doc(db, "users", user.uid));

    // Step 2 — delete Firebase Auth account
    await deleteUser(user);
  }

  /**
   * Send verification email
   */
  async sendEmailVerification(user?: FirebaseUser): Promise<void> {
    const currentUser = user || auth.currentUser;
    if (!currentUser) {
      throw new Error("No user is currently signed in");
    }

    await firebaseSendEmailVerification(currentUser);
  }

  /**
   * Check email verification
   */
  async checkEmailVerified(): Promise<boolean> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user is currently signed in");
    }

    await reload(user);
    await this.syncEmailVerificationStatus(user);

    return user.emailVerified;
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  }

  /**
   * Update user profile
   */
  async updateUserProfile(
    displayName?: string,
    photoURL?: string,
  ): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user is currently signed in");
    }

    await updateProfile(user, {
      ...(displayName && { displayName }),
      ...(photoURL && { photoURL }),
    });

    await updateDoc(doc(db, "users", user.uid), {
      ...(displayName && { username: displayName }),
      ...(photoURL && { photoURL }),
      updatedAt: serverTimestamp(),
    });

    await user.getIdToken(true);
  }

  /**
   * Create Firestore user document
   */
  private async createUserDocument(
    user: FirebaseUser,
    username: string,
  ): Promise<void> {
    const userRef = doc(db, "users", user.uid);

    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      username: username.trim(),
      photoURL: user.photoURL || null,
      emailVerified: user.emailVerified,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  /**
   * Sync email verification status with Firestore
   */
  private async syncEmailVerificationStatus(user: FirebaseUser): Promise<void> {
    await reload(user);

    await setDoc(
      doc(db, "users", user.uid),
      {
        emailVerified: user.emailVerified,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  }

  /**
   * Get current user
   */
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }
}

export default new AuthService();
