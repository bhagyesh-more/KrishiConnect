-- ==============================================================================
-- KrishiConnect — Migration 002: Farms, Fields, Crop Guides, Records & Tasks
-- ==============================================================================

-- 1. Custom Types for Farming
DO $$ BEGIN
    CREATE TYPE crop_status AS ENUM ('planned', 'sown', 'growing', 'harvesting', 'completed', 'abandoned');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Farms Table
CREATE TABLE IF NOT EXISTS public.farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    farm_name TEXT NOT NULL,
    total_area_acres NUMERIC(6,2) NOT NULL CHECK (total_area_acres > 0),
    irrigation_source TEXT[] NOT NULL DEFAULT '{}',
    soil_type TEXT,
    location_district TEXT NOT NULL,
    location_taluka TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Farm Fields Table
CREATE TABLE IF NOT EXISTS public.farm_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    field_name TEXT NOT NULL,
    area_acres NUMERIC(6,2) NOT NULL CHECK (area_acres > 0),
    soil_type TEXT,
    irrigation_type TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Crop Guides Table (Reviewed Agronomic Knowledge Base)
CREATE TABLE IF NOT EXISTS public.crop_guides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_code TEXT UNIQUE NOT NULL,
    crop_name_mr TEXT NOT NULL,
    crop_name_hi TEXT NOT NULL,
    crop_name_en TEXT NOT NULL,
    variety TEXT,
    ideal_season TEXT NOT NULL CHECK (ideal_season IN ('Kharif', 'Rabi', 'Zaid', 'Perennial')),
    growing_duration_days INT NOT NULL CHECK (growing_duration_days > 0),
    soil_requirements TEXT,
    water_requirements TEXT,
    growth_stages JSONB NOT NULL DEFAULT '[]',
    common_pests JSONB NOT NULL DEFAULT '[]',
    source_attribution TEXT NOT NULL,
    last_verified_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Crop Records Table
CREATE TABLE IF NOT EXISTS public.crop_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    field_id UUID NOT NULL REFERENCES public.farm_fields(id) ON DELETE CASCADE,
    guide_id UUID REFERENCES public.crop_guides(id) ON DELETE SET NULL,
    custom_crop_name TEXT,
    variety TEXT,
    season TEXT NOT NULL DEFAULT 'Kharif',
    sowing_date DATE NOT NULL,
    expected_harvest_date DATE,
    actual_harvest_date DATE,
    status crop_status NOT NULL DEFAULT 'sown',
    total_yield_quintals NUMERIC(8,2),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Crop Tasks Table
CREATE TABLE IF NOT EXISTS public.crop_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_record_id UUID NOT NULL REFERENCES public.crop_records(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('irrigation', 'fertilizer', 'pesticide', 'weeding', 'harvest', 'scouting')),
    due_date DATE NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    priority task_priority NOT NULL DEFAULT 'medium',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Timestamp Triggers
DROP TRIGGER IF EXISTS trg_farms_updated_at ON public.farms;
CREATE TRIGGER trg_farms_updated_at
BEFORE UPDATE ON public.farms
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_farm_fields_updated_at ON public.farm_fields;
CREATE TRIGGER trg_farm_fields_updated_at
BEFORE UPDATE ON public.farm_fields
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_crop_records_updated_at ON public.crop_records;
CREATE TRIGGER trg_crop_records_updated_at
BEFORE UPDATE ON public.crop_records
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_crop_tasks_updated_at ON public.crop_tasks;
CREATE TRIGGER trg_crop_tasks_updated_at
BEFORE UPDATE ON public.crop_tasks
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ==============================================================================
-- 8. Row Level Security (RLS) Policies
-- ==============================================================================

ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_tasks ENABLE ROW LEVEL SECURITY;

-- Farms Policies: Farmers own and control their farms
DROP POLICY IF EXISTS "Farmers can view own farms" ON public.farms;
CREATE POLICY "Farmers can view own farms"
ON public.farms FOR SELECT
TO authenticated
USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Farmers can insert own farms" ON public.farms;
CREATE POLICY "Farmers can insert own farms"
ON public.farms FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Farmers can update own farms" ON public.farms;
CREATE POLICY "Farmers can update own farms"
ON public.farms FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Farmers can delete own farms" ON public.farms;
CREATE POLICY "Farmers can delete own farms"
ON public.farms FOR DELETE
TO authenticated
USING (auth.uid() = owner_id);

