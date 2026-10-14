export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AppRole = 'farmer' | 'buyer' | 'expert' | 'seller' | 'admin';
export type VerificationStatus = 'none' | 'pending' | 'verified' | 'rejected';
export type CropStatus = 'planned' | 'sown' | 'growing' | 'harvesting' | 'completed' | 'abandoned';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskCategory = 'irrigation' | 'fertilizer' | 'pesticide' | 'weeding' | 'harvest' | 'scouting';
export type CommodityCategory = 'grains' | 'pulses' | 'vegetables' | 'fruits' | 'spices' | 'oilseeds' | 'flowers' | 'inputs' | 'other';
export type PriceUnit = 'per_quintal' | 'per_kg' | 'per_crate' | 'per_ton' | 'per_dozen';
export type ListingStatus = 'active' | 'paused' | 'sold_out' | 'removed';
export type EnquiryStatus = 'new' | 'contacted' | 'accepted' | 'declined' | 'closed';
export type SchemeCategory = 'subsidy' | 'insurance' | 'irrigation' | 'credit' | 'organic' | 'equipment' | 'general';
export type ExpertSpecialization = 'agronomy_pest' | 'soil_fertilizer' | 'horticulture_fruits' | 'irrigation_engineering' | 'organic_farming' | 'animal_husbandry' | 'general_agri';
export type ConsultationStatusType = 'pending' | 'accepted' | 'completed' | 'cancelled';
export type LearningCategory = 'crop_care' | 'soil_health' | 'irrigation' | 'pest_disease' | 'post_harvest' | 'organic';
export type LearningContentType = 'guide' | 'tutorial' | 'best_practices' | 'video_summary';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          phone_number: string | null;
          state: string;
          district: string;
          taluka: string | null;
          village: string | null;
          preferred_language: 'mr' | 'hi' | 'en';
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          phone_number?: string | null;
          state?: string;
          district: string;
          taluka?: string | null;
          village?: string | null;
          preferred_language?: 'mr' | 'hi' | 'en';
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone_number?: string | null;
          state?: string;
          district?: string;
          taluka?: string | null;
          village?: string | null;
          preferred_language?: 'mr' | 'hi' | 'en';
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: AppRole;
          verification_status: VerificationStatus;
          granted_at: string;
          verified_by: string | null;
          verified_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: AppRole;
          verification_status?: VerificationStatus;
          granted_at?: string;
          verified_by?: string | null;
          verified_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: AppRole;
          verification_status?: VerificationStatus;
          granted_at?: string;
          verified_by?: string | null;
          verified_at?: string | null;
        };
      };
      farms: {
        Row: {
          id: string;
          owner_id: string;
          farm_name: string;
          total_area_acres: number;
          irrigation_source: string[];
          soil_type: string | null;
          location_district: string;
          location_taluka: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          farm_name: string;
          total_area_acres: number;
          irrigation_source?: string[];
          soil_type?: string | null;
          location_district: string;
          location_taluka?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          farm_name?: string;
          total_area_acres?: number;
          irrigation_source?: string[];
          soil_type?: string | null;
          location_district?: string;
          location_taluka?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      farm_fields: {
        Row: {
          id: string;
          farm_id: string;
          field_name: string;
          area_acres: number;
          soil_type: string | null;
          irrigation_type: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          farm_id: string;
          field_name: string;
          area_acres: number;
          soil_type?: string | null;
          irrigation_type?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          farm_id?: string;
          field_name?: string;
          area_acres?: number;
          soil_type?: string | null;
          irrigation_type?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      crop_guides: {
        Row: {
          id: string;
          crop_code: string;
          crop_name_mr: string;
          crop_name_hi: string;
          crop_name_en: string;
          variety: string | null;
          ideal_season: 'Kharif' | 'Rabi' | 'Zaid' | 'Perennial';
          growing_duration_days: number;
          soil_requirements: string | null;
          water_requirements: string | null;
          growth_stages: Json;
          common_pests: Json;
          source_attribution: string;
          last_verified_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          crop_code: string;
          crop_name_mr: string;
          crop_name_hi: string;
          crop_name_en: string;
          variety?: string | null;
          ideal_season: 'Kharif' | 'Rabi' | 'Zaid' | 'Perennial';
          growing_duration_days: number;
          soil_requirements?: string | null;
          water_requirements?: string | null;
          growth_stages?: Json;
          common_pests?: Json;
          source_attribution: string;
          last_verified_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          crop_code?: string;
          crop_name_mr?: string;
          crop_name_hi?: string;
          crop_name_en?: string;
          variety?: string | null;
          ideal_season?: 'Kharif' | 'Rabi' | 'Zaid' | 'Perennial';
          growing_duration_days?: number;
          soil_requirements?: string | null;
          water_requirements?: string | null;
          growth_stages?: Json;
          common_pests?: Json;
          source_attribution?: string;
          last_verified_at?: string;
          created_at?: string;
        };
      };
      crop_records: {
        Row: {
          id: string;
          field_id: string;
          guide_id: string | null;
          custom_crop_name: string | null;
          variety: string | null;
          season: string;
          sowing_date: string;
          expected_harvest_date: string | null;
          actual_harvest_date: string | null;
          status: CropStatus;
          total_yield_quintals: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          field_id: string;
          guide_id?: string | null;
          custom_crop_name?: string | null;
          variety?: string | null;
          season?: string;
          sowing_date: string;
          expected_harvest_date?: string | null;
          actual_harvest_date?: string | null;
          status?: CropStatus;
          total_yield_quintals?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          field_id?: string;
          guide_id?: string | null;
          custom_crop_name?: string | null;
          variety?: string | null;
          season?: string;
          sowing_date?: string;
          expected_harvest_date?: string | null;
          actual_harvest_date?: string | null;
          status?: CropStatus;
          total_yield_quintals?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      crop_tasks: {
        Row: {
          id: string;
          crop_record_id: string;
          title: string;
          description: string | null;
          category: TaskCategory;
          due_date: string;
          is_completed: boolean;
          completed_at: string | null;
          priority: TaskPriority;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          crop_record_id: string;
          title: string;
          description?: string | null;
          category: TaskCategory;
          due_date: string;
          is_completed?: boolean;
          completed_at?: string | null;
          priority?: TaskPriority;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          crop_record_id?: string;
          title?: string;
          description?: string | null;
          category?: TaskCategory;
          due_date?: string;
          is_completed?: boolean;
          completed_at?: string | null;
          priority?: TaskPriority;
          created_at?: string;
          updated_at?: string;
        };
      };
      expert_verifications: {
        Row: {
          id: string;
          user_id: string;
          specialization: string;
          credentials_document_url: string;
          organization: string | null;
          years_of_experience: number;
          status: VerificationStatus;
          rejection_reason: string | null;
          submitted_at: string;
          reviewed_at: string | null;
          reviewed_by: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          specialization: string;
          credentials_document_url: string;
          organization?: string | null;
          years_of_experience?: number;
          status?: VerificationStatus;
          rejection_reason?: string | null;
          submitted_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          specialization?: string;
          credentials_document_url?: string;
          organization?: string | null;
          years_of_experience?: number;
          status?: VerificationStatus;
          rejection_reason?: string | null;
          submitted_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
        };
      };
      seller_verifications: {
        Row: {
          id: string;
          user_id: string;
          business_name: string;
          license_type: string | null;
          license_number: string | null;
          document_url: string | null;
          status: VerificationStatus;
          rejection_reason: string | null;
          submitted_at: string;
          reviewed_at: string | null;
          reviewed_by: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          business_name: string;
          license_type?: string | null;
          license_number?: string | null;
          document_url?: string | null;
          status?: VerificationStatus;
          rejection_reason?: string | null;
          submitted_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          business_name?: string;
          license_type?: string | null;
          license_number?: string | null;
          document_url?: string | null;
          status?: VerificationStatus;
          rejection_reason?: string | null;
          submitted_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          target_entity: string;
          target_id: string | null;
          metadata: Json;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          action: string;
          target_entity: string;
          target_id?: string | null;
          metadata?: Json;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string | null;
          action?: string;
          target_entity?: string;
          target_id?: string | null;
          metadata?: Json;
          ip_address?: string | null;
          created_at?: string;
        };
      };
      community_posts: {
        Row: {
          id: string;
          author_id: string;
          title: string;
          content: string;
          crop_category: string | null;
          topic_category: string;
          image_urls: string[];
          is_pinned: boolean;
          is_locked: boolean;
          is_hidden: boolean;
          upvotes_count: number;
          comments_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          title: string;
          content: string;
          crop_category?: string | null;
          topic_category: string;
          image_urls?: string[];
          is_pinned?: boolean;
          is_locked?: boolean;
          is_hidden?: boolean;
          upvotes_count?: number;
          comments_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          author_id?: string;
          title?: string;
          content?: string;
          crop_category?: string | null;
          topic_category?: string;
          image_urls?: string[];
          is_pinned?: boolean;
          is_locked?: boolean;
          is_hidden?: boolean;
          upvotes_count?: number;
          comments_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      post_comments: {
        Row: {
          id: string;
          post_id: string;
          author_id: string;
          parent_comment_id: string | null;
          content: string;
          is_expert_answer: boolean;
          is_accepted_answer: boolean;
          is_hidden: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          author_id: string;
          parent_comment_id?: string | null;
          content: string;
          is_expert_answer?: boolean;
          is_accepted_answer?: boolean;
          is_hidden?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          author_id?: string;
          parent_comment_id?: string | null;
          content?: string;
          is_expert_answer?: boolean;
          is_accepted_answer?: boolean;
          is_hidden?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      post_reactions: {
        Row: {
          user_id: string;
          post_id: string;
          reaction_type: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          post_id: string;
          reaction_type?: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          post_id?: string;
          reaction_type?: string;
          created_at?: string;
        };
      };
      post_bookmarks: {
        Row: {
          user_id: string;
          post_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          post_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          post_id?: string;
          created_at?: string;
        };
      };
      post_reports: {
        Row: {
          id: string;
          reporter_id: string;
          post_id: string | null;
          comment_id: string | null;
          reason: string;
          details: string | null;
          status: string;
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          reporter_id: string;
          post_id?: string | null;
          comment_id?: string | null;
          reason: string;
          details?: string | null;
          status?: string;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          reporter_id?: string;
          post_id?: string | null;
          comment_id?: string | null;
          reason?: string;
          details?: string | null;
          status?: string;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
        };
      };
      product_listings: {
        Row: {
          id: string;
          seller_id: string;
          commodity_name: string;
          variety: string | null;
          category: CommodityCategory;
          description: string | null;
          quantity_available: number;
          quantity_unit: PriceUnit;
          price_per_unit: number;
          price_unit: PriceUnit;
          minimum_order_qty: number;
          location_district: string;
          location_taluka: string | null;
          harvest_date: string | null;
          image_urls: string[];
          is_organic: boolean;
          status: ListingStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          seller_id: string;
          commodity_name: string;
          variety?: string | null;
          category?: CommodityCategory;
          description?: string | null;
          quantity_available: number;
          quantity_unit?: PriceUnit;
          price_per_unit: number;
          price_unit?: PriceUnit;
          minimum_order_qty?: number;
          location_district: string;
          location_taluka?: string | null;
          harvest_date?: string | null;
          image_urls?: string[];
          is_organic?: boolean;
          status?: ListingStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          seller_id?: string;
          commodity_name?: string;
          variety?: string | null;
          category?: CommodityCategory;
          description?: string | null;
          quantity_available?: number;
          quantity_unit?: PriceUnit;
          price_per_unit?: number;
          price_unit?: PriceUnit;
          minimum_order_qty?: number;
          location_district?: string;
          location_taluka?: string | null;
          harvest_date?: string | null;
          image_urls?: string[];
          is_organic?: boolean;
          status?: ListingStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      marketplace_enquiries: {
        Row: {
          id: string;
          listing_id: string;
          buyer_id: string;
          seller_id: string;
          proposed_quantity: number;
          proposed_price_per_unit: number | null;
          buyer_message: string;
          buyer_phone: string | null;
          contact_preference: 'phone' | 'whatsapp' | 'visit';
          status: EnquiryStatus;
          status_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          buyer_id: string;
          seller_id: string;
          proposed_quantity: number;
          proposed_price_per_unit?: number | null;
          buyer_message: string;
          buyer_phone?: string | null;
          contact_preference?: 'phone' | 'whatsapp' | 'visit';
          status?: EnquiryStatus;
          status_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          listing_id?: string;
          buyer_id?: string;
          seller_id?: string;
          proposed_quantity?: number;
          proposed_price_per_unit?: number | null;
          buyer_message?: string;
          buyer_phone?: string | null;
          contact_preference?: 'phone' | 'whatsapp' | 'visit';
          status?: EnquiryStatus;
          status_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      government_schemes: {
        Row: {
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
          eligibility_criteria: Json;
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
          updated_at: string;
        };
        Insert: {
          id?: string;
          scheme_code: string;
          title_mr: string;
          title_hi: string;
          title_en: string;
          administering_body: string;
          category?: SchemeCategory;
          summary_mr: string;
          summary_hi: string;
          summary_en: string;
          beneficiary_type?: string;
          eligibility_criteria?: Json;
          benefits_description_mr: string;
          benefits_description_hi: string;
          benefits_description_en: string;
          documents_required?: string[];
          application_steps?: string[];
          official_portal_url?: string | null;
          last_verified_date?: string;
          application_deadline?: string | null;
          is_demo_record?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          scheme_code?: string;
          title_mr?: string;
          title_hi?: string;
          title_en?: string;
          administering_body?: string;
          category?: SchemeCategory;
          summary_mr?: string;
          summary_hi?: string;
          summary_en?: string;
          beneficiary_type?: string;
          eligibility_criteria?: Json;
          benefits_description_mr?: string;
          benefits_description_hi?: string;
          benefits_description_en?: string;
          documents_required?: string[];
          application_steps?: string[];
          official_portal_url?: string | null;
          last_verified_date?: string;
          application_deadline?: string | null;
          is_demo_record?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      saved_schemes: {
        Row: {
          user_id: string;
          scheme_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          scheme_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          scheme_id?: string;
          created_at?: string;
        };
      };
      expert_profiles: {
        Row: {
          id: string;
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
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          qualification: string;
          specialization?: ExpertSpecialization;
          affiliation: string;
          experience_years?: number;
          languages_spoken?: string[];
          supported_crops?: string[];
          district: string;
          bio?: string | null;
          is_available?: boolean;
          is_verified?: boolean;
          is_demo_profile?: boolean;
          total_consultations_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          qualification?: string;
          specialization?: ExpertSpecialization;
          affiliation?: string;
          experience_years?: number;
          languages_spoken?: string[];
          supported_crops?: string[];
          district?: string;
          bio?: string | null;
          is_available?: boolean;
          is_verified?: boolean;
          is_demo_profile?: boolean;
          total_consultations_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      consultation_requests: {
        Row: {
          id: string;
          farmer_id: string;
          expert_id: string | null;
          crop_name: string | null;
          subject: string;
          description: string;
          preferred_contact_method: 'phone' | 'whatsapp' | 'in_person_kvk';
          preferred_time_slot: string | null;
          farmer_phone: string | null;
          image_urls: string[];
          status: ConsultationStatusType;
          expert_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          farmer_id: string;
          expert_id?: string | null;
          crop_name?: string | null;
          subject: string;
          description: string;
          preferred_contact_method?: 'phone' | 'whatsapp' | 'in_person_kvk';
          preferred_time_slot?: string | null;
          farmer_phone?: string | null;
          image_urls?: string[];
          status?: ConsultationStatusType;
          expert_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          farmer_id?: string;
          expert_id?: string | null;
          crop_name?: string | null;
          subject?: string;
          description?: string;
          preferred_contact_method?: 'phone' | 'whatsapp' | 'in_person_kvk';
          preferred_time_slot?: string | null;
          farmer_phone?: string | null;
          image_urls?: string[];
          status?: ConsultationStatusType;
          expert_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      expert_responses: {
        Row: {
          id: string;
          request_id: string;
          expert_id: string;
          recommendation: string;
          recommended_practices: string | null;
          disclaimer: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          expert_id: string;
          recommendation: string;
          recommended_practices?: string | null;
          disclaimer?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          request_id?: string;
          expert_id?: string;
          recommendation?: string;
          recommended_practices?: string | null;
          disclaimer?: string;
          created_at?: string;
        };
      };
      learning_resources: {
        Row: {
          id: string;
          title_mr: string;
          title_hi: string;
          title_en: string;
          summary_mr: string;
          summary_hi: string;
          summary_en: string;
          content_markdown_mr: string;
          content_markdown_hi: string;
          content_markdown_en: string;
          category: LearningCategory;
          content_type: LearningContentType;
          crop_tag: string | null;
          difficulty_level: 'beginner' | 'intermediate' | 'advanced';
          estimated_minutes: number;
          source_attribution: string;
          is_demo_resource: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title_mr: string;
          title_hi: string;
          title_en: string;
          summary_mr: string;
          summary_hi: string;
          summary_en: string;
          content_markdown_mr: string;
          content_markdown_hi: string;
          content_markdown_en: string;
          category?: LearningCategory;
          content_type?: LearningContentType;
          crop_tag?: string | null;
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
          estimated_minutes?: number;
          source_attribution: string;
          is_demo_resource?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title_mr?: string;
          title_hi?: string;
          title_en?: string;
          summary_mr?: string;
          summary_hi?: string;
          summary_en?: string;
          content_markdown_mr?: string;
          content_markdown_hi?: string;
          content_markdown_en?: string;
          category?: LearningCategory;
          content_type?: LearningContentType;
          crop_tag?: string | null;
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
          estimated_minutes?: number;
          source_attribution?: string;
          is_demo_resource?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      resource_bookmarks: {
        Row: {
          user_id: string;
          resource_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          resource_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          resource_id?: string;
          created_at?: string;
        };
      };
      ai_consultations: {
        Row: {
          id: string;
          user_id: string | null;
          prompt_text: string;
          response_text: string;
          crop_context: string | null;
          district: string | null;
          language: string;
          safety_warnings_triggered: string[];
          has_harmful_substance_flag: boolean;
          is_mock_response: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          prompt_text: string;
          response_text: string;
          crop_context?: string | null;
          district?: string | null;
          language?: string;
          safety_warnings_triggered?: string[];
          has_harmful_substance_flag?: boolean;
          is_mock_response?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          prompt_text?: string;
          response_text?: string;
          crop_context?: string | null;
          district?: string | null;
          language?: string;
          safety_warnings_triggered?: string[];
          has_harmful_substance_flag?: boolean;
          is_mock_response?: boolean;
          created_at?: string;
        };
      };
    };
  };
}
