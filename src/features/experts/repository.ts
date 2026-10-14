import {
  ExpertProfile,
  ConsultationRequest,
  GetExpertsOptions,
  ConsultationStatusType,
} from "./types";
import {
  CreateConsultationRequestInput,
} from "./schemas";

export interface ExpertRepository {
  getExperts(options: GetExpertsOptions): Promise<{ experts: ExpertProfile[]; total: number }>;
  getExpertById(id: string): Promise<ExpertProfile | null>;
  createConsultationRequest(
    input: CreateConsultationRequestInput,
    farmerId: string,
    farmerName?: string
  ): Promise<ConsultationRequest>;
  getConsultations(params: { farmerId?: string; expertId?: string }): Promise<ConsultationRequest[]>;
  getConsultationById(id: string, userId: string, isAdmin?: boolean): Promise<ConsultationRequest | null>;
  updateConsultationStatus(
    requestId: string,
    status: ConsultationStatusType,
    notes: string | undefined,
    userId: string,
    isAdmin?: boolean
  ): Promise<ConsultationRequest>;
}

// Factory to resolve appropriate repository (Mock vs Supabase)
import { mockExpertRepository } from "./mockRepository";
import { supabaseExpertRepository } from "./supabaseRepository";

export function getExpertRepository(): ExpertRepository {
  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-project") &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("placeholder-anon-key");

  if (!isSupabaseConfigured) {
    return mockExpertRepository;
  }

  return supabaseExpertRepository;
}
