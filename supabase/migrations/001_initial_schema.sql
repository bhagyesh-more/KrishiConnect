-- ==============================================================================
-- KrishiConnect — Migration 001: Initial Schema (Profiles, Roles, RBAC & Audit)
-- ==============================================================================

-- 1. Custom Types
DO $$ BEGIN
    CREATE TYPE app_role AS ENUM ('farmer', 'buyer', 'expert', 'seller', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('none', 'pending', 'verified', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone_number TEXT UNIQUE,
    state TEXT NOT NULL DEFAULT 'Maharashtra',
    district TEXT NOT NULL,
    taluka TEXT,
    village TEXT,
    preferred_language TEXT NOT NULL DEFAULT 'mr' CHECK (preferred_language IN ('mr', 'hi', 'en')),
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. User Roles Table (Server-enforced RBAC)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role app_role NOT NULL,
    verification_status verification_status NOT NULL DEFAULT 'none',
    granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    verified_by UUID REFERENCES public.profiles(id),
    verified_at TIMESTAMPTZ,
    UNIQUE(user_id, role)
);

-- 4. Verification Proofs for Experts & Sellers (Private documents)
CREATE TABLE IF NOT EXISTS public.expert_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    specialization TEXT NOT NULL,
    credentials_document_url TEXT NOT NULL,
    organization TEXT,
    years_of_experience INT NOT NULL DEFAULT 0,
    status verification_status NOT NULL DEFAULT 'pending',
    rejection_reason TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.seller_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    license_type TEXT,
    license_number TEXT,
    document_url TEXT,
    status verification_status NOT NULL DEFAULT 'pending',
    rejection_reason TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES public.profiles(id)
);

-- 5. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_entity TEXT NOT NULL,
    target_id UUID,
    metadata JSONB NOT NULL DEFAULT '{}',
    ip_address INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Helper Function: Check Admin Status (SECURITY DEFINER to prevent recursion)
CREATE OR REPLACE FUNCTION public.is_admin(lookup_uid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = lookup_uid
          AND role = 'admin'
          AND verification_status = 'verified'
    );
$$;

-- 7. Trigger: Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 8. Trigger: Handle new user registration from Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    raw_name TEXT;
    raw_district TEXT;
    raw_taluka TEXT;
    raw_lang TEXT;
    raw_role app_role;
    initial_verification verification_status;
BEGIN
    raw_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'नवीन शेतकरी');
    raw_district := COALESCE(NEW.raw_user_meta_data->>'district', 'Pune');
    raw_taluka := NEW.raw_user_meta_data->>'taluka';
    raw_lang := COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'mr');
    
    -- Safe fallback on role: only allow standard self-selectable roles, NEVER allow admin!
    BEGIN
        IF NEW.raw_user_meta_data->>'role' IN ('farmer', 'buyer', 'expert', 'seller') THEN
            raw_role := (NEW.raw_user_meta_data->>'role')::app_role;
        ELSE
            raw_role := 'farmer'::app_role;
        END IF;
    EXCEPTION WHEN OTHERS THEN
        raw_role := 'farmer'::app_role;
    END;

    -- Experts and Sellers require administrative verification
    IF raw_role IN ('expert', 'seller') THEN
        initial_verification := 'pending'::verification_status;
    ELSE
        initial_verification := 'none'::verification_status;
    END IF;

    -- Insert Profile
    INSERT INTO public.profiles (
        id,
        full_name,
        phone_number,
        district,
        taluka,
        preferred_language
    ) VALUES (
        NEW.id,
        raw_name,
        NEW.phone,
        raw_district,
        raw_taluka,
        raw_lang
    ) ON CONFLICT (id) DO NOTHING;

    -- Insert Initial User Role (Guaranteed safe from privilege escalation)
    INSERT INTO public.user_roles (
        user_id,
        role,
        verification_status
    ) VALUES (
        NEW.id,
        raw_role,
        initial_verification
    ) ON CONFLICT (user_id, role) DO NOTHING;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 9. Row Level Security (RLS) Policies
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Active profiles are readable by authenticated users" ON public.profiles;
CREATE POLICY "Active profiles are readable by authenticated users"
ON public.profiles FOR SELECT
TO authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- User Roles Policies
DROP POLICY IF EXISTS "Users can view own roles or admin can view all" ON public.user_roles;
CREATE POLICY "Users can view own roles or admin can view all"
ON public.user_roles FOR SELECT
TO authenticated
USING (
    auth.uid() = user_id
    OR public.is_admin(auth.uid())
);

DROP POLICY IF EXISTS "Users can self-assign non-admin roles during onboarding" ON public.user_roles;
CREATE POLICY "Users can self-assign non-admin roles during onboarding"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = user_id
    AND role <> 'admin'
    AND (
        (role IN ('farmer', 'buyer') AND verification_status = 'none')
        OR (role IN ('expert', 'seller') AND verification_status = 'pending')
    )
);

DROP POLICY IF EXISTS "Only verified admin can update roles or verification" ON public.user_roles;
CREATE POLICY "Only verified admin can update roles or verification"
ON public.user_roles FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Expert & Seller Verification Documents Policies
DROP POLICY IF EXISTS "Users can view own expert verification or admin can view all" ON public.expert_verifications;
CREATE POLICY "Users can view own expert verification or admin can view all"
ON public.expert_verifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can submit own expert verification" ON public.expert_verifications;
CREATE POLICY "Users can submit own expert verification"
ON public.expert_verifications FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND status = 'pending');

DROP POLICY IF EXISTS "Users can view own seller verification or admin can view all" ON public.seller_verifications;
CREATE POLICY "Users can view own seller verification or admin can view all"
ON public.seller_verifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can submit own seller verification" ON public.seller_verifications;
CREATE POLICY "Users can submit own seller verification"
ON public.seller_verifications FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- Audit Logs Policies
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view audit logs"
ON public.audit_logs FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can record audit actions" ON public.audit_logs;
CREATE POLICY "Authenticated users can record audit actions"
ON public.audit_logs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = actor_id);

-- 10. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_district ON public.profiles(district);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone_number);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role, verification_status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id, created_at DESC);
