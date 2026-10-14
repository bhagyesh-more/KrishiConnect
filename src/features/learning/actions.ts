"use server";

import { getLearningRepository } from "./repository";
import { LearningResource, GetLearningResourcesOptions } from "./types";
import { createClient } from "@/lib/supabase/server";

export async function getLearningResourcesAction(
  options?: GetLearningResourcesOptions
): Promise<LearningResource[]> {
  const repo = getLearningRepository();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id || "mock-farmer-pune";
  return repo.getResources({ ...options, userId });
}

export async function getLearningResourceDetailAction(
  id: string
): Promise<LearningResource | null> {
  const repo = getLearningRepository();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id || "mock-farmer-pune";
  return repo.getResourceById(id, userId);
}

export async function toggleLearningBookmarkAction(
  resourceId: string
): Promise<{ success: boolean; isBookmarked: boolean; error?: string }> {
  try {
    const repo = getLearningRepository();
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id || "mock-farmer-pune";
    const isBookmarked = await repo.toggleBookmark(resourceId, userId);
    return { success: true, isBookmarked };
  } catch (err: any) {
    return { success: false, isBookmarked: false, error: err.message };
  }
}