-- Farm Fields Policies: Controlled via parent farm ownership
DROP POLICY IF EXISTS "Farmers can view own fields" ON public.farm_fields;
CREATE POLICY "Farmers can view own fields"
ON public.farm_fields FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.farms f
        WHERE f.id = farm_fields.farm_id
          AND f.owner_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Farmers can insert own fields" ON public.farm_fields;
CREATE POLICY "Farmers can insert own fields"
ON public.farm_fields FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.farms f
        WHERE f.id = farm_fields.farm_id
          AND f.owner_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Farmers can update own fields" ON public.farm_fields;
CREATE POLICY "Farmers can update own fields"
ON public.farm_fields FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.farms f
        WHERE f.id = farm_fields.farm_id
          AND f.owner_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.farms f
        WHERE f.id = farm_fields.farm_id
          AND f.owner_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Farmers can delete own fields" ON public.farm_fields;
CREATE POLICY "Farmers can delete own fields"
ON public.farm_fields FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.farms f
        WHERE f.id = farm_fields.farm_id
          AND f.owner_id = auth.uid()
    )
);

-- Crop Guides Policies: Publicly readable; admin-only modifications
DROP POLICY IF EXISTS "Crop guides are readable by everyone" ON public.crop_guides;
CREATE POLICY "Crop guides are readable by everyone"
ON public.crop_guides FOR SELECT
TO authenticated, anon
USING (true);

DROP POLICY IF EXISTS "Admins can manage crop guides" ON public.crop_guides;
CREATE POLICY "Admins can manage crop guides"
ON public.crop_guides FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Crop Records Policies: Controlled via field -> farm -> owner
DROP POLICY IF EXISTS "Farmers can view own crop records" ON public.crop_records;
CREATE POLICY "Farmers can view own crop records"
ON public.crop_records FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.farm_fields ff
        JOIN public.farms f ON ff.farm_id = f.id
        WHERE ff.id = crop_records.field_id
          AND f.owner_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Farmers can insert own crop records" ON public.crop_records;
CREATE POLICY "Farmers can insert own crop records"
ON public.crop_records FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.farm_fields ff
        JOIN public.farms f ON ff.farm_id = f.id
        WHERE ff.id = crop_records.field_id
          AND f.owner_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Farmers can update own crop records" ON public.crop_records;
CREATE POLICY "Farmers can update own crop records"
ON public.crop_records FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.farm_fields ff
        JOIN public.farms f ON ff.farm_id = f.id
        WHERE ff.id = crop_records.field_id
          AND f.owner_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.farm_fields ff
        JOIN public.farms f ON ff.farm_id = f.id
        WHERE ff.id = crop_records.field_id
          AND f.owner_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Farmers can delete own crop records" ON public.crop_records;
CREATE POLICY "Farmers can delete own crop records"
ON public.crop_records FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.farm_fields ff
        JOIN public.farms f ON ff.farm_id = f.id
        WHERE ff.id = crop_records.field_id
          AND f.owner_id = auth.uid()
    )
);

-- Crop Tasks Policies: Controlled via task -> record -> field -> farm -> owner
DROP POLICY IF EXISTS "Farmers can view own crop tasks" ON public.crop_tasks;
CREATE POLICY "Farmers can view own crop tasks"
ON public.crop_tasks FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.crop_records cr
        JOIN public.farm_fields ff ON cr.field_id = ff.id
        JOIN public.farms f ON ff.farm_id = f.id
        WHERE cr.id = crop_tasks.crop_record_id
          AND f.owner_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Farmers can insert own crop tasks" ON public.crop_tasks;
CREATE POLICY "Farmers can insert own crop tasks"
ON public.crop_tasks FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.crop_records cr
        JOIN public.farm_fields ff ON cr.field_id = ff.id
        JOIN public.farms f ON ff.farm_id = f.id
        WHERE cr.id = crop_tasks.crop_record_id
          AND f.owner_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Farmers can update own crop tasks" ON public.crop_tasks;
CREATE POLICY "Farmers can update own crop tasks"
ON public.crop_tasks FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.crop_records cr
        JOIN public.farm_fields ff ON cr.field_id = ff.id
        JOIN public.farms f ON ff.farm_id = f.id
        WHERE cr.id = crop_tasks.crop_record_id
          AND f.owner_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.crop_records cr
        JOIN public.farm_fields ff ON cr.field_id = ff.id
        JOIN public.farms f ON ff.farm_id = f.id
        WHERE cr.id = crop_tasks.crop_record_id
          AND f.owner_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Farmers can delete own crop tasks" ON public.crop_tasks;
