import {
  GovernmentScheme,
  GetSchemesOptions,
  EligibilityAssessmentInput,
  EligibilityAssessmentResult,
} from "./types";

export interface SchemesRepository {
  getSchemes(options: GetSchemesOptions): Promise<{ schemes: GovernmentScheme[]; total: number }>;
  getSchemeById(id: string, userId?: string): Promise<GovernmentScheme | null>;
  toggleSaveScheme(schemeId: string, userId: string): Promise<{ saved: boolean }>;
  checkEligibility(schemeId: string, input: EligibilityAssessmentInput): Promise<EligibilityAssessmentResult>;
}

// Factory to resolve appropriate repository (Mock vs Supabase)
import { mockSchemesRepository } from "./mockRepository";
import { supabaseSchemesRepository } from "./supabaseRepository";

export function getSchemesRepository(): SchemesRepository {
  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-project") &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("placeholder-anon-key");

  if (!isSupabaseConfigured) {
    return mockSchemesRepository;
  }

  return supabaseSchemesRepository;
}
