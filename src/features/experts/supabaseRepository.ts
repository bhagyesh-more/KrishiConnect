import { createClient } from "@/lib/supabase/server";
import {
  ExpertProfile,
  ConsultationRequest,
  GetExpertsOptions,
  ConsultationStatusType,
} from "./types";
import {
  CreateConsultationRequestInput,
} from "./schemas";
import { ExpertRepository } from "./repository";

class SupabaseExpertRepositoryImpl implements ExpertRepository {
  async getExperts(options: GetExpertsOptions): Promise<{ experts: ExpertProfile[]; total: number }> {
    const supabase = createClient();

    let query = (supabase.from("expert_profiles") as any)
      .select("*, profiles!expert_profiles_id_fkey(*)", { count: "exact" });

    if (options.specialization && options.specialization !== "all") {
      query = query.eq("specialization", options.specialization);
    }

    if (options.district && options.district !== "all") {
      query = query.ilike("district", `%${options.district}%`);
    }

    if (options.onlyAvailable) {
      query = query.eq("is_available", true);
    }

    query = query.order("experience_years", { ascending: false });

    const { data, count, error } = await query;
    if (error || !data) {
      return { experts: [], total: 0 };
    }

    let experts: ExpertProfile[] = data.map((row: any) => ({
      id: row.id,
      full_name: row.profiles ? row.profiles.full_name : "कृषी तज्ज्ञ",
      qualification: row.qualification,
      specialization: row.specialization,
      affiliation: row.affiliation,
      experience_years: row.experience_years,
      languages_spoken: row.languages_spoken || [],
      supported_crops: row.supported_crops || [],
      district: row.district,
      bio: row.bio,
      is_available: row.is_available,
      is_verified: row.is_verified,
      is_demo_profile: row.is_demo_profile,
      total_consultations_count: row.total_consultations_count || 0,
      avatar_url: row.profiles?.avatar_url,
      created_at: row.created_at,
    }));

    if (options.search && options.search.trim().length > 0) {
      const q = options.search.trim().toLowerCase();
      experts = experts.filter(
        (e) =>
          e.full_name.toLowerCase().includes(q) ||
          e.qualification.toLowerCase().includes(q) ||
          e.affiliation.toLowerCase().includes(q)
      );
    }

    return {
      experts,
      total: count || experts.length,
    };
  }

