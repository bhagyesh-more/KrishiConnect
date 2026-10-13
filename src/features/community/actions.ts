"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserProfile } from "@/features/auth/actions";
import { getCommunityRepository } from "./repository";
import {
  createPostSchema,
  updatePostSchema,
  createCommentSchema,
  createReportSchema,
  moderateContentSchema,
  CreatePostInput,
  UpdatePostInput,
  CreateCommentInput,
  CreateReportInput,
  ModerateContentInput,
} from "./schemas";
import { GetPostsOptions, PostAuthor } from "./types";
import { MOCK_AUTHORS } from "./mockRepository";

export interface ActionResult<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

async function resolveAuthorContext(): Promise<{
  author: PostAuthor;
  isAdmin: boolean;
}> {
  const userContext = await getCurrentUserProfile();

  if (userContext?.profile) {
    const profile = userContext.profile as any;
    const roles = userContext.roles.map((r: any) => r.role);
    const isAdmin = roles.includes("admin");
    const isExpert = roles.includes("expert");

    return {
      author: {
        id: profile.id,
        full_name: profile.full_name,
        district: profile.district,
        taluka: profile.taluka,
        role: isAdmin ? "admin" : isExpert ? "expert" : "farmer",
        avatar_url: profile.avatar_url,
        is_verified_expert: isExpert,
      },
      isAdmin,
    };
  }

  // Fallback demo author when running locally without active session
  return {
    author: MOCK_AUTHORS.farmer_ramesh,
    isAdmin: false,
  };
}

export async function getCommunityPostsAction(
  options: GetPostsOptions = {}
): Promise<ActionResult> {
  try {
    const userContext = await getCurrentUserProfile();
    const userId = userContext?.user?.id || options.userId;
    const repo = getCommunityRepository();
    const result = await repo.getPosts({ ...options, userId });
    return { success: true, data: result };
  } catch (err: any) {
    return { success: false, error: err?.message || "पोस्ट मिळवण्यात त्रुटी आली" };
  }
}

export async function getCommunityPostDetailAction(
  postId: string
): Promise<ActionResult> {
  try {
    const userContext = await getCurrentUserProfile();
    const userId = userContext?.user?.id;
    const repo = getCommunityRepository();
    const [post, comments] = await Promise.all([
      repo.getPostById(postId, userId),
      repo.getComments(postId),
    ]);

    if (!post) {
      return { success: false, error: "पोस्ट अस्तित्वात नाही किंवा हटवली आहे" };
    }

    return {
      success: true,
      data: {
        post,
        comments,
        currentUserId: userId || MOCK_AUTHORS.farmer_ramesh.id,
      },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "पोस्ट तपशील मिळवण्यात त्रुटी आली" };
  }
}

export async function createCommunityPostAction(
  input: CreatePostInput
): Promise<ActionResult> {
  const validation = createPostSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "अवैध पोस्ट माहिती",
    };
  }

  try {
    const { author } = await resolveAuthorContext();
    const repo = getCommunityRepository();
    const post = await repo.createPost(validation.data, author);

    revalidatePath("/community");
    return {
      success: true,
      message: "पोस्ट यशस्वीरित्या प्रकाशित झाली!",
      data: post,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "पोस्ट तयार करण्यात त्रुटी आली" };
  }
}

export async function updateCommunityPostAction(
  postId: string,
  input: UpdatePostInput
): Promise<ActionResult> {
  const validation = updatePostSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "अवैध बदल माहिती",
    };
  }

  try {
    const { author, isAdmin } = await resolveAuthorContext();
    const repo = getCommunityRepository();
    const updated = await repo.updatePost(postId, validation.data, author.id, isAdmin);

    revalidatePath("/community");
    revalidatePath(`/community/${postId}`);
    return {
      success: true,
      message: "पोस्ट यशस्वीरित्या अद्ययावत केली!",
      data: updated,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "पोस्ट अद्ययावत करण्यात अयशस्वी" };
  }
}

