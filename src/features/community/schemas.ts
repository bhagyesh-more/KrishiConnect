import { z } from "zod";

export const AllowedTopics = [
  "crop_care",
  "pest_disease",
  "market_price",
  "equipment",
  "organic",
  "general",
] as const;

export const AllowedReportReasons = [
  "misinformation",
  "unsafe_pesticide_advice",
  "spam",
  "abuse",
  "other",
] as const;

// Production image upload constraints documentation:
// Max 3 images per post, allowed types: image/jpeg, image/png, image/webp, max 5MB each.
const imageUrlItemSchema = z
  .string()
  .refine(
    (val) =>
      val.startsWith("http://") ||
      val.startsWith("https://") ||
      val.startsWith("/") ||
      val.startsWith("data:image/"),
    { message: "कृपया वैध इमेज लिंक किंवा फाइल निवडा" }
  );

export const createPostSchema = z.object({
  title: z
    .string()
    .min(5, "शीर्षक किमान ५ अक्षरांचे असावे (Title must be at least 5 characters)")
    .max(150, "शीर्षक १५० अक्षरांपेक्षा मोठे असू नये"),
  content: z
    .string()
    .min(10, "तपशील किमान १० अक्षरांचा असावा (Content must be at least 10 characters)")
    .max(3000, "मजकूर ३००० अक्षरांपेक्षा मोठा नसावा"),
  topicCategory: z.enum(AllowedTopics),
  cropCategory: z.string().max(50).optional(),
  imageUrls: z
    .array(imageUrlItemSchema)
    .max(3, "एका पोस्टमध्ये जास्तीत जास्त ३ फोटो जोडता येतील (Maximum 3 photos allowed)")
    .default([]),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

export const updatePostSchema = z.object({
  title: z
    .string()
    .min(5, "शीर्षक किमान ५ अक्षरांचे असावे")
    .max(150)
    .optional(),
  content: z
    .string()
    .min(10, "तपशील किमान १० अक्षरांचा असावा")
    .max(3000)
    .optional(),
  topicCategory: z.enum(AllowedTopics).optional(),
  cropCategory: z.string().max(50).optional(),
  imageUrls: z.array(imageUrlItemSchema).max(3).optional(),
});

export type UpdatePostInput = z.infer<typeof updatePostSchema>;

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(2, "प्रतिक्रिया किमान २ अक्षरांची असावी (Comment must be at least 2 characters)")
    .max(1000, "प्रतिक्रिया १००० अक्षरांपेक्षा मोठी नसावी"),
  parentCommentId: z.string().uuid().optional().or(z.literal("")),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

export const createReportSchema = z.object({
  postId: z.string().uuid().optional().or(z.literal("")),
  commentId: z.string().uuid().optional().or(z.literal("")),
  reason: z.enum(AllowedReportReasons),
  details: z.string().max(500, "तपशील ५०० अक्षरांपेक्षा मोठा नसावा").optional(),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;

export const moderateContentSchema = z.object({
  reportId: z.string().uuid("अवैध तक्रार आयडी"),
  action: z.enum(["dismiss", "hide_content", "restore_content", "lock_post"] as const),
  note: z.string().max(300).optional(),
});

export type ModerateContentInput = z.infer<typeof moderateContentSchema>;
