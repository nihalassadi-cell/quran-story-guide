type StoredUser = {
  id: string;
  email?: string;
};

type StoredSession = {
  access_token?: string;
  user?: StoredUser | null;
  currentSession?: {
    access_token?: string;
    user?: StoredUser | null;
  } | null;
  session?: {
    access_token?: string;
    user?: StoredUser | null;
  } | null;
};

export function readStoredAuth() {
  if (typeof window === "undefined") return null;

  try {
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (!key || !key.includes("auth-token")) continue;

      const raw = window.localStorage.getItem(key);
      if (!raw) continue;

      const parsed = JSON.parse(raw) as StoredSession | StoredSession[];
      const entries = Array.isArray(parsed) ? parsed : [parsed];

      for (const entry of entries) {
        const session = entry?.currentSession ?? entry?.session ?? entry;
        const accessToken = session?.access_token;
        const user = session?.user ?? null;

        if (accessToken && user?.id) {
          return { accessToken, user };
        }
      }
    }
  } catch {
    return null;
  }

  return null;
}

function getBackendConfig() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Backend configuration is missing");
  }

  return { url, key };
}

export async function fetchRoleWithStoredSession(role: string) {
  const auth = readStoredAuth();
  if (!auth) return { ok: false as const, status: 401, hasRole: false };

  const { url, key } = getBackendConfig();
  const params = new URLSearchParams({
    select: "role",
    user_id: `eq.${auth.user.id}`,
    role: `eq.${role}`,
    limit: "1",
  });

  const response = await fetch(`${url}/rest/v1/user_roles?${params.toString()}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${auth.accessToken}`,
    },
  });

  if (!response.ok) {
    return { ok: false as const, status: response.status, hasRole: false };
  }

  const rows = (await response.json()) as Array<{ role: string }>;
  return { ok: true as const, status: response.status, hasRole: rows.length > 0, user: auth.user };
}

export async function fetchWithStoredSession(path: string, init?: RequestInit) {
  const auth = readStoredAuth();
  if (!auth) {
    throw new Error("No stored session");
  }

  const { url, key } = getBackendConfig();

  return fetch(`${url}${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${auth.accessToken}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
}