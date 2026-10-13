import { createClient } from "@/lib/supabase/server";
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
import { CommunityRepository } from "./repository";

class SupabaseCommunityRepositoryImpl implements CommunityRepository {
  async getPosts(options: GetPostsOptions): Promise<{ posts: CommunityPost[]; total: number }> {
    const supabase = createClient();

    let query = (supabase.from("community_posts") as any)
      .select("*, profiles!community_posts_author_id_fkey(*)", { count: "exact" })
      .eq("is_hidden", false);

    if (options.topic && options.topic !== "all") {
      query = query.eq("topic_category", options.topic);
    }

    if (options.search && options.search.trim().length > 0) {
      const q = options.search.trim();
      query = query.or(`title.ilike.%${q}%,content.ilike.%${q}%,crop_category.ilike.%${q}%`);
    }

    if (options.authorId) {
      query = query.eq("author_id", options.authorId);
    }

    query = query
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });

    const { data, count, error } = await query;
    if (error || !data) {
      return { posts: [], total: 0 };
    }

    // Load likes and bookmarks for current user if signed in
    let userLikes = new Set<string>();
    let userBookmarks = new Set<string>();

    if (options.userId) {
      const [{ data: likes }, { data: bookmarks }] = await Promise.all([
        (supabase.from("post_reactions") as any)
          .select("post_id")
          .eq("user_id", options.userId),
        (supabase.from("post_bookmarks") as any)
          .select("post_id")
          .eq("user_id", options.userId),
      ]);

      if (likes) likes.forEach((l: any) => userLikes.add(l.post_id));
      if (bookmarks) bookmarks.forEach((b: any) => userBookmarks.add(b.post_id));
    }

    const posts: CommunityPost[] = data.map((row: any) => ({
      id: row.id,
      author_id: row.author_id,
      author: {
        id: row.profiles?.id || row.author_id,
        full_name: row.profiles?.full_name || "शेतकरी",
        district: row.profiles?.district || "महाराष्ट्र",
        taluka: row.profiles?.taluka,
        role: "farmer",
        avatar_url: row.profiles?.avatar_url,
      },
      title: row.title,
      content: row.content,
      crop_category: row.crop_category,
      topic_category: row.topic_category,
      image_urls: row.image_urls || [],
      is_pinned: row.is_pinned,
      is_locked: row.is_locked,
      is_hidden: row.is_hidden,
      upvotes_count: row.upvotes_count || 0,
      comments_count: row.comments_count || 0,
      created_at: row.created_at,
      updated_at: row.updated_at,
      is_liked: userLikes.has(row.id),
      is_bookmarked: userBookmarks.has(row.id),
    }));

    if (options.onlyBookmarked && options.userId) {
      const filtered = posts.filter((p) => p.is_bookmarked);
      return { posts: filtered, total: filtered.length };
    }

    return { posts, total: count || posts.length };
  }

  async getPostById(id: string, currentUserId?: string): Promise<CommunityPost | null> {
    const supabase = createClient();
    const { data: row, error } = await (supabase.from("community_posts") as any)
      .select("*, profiles!community_posts_author_id_fkey(*)")
      .eq("id", id)
      .single();

    if (error || !row) return null;

    let isLiked = false;
    let isBookmarked = false;

    if (currentUserId) {
      const [{ data: like }, { data: bookmark }] = await Promise.all([
        (supabase.from("post_reactions") as any)
          .select("post_id")
          .eq("user_id", currentUserId)
          .eq("post_id", id)
          .maybeSingle(),
        (supabase.from("post_bookmarks") as any)
          .select("post_id")
          .eq("user_id", currentUserId)
          .eq("post_id", id)
          .maybeSingle(),
      ]);
      isLiked = !!like;
      isBookmarked = !!bookmark;
    }

    return {
      id: row.id,
      author_id: row.author_id,
      author: {
        id: row.profiles?.id || row.author_id,
        full_name: row.profiles?.full_name || "शेतकरी",
        district: row.profiles?.district || "महाराष्ट्र",
        taluka: row.profiles?.taluka,
        role: "farmer",
        avatar_url: row.profiles?.avatar_url,
      },
      title: row.title,
      content: row.content,
      crop_category: row.crop_category,
      topic_category: row.topic_category,
      image_urls: row.image_urls || [],
      is_pinned: row.is_pinned,
      is_locked: row.is_locked,
      is_hidden: row.is_hidden,
      upvotes_count: row.upvotes_count || 0,
      comments_count: row.comments_count || 0,
      created_at: row.created_at,
      updated_at: row.updated_at,
      is_liked: isLiked,
      is_bookmarked: isBookmarked,
    };
  }

  async createPost(input: CreatePostInput, author: PostAuthor): Promise<CommunityPost> {
    const supabase = createClient();
    const { data, error } = await (supabase.from("community_posts") as any)
      .insert({
        author_id: author.id,
        title: input.title,
        content: input.content,
        crop_category: input.cropCategory || null,
        topic_category: input.topicCategory,
        image_urls: input.imageUrls || [],
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || "पोस्ट तयार करण्यात त्रुटी आली");
    }

    return {
      ...data,
      author,
      upvotes_count: 0,
      comments_count: 0,
      is_liked: false,
      is_bookmarked: false,
    };
  }

  async updatePost(
    id: string,
    input: UpdatePostInput,
    userId: string,
    isAdmin = false
  ): Promise<CommunityPost> {
    const supabase = createClient();

    let query = (supabase.from("community_posts") as any)
      .update({
        ...(input.title !== undefined && { title: input.title }),
        ...(input.content !== undefined && { content: input.content }),
        ...(input.topicCategory !== undefined && { topic_category: input.topicCategory }),
        ...(input.cropCategory !== undefined && { crop_category: input.cropCategory }),
        ...(input.imageUrls !== undefined && { image_urls: input.imageUrls }),
      })
      .eq("id", id);

    if (!isAdmin) {
      query = query.eq("author_id", userId);
    }

    const { data, error } = await query.select("*, profiles(*)").single();
    if (error || !data) {
      throw new Error(error?.message || "पोस्ट अद्ययावत करण्यात त्रुटी आली");
    }

    return {
      ...data,
      author: {
        id: data.profiles?.id || userId,
        full_name: data.profiles?.full_name || "शेतकरी",
        district: data.profiles?.district || "महाराष्ट्र",
        role: "farmer",
      },
    };
  }

  async deletePost(id: string, userId: string, isAdmin = false): Promise<boolean> {
    const supabase = createClient();
    let query = (supabase.from("community_posts") as any).delete().eq("id", id);
    if (!isAdmin) {
      query = query.eq("author_id", userId);
    }
    const { error } = await query;
    return !error;
  }

  async toggleLike(postId: string, userId: string): Promise<{ liked: boolean; upvotesCount: number }> {
    const supabase = createClient();
    const { data: existing } = await (supabase.from("post_reactions") as any)
      .select("*")
      .eq("user_id", userId)
      .eq("post_id", postId)
      .maybeSingle();

    if (existing) {
      await (supabase.from("post_reactions") as any)
        .delete()
        .eq("user_id", userId)
        .eq("post_id", postId);
      const { data: p } = await (supabase.from("community_posts") as any)
        .select("upvotes_count")
        .eq("id", postId)
        .single();
      return { liked: false, upvotesCount: p?.upvotes_count || 0 };
    } else {
      await (supabase.from("post_reactions") as any).insert({
        user_id: userId,
        post_id: postId,
        reaction_type: "upvote",
      });
      const { data: p } = await (supabase.from("community_posts") as any)
        .select("upvotes_count")
        .eq("id", postId)
        .single();
      return { liked: true, upvotesCount: p?.upvotes_count || 1 };
    }
  }

  async toggleBookmark(postId: string, userId: string): Promise<{ bookmarked: boolean }> {
    const supabase = createClient();
    const { data: existing } = await (supabase.from("post_bookmarks") as any)
      .select("*")
      .eq("user_id", userId)
      .eq("post_id", postId)
      .maybeSingle();

    if (existing) {
      await (supabase.from("post_bookmarks") as any)
        .delete()
        .eq("user_id", userId)
        .eq("post_id", postId);
      return { bookmarked: false };
    } else {
      await (supabase.from("post_bookmarks") as any).insert({
        user_id: userId,
        post_id: postId,
      });
      return { bookmarked: true };
    }
  }

  async getComments(postId: string): Promise<PostComment[]> {
    const supabase = createClient();
    const { data, error } = await (supabase.from("post_comments") as any)
      .select("*, profiles!post_comments_author_id_fkey(*)")
      .eq("post_id", postId)
      .eq("is_hidden", false)
      .order("created_at", { ascending: true });

    if (error || !data) return [];

    const rootComments: PostComment[] = [];
    const replyMap = new Map<string, PostComment[]>();

    for (const c of data) {
      const comment: PostComment = {
        id: c.id,
        post_id: c.post_id,
        author_id: c.author_id,
        author: {
          id: c.profiles?.id || c.author_id,
          full_name: c.profiles?.full_name || "शेतकरी",
          district: c.profiles?.district || "महाराष्ट्र",
          role: "farmer",
          avatar_url: c.profiles?.avatar_url,
          is_verified_expert: c.is_expert_answer,
        },
        parent_comment_id: c.parent_comment_id,
        content: c.content,
        is_expert_answer: c.is_expert_answer,
        is_accepted_answer: c.is_accepted_answer,
        is_hidden: c.is_hidden,
        created_at: c.created_at,
      };

      if (c.parent_comment_id) {
        const list = replyMap.get(c.parent_comment_id) || [];
        list.push(comment);
        replyMap.set(c.parent_comment_id, list);
      } else {
        rootComments.push({ ...comment, replies: [] });
      }
    }

    for (const root of rootComments) {
      root.replies = replyMap.get(root.id) || [];
    }

    return rootComments;
  }

  async createComment(
    postId: string,
    input: CreateCommentInput,
    author: PostAuthor
  ): Promise<PostComment> {
    const supabase = createClient();
    const isExpert = author.role === "expert" || !!author.is_verified_expert;

    const { data, error } = await (supabase.from("post_comments") as any)
      .insert({
        post_id: postId,
        author_id: author.id,
        parent_comment_id: input.parentCommentId || null,
        content: input.content,
        is_expert_answer: isExpert,
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || "प्रतिक्रिया नोंदवण्यात त्रुटी आली");
    }

    return {
      ...data,
      author,
      replies: [],
    };
  }

  async deleteComment(commentId: string, userId: string, isAdmin = false): Promise<boolean> {
    const supabase = createClient();
    let query = (supabase.from("post_comments") as any).delete().eq("id", commentId);
    if (!isAdmin) {
      query = query.eq("author_id", userId);
    }
    const { error } = await query;
    return !error;
  }

  async createReport(
    input: CreateReportInput,
    reporterId: string,
    reporterName = "शेतकरी"
  ): Promise<ContentReport> {
    const supabase = createClient();
    const { data, error } = await (supabase.from("post_reports") as any)
      .insert({
        reporter_id: reporterId,
        post_id: input.postId || null,
        comment_id: input.commentId || null,
        reason: input.reason,
        details: input.details || null,
        status: "pending",
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || "तक्रार नोंदवण्यात त्रुटी आली");
    }

    return {
      ...data,
      reporter_name: reporterName,
    };
  }

  async getReports(status?: ReportStatus): Promise<ContentReport[]> {
    const supabase = createClient();
    let query = (supabase.from("post_reports") as any)
      .select("*, profiles!post_reports_reporter_id_fkey(full_name), community_posts(title, content)")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((r: any) => ({
      id: r.id,
      reporter_id: r.reporter_id,
      reporter_name: r.profiles?.full_name || "शेतकरी",
      post_id: r.post_id,
      comment_id: r.comment_id,
      post_title: r.community_posts?.title,
      target_content: r.community_posts?.content,
      reason: r.reason,
      details: r.details,
      status: r.status,
      reviewed_by: r.reviewed_by,
      reviewed_at: r.reviewed_at,
      created_at: r.created_at,
    }));
  }

  async moderateContent(
    reportId: string,
    action: "dismiss" | "hide_content" | "restore_content" | "lock_post",
    adminId: string
  ): Promise<boolean> {
    const supabase = createClient();
    const newStatus = action === "dismiss" ? "dismissed" : "action_taken";

    const { data: report, error: repErr } = await (supabase.from("post_reports") as any)
      .update({
        status: newStatus,
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", reportId)
      .select()
      .single();

    if (repErr || !report) return false;

    if (action === "hide_content") {
      if (report.post_id) {
        await (supabase.from("community_posts") as any)
          .update({ is_hidden: true })
          .eq("id", report.post_id);
      }
      if (report.comment_id) {
        await (supabase.from("post_comments") as any)
          .update({ is_hidden: true })
          .eq("id", report.comment_id);
      }
    } else if (action === "restore_content") {
      if (report.post_id) {
        await (supabase.from("community_posts") as any)
          .update({ is_hidden: false })
          .eq("id", report.post_id);
      }
      if (report.comment_id) {
        await (supabase.from("post_comments") as any)
          .update({ is_hidden: false })
          .eq("id", report.comment_id);
      }
    } else if (action === "lock_post" && report.post_id) {
      await (supabase.from("community_posts") as any)
        .update({ is_locked: true })
        .eq("id", report.post_id);
    }

    return true;
  }
}

export const supabaseCommunityRepository = new SupabaseCommunityRepositoryImpl();
