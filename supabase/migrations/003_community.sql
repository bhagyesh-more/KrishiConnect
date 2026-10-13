-- ==============================================================================
-- KrishiConnect — Migration 003: Farmer Community, Comments & Moderation
-- ==============================================================================

-- 1. Custom Enums / Types
DO $$ BEGIN
    CREATE TYPE community_topic AS ENUM (
        'crop_care',
        'pest_disease',
        'market_price',
        'equipment',
        'organic',
        'general'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE report_reason AS ENUM (
        'misinformation',
        'unsafe_pesticide_advice',
        'spam',
        'abuse',
        'other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE report_status AS ENUM (
        'pending',
        'reviewed',
        'dismissed',
        'action_taken'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Community Posts Table
CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    crop_category TEXT,
    topic_category community_topic NOT NULL DEFAULT 'general',
    image_urls TEXT[] NOT NULL DEFAULT '{}',
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    is_locked BOOLEAN NOT NULL DEFAULT false,
    is_hidden BOOLEAN NOT NULL DEFAULT false,
    upvotes_count INT NOT NULL DEFAULT 0 CHECK (upvotes_count >= 0),
    comments_count INT NOT NULL DEFAULT 0 CHECK (comments_count >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_post_title_length CHECK (char_length(title) >= 5 AND char_length(title) <= 200),
    CONSTRAINT chk_post_content_length CHECK (char_length(content) >= 10 AND char_length(content) <= 5000),
    CONSTRAINT chk_post_images_count CHECK (array_length(image_urls, 1) IS NULL OR array_length(image_urls, 1) <= 3)
);

-- 3. Post Comments Table (Threaded replies supported via parent_comment_id)
CREATE TABLE IF NOT EXISTS public.post_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES public.post_comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_expert_answer BOOLEAN NOT NULL DEFAULT false,
    is_accepted_answer BOOLEAN NOT NULL DEFAULT false,
    is_hidden BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_comment_content_length CHECK (char_length(content) >= 2 AND char_length(content) <= 1500)
);

-- 4. Post Reactions / Likes Table
CREATE TABLE IF NOT EXISTS public.post_reactions (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
    reaction_type TEXT NOT NULL DEFAULT 'upvote',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, post_id)
);

-- 5. Post Bookmarks Table
CREATE TABLE IF NOT EXISTS public.post_bookmarks (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, post_id)
);

-- 6. Content Reports Table (Moderation)
CREATE TABLE IF NOT EXISTS public.post_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES public.post_comments(id) ON DELETE CASCADE,
    reason report_reason NOT NULL,
    details TEXT,
    status report_status NOT NULL DEFAULT 'pending',
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_report_target CHECK (
        (post_id IS NOT NULL AND comment_id IS NULL) OR
        (post_id IS NULL AND comment_id IS NOT NULL) OR
        (post_id IS NOT NULL AND comment_id IS NOT NULL)
    )
);

-- 7. Trigger Helpers for updated_at
DROP TRIGGER IF EXISTS trg_community_posts_updated_at ON public.community_posts;
CREATE TRIGGER trg_community_posts_updated_at
BEFORE UPDATE ON public.community_posts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_post_comments_updated_at ON public.post_comments;
CREATE TRIGGER trg_post_comments_updated_at
BEFORE UPDATE ON public.post_comments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Counters Maintenance Functions & Triggers
-- Upvotes counter trigger
CREATE OR REPLACE FUNCTION public.sync_post_upvotes_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.community_posts
        SET upvotes_count = upvotes_count + 1
        WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.community_posts
        SET upvotes_count = GREATEST(0, upvotes_count - 1)
        WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_post_upvotes ON public.post_reactions;
CREATE TRIGGER trg_sync_post_upvotes
AFTER INSERT OR DELETE ON public.post_reactions
FOR EACH ROW EXECUTE FUNCTION public.sync_post_upvotes_count();

-- Comments counter trigger
CREATE OR REPLACE FUNCTION public.sync_post_comments_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.community_posts
        SET comments_count = comments_count + 1
        WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.community_posts
        SET comments_count = GREATEST(0, comments_count - 1)
        WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_post_comments ON public.post_comments;
