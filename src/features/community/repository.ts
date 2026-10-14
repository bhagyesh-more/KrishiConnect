import {
  CommunityPost,
  PostComment,
  ContentReport,
  GetPostsOptions,
  PostAuthor,
  ReportStatus,
} from "./types";
import {
  CreatePostInput,
  UpdatePostInput,
  CreateCommentInput,
  CreateReportInput,
} from "./schemas";

export interface CommunityRepository {
  getPosts(options: GetPostsOptions): Promise<{ posts: CommunityPost[]; total: number }>;
  getPostById(id: string, currentUserId?: string): Promise<CommunityPost | null>;
  createPost(input: CreatePostInput, author: PostAuthor): Promise<CommunityPost>;
  updatePost(id: string, input: UpdatePostInput, userId: string, isAdmin?: boolean): Promise<CommunityPost>;
  deletePost(id: string, userId: string, isAdmin?: boolean): Promise<boolean>;
  toggleLike(postId: string, userId: string): Promise<{ liked: boolean; upvotesCount: number }>;
  toggleBookmark(postId: string, userId: string): Promise<{ bookmarked: boolean }>;
  getComments(postId: string): Promise<PostComment[]>;
  createComment(postId: string, input: CreateCommentInput, author: PostAuthor): Promise<PostComment>;
  deleteComment(commentId: string, userId: string, isAdmin?: boolean): Promise<boolean>;
  createReport(input: CreateReportInput, reporterId: string, reporterName?: string): Promise<ContentReport>;
  getReports(status?: ReportStatus): Promise<ContentReport[]>;
  moderateContent(
    reportId: string,
    action: "dismiss" | "hide_content" | "restore_content" | "lock_post",
    adminId: string
  ): Promise<boolean>;
}

// Factory to resolve appropriate repository (Mock vs Supabase)
import { mockCommunityRepository } from "./mockRepository";
import { supabaseCommunityRepository } from "./supabaseRepository";

export function getCommunityRepository(): CommunityRepository {
  const isMock =
    process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-project") ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("placeholder-anon-key");

  // In forced mock mode, local demo, or unconfigured mode, use deterministic mock repository
  if (isMock) {
    return mockCommunityRepository;
  }

  return supabaseCommunityRepository;
}
