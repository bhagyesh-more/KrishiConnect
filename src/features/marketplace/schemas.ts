import { z } from "zod";

export const AllowedCategories = [
  "grains",
  "pulses",
  "vegetables",
  "fruits",
  "spices",
  "oilseeds",
  "flowers",
  "inputs",
  "other",
] as const;

export const AllowedPriceUnits = [
  "per_quintal",
  "per_kg",
  "per_crate",
  "per_ton",
  "per_dozen",
] as const;

export const AllowedListingStatuses = [
  "active",
  "paused",
  "sold_out",
  "removed",
] as const;

export const AllowedEnquiryStatuses = [
  "new",
  "contacted",
  "accepted",
  "declined",
  "closed",
] as const;

export const AllowedContactPreferences = ["phone", "whatsapp", "visit"] as const;

// Production image upload constraints documentation:
// Max 5 images per listing, allowed types: image/jpeg, image/png, image/webp, max 5MB each.
const imageUrlItemSchema = z
  .string()
  .refine(
    (val) =>
      val.startsWith("http://") ||
      val.startsWith("https://") ||
      val.startsWith("/") ||
      val.startsWith("data:image/"),
    { message: "कृपया वैध इमेज लिंक किंवा फाइल निवडा (Invalid image URL)" }
  );

export const createListingSchema = z.object({
  commodityName: z
    .string()
    .min(2, "मालाचे नाव किमान २ अक्षरांचे असावे (Commodity name must be at least 2 characters)")
    .max(100, "मालाचे नाव १०० अक्षरांपेक्षा मोठे नसावे"),
  variety: z.string().max(100).optional(),
  category: z.enum(AllowedCategories),
  description: z.string().max(2000, "तपशील २००० अक्षरांपेक्षा मोठा नसावा").optional(),
  quantity: z
    .number()
    .positive("उपलब्ध प्रमाण शून्य किंवा ऋण असू शकत नाही (Quantity must be greater than 0)"),
  quantityUnit: z.enum(AllowedPriceUnits),
  pricePerUnit: z
    .number()
    .positive("दर शून्य किंवा ऋण असू शकत नाही (Price must be greater than 0)"),
  priceUnit: z.enum(AllowedPriceUnits),
  minimumOrderQty: z
    .number()
    .positive("किमान खरेदी प्रमाण शून्य किंवा ऋण असू शकत नाही")
    .optional()
    .default(1),
  locationDistrict: z
    .string()
    .min(2, "जिल्हा निवडणे आवश्यक आहे (District is required)"),
  locationTaluka: z.string().max(50).optional(),
  harvestDate: z.string().optional(),
  imageUrls: z
    .array(imageUrlItemSchema)
    .max(5, "एका यादीसाठी जास्तीत जास्त ५ फोटो जोडता येतील (Maximum 5 images allowed)")
    .optional()
    .default([]),
  isOrganic: z.boolean().default(false),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;

export const updateListingSchema = z.object({
  commodityName: z.string().min(2).max(100).optional(),
  variety: z.string().max(100).optional(),
  category: z.enum(AllowedCategories).optional(),
  description: z.string().max(2000).optional(),
  quantity: z.number().positive("प्रमाण शून्य किंवा ऋण असू शकत नाही").optional(),
  quantityUnit: z.enum(AllowedPriceUnits).optional(),
  pricePerUnit: z.number().positive("दर शून्य किंवा ऋण असू शकत नाही").optional(),
  priceUnit: z.enum(AllowedPriceUnits).optional(),
  minimumOrderQty: z.number().positive().optional(),
  locationDistrict: z.string().min(2).optional(),
  locationTaluka: z.string().max(50).optional(),
  harvestDate: z.string().optional(),
  imageUrls: z.array(imageUrlItemSchema).max(5).optional(),
  isOrganic: z.boolean().optional(),
  status: z.enum(AllowedListingStatuses).optional(),
});

export type UpdateListingInput = z.infer<typeof updateListingSchema>;

export const createEnquirySchema = z.object({
  listingId: z.string().min(1, "यादी क्रमांक आवश्यक आहे (Listing ID is required)"),
  proposedQuantity: z
    .number()
    .positive("मागणी केलेले प्रमाण शून्य किंवा ऋण असू शकत नाही (Requested quantity must be positive)"),
  proposedPricePerUnit: z
    .number()
    .positive("प्रस्तावित दर शून्य किंवा ऋण असू शकत नाही")
    .optional(),
  buyerMessage: z
    .string()
    .min(5, "संदेश किमान ५ अक्षरांचा असावे (Message must be at least 5 characters)")
    .max(1000, "संदेश १००० अक्षरांपेक्षा मोठा नसावा"),
  buyerPhone: z.string().max(20).optional(),
  contactPreference: z.enum(AllowedContactPreferences).default("phone"),
});

export type CreateEnquiryInput = z.infer<typeof createEnquirySchema>;

export const updateEnquiryStatusSchema = z.object({
  enquiryId: z.string().min(1, "चौकशी क्रमांक आवश्यक आहे"),
  status: z.enum(AllowedEnquiryStatuses),
  statusNotes: z.string().max(500).optional(),
});

export type UpdateEnquiryStatusInput = z.infer<typeof updateEnquiryStatusSchema>;