export async function deleteCommunityPostAction(
  postId: string
): Promise<ActionResult> {
  try {
    const { author, isAdmin } = await resolveAuthorContext();
    const repo = getCommunityRepository();
    const deleted = await repo.deletePost(postId, author.id, isAdmin);

    if (!deleted) {
      return { success: false, error: "पोस्ट हटवण्यात त्रुटी आली" };
    }

    revalidatePath("/community");
    return { success: true, message: "पोस्ट यशस्वीरित्या हटवली गेली!" };
  } catch (err: any) {
    return { success: false, error: err?.message || "पोस्ट हटवण्यात अयशस्वी" };
  }
}

export async function togglePostLikeAction(
  postId: string
): Promise<ActionResult> {
  try {
    const { author } = await resolveAuthorContext();
    const repo = getCommunityRepository();
    const result = await repo.toggleLike(postId, author.id);

    revalidatePath("/community");
    revalidatePath(`/community/${postId}`);
    return { success: true, data: result };
  } catch (err: any) {
    return { success: false, error: err?.message || "पसंती नोंदवण्यात त्रुटी आली" };
  }
}

export async function togglePostBookmarkAction(
  postId: string
): Promise<ActionResult> {
  try {
    const { author } = await resolveAuthorContext();
    const repo = getCommunityRepository();
    const result = await repo.toggleBookmark(postId, author.id);

    revalidatePath("/community");
    revalidatePath(`/community/${postId}`);
    return {
      success: true,
      message: result.bookmarked ? "बुकमार्क जतन केला!" : "बुकमार्क काढला!",
      data: result,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "बुकमार्क बदलण्यात त्रुटी आली" };
  }
}

export async function createPostCommentAction(
  postId: string,
  input: CreateCommentInput
): Promise<ActionResult> {
  const validation = createCommentSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "अवैध प्रतिक्रिया माहिती",
    };
  }

  try {
    const { author } = await resolveAuthorContext();
    const repo = getCommunityRepository();
    const comment = await repo.createComment(postId, validation.data, author);

    revalidatePath("/community");
    revalidatePath(`/community/${postId}`);
    return {
      success: true,
      message: "प्रतिक्रिया नोंदवली गेली!",
      data: comment,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "प्रतिक्रिया नोंदवण्यात अयशस्वी" };
  }
}

export async function deletePostCommentAction(
  commentId: string,
  postId: string
): Promise<ActionResult> {
  try {
    const { author, isAdmin } = await resolveAuthorContext();
    const repo = getCommunityRepository();
    const deleted = await repo.deleteComment(commentId, author.id, isAdmin);

    if (!deleted) {
      return { success: false, error: "प्रतिक्रिया हटवण्यात त्रुटी आली" };
    }

    revalidatePath(`/community/${postId}`);
    return { success: true, message: "प्रतिक्रिया हटवली गेली!" };
  } catch (err: any) {
    return { success: false, error: err?.message || "प्रतिक्रिया हटवण्यात अयशस्वी" };
  }
}

export async function createPostReportAction(
  input: CreateReportInput
): Promise<ActionResult> {
  const validation = createReportSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "अवैध तक्रार माहिती",
    };
  }

  try {
    const { author } = await resolveAuthorContext();
    const repo = getCommunityRepository();
    const report = await repo.createReport(validation.data, author.id, author.full_name);

    return {
      success: true,
      message: "तक्रार नोंदवली गेली. प्रशासक लवकरच याची पडताळणी करतील.",
      data: report,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "तक्रार नोंदवण्यात त्रुटी आली" };
  }
}

export async function getModerationReportsAction(): Promise<ActionResult> {
  try {
    const repo = getCommunityRepository();
    const reports = await repo.getReports();
    return { success: true, data: reports };
  } catch (err: any) {
    return { success: false, error: err?.message || "तक्रारींची यादी मिळवण्यात त्रुटी" };
  }
}

export async function moderateContentAction(
  input: ModerateContentInput
): Promise<ActionResult> {
  const validation = moderateContentSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "अवैध कारवाई माहिती",
    };
  }

  try {
    const { author } = await resolveAuthorContext();
    const repo = getCommunityRepository();
    const success = await repo.moderateContent(
      validation.data.reportId,
      validation.data.action,
      author.id
    );

    revalidatePath("/community");
    return {
      success,
      message: "तक्रारीवर योग्य कारवाई करण्यात आली!",
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "कारवाई करण्यात अयशस्वी" };
  }
}
