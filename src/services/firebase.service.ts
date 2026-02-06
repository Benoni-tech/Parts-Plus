// src/services/firebase.service.ts

import {
    collection,
    doc,
    getDoc,
    getDocs,
    increment,
    Timestamp,
    updateDoc
} from "firebase/firestore";
import { db } from "../../Config/firebase";
import { Hymn, HymnCategory, HymnFilter } from "../types/hymn.types";

export class HymnService {
  private static COLLECTION = "songs";

  /**
   * Fetch all hymns
   */
  static async getAllHymns(): Promise<Hymn[]> {
    try {
      const songsRef = collection(db, this.COLLECTION);
      const snapshot = await getDocs(songsRef);

      return snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate(),
          }) as Hymn,
      );
    } catch (error) {
      console.error("Error fetching hymns:", error);
      throw error;
    }
  }

  /**
   * Get hymn by ID
   */
  static async getHymnById(id: string): Promise<Hymn | null> {
    try {
      const hymnRef = doc(db, this.COLLECTION, id);
      const snapshot = await getDoc(hymnRef);

      if (!snapshot.exists()) return null;

      return {
        id: snapshot.id,
        ...snapshot.data(),
        createdAt: snapshot.data().createdAt?.toDate(),
        updatedAt: snapshot.data().updatedAt?.toDate(),
      } as Hymn;
    } catch (error) {
      console.error("Error fetching hymn:", error);
      throw error;
    }
  }

  /**
   * Filter hymns by category
   */
  static async getHymnsByCategory(category: HymnCategory): Promise<Hymn[]> {
    try {
      const hymns = await this.getAllHymns();
      return hymns.filter((h) => h.category === category);
    } catch (error) {
      console.error("Error filtering by category:", error);
      throw error;
    }
  }

  /**
   * Filter hymns by tags and search
   */
  static async filterHymns(filter: HymnFilter): Promise<Hymn[]> {
    try {
      let hymns = await this.getAllHymns();

      // Filter by category
      if (filter.category) {
        hymns = hymns.filter((h) => h.category === filter.category);
      }

      // Filter by tags (hymn must have ALL selected tags)
      if (filter.tags && filter.tags.length > 0) {
        hymns = hymns.filter((h) =>
          filter.tags!.every((tag) => h.tags?.includes(tag)),
        );
      }

      // Search by title or composer
      if (filter.searchTerm) {
        const search = filter.searchTerm.toLowerCase();
        hymns = hymns.filter(
          (h) =>
            h.title.toLowerCase().includes(search) ||
            h.composer.toLowerCase().includes(search),
        );
      }

      return hymns;
    } catch (error) {
      console.error("Error filtering hymns:", error);
      throw error;
    }
  }

  /**
   * Get all unique tags
   */
  static async getAllTags(): Promise<string[]> {
    try {
      const hymns = await this.getAllHymns();
      const allTags = hymns.flatMap((h) => h.tags || []);
      return [...new Set(allTags)].sort();
    } catch (error) {
      console.error("Error getting tags:", error);
      throw error;
    }
  }

  /**
   * Get all unique composers
   */
  static async getAllComposers(): Promise<string[]> {
    try {
      const hymns = await this.getAllHymns();
      const composers = hymns.map((h) => h.composer).filter(Boolean);
      return [...new Set(composers)].sort();
    } catch (error) {
      console.error("Error getting composers:", error);
      throw error;
    }
  }

  /**
   * Increment play count
   */
  static async incrementPlays(hymnId: string): Promise<void> {
    try {
      const hymnRef = doc(db, this.COLLECTION, hymnId);
      await updateDoc(hymnRef, {
        plays: increment(1),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error incrementing plays:", error);
      // Don't throw - play count is not critical
    }
  }

  /**
   * Get popular hymns (most played)
   */
  static async getPopularHymns(count: number = 10): Promise<Hymn[]> {
    try {
      const hymns = await this.getAllHymns();
      return hymns
        .sort((a, b) => (b.plays || 0) - (a.plays || 0))
        .slice(0, count);
    } catch (error) {
      console.error("Error getting popular hymns:", error);
      throw error;
    }
  }

  /**
   * Get recently added hymns
   */
  static async getRecentHymns(count: number = 10): Promise<Hymn[]> {
    try {
      const hymns = await this.getAllHymns();
      return hymns
        .sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, count);
    } catch (error) {
      console.error("Error getting recent hymns:", error);
      throw error;
    }
  }

  /**
   * Search hymns
   */
  static async searchHymns(searchTerm: string): Promise<Hymn[]> {
    return this.filterHymns({ searchTerm });
  }
}