CREATE TRIGGER trg_sync_post_comments
AFTER INSERT OR DELETE ON public.post_comments
FOR EACH ROW EXECUTE FUNCTION public.sync_post_comments_count();

-- 9. Row Level Security (RLS) Policies
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_reports ENABLE ROW LEVEL SECURITY;

-- Community Posts Policies
DROP POLICY IF EXISTS "Public can view unhidden posts" ON public.community_posts;
CREATE POLICY "Public can view unhidden posts"
ON public.community_posts FOR SELECT
USING (is_hidden = false OR auth.uid() = author_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.community_posts;
CREATE POLICY "Authenticated users can create posts"
ON public.community_posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors or admins can update posts" ON public.community_posts;
CREATE POLICY "Authors or admins can update posts"
ON public.community_posts FOR UPDATE
TO authenticated
USING (auth.uid() = author_id OR public.is_admin(auth.uid()))
WITH CHECK (
    public.is_admin(auth.uid()) OR (
        auth.uid() = author_id AND
        is_hidden = false
    )
);

DROP POLICY IF EXISTS "Authors or admins can delete posts" ON public.community_posts;
CREATE POLICY "Authors or admins can delete posts"
ON public.community_posts FOR DELETE
TO authenticated
USING (auth.uid() = author_id OR public.is_admin(auth.uid()));

-- Post Comments Policies
DROP POLICY IF EXISTS "Public can view unhidden comments" ON public.post_comments;
CREATE POLICY "Public can view unhidden comments"
ON public.post_comments FOR SELECT
USING (is_hidden = false OR auth.uid() = author_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.post_comments;
CREATE POLICY "Authenticated users can create comments"
ON public.post_comments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors or admins can update comments" ON public.post_comments;
CREATE POLICY "Authors or admins can update comments"
ON public.post_comments FOR UPDATE
TO authenticated
USING (auth.uid() = author_id OR public.is_admin(auth.uid()))
WITH CHECK (
    public.is_admin(auth.uid()) OR (
        auth.uid() = author_id AND
        is_hidden = false
    )
);

DROP POLICY IF EXISTS "Authors or admins can delete comments" ON public.post_comments;
CREATE POLICY "Authors or admins can delete comments"
ON public.post_comments FOR DELETE
TO authenticated
USING (auth.uid() = author_id OR public.is_admin(auth.uid()));

-- Post Reactions Policies
DROP POLICY IF EXISTS "Public can view post reactions" ON public.post_reactions;
CREATE POLICY "Public can view post reactions"
ON public.post_reactions FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can add own reaction" ON public.post_reactions;
CREATE POLICY "Users can add own reaction"
ON public.post_reactions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove own reaction" ON public.post_reactions;
CREATE POLICY "Users can remove own reaction"
ON public.post_reactions FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Post Bookmarks Policies
DROP POLICY IF EXISTS "Users can view own bookmarks" ON public.post_bookmarks;
CREATE POLICY "Users can view own bookmarks"
ON public.post_bookmarks FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can add own bookmark" ON public.post_bookmarks;
CREATE POLICY "Users can add own bookmark"
ON public.post_bookmarks FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove own bookmark" ON public.post_bookmarks;
CREATE POLICY "Users can remove own bookmark"
ON public.post_bookmarks FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Post Reports Policies
DROP POLICY IF EXISTS "Reporters can view own reports and admins can view all" ON public.post_reports;
CREATE POLICY "Reporters can view own reports and admins can view all"
ON public.post_reports FOR SELECT
TO authenticated
USING (auth.uid() = reporter_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can submit reports" ON public.post_reports;
CREATE POLICY "Authenticated users can submit reports"
ON public.post_reports FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "Admins can update report status" ON public.post_reports;
CREATE POLICY "Admins can update report status"
ON public.post_reports FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- 10. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_posts_author ON public.community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_topic ON public.community_posts(topic_category);
CREATE INDEX IF NOT EXISTS idx_posts_created ON public.community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_hidden ON public.community_posts(is_hidden);
CREATE INDEX IF NOT EXISTS idx_comments_post ON public.post_comments(post_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON public.post_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_reactions_post ON public.post_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.post_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.post_reports(status, created_at DESC);