  async getExpertById(id: string): Promise<ExpertProfile | null> {
    const supabase = createClient();

    const { data, error } = await (supabase.from("expert_profiles") as any)
      .select("*, profiles!expert_profiles_id_fkey(*)")
      .eq("id", id)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      full_name: data.profiles ? data.profiles.full_name : "कृषी तज्ज्ञ",
      qualification: data.qualification,
      specialization: data.specialization,
      affiliation: data.affiliation,
      experience_years: data.experience_years,
      languages_spoken: data.languages_spoken || [],
      supported_crops: data.supported_crops || [],
      district: data.district,
      bio: data.bio,
      is_available: data.is_available,
      is_verified: data.is_verified,
      is_demo_profile: data.is_demo_profile,
      total_consultations_count: data.total_consultations_count || 0,
      avatar_url: data.profiles?.avatar_url,
      created_at: data.created_at,
    };
  }

  async createConsultationRequest(
    input: CreateConsultationRequestInput,
    farmerId: string,
    farmerName = "शेतकरी"
  ): Promise<ConsultationRequest> {
    const supabase = createClient();

    const { data, error } = await (supabase.from("consultation_requests") as any)
      .insert({
        farmer_id: farmerId,
        expert_id: input.expertId || null,
        crop_name: input.cropName || null,
        subject: input.subject,
        description: input.description,
        preferred_contact_method: input.preferredContactMethod || "phone",
        preferred_time_slot: input.preferredTimeSlot || null,
        farmer_phone: input.farmerPhone || null,
        image_urls: input.imageUrls || [],
        status: "pending",
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || "सल्ला विनंती पाठवण्यात त्रुटी आली");
    }

    return {
      ...data,
      farmer_name: farmerName,
    };
  }

  async getConsultations(params: { farmerId?: string; expertId?: string }): Promise<ConsultationRequest[]> {
    const supabase = createClient();

    let query = (supabase.from("consultation_requests") as any)
      .select("*, expert_profiles(*, profiles!expert_profiles_id_fkey(*)), profiles!consultation_requests_farmer_id_fkey(*)")
      .order("created_at", { ascending: false });

    if (params.farmerId) {
      query = query.eq("farmer_id", params.farmerId);
    }
    if (params.expertId) {
      query = query.eq("expert_id", params.expertId);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((row: any) => ({
      id: row.id,
      farmer_id: row.farmer_id,
      expert_id: row.expert_id,
      crop_name: row.crop_name,
      subject: row.subject,
      description: row.description,
      preferred_contact_method: row.preferred_contact_method,
      preferred_time_slot: row.preferred_time_slot,
      farmer_phone: row.farmer_phone,
      farmer_name: row.profiles?.full_name || "शेतकरी",
      image_urls: row.image_urls || [],
      status: row.status,
      expert_notes: row.expert_notes,
      created_at: row.created_at,
      updated_at: row.updated_at,
      expert: row.expert_profiles
        ? {
            id: row.expert_profiles.id,
            full_name: row.expert_profiles.profiles?.full_name || "कृषी तज्ज्ञ",
            qualification: row.expert_profiles.qualification,
            specialization: row.expert_profiles.specialization,
            affiliation: row.expert_profiles.affiliation,
            experience_years: row.expert_profiles.experience_years,
            languages_spoken: row.expert_profiles.languages_spoken || [],
            supported_crops: row.expert_profiles.supported_crops || [],
            district: row.expert_profiles.district,
            bio: row.expert_profiles.bio,
            is_available: row.expert_profiles.is_available,
            is_verified: row.expert_profiles.is_verified,
            is_demo_profile: row.expert_profiles.is_demo_profile,
            total_consultations_count: row.expert_profiles.total_consultations_count,
            created_at: row.expert_profiles.created_at,
          }
        : undefined,
    }));
  }

  async getConsultationById(id: string, userId: string, isAdmin = false): Promise<ConsultationRequest | null> {
    const supabase = createClient();

    const { data, error } = await (supabase.from("consultation_requests") as any)
      .select("*, expert_profiles(*, profiles!expert_profiles_id_fkey(*)), profiles!consultation_requests_farmer_id_fkey(*)")
      .eq("id", id)
      .single();

    if (error || !data) return null;

    if (data.farmer_id !== userId && data.expert_id !== userId && !isAdmin) {
      throw new Error("आपल्याला ही सल्ला विनंती पाहण्याची परवानगी नाही (Unauthorized)");
    }

    return {
      id: data.id,
      farmer_id: data.farmer_id,
      expert_id: data.expert_id,
      crop_name: data.crop_name,
      subject: data.subject,
      description: data.description,
      preferred_contact_method: data.preferred_contact_method,
      preferred_time_slot: data.preferred_time_slot,
      farmer_phone: data.farmer_phone,
      farmer_name: data.profiles?.full_name || "शेतकरी",
      image_urls: data.image_urls || [],
      status: data.status,
      expert_notes: data.expert_notes,
      created_at: data.created_at,
      updated_at: data.updated_at,
      expert: data.expert_profiles
        ? {
            id: data.expert_profiles.id,
            full_name: data.expert_profiles.profiles?.full_name || "कृषी तज्ज्ञ",
            qualification: data.expert_profiles.qualification,
            specialization: data.expert_profiles.specialization,
            affiliation: data.expert_profiles.affiliation,
            experience_years: data.expert_profiles.experience_years,
            languages_spoken: data.expert_profiles.languages_spoken || [],
            supported_crops: data.expert_profiles.supported_crops || [],
            district: data.expert_profiles.district,
            bio: data.expert_profiles.bio,
            is_available: data.expert_profiles.is_available,
            is_verified: data.expert_profiles.is_verified,
            is_demo_profile: data.expert_profiles.is_demo_profile,
            total_consultations_count: data.expert_profiles.total_consultations_count,
            created_at: data.expert_profiles.created_at,
          }
        : undefined,
    };
  }

  async updateConsultationStatus(
    requestId: string,
    status: ConsultationStatusType,
    notes: string | undefined,
    userId: string,
    isAdmin = false
  ): Promise<ConsultationRequest> {
    const supabase = createClient();

    const { data: existing, error: fetchErr } = await (supabase.from("consultation_requests") as any)
      .select("*")
      .eq("id", requestId)
      .single();

    if (fetchErr || !existing) {
      throw new Error("सल्ला विनंती सापडली नाही");
    }

    const isFarmer = existing.farmer_id === userId;
    const isExpert = existing.expert_id === userId;

    if (!isFarmer && !isExpert && !isAdmin) {
      throw new Error("आपल्याला ही विनंती अद्ययावत करण्याची परवानगी नाही");
    }

    if (isFarmer && !isExpert && !isAdmin && status !== "cancelled") {
      throw new Error("शेतकरी केवळ विनंती रद्द करू शकतात");
    }

    const { data, error } = await (supabase.from("consultation_requests") as any)
      .update({
        status,
        expert_notes: notes !== undefined ? notes : existing.expert_notes,
      })
      .eq("id", requestId)
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || "स्थिती अद्ययावत करण्यात त्रुटी आली");
    }

    return data;
  }
}

export const supabaseExpertRepository = new SupabaseExpertRepositoryImpl();
