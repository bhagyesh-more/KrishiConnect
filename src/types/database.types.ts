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
    };
  };
}
