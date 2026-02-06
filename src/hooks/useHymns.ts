// src/hooks/useHymns.ts

import { useEffect, useState } from "react";
import { HymnService } from "../services/firebase.service";
import { Hymn, HymnFilter } from "../types/hymn.types";

/**
 * Hook to fetch and filter hymns
 */
export const useHymns = (filter?: HymnFilter) => {
  const [hymns, setHymns] = useState<Hymn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHymns();
  }, [JSON.stringify(filter)]); // Re-fetch when filter changes

  const loadHymns = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = filter
        ? await HymnService.filterHymns(filter)
        : await HymnService.getAllHymns();

      setHymns(data);
    } catch (err: any) {
      setError(err.message || "Failed to load hymns");
      console.error("Error loading hymns:", err);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    loadHymns();
  };

  return { hymns, loading, error, refresh };
};

/**
 * Hook to fetch a single hymn by ID
 */
export const useHymn = (id: string) => {
  const [hymn, setHymn] = useState<Hymn | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadHymn();
    }
  }, [id]);

  const loadHymn = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await HymnService.getHymnById(id);
      setHymn(data);
    } catch (err: any) {
      setError(err.message || "Failed to load hymn");
      console.error("Error loading hymn:", err);
    } finally {
      setLoading(false);
    }
  };

  return { hymn, loading, error, refresh: loadHymn };
};

/**
 * Hook to fetch all available tags
 */
export const useTags = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const data = await HymnService.getAllTags();
      setTags(data);
    } catch (error) {
      console.error("Error loading tags:", error);
    } finally {
      setLoading(false);
    }
  };

  return { tags, loading };
};

/**
 * Hook to fetch all composers
 */
export const useComposers = () => {
  const [composers, setComposers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComposers();
  }, []);

  const loadComposers = async () => {
    try {
      const data = await HymnService.getAllComposers();
      setComposers(data);
    } catch (error) {
      console.error("Error loading composers:", error);
    } finally {
      setLoading(false);
    }
  };

  return { composers, loading };
};

/**
 * Hook to fetch popular hymns
 */
export const usePopularHymns = (count: number = 5) => {
  const [hymns, setHymns] = useState<Hymn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPopularHymns();
  }, [count]);

  const loadPopularHymns = async () => {
    try {
      const data = await HymnService.getPopularHymns(count);
      setHymns(data);
    } catch (error) {
      console.error("Error loading popular hymns:", error);
    } finally {
      setLoading(false);
    }
  };

  return { hymns, loading, refresh: loadPopularHymns };
};

/**
 * Hook to fetch recently added hymns
 */
export const useRecentHymns = (count: number = 5) => {
  const [hymns, setHymns] = useState<Hymn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentHymns();
  }, [count]);

  const loadRecentHymns = async () => {
    try {
      const data = await HymnService.getRecentHymns(count);
      setHymns(data);
    } catch (error) {
      console.error("Error loading recent hymns:", error);
    } finally {
      setLoading(false);
    }
  };

  return { hymns, loading, refresh: loadRecentHymns };
};
