-- ==============================================================================
-- KrishiConnect — Migration 004: Agricultural Marketplace & Buyer Enquiries
-- ==============================================================================

-- 1. Custom Enums / Types
DO $$ BEGIN
    CREATE TYPE commodity_category AS ENUM (
        'grains',
        'pulses',
        'vegetables',
        'fruits',
        'spices',
        'oilseeds',
        'flowers',
        'inputs',
        'other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE price_unit AS ENUM (
        'per_quintal',
        'per_kg',
        'per_crate',
        'per_ton',
        'per_dozen'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE listing_status AS ENUM (
        'active',
        'paused',
        'sold_out',
        'removed'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE enquiry_status AS ENUM (
        'new',
        'contacted',
        'accepted',
        'declined',
        'closed'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE contact_preference_type AS ENUM (
        'phone',
        'whatsapp',
        'visit'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Product Listings Table
CREATE TABLE IF NOT EXISTS public.product_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    commodity_name TEXT NOT NULL,
    variety TEXT,
    category commodity_category NOT NULL DEFAULT 'other',
    description TEXT,
    quantity_available NUMERIC(10,2) NOT NULL CHECK (quantity_available > 0),
    quantity_unit price_unit NOT NULL DEFAULT 'per_quintal',
    price_per_unit NUMERIC(10,2) NOT NULL CHECK (price_per_unit > 0),
    price_unit price_unit NOT NULL DEFAULT 'per_quintal',
    minimum_order_qty NUMERIC(10,2) NOT NULL DEFAULT 1.0 CHECK (minimum_order_qty > 0),
    location_district TEXT NOT NULL,
    location_taluka TEXT,
    harvest_date DATE,
    image_urls TEXT[] NOT NULL DEFAULT '{}',
    is_organic BOOLEAN NOT NULL DEFAULT false,
    status listing_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_commodity_name_length CHECK (char_length(commodity_name) >= 2 AND char_length(commodity_name) <= 100),
    CONSTRAINT chk_variety_length CHECK (variety IS NULL OR (char_length(variety) >= 1 AND char_length(variety) <= 100)),
    CONSTRAINT chk_listing_description_length CHECK (description IS NULL OR char_length(description) <= 2000),
    CONSTRAINT chk_listing_images_count CHECK (array_length(image_urls, 1) IS NULL OR array_length(image_urls, 1) <= 5)
);

-- 3. Marketplace Enquiries Table (Direct Buyer Enquiries)
CREATE TABLE IF NOT EXISTS public.marketplace_enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES public.product_listings(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    proposed_quantity NUMERIC(10,2) NOT NULL CHECK (proposed_quantity > 0),
    proposed_price_per_unit NUMERIC(10,2) CHECK (proposed_price_per_unit IS NULL OR proposed_price_per_unit > 0),
    buyer_message TEXT NOT NULL,
    buyer_phone TEXT,
    contact_preference contact_preference_type NOT NULL DEFAULT 'phone',
    status enquiry_status NOT NULL DEFAULT 'new',
    status_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_no_self_enquiry CHECK (buyer_id <> seller_id),
    CONSTRAINT chk_enquiry_message_length CHECK (char_length(buyer_message) >= 5 AND char_length(buyer_message) <= 1000)
);

-- 4. Triggers for updated_at
DROP TRIGGER IF EXISTS trg_product_listings_updated_at ON public.product_listings;
CREATE TRIGGER trg_product_listings_updated_at
BEFORE UPDATE ON public.product_listings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_marketplace_enquiries_updated_at ON public.marketplace_enquiries;
CREATE TRIGGER trg_marketplace_enquiries_updated_at
BEFORE UPDATE ON public.marketplace_enquiries
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_product_listings_seller_id ON public.product_listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_product_listings_category ON public.product_listings(category);
CREATE INDEX IF NOT EXISTS idx_product_listings_district ON public.product_listings(location_district);
CREATE INDEX IF NOT EXISTS idx_product_listings_status ON public.product_listings(status);
CREATE INDEX IF NOT EXISTS idx_product_listings_created_at ON public.product_listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_listings_price ON public.product_listings(price_per_unit);

CREATE INDEX IF NOT EXISTS idx_marketplace_enquiries_listing_id ON public.marketplace_enquiries(listing_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_enquiries_buyer_id ON public.marketplace_enquiries(buyer_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_enquiries_seller_id ON public.marketplace_enquiries(seller_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_enquiries_status ON public.marketplace_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_enquiries_created_at ON public.marketplace_enquiries(created_at DESC);

-- 6. Row Level Security (RLS) Policies
ALTER TABLE public.product_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_enquiries ENABLE ROW LEVEL SECURITY;

-- Product Listings Policies
DROP POLICY IF EXISTS "Public can view active listings" ON public.product_listings;
CREATE POLICY "Public can view active listings"
ON public.product_listings FOR SELECT
USING (
    status = 'active' OR
    auth.uid() = seller_id OR
    public.is_admin(auth.uid())
);

DROP POLICY IF EXISTS "Authenticated users can create listings" ON public.product_listings;
CREATE POLICY "Authenticated users can create listings"
ON public.product_listings FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = seller_id AND (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role IN ('farmer', 'seller', 'admin')
        )
    )
);

DROP POLICY IF EXISTS "Sellers or admins can update listings" ON public.product_listings;
CREATE POLICY "Sellers or admins can update listings"
ON public.product_listings FOR UPDATE
TO authenticated
USING (auth.uid() = seller_id OR public.is_admin(auth.uid()))
WITH CHECK (auth.uid() = seller_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Sellers or admins can delete listings" ON public.product_listings;
CREATE POLICY "Sellers or admins can delete listings"
ON public.product_listings FOR DELETE
TO authenticated
USING (auth.uid() = seller_id OR public.is_admin(auth.uid()));

-- Marketplace Enquiries Policies
DROP POLICY IF EXISTS "Buyers and sellers can view their own enquiries" ON public.marketplace_enquiries;
CREATE POLICY "Buyers and sellers can view their own enquiries"
ON public.marketplace_enquiries FOR SELECT
TO authenticated
USING (
    auth.uid() = buyer_id OR
    auth.uid() = seller_id OR
    public.is_admin(auth.uid())
);

DROP POLICY IF EXISTS "Authenticated users can submit enquiries" ON public.marketplace_enquiries;
CREATE POLICY "Authenticated users can submit enquiries"
ON public.marketplace_enquiries FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = buyer_id AND
    buyer_id <> seller_id
);

DROP POLICY IF EXISTS "Sellers, buyers, or admins can update enquiries" ON public.marketplace_enquiries;
CREATE POLICY "Sellers, buyers, or admins can update enquiries"
ON public.marketplace_enquiries FOR UPDATE
TO authenticated
USING (
    auth.uid() = seller_id OR
    auth.uid() = buyer_id OR
    public.is_admin(auth.uid())
)
WITH CHECK (
    auth.uid() = seller_id OR
    auth.uid() = buyer_id OR
    public.is_admin(auth.uid())
);

DROP POLICY IF EXISTS "Buyers or admins can delete enquiries" ON public.marketplace_enquiries;
CREATE POLICY "Buyers or admins can delete enquiries"
ON public.marketplace_enquiries FOR DELETE
TO authenticated
USING (
    auth.uid() = buyer_id OR
    public.is_admin(auth.uid())
);
