import { LearningCategory, LearningContentType } from "@/types/database.types";

export type { LearningCategory, LearningContentType };

export interface LearningResource {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string; // Markdown or rich text
  category: LearningCategory;
  content_type: LearningContentType;
  crop?: string | null;
  topic?: string | null;
  language: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimated_read_minutes: number;
  source_attribution?: string | null;
  source_url?: string | null;
  is_verified: boolean;
  is_demo_content: boolean;
  tags?: string[];
  view_count: number;
  created_at: string;
  updated_at: string;
  is_bookmarked?: boolean;
}

export interface GetLearningResourcesOptions {
  category?: LearningCategory;
  content_type?: LearningContentType;
  crop?: string;
  search?: string;
  language?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  bookmarkedOnly?: boolean;
  userId?: string;
}
