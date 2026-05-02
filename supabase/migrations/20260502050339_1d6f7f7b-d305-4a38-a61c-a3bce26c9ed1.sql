
-- Roles enum and table (separate from profiles to avoid privilege escalation)
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Surahs (114 chapters)
CREATE TABLE public.surahs (
  number INT PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_translit TEXT NOT NULL,
  verse_count INT NOT NULL,
  revelation_place TEXT NOT NULL,
  is_animated BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.surahs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read surahs" ON public.surahs FOR SELECT USING (true);
CREATE POLICY "Admins can update surahs" ON public.surahs FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Verses
CREATE TABLE public.verses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  surah_number INT NOT NULL REFERENCES public.surahs(number) ON DELETE CASCADE,
  verse_number INT NOT NULL,
  text_ar TEXT NOT NULL,
  juz INT,
  page INT,
  mentions_prophet_muhammad BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (surah_number, verse_number)
);
CREATE INDEX idx_verses_surah ON public.verses (surah_number, verse_number);

ALTER TABLE public.verses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read verses" ON public.verses FOR SELECT USING (true);
CREATE POLICY "Admins can write verses" ON public.verses FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Translations
CREATE TABLE public.translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verse_id UUID NOT NULL REFERENCES public.verses(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  text TEXT NOT NULL,
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (verse_id, language)
);
CREATE INDEX idx_translations_verse ON public.translations (verse_id);
CREATE INDEX idx_translations_text ON public.translations USING gin (to_tsvector('english', text));

ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read translations" ON public.translations FOR SELECT USING (true);
CREATE POLICY "Admins can write translations" ON public.translations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Scenes (AI-generated backgrounds)
CREATE TABLE public.scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verse_id UUID NOT NULL UNIQUE REFERENCES public.verses(id) ON DELETE CASCADE,
  image_url TEXT,
  image_prompt TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending|ready|failed|symbolic
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.scenes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read scenes" ON public.scenes FOR SELECT USING (true);
CREATE POLICY "Admins can write scenes" ON public.scenes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Narrations (AI TTS per verse + language)
CREATE TABLE public.narrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verse_id UUID NOT NULL REFERENCES public.verses(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  voice_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (verse_id, language)
);
CREATE INDEX idx_narrations_verse ON public.narrations (verse_id, language);

ALTER TABLE public.narrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read narrations" ON public.narrations FOR SELECT USING (true);
CREATE POLICY "Admins can write narrations" ON public.narrations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Bookmarks
CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  surah_number INT NOT NULL REFERENCES public.surahs(number) ON DELETE CASCADE,
  verse_number INT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, surah_number, verse_number)
);
CREATE INDEX idx_bookmarks_user ON public.bookmarks (user_id, created_at DESC);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own bookmarks" ON public.bookmarks FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users insert own bookmarks" ON public.bookmarks FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users delete own bookmarks" ON public.bookmarks FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users update own bookmarks" ON public.bookmarks FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- User settings
CREATE TABLE public.user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  translation_language TEXT NOT NULL DEFAULT 'en',
  reciter TEXT NOT NULL DEFAULT 'ar.alafasy',
  autoplay BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own settings" ON public.user_settings FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users insert own settings" ON public.user_settings FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own settings" ON public.user_settings FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- updated_at trigger helper
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_scenes_updated BEFORE UPDATE ON public.scenes
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_user_settings_updated BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('scene-images', 'scene-images', true),
  ('narrations', 'narrations', true);

CREATE POLICY "Public read scene-images" ON storage.objects FOR SELECT
  USING (bucket_id = 'scene-images');
CREATE POLICY "Admins write scene-images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'scene-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update scene-images" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'scene-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read narrations" ON storage.objects FOR SELECT
  USING (bucket_id = 'narrations');
CREATE POLICY "Admins write narrations" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'narrations' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update narrations" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'narrations' AND public.has_role(auth.uid(), 'admin'));
