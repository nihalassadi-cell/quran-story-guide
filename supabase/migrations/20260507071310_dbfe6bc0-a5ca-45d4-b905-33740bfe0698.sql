
CREATE TABLE public.tts_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  created_at timestamptz not null default now()
);
CREATE INDEX idx_tts_usage_user_day ON public.tts_usage(user_id, created_at);
ALTER TABLE public.tts_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view their own usage" ON public.tts_usage FOR SELECT USING (auth.uid() = user_id);
