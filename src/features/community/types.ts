export type TopicCategory =
  | "all"
  | "crop_care"
  | "pest_disease"
  | "market_price"
  | "equipment"
  | "organic"
  | "general";

export type ReportReason =
  | "misinformation"
  | "unsafe_pesticide_advice"
  | "spam"
  | "abuse"
  | "other";

export type ReportStatus = "pending" | "reviewed" | "dismissed" | "action_taken";

export interface PostAuthor {
  id: string;
  full_name: string;
  district: string;
  taluka?: string | null;
  role: "farmer" | "buyer" | "expert" | "seller" | "admin";
  avatar_url?: string | null;
  is_verified_expert?: boolean;
}

export interface PostComment {
  id: string;
  post_id: string;
  author_id: string;
  author: PostAuthor;
  parent_comment_id?: string | null;
  content: string;
  is_expert_answer: boolean;
  is_accepted_answer: boolean;
  is_hidden: boolean;
  created_at: string;
  updated_at?: string;
  replies?: PostComment[];
}

export interface CommunityPost {
  id: string;
  author_id: string;
  author: PostAuthor;
  title: string;
  content: string;
  crop_category?: string | null;
  topic_category: Exclude<TopicCategory, "all">;
  image_urls: string[];
  is_pinned: boolean;
  is_locked: boolean;
  is_hidden: boolean;
  upvotes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  is_liked?: boolean;
  is_bookmarked?: boolean;
}

export interface ContentReport {
  id: string;
  reporter_id: string;
  reporter_name?: string;
  post_id?: string | null;
  comment_id?: string | null;
  post_title?: string;
  target_content?: string;
  reason: ReportReason;
  details?: string | null;
  status: ReportStatus;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at: string;
}

export interface GetPostsOptions {
  topic?: TopicCategory;
  search?: string;
  crop?: string;
  onlyBookmarked?: boolean;
  authorId?: string;
  userId?: string;
  page?: number;
  limit?: number;
}
