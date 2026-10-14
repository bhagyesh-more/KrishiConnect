import { createClient } from "@/lib/supabase/server";
import {
  GovernmentScheme,
  GetSchemesOptions,
  EligibilityAssessmentInput,
  EligibilityAssessmentResult,
} from "./types";
import { SchemesRepository } from "./repository";

class SupabaseSchemesRepositoryImpl implements SchemesRepository {
  async getSchemes(options: GetSchemesOptions): Promise<{ schemes: GovernmentScheme[]; total: number }> {
    const supabase = createClient();

    let query = (supabase.from("government_schemes") as any)
      .select("*", { count: "exact" });

    if (options.category && options.category !== "all") {
      query = query.eq("category", options.category);
    }

    if (options.search && options.search.trim().length > 0) {
      const q = options.search.trim();
      query = query.or(`title_mr.ilike.%${q}%,title_en.ilike.%${q}%,summary_mr.ilike.%${q}%,scheme_code.ilike.%${q}%`);
    }

    query = query.order("created_at", { ascending: false });

    const { data, count, error } = await query;
    if (error || !data) {
      return { schemes: [], total: 0 };
    }

    // Check saved schemes if signed in
    let savedSchemeIds = new Set<string>();
    if (options.userId) {
      const { data: savedData } = await (supabase.from("saved_schemes") as any)
        .select("scheme_id")
        .eq("user_id", options.userId);
      if (savedData) {
        savedSchemeIds = new Set(savedData.map((s: any) => s.scheme_id));
      }
    }

    let schemes: GovernmentScheme[] = data.map((row: any) => ({
      ...row,
      eligibility_criteria: Array.isArray(row.eligibility_criteria) ? row.eligibility_criteria : [],
      is_saved: savedSchemeIds.has(row.id),
    }));

    if (options.onlySaved) {
      schemes = schemes.filter((s) => s.is_saved);
    }

    return {
      schemes,
      total: count || schemes.length,
    };
  }

  async getSchemeById(id: string, userId?: string): Promise<GovernmentScheme | null> {
    const supabase = createClient();

    const { data, error } = await (supabase.from("government_schemes") as any)
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;

    let isSaved = false;
    if (userId) {
      const { data: savedData } = await (supabase.from("saved_schemes") as any)
        .select("scheme_id")
        .eq("user_id", userId)
        .eq("scheme_id", id)
        .single();
      isSaved = !!savedData;
    }

    return {
      ...data,
      eligibility_criteria: Array.isArray(data.eligibility_criteria) ? data.eligibility_criteria : [],
      is_saved: isSaved,
    };
  }

  async toggleSaveScheme(schemeId: string, userId: string): Promise<{ saved: boolean }> {
    const supabase = createClient();

    const { data: existing } = await (supabase.from("saved_schemes") as any)
      .select("scheme_id")
      .eq("user_id", userId)
      .eq("scheme_id", schemeId)
      .single();

    if (existing) {
      await (supabase.from("saved_schemes") as any)
        .delete()
        .eq("user_id", userId)
        .eq("scheme_id", schemeId);
      return { saved: false };
    } else {
      await (supabase.from("saved_schemes") as any)
        .insert({ user_id: userId, scheme_id: schemeId });
      return { saved: true };
    }
  }

  async checkEligibility(
    schemeId: string,
    input: EligibilityAssessmentInput
  ): Promise<EligibilityAssessmentResult> {
    const scheme = await this.getSchemeById(schemeId);
    if (!scheme) {
      throw new Error("योजना सापडली नाही");
    }

    const matchedCriteria: string[] = [];
    const unmatchedCriteria: string[] = [];

    for (const crit of scheme.eligibility_criteria) {
      if (crit.min_acres !== undefined && input.landSizeAcres < crit.min_acres) {
        unmatchedCriteria.push(`किमान जमीन धारणा अट: ${crit.min_acres} एकर आवश्यक`);
      } else if (crit.max_acres !== undefined && input.landSizeAcres > crit.max_acres) {
        unmatchedCriteria.push(`कमाल जमीन मर्यादा: ${crit.max_acres} एकरपर्यंत मर्यादा`);
      } else if (crit.eligible_categories && crit.eligible_categories.length > 0) {
        if (!crit.eligible_categories.includes(input.farmerCategory)) {
          unmatchedCriteria.push(`संवर्ग अट: ही योजना केवळ ${crit.eligible_categories.join(", ")} साठी लागू आहे`);
        } else {
          matchedCriteria.push(crit.label_mr);
        }
      } else if (crit.requires_irrigation) {
        if (!input.hasIrrigation) {
          unmatchedCriteria.push("कायमस्वरूपी जलस्रोत / सिंचन व्यवस्था असणे आवश्यक आहे");
        } else {
          matchedCriteria.push(crit.label_mr);
        }
      } else {
        matchedCriteria.push(crit.label_mr);
      }
    }

    const totalCount = matchedCriteria.length + unmatchedCriteria.length;
    const scorePercentage = totalCount > 0 ? Math.round((matchedCriteria.length / totalCount) * 100) : 100;
    const isLikelyEligible = unmatchedCriteria.length === 0;

    return {
      schemeId,
      isLikelyEligible,
      scorePercentage,
      matchedCriteria,
      unmatchedCriteria,
      notes: isLikelyEligible
        ? "प्राथमिक माहितीनुसार आपण या योजनेसाठी संभाव्य पात्र आहात. महाडीबीटी पोर्टलवर प्रत्यक्ष पडताळणी करा."
        : "काही निकष जुळत नसल्याचे दिसत आहे. कृपया अधिकृत अटी तपासा.",
    };
  }
}

export const supabaseSchemesRepository = new SupabaseSchemesRepositoryImpl();
