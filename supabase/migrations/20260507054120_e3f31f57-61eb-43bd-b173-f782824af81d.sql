ALTER TABLE public.scenes REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.scenes;