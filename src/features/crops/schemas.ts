import { z } from "zod";

export const farmSchema = z.object({
  farmName: z
    .string()
    .min(2, "शेताचे नाव किमान २ अक्षरांचे असावे (Farm name must be at least 2 characters)")
    .max(100),
  totalAreaAcres: z.coerce
    .number()
    .positive("क्षेत्रफळ ० पेक्षा जास्त असावे (Area must be greater than 0)")
    .max(10000, "अवैध क्षेत्रफळ"),
  irrigationSource: z.array(z.string()).default([]),
  soilType: z.string().optional(),
  locationDistrict: z.string().min(1, "कृपया जिल्हा निवडा"),
  locationTaluka: z.string().optional(),
});

export type FarmInput = z.infer<typeof farmSchema>;

export const fieldSchema = z.object({
  farmId: z.string().uuid("अवैध शेत आयडी (Invalid farm ID)"),
  fieldName: z
    .string()
    .min(1, "तुकड्याचे नाव आवश्यक आहे (Field name is required)")
    .max(100),
  areaAcres: z.coerce
    .number()
    .positive("क्षेत्रफळ ० पेक्षा जास्त असावे (Area must be greater than 0)")
    .max(10000),
  soilType: z.string().optional(),
  irrigationType: z.string().optional(),
});

export type FieldInput = z.infer<typeof fieldSchema>;

export const cropRecordSchema = z.object({
  fieldId: z.string().uuid("अवैध शेत तुकडा आयडी (Invalid field ID)"),
  guideId: z.string().uuid().optional().or(z.literal("")),
  customCropName: z.string().optional(),
  variety: z.string().optional(),
  season: z.enum(["Kharif", "Rabi", "Zaid", "Perennial"]).default("Kharif"),
  sowingDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "कृपया YYYY-MM-DD फॉरमॅटमध्ये तारीख प्रविष्ट करा"),
  expectedHarvestDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "अवैध काढणी तारीख")
    .optional()
    .or(z.literal("")),
  status: z
    .enum(["planned", "sown", "growing", "harvesting", "completed", "abandoned"])
    .default("sown"),
  notes: z.string().max(500).optional(),
});

export type CropRecordInput = z.infer<typeof cropRecordSchema>;

export const cropTaskSchema = z.object({
  cropRecordId: z.string().uuid("अवैध पीक नोंद आयडी (Invalid crop record ID)"),
  title: z
    .string()
    .min(2, "कामाचे नाव किमान २ अक्षरांचे असावे")
    .max(150),
  description: z.string().max(500).optional(),
  category: z.enum([
    "irrigation",
    "fertilizer",
    "pesticide",
    "weeding",
    "harvest",
    "scouting",
  ]),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "कृपया वैध तारीख प्रविष्ट करा"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
});

export type CropTaskInput = z.infer<typeof cropTaskSchema>;
