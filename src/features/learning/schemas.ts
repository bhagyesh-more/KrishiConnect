import { z } from "zod";

export const getLearningResourcesSchema = z.object({
  category: z
    .enum([
      "crop_practices",
      "soil_health",
      "irrigation",
      "pest_management",
      "harvesting",
      "post_harvest",
      "organic_farming",
      "farm_machinery",
      "business_finance",
    ])
    .optional(),
  content_type: z.enum(["article", "guide", "tutorial", "video_summary", "infographic"]).optional(),
  crop: z.string().optional(),
  search: z.string().optional(),
  language: z.string().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  bookmarkedOnly: z.boolean().optional(),
});
