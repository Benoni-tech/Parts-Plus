// src/types/hymn.types.ts

export type VoicePart = "soprano" | "alto" | "tenor" | "bass";

export type HymnCategory =
  | "hymn"
  | "chorus"
  | "english"
  | "twi"
  | "praises"
  | "worship";

export interface VoiceParts {
  soprano: string;
  alto: string;
  tenor: string;
  bass: string;
}

export interface PartsDuration {
  soprano: string;
  alto: string;
  tenor: string;
  bass: string;
}

export interface Credits {
  soprano: string;
  alto: string;
  tenor: string;
  bass: string;
  pianist: string;
}

export interface Hymn {
  id?: string;

  // Basic Info
  title: string;
  number: number;
  category: HymnCategory;

  // Composer Info
  composer: string;
  lyricist: string;
  yearWritten: number;

  // Performance Info
  credits: Credits;

  // Audio Files
  voiceParts: VoiceParts;
  partsDuration: PartsDuration;

  // Media
  coverImage: string;
  lyrics: string;

  // Metadata
  tags: string[];
  plays: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface HymnFilter {
  category?: HymnCategory;
  tags?: string[];
  searchTerm?: string;
}
