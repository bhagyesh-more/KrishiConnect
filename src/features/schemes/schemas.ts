import { z } from "zod";

export const assessmentInputSchema = z.object({
  landSizeAcres: z
    .coerce
    .number()
    .min(0, "जमीन धारणा ऋण असू शकत नाही")
    .max(500, "कृपया ५०० एकरांपेक्षा कमी मूल्य प्रविष्ट करा"),
  farmerCategory: z.enum([
    "small_marginal",
    "medium_large",
    "sc_st",
    "woman_farmer",
    "general",
  ]),
  hasIrrigation: z.boolean(),
  district: z.string().optional(),
});

export type AssessmentInput = z.infer<typeof assessmentInputSchema>;