CREATE POLICY "Farmers can delete own crop tasks"
ON public.crop_tasks FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.crop_records cr
        JOIN public.farm_fields ff ON cr.field_id = ff.id
        JOIN public.farms f ON ff.farm_id = f.id
        WHERE cr.id = crop_tasks.crop_record_id
          AND f.owner_id = auth.uid()
    )
);

-- ==============================================================================
-- 9. Performance Indexes
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_farms_owner ON public.farms(owner_id);
CREATE INDEX IF NOT EXISTS idx_farm_fields_farm ON public.farm_fields(farm_id);
CREATE INDEX IF NOT EXISTS idx_crop_records_field ON public.crop_records(field_id);
CREATE INDEX IF NOT EXISTS idx_crop_records_status ON public.crop_records(status);
CREATE INDEX IF NOT EXISTS idx_crop_tasks_record_status ON public.crop_tasks(crop_record_id, is_completed, due_date);

-- ==============================================================================
-- 10. Idempotent Seed Data: 5 Maharashtra Crop Guides
-- ==============================================================================

INSERT INTO public.crop_guides (
    id,
    crop_code,
    crop_name_mr,
    crop_name_hi,
    crop_name_en,
    variety,
    ideal_season,
    growing_duration_days,
    soil_requirements,
    water_requirements,
    growth_stages,
    common_pests,
    source_attribution
) VALUES
(
    '00000000-0000-0000-0000-000000000001',
    'SOYBEAN_JS335',
    'सोयाबीन',
    'सोयाबीन',
    'Soybean',
    'JS 335 / फुले कल्याणी',
    'Kharif',
    100,
    'मध्यम ते भारी, उत्तम निचरा होणारी काळी जमीन (सामू ६.५ ते ७.५)',
    'फुलोरा (३०-३५ दिवस) व शेंगा भरताना (५५-६५ दिवस) ओलावा आवश्यक. पाणी साचू नये.',
    '[
        {"stage": "Sowing & Emergence", "days": 7, "nameMr": "उगवण अवस्था", "tasks": ["बीजप्रक्रिया (थायरम + रायझोबियम)", "ओल तपासून पेरणी"]},
        {"stage": "Vegetative Growth", "days": 30, "nameMr": "शाकीय वाढ", "tasks": ["तणनियंत्रण (२० दिवसांच्या आत)", "खोडमाशी निरीक्षण"]},
        {"stage": "Flowering Stage", "days": 55, "nameMr": "फुलोरा अवस्था", "tasks": ["सूक्ष्म अन्नद्रव्य फवारणी", "पाण्याचा ताण पडू न देणे"]},
        {"stage": "Pod Development", "days": 80, "nameMr": "शेंगा भरणे", "tasks": ["चक्रीभुंगा व अळी नियंत्रण", "संरक्षक पाणी"]},
        {"stage": "Maturity & Harvest", "days": 100, "nameMr": "परिपक्वता व काढणी", "tasks": ["पाने पिवळी पडून गळल्यावर काढणी", "योग्य वाळवण"]}
    ]'::jsonb,
    '[
        {"name": "खोडमाशी (Stem Fly)", "symptoms": "रोपांची पाने कोमेजणे, खोडाला छिद्र", "preventive": "पेरणीवेळी निंबोळी पेंड वापरणे व वेळेवर पेरणी"},
        {"name": "चक्रीभुंगा (Girdle Beetle)", "symptoms": "फांद्यांवर व देठावर गोलाकार खाचा", "preventive": "प्रादुर्भावग्रस्त फांद्या नष्ट करणे"}
    ]'::jsonb,
    'ICAR - भारतीय सोयाबीन संशोधन संस्था (IISR) आणि म.पु.कृ.वि. राहुरी'
),
(
    '00000000-0000-0000-0000-000000000002',
    'COTTON_HYBRID',
    'कापूस',
    'कपास',
    'Cotton',
    'मध्यम-लांब धागा संकरित (BT/Non-BT)',
    'Kharif',
    160,
    'खोल काळी कसदार जमीन, पाण्याचा चांगला निचरा असणारी जमीन',
    'ठिबक सिंचन अत्यंत फायदेशीर; बोंड भरण्याच्या काळात नियमित हलके पाणी आवश्यक.',
    '[
        {"stage": "Germination & Early Growth", "days": 15, "nameMr": "उगवण व प्राथमिक वाढ", "tasks": ["नांग्या भरणे", "रसशोषक किडींचे निरीक्षण"]},
        {"stage": "Square Formation ( पाते धरणे )", "days": 50, "nameMr": "पाते धरणे", "tasks": ["खतांचा पहिला हप्ता", "कामगंध सापळे लावणे (गुलाबी बोंडअळी)"]},
        {"stage": "Flowering & Boll Setting", "days": 100, "nameMr": "फुल व बोंड धारणा", "tasks": ["बोंडअळी नियमित गस्त", "डीएपी किंवा १९:१९:१९ फवारणी"]},
        {"stage": "Boll Opening & Picking", "days": 160, "nameMr": "बोंड उमलणे व वेचणी", "tasks": ["सुक्या हवेत स्वच्छ कापूस वेचणी", "कचरा विरहीत साठवणूक"]}
    ]'::jsonb,
    '[
        {"name": "गुलाबी बोंडअळी (Pink Bollworm)", "symptoms": "पात्यांना छिद्र, डोमकळ्या", "preventive": "हेक्टरी ५ कामगंध सापळे, जैविक ट्रायकोडर्मा/ट्रायकोग्रामा"},
        {"name": "पांढरी माशी व मावा (Sucking Pests)", "symptoms": "पाने आकसणे, चिकटा पडणे", "preventive": "पिवळे चिकट सापळे व ५% निंबोळी अर्क फवारणी"}
    ]'::jsonb,
    'केंद्रीय कापूस संशोधन संस्था (CICR) नागपूर व डॉ. पं.दे.कृ.वि. अकोला'
),
(
    '00000000-0000-0000-0000-000000000003',
    'SUGARCANE_CO86032',
    'ऊस',
    'गन्ना',
    'Sugarcane',
    'को ८६०३२ (निरा) / फुले ०२६५',
    'Perennial',
    360,
    'मध्यम ते भारी, उत्तम निचऱ्याची गाळाची काळी जमीन (सामू ६.५ ते ८.०)',
    'मोठ्या प्रमाणावर पाणी आवश्यक; ठिबक सिंचनाने ४०-५०% पाण्याची बचत होते.',
    '[
        {"stage": "Germination & Sprouting", "days": 35, "nameMr": "उगवण अवस्था", "tasks": ["बेणे प्रक्रिया (बुरशीनाशक + कीटकनाशक)", "तण नियंत्रण"]},
        {"stage": "Tillering ( फुटवे फुटणे )", "days": 120, "nameMr": "फुटव्यांची अवस्था", "tasks": ["खतांचा दुसरा हप्ता", "खोडकीड नियंत्रण"]},
        {"stage": "Grand Growth ( कांड्या सुटणे )", "days": 270, "nameMr": "कांड्या सुटणे व वाढ", "tasks": ["मोठी बांधणी (Earthing up)", "नियमित पाणी नियोजन"]},
        {"stage": "Maturity & Ripening", "days": 360, "nameMr": "पक्वता व तोडणी", "tasks": ["तोडणीपूर्वी १५ दिवस पाणी बंद करणे", "कारखान्याशी समन्वय"]}
    ]'::jsonb,
    '[
        {"name": "खोडकीड (Early Shoot Borer)", "symptoms": "मध्यवर्ती पोंगा वाळणे", "preventive": "मातीची हलकी भर देणे व फेरोमोन सापळे"},
        {"name": "हुमणी (White Grub)", "symptoms": "मुळे कुरतडल्याने ऊस वाळणे", "preventive": "पावसाळ्याच्या सुरुवातीला भुंगेरे गोळा करून नष्ट करणे"}
    ]'::jsonb,
    'वसंतदादा शुगर इन्स्टिट्यूट (VSI) पुणे व म.पु.कृ.वि. राहुरी'
),
(
    '00000000-0000-0000-0000-000000000004',
    'ONION_RABI',
    'कांदा',
    'प्याज',
    'Onion',
    'बसंवत ७८० / फुले समर्थ / एन-२-४-१',
    'Rabi',
    120,
    'हलकी ते मध्यम पोयट्याची, सेंद्रिय खतांनी समृद्ध जमीन',
    'हलके व नियमित पाणी. काढणीपूर्वी १०-१२ दिवस पाणी बंद करावे.',
    '[
        {"stage": "Nursery Raising", "days": 45, "nameMr": "रोपवाटिका तयारी", "tasks": ["गादीवाफे तयार करणे", "रोप संरक्षण फवारणी"]},
        {"stage": "Transplanting", "days": 65, "nameMr": "पुनर्लागवड", "tasks": ["रोपांचे शेंडे कापून लागवड", "तत्काळ हलके पाणी देणे"]},
        {"stage": "Bulb Development", "days": 95, "nameMr": "कांदा पोसणे", "tasks": ["सल्फर व पोटॅश मात्रा", "करपा व फुलकिडे नियंत्रण"]},
        {"stage": "Harvesting & Curing", "days": 120, "nameMr": "काढणी व वाळवण", "tasks": ["५०% माना पडल्यावर काढणी", "पानांसह शेतात वाळवणे"]}
    ]'::jsonb,
    '[
        {"name": "फुलकिडे (Thrips)", "symptoms": "पानांवर पांढुरके चट्टे, पाने वाकडी होणे", "preventive": "निळा चिकट सापळे व वेळेवर फवारणी"},
        {"name": "जांभळा करपा (Purple Blotch)", "symptoms": "पानांवर लांबट जांभळे डाग", "preventive": "मॅन्कोझेब किंवा कॉपर ऑक्झिक्लोराईडची प्रतिबंधक फवारणी"}
    ]'::jsonb,
    'ICAR - कांदा व लसूण संशोधन संचालनालय (DOGR) राजगुरुनगर, पुणे'
),
(
    '00000000-0000-0000-0000-000000000005',
    'WHEAT_RABI',
    'गहू',
    'गेहूं',
    'Wheat',
    'एचडी २१८९ / फुले समाधान (NIAW-1994)',
    'Rabi',
    115,
    'मध्यम ते भारी, उत्तम निचऱ्याची काळी जमीन',
    'मुकुट मुळे फुटताना (२१ दिवस), कांडी धरताना (४०-४५ दिवस), व ओंबी भरताना पाणी देणे अनिवार्य.',
    '[
        {"stage": "Crown Root Initiation (CRI)", "days": 25, "nameMr": "मुकुट मुळे फुटणे (अतिसंवेदनशील)", "tasks": ["पहिले महत्त्वाचे पाणी", "युरियाचा हप्ता"]},
        {"stage": "Tillering & Jointing", "days": 55, "nameMr": "फुटवे व कांडी धरणे", "tasks": ["तण नियंत्रण", "दुसरे पाणी नियोजन"]},
        {"stage": "Heading & Flowering", "days": 85, "nameMr": "ओंब्या बाहेर पडणे व फुलोरा", "tasks": ["तिसरे महत्त्वाचे पाणी", "तांबेरा रोग तपासणी"]},
        {"stage": "Grain Filling & Maturity", "days": 115, "nameMr": "दाणे भरणे व परिपक्वता", "tasks": ["हवेचा वेग पाहून हलके पाणी", "दाणे कडक झाल्यावर कापणी"]}
    ]'::jsonb,
    '[
        {"name": "तांबेरा (Rust)", "symptoms": "पानांवर तपकिरी किंवा काळे डाग", "preventive": "प्रतिकारक्षम वाणांची निवड व प्रोपिकोनेझोल फवारणी"},
        {"name": "मावा (Aphids)", "symptoms": "ओंब्यांवरून रस शोषणे", "preventive": "पिवळे सापळे व मित्रकीटक संवर्धन"}
    ]'::jsonb,
    'भारतीय गहू व बार्ली संशोधन संस्था (IIWBR) व म.पु.कृ.वि. राहुरी'
)
ON CONFLICT (id) DO UPDATE SET
    crop_code = EXCLUDED.crop_code,
    crop_name_mr = EXCLUDED.crop_name_mr,
    crop_name_hi = EXCLUDED.crop_name_hi,
    crop_name_en = EXCLUDED.crop_name_en,
    variety = EXCLUDED.variety,
    ideal_season = EXCLUDED.ideal_season,
    growing_duration_days = EXCLUDED.growing_duration_days,
    soil_requirements = EXCLUDED.soil_requirements,
    water_requirements = EXCLUDED.water_requirements,
    growth_stages = EXCLUDED.growth_stages,
    common_pests = EXCLUDED.common_pests,
    source_attribution = EXCLUDED.source_attribution,
    last_verified_at = now();
