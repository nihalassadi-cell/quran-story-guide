import { supabase } from "@/integrations/supabase/client";

let pendingSessionPromise: Promise<Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"]> | null = null;

export async function getCurrentSession() {
  if (!pendingSessionPromise) {
    pendingSessionPromise = supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) throw error;
        return data.session;
      })
      .finally(() => {
        pendingSessionPromise = null;
      });
  }

  return pendingSessionPromise;
}

export async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user ?? null;
}