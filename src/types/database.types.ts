export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AppRole = 'farmer' | 'buyer' | 'expert' | 'seller' | 'admin';
export type VerificationStatus = 'none' | 'pending' | 'verified' | 'rejected';

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
    };
  };
}
