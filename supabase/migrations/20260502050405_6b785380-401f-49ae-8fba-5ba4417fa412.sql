
-- Fix: search_path on touch_updated_at
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Revoke direct execute on SECURITY DEFINER functions (RLS policies still call them as table owner)
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;

-- Replace broad public listing on storage with admin-only listing.
-- Individual file reads via public URL still work because they don't use storage.objects SELECT policy.
DROP POLICY IF EXISTS "Public read scene-images" ON storage.objects;
DROP POLICY IF EXISTS "Public read narrations" ON storage.objects;

CREATE POLICY "Admins list scene-images" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'scene-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins list narrations" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'narrations' AND public.has_role(auth.uid(), 'admin'));
