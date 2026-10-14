import { z } from "zod";

export const AllowedSpecializations = [
  "agronomy_pest",
  "soil_fertilizer",
  "horticulture_fruits",
  "irrigation_engineering",
  "organic_farming",
  "animal_husbandry",
  "general_agri",
] as const;

export const AllowedContactMethods = ["phone", "whatsapp", "in_person_kvk"] as const;

export const createConsultationRequestSchema = z.object({
  expertId: z.string().optional().nullable(),
  cropName: z.string().max(100).optional(),
  subject: z
    .string()
    .min(3, "विषय किमान ३ अक्षरांचा असावा (Subject must be at least 3 characters)")
    .max(150, "विषय १५० अक्षरांपेक्षा मोठा नसावा"),
  description: z
    .string()
    .min(10, "तपशील किमान १० अक्षरांचा असावा (Description must be at least 10 characters)")
    .max(2000, "तपशील २००० अक्षरांपेक्षा मोठा नसावा"),
  preferredContactMethod: z.enum(AllowedContactMethods).default("phone"),
  preferredTimeSlot: z.string().max(100).optional(),
  farmerPhone: z.string().max(20).optional(),
  imageUrls: z.array(z.string()).max(3).default([]),
});

export type CreateConsultationRequestInput = z.infer<typeof createConsultationRequestSchema>;

export const updateConsultationStatusSchema = z.object({
  requestId: z.string().min(1),
  status: z.enum(["pending", "accepted", "completed", "cancelled"]),
  expertNotes: z.string().max(1000).optional(),
});

export type UpdateConsultationStatusInput = z.infer<typeof updateConsultationStatusSchema>;
