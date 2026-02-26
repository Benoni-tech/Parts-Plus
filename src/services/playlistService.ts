// src/services/playlistService.ts

import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "../../Config/firebase";

export interface Playlist {
  id: string;
  name: string;
  userId: string;
  hymnIds: string[];
  createdAt: any;
  updatedAt: any;
}

class PlaylistService {
  private col = collection(db, "playlists");

  /** Real-time listener — fails silently while index is building */
  subscribeToPlaylists(
    userId: string,
    callback: (playlists: Playlist[]) => void,
    onError?: (err: any) => void,
  ) {
    const q = query(
      this.col,
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    );

    return onSnapshot(
      q,
      (snap) => {
        const playlists = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Playlist[];
        callback(playlists);
      },
      (error) => {
        // Index still building — retry after 3 seconds silently
        if (
          error.code === "failed-precondition" &&
          error.message.includes("index")
        ) {
          if (__DEV__) {
            console.log("Firestore index still building — retrying in 3s…");
          }
          setTimeout(() => {
            this.subscribeToPlaylists(userId, callback, onError);
          }, 3000);
        } else if (onError) {
          onError(error);
        } else if (__DEV__) {
          console.error("Playlist listener error:", error);
        }
      },
    );
  }

  /** Create a new empty playlist */
  async createPlaylist(userId: string, name: string): Promise<string> {
    const ref = await addDoc(this.col, {
      name: name.trim(),
      userId,
      hymnIds: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  }

  /** Add a hymn to a playlist */
  async addHymn(playlistId: string, hymnId: string): Promise<void> {
    await updateDoc(doc(this.col, playlistId), {
      hymnIds: arrayUnion(hymnId),
      updatedAt: serverTimestamp(),
    });
  }

  /** Remove a hymn from a playlist */
  async removeHymn(playlistId: string, hymnId: string): Promise<void> {
    await updateDoc(doc(this.col, playlistId), {
      hymnIds: arrayRemove(hymnId),
      updatedAt: serverTimestamp(),
    });
  }

  /** Rename a playlist */
  async renamePlaylist(playlistId: string, name: string): Promise<void> {
    await updateDoc(doc(this.col, playlistId), {
      name: name.trim(),
      updatedAt: serverTimestamp(),
    });
  }

  /** Delete a playlist */
  async deletePlaylist(playlistId: string): Promise<void> {
    await deleteDoc(doc(this.col, playlistId));
  }
}

export default new PlaylistService();
