import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type StoredSessionShape = {
  user?: User | null;
  currentSession?: {
    user?: User | null;
  } | null;
};

function readStoredUser() {
  if (typeof window === "undefined") return null;

  try {
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (!key || !key.includes("auth-token")) continue;

      const raw = window.localStorage.getItem(key);
      if (!raw) continue;

      const parsed = JSON.parse(raw) as StoredSessionShape | StoredSessionShape[];

      if (Array.isArray(parsed)) {
        for (const entry of parsed) {
          const user = entry?.currentSession?.user ?? entry?.user ?? null;
          if (user?.id) return user;
        }
        continue;
      }

      const user = parsed?.currentSession?.user ?? parsed?.user ?? null;
      if (user?.id) return user;
    }
  } catch {
    return null;
  }

  return null;
}

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(() => readStoredUser());
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const loadInitialSession = async () => {
      if (active) setIsAuthLoading(true);

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!active) return;
        setUser(session?.user ?? null);
      } catch {
        if (!active) return;
        setUser(null);
      } finally {
        if (active) setIsAuthLoading(false);
      }
    };

    void loadInitialSession();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(session?.user ?? null);
      setIsAuthLoading(false);
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return { user, isAuthLoading };
}