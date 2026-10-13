import { z } from "zod";

// Disallow 'admin' from self-registration / self-selection
export const RegisterableRoles = ["farmer", "buyer", "expert", "seller"] as const;

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, "नाव किमान २ अक्षरांचे असणे आवश्यक आहे (Name must be at least 2 characters)")
    .max(100),
  email: z.string().email("कृपया वैध ईमेल प्रविष्ट करा (Please enter a valid email address)"),
  password: z
    .string()
    .min(6, "पासवर्ड किमान ६ वर्णांचा असावा (Password must be at least 6 characters)"),
  district: z.string().min(1, "कृपया जिल्हा निवडा (Please select a district)"),
  taluka: z.string().optional(),
  role: z.enum(["farmer", "buyer", "expert", "seller"]),
  preferredLanguage: z.enum(["mr", "hi", "en"]).default("mr"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("कृपया वैध ईमेल प्रविष्ट करा (Please enter a valid email address)"),
  password: z.string().min(1, "कृपया पासवर्ड प्रविष्ट करा (Please enter your password)"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("कृपया वैध ईमेल प्रविष्ट करा (Please enter a valid email address)"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(100),
  phoneNumber: z
    .string()
    .regex(/^(\+91)?[6-9]\d{9}$/, "कृपया वैध १०-अंकी भारतीय मोबाईल नंबर प्रविष्ट करा")
    .optional()
    .or(z.literal("")),
  district: z.string().min(1),
  taluka: z.string().optional(),
  village: z.string().optional(),
  preferredLanguage: z.enum(["mr", "hi", "en"]),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
