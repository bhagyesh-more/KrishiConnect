-- ==============================================================================
-- KrishiConnect — Migration 005: Government Schemes, Experts & Learning Centre
-- ==============================================================================

-- 1. Custom Types / Enums
DO $$ BEGIN
    CREATE TYPE scheme_category AS ENUM (
        'subsidy',
        'insurance',
        'irrigation',
        'credit',
        'organic',
        'equipment',
        'general'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE expert_specialization AS ENUM (
        'agronomy_pest',
        'soil_fertilizer',
        'horticulture_fruits',
        'irrigation_engineering',
        'organic_farming',
        'animal_husbandry',
        'general_agri'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE consultation_status_type AS ENUM (
        'pending',
        'accepted',
        'completed',
        'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE learning_category AS ENUM (
        'crop_care',
        'soil_health',
        'irrigation',
        'pest_disease',
        'post_harvest',
        'organic'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE learning_content_type AS ENUM (
        'guide',
        'tutorial',
        'best_practices',
        'video_summary'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Government Schemes Table
CREATE TABLE IF NOT EXISTS public.government_schemes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scheme_code TEXT UNIQUE NOT NULL,
    title_mr TEXT NOT NULL,
    title_hi TEXT NOT NULL,
    title_en TEXT NOT NULL,
    administering_body TEXT NOT NULL,
    category scheme_category NOT NULL DEFAULT 'general',
    summary_mr TEXT NOT NULL,
    summary_hi TEXT NOT NULL,
    summary_en TEXT NOT NULL,
    beneficiary_type TEXT NOT NULL DEFAULT 'all_farmers',
    eligibility_criteria JSONB NOT NULL DEFAULT '[]',
    benefits_description_mr TEXT NOT NULL,
    benefits_description_hi TEXT NOT NULL,
    benefits_description_en TEXT NOT NULL,
    documents_required TEXT[] NOT NULL DEFAULT '{}',
    application_steps TEXT[] NOT NULL DEFAULT '{}',
    official_portal_url TEXT,
    last_verified_date DATE NOT NULL DEFAULT CURRENT_DATE,
    application_deadline DATE,
    is_demo_record BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Saved Schemes (Bookmarks)
CREATE TABLE IF NOT EXISTS public.saved_schemes (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    scheme_id UUID NOT NULL REFERENCES public.government_schemes(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, scheme_id)
);

-- 4. Expert Profiles Table
CREATE TABLE IF NOT EXISTS public.expert_profiles (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    qualification TEXT NOT NULL,
    specialization expert_specialization NOT NULL DEFAULT 'agronomy_pest',
    affiliation TEXT NOT NULL,
    experience_years INT NOT NULL DEFAULT 5 CHECK (experience_years >= 0),
    languages_spoken TEXT[] NOT NULL DEFAULT '{"mr"}',
    supported_crops TEXT[] NOT NULL DEFAULT '{}',
    district TEXT NOT NULL,
    bio TEXT,
    is_available BOOLEAN NOT NULL DEFAULT true,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    is_demo_profile BOOLEAN NOT NULL DEFAULT true,
    total_consultations_count INT NOT NULL DEFAULT 0 CHECK (total_consultations_count >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Consultation Requests Table
CREATE TABLE IF NOT EXISTS public.consultation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    expert_id UUID REFERENCES public.expert_profiles(id) ON DELETE SET NULL,
    crop_name TEXT,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    preferred_contact_method TEXT NOT NULL DEFAULT 'phone' CHECK (preferred_contact_method IN ('phone', 'whatsapp', 'in_person_kvk')),
    preferred_time_slot TEXT,
    farmer_phone TEXT,
    image_urls TEXT[] NOT NULL DEFAULT '{}',
    status consultation_status_type NOT NULL DEFAULT 'pending',
    expert_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_consultation_subject_length CHECK (char_length(subject) >= 3 AND char_length(subject) <= 150),
    CONSTRAINT chk_consultation_desc_length CHECK (char_length(description) >= 10 AND char_length(description) <= 2000),
    CONSTRAINT chk_consultation_no_self CHECK (farmer_id <> expert_id)
);

-- 6. Expert Consultation Responses Table
CREATE TABLE IF NOT EXISTS public.expert_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.consultation_requests(id) ON DELETE CASCADE,
    expert_id UUID NOT NULL REFERENCES public.expert_profiles(id) ON DELETE CASCADE,
    recommendation TEXT NOT NULL,
    recommended_practices TEXT,
    disclaimer TEXT NOT NULL DEFAULT 'Expert advisory based on farmer description. On-field verification recommended.',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_recommendation_length CHECK (char_length(recommendation) >= 10)
);

-- 7. Learning Resources Table
CREATE TABLE IF NOT EXISTS public.learning_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_mr TEXT NOT NULL,
    title_hi TEXT NOT NULL,
    title_en TEXT NOT NULL,
    summary_mr TEXT NOT NULL,
    summary_hi TEXT NOT NULL,
    summary_en TEXT NOT NULL,
    content_markdown_mr TEXT NOT NULL,
    content_markdown_hi TEXT NOT NULL,
    content_markdown_en TEXT NOT NULL,
    category learning_category NOT NULL DEFAULT 'crop_care',
    content_type learning_content_type NOT NULL DEFAULT 'guide',
    crop_tag TEXT,
    difficulty_level TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    estimated_minutes INT NOT NULL DEFAULT 5 CHECK (estimated_minutes > 0),
    source_attribution TEXT NOT NULL,
    is_demo_resource BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Learning Resource Bookmarks
CREATE TABLE IF NOT EXISTS public.resource_bookmarks (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES public.learning_resources(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, resource_id)
);

-- 9. Trigger Helpers for updated_at
DROP TRIGGER IF EXISTS trg_government_schemes_updated_at ON public.government_schemes;
CREATE TRIGGER trg_government_schemes_updated_at
BEFORE UPDATE ON public.government_schemes
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_expert_profiles_updated_at ON public.expert_profiles;
CREATE TRIGGER trg_expert_profiles_updated_at
BEFORE UPDATE ON public.expert_profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_consultation_requests_updated_at ON public.consultation_requests;
CREATE TRIGGER trg_consultation_requests_updated_at
BEFORE UPDATE ON public.consultation_requests
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_learning_resources_updated_at ON public.learning_resources;
CREATE TRIGGER trg_learning_resources_updated_at
BEFORE UPDATE ON public.learning_resources
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 10. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_government_schemes_category ON public.government_schemes(category);
CREATE INDEX IF NOT EXISTS idx_government_schemes_code ON public.government_schemes(scheme_code);

CREATE INDEX IF NOT EXISTS idx_expert_profiles_specialization ON public.expert_profiles(specialization);
CREATE INDEX IF NOT EXISTS idx_expert_profiles_district ON public.expert_profiles(district);

CREATE INDEX IF NOT EXISTS idx_consultation_requests_farmer_id ON public.consultation_requests(farmer_id);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_expert_id ON public.consultation_requests(expert_id);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_status ON public.consultation_requests(status);

CREATE INDEX IF NOT EXISTS idx_learning_resources_category ON public.learning_resources(category);
CREATE INDEX IF NOT EXISTS idx_learning_resources_content_type ON public.learning_resources(content_type);
CREATE INDEX IF NOT EXISTS idx_learning_resources_crop_tag ON public.learning_resources(crop_tag);

-- 11. Row Level Security (RLS) Policies
ALTER TABLE public.government_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_bookmarks ENABLE ROW LEVEL SECURITY;

-- Schemes RLS
DROP POLICY IF EXISTS "Public can view government schemes" ON public.government_schemes;
CREATE POLICY "Public can view government schemes"
ON public.government_schemes FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can manage saved schemes" ON public.saved_schemes;
CREATE POLICY "Users can manage saved schemes"
ON public.saved_schemes FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Expert Profiles RLS
DROP POLICY IF EXISTS "Public can view expert profiles" ON public.expert_profiles;
CREATE POLICY "Public can view expert profiles"
ON public.expert_profiles FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Experts or admins can update their profile" ON public.expert_profiles;
CREATE POLICY "Experts or admins can update their profile"
ON public.expert_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id OR public.is_admin(auth.uid()))
WITH CHECK (auth.uid() = id OR public.is_admin(auth.uid()));

-- Consultation Requests RLS
DROP POLICY IF EXISTS "Farmers, experts, and admins can view consultation requests" ON public.consultation_requests;
CREATE POLICY "Farmers, experts, and admins can view consultation requests"
ON public.consultation_requests FOR SELECT
TO authenticated
USING (
    auth.uid() = farmer_id OR
    auth.uid() = expert_id OR
    public.is_admin(auth.uid())
);

DROP POLICY IF EXISTS "Farmers can create consultation requests" ON public.consultation_requests;
CREATE POLICY "Farmers can create consultation requests"
ON public.consultation_requests FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = farmer_id AND
    farmer_id <> expert_id
);

DROP POLICY IF EXISTS "Participants or admins can update consultation requests" ON public.consultation_requests;
CREATE POLICY "Participants or admins can update consultation requests"
ON public.consultation_requests FOR UPDATE
TO authenticated
USING (
    auth.uid() = farmer_id OR
    auth.uid() = expert_id OR
    public.is_admin(auth.uid())
)
WITH CHECK (
    auth.uid() = farmer_id OR
    auth.uid() = expert_id OR
    public.is_admin(auth.uid())
);

-- Expert Responses RLS
DROP POLICY IF EXISTS "Participants can view expert responses" ON public.expert_responses;
CREATE POLICY "Participants can view expert responses"
ON public.expert_responses FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.consultation_requests cr
        WHERE cr.id = request_id AND (
            cr.farmer_id = auth.uid() OR
            cr.expert_id = auth.uid() OR
            public.is_admin(auth.uid())
        )
    )
);

DROP POLICY IF EXISTS "Experts can create responses" ON public.expert_responses;
CREATE POLICY "Experts can create responses"
ON public.expert_responses FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = expert_id
);

-- Learning Resources RLS
DROP POLICY IF EXISTS "Public can view learning resources" ON public.learning_resources;
CREATE POLICY "Public can view learning resources"
ON public.learning_resources FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can manage resource bookmarks" ON public.resource_bookmarks;
CREATE POLICY "Users can manage resource bookmarks"
ON public.resource_bookmarks FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
