import { SchemeCategory } from "@/types/database.types";

export type { SchemeCategory };

export interface EligibilityCriterion {
  rule: string;
  label_mr: string;
  label_hi?: string;
  label_en?: string;
  min_acres?: number;
  max_acres?: number;
  eligible_categories?: string[];
  requires_irrigation?: boolean;
}

export interface GovernmentScheme {
  id: string;
  scheme_code: string;
  title_mr: string;
  title_hi: string;
  title_en: string;
  administering_body: string;
  category: SchemeCategory;
  summary_mr: string;
  summary_hi: string;
  summary_en: string;
  beneficiary_type: string;
  eligibility_criteria: EligibilityCriterion[];
  benefits_description_mr: string;
  benefits_description_hi: string;
  benefits_description_en: string;
  documents_required: string[];
  application_steps: string[];
  official_portal_url: string | null;
  last_verified_date: string;
  application_deadline: string | null;
  is_demo_record: boolean;
  created_at: string;
  is_saved?: boolean;
}

export interface GetSchemesOptions {
  category?: SchemeCategory | "all";
  search?: string;
  beneficiaryType?: string;
  onlySaved?: boolean;
  userId?: string;
}

export interface EligibilityAssessmentInput {
  landSizeAcres: number;
  farmerCategory: "small_marginal" | "medium_large" | "sc_st" | "woman_farmer" | "general";
  hasIrrigation: boolean;
  district?: string;
}

export interface EligibilityAssessmentResult {
  schemeId: string;
  isLikelyEligible: boolean;
  scorePercentage: number;
  matchedCriteria: string[];
  unmatchedCriteria: string[];
  notes: string;
}
