import { LearningResource, GetLearningResourcesOptions } from "./types";

export interface LearningRepository {
  getResources(options?: GetLearningResourcesOptions): Promise<LearningResource[]>;
  getResourceById(id: string, userId?: string): Promise<LearningResource | null>;
  toggleBookmark(resourceId: string, userId: string): Promise<boolean>; // Returns new bookmark state
  getRecentOrPopular(limit?: number): Promise<LearningResource[]>;
}

export function getLearningRepository(): LearningRepository {
  const isMock =
    process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (isMock) {
    // Dynamic require or import
    const { MockLearningRepository } = require("./mockRepository");
    return new MockLearningRepository();
  }

  const { SupabaseLearningRepository } = require("./supabaseRepository");
  return new SupabaseLearningRepository();
}
