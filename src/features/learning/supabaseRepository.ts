import { LearningResource, GetLearningResourcesOptions } from "./types";
import { LearningRepository } from "./repository";
import { createClient } from "@/lib/supabase/server";

export class SupabaseLearningRepository implements LearningRepository {
  async getResources(options?: GetLearningResourcesOptions): Promise<LearningResource[]> {
    const supabase = await createClient();

    let query = (supabase as any)
      .from("learning_resources")
      .select("*")
      .order("created_at", { ascending: false });

    if (options?.category) {
      query = query.eq("category", options.category);
    }
    if (options?.content_type) {
      query = query.eq("content_type", options.content_type);
    }
    if (options?.difficulty) {
      query = query.eq("difficulty_level", options.difficulty);
    }
    if (options?.search) {
      query = query.or(
        `title_mr.ilike.%${options.search}%,summary_mr.ilike.%${options.search}%`
      );
    }

    const { data, error } = await query;
    if (error || !data) return [];

    let bookmarkedIds = new Set<string>();
    if (options?.userId) {
      const { data: bData } = await (supabase as any)
        .from("resource_bookmarks")
        .select("resource_id")
        .eq("user_id", options.userId);
      if (bData) {
        bookmarkedIds = new Set(bData.map((b: any) => b.resource_id));
      }
    }

    const mapped: LearningResource[] = (data as any[]).map((row) => ({
      id: row.id,
      title: row.title_mr || row.title_en,
      slug: row.id,
      summary: row.summary_mr || row.summary_en,
      content: row.content_markdown_mr || row.content_markdown_en,
      category: row.category,
      content_type: row.content_type,
      crop: row.crop_tag,
      topic: row.category,
      language: "mr",
      difficulty: row.difficulty_level || "beginner",
      estimated_read_minutes: row.estimated_minutes || 5,
      source_attribution: row.source_attribution,
      source_url: null,
      is_verified: true,
      is_demo_content: !!row.is_demo_resource,
      tags: row.crop_tag ? [row.crop_tag] : [],
      view_count: 100,
      created_at: row.created_at,
      updated_at: row.updated_at,
      is_bookmarked: bookmarkedIds.has(row.id),
    }));

    if (options?.bookmarkedOnly) {
      return mapped.filter((r) => r.is_bookmarked);
    }

    return mapped;
  }

  async getResourceById(id: string, userId?: string): Promise<LearningResource | null> {
    const supabase = await createClient();
    const { data, error } = await (supabase as any)
      .from("learning_resources")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return null;

    let isBookmarked = false;
    if (userId) {
      const { data: bData } = await (supabase as any)
        .from("resource_bookmarks")
        .select("created_at")
        .eq("user_id", userId)
        .eq("resource_id", data.id)
        .maybeSingle();
      if (bData) isBookmarked = true;
    }

    return {
      id: data.id,
      title: data.title_mr || data.title_en,
      slug: data.id,
      summary: data.summary_mr || data.summary_en,
      content: data.content_markdown_mr || data.content_markdown_en,
      category: data.category,
      content_type: data.content_type,
      crop: data.crop_tag,
      topic: data.category,
      language: "mr",
      difficulty: data.difficulty_level || "beginner",
      estimated_read_minutes: data.estimated_minutes || 5,
      source_attribution: data.source_attribution,
      source_url: null,
      is_verified: true,
      is_demo_content: !!data.is_demo_resource,
      tags: data.crop_tag ? [data.crop_tag] : [],
      view_count: 100,
      created_at: data.created_at,
      updated_at: data.updated_at,
      is_bookmarked: isBookmarked,
    };
  }

  async toggleBookmark(resourceId: string, userId: string): Promise<boolean> {
    const supabase = await createClient();
    const { data: existing } = await (supabase as any)
      .from("resource_bookmarks")
      .select("resource_id")
      .eq("user_id", userId)
      .eq("resource_id", resourceId)
      .maybeSingle();

    if (existing) {
      await (supabase as any)
        .from("resource_bookmarks")
        .delete()
        .eq("user_id", userId)
        .eq("resource_id", resourceId);
      return false;
    } else {
      await (supabase as any).from("resource_bookmarks").insert({
        user_id: userId,
        resource_id: resourceId,
      });
      return true;
    }
  }

  async getRecentOrPopular(limit: number = 4): Promise<LearningResource[]> {
    return this.getResources();
  }
}
