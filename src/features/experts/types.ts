import { ExpertSpecialization, ConsultationStatusType } from "@/types/database.types";

export type { ExpertSpecialization, ConsultationStatusType };

export interface ExpertProfile {
  id: string;
  full_name: string;
  qualification: string;
  specialization: ExpertSpecialization;
  affiliation: string;
  experience_years: number;
  languages_spoken: string[];
  supported_crops: string[];
  district: string;
  bio: string | null;
  is_available: boolean;
  is_verified: boolean;
  is_demo_profile: boolean;
  total_consultations_count: number;
  avatar_url?: string | null;
  created_at: string;
}

export interface ConsultationRequest {
  id: string;
  farmer_id: string;
  expert_id: string | null;
  crop_name: string | null;
  subject: string;
  description: string;
  preferred_contact_method: "phone" | "whatsapp" | "in_person_kvk";
  preferred_time_slot: string | null;
  farmer_phone: string | null;
  farmer_name?: string;
  image_urls: string[];
  status: ConsultationStatusType;
  expert_notes: string | null;
  created_at: string;
  updated_at: string;
  expert?: ExpertProfile;
}

export interface GetExpertsOptions {
  specialization?: ExpertSpecialization | "all";
  crop?: string;
  district?: string;
  search?: string;
  onlyAvailable?: boolean;
}
