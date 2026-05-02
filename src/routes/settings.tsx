import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { TRANSLATION_LANGUAGES, RECITERS, type LanguageCode } from "@/lib/quran-api";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Noor" }, { name: "description", content: "Choose translation language, reciter, and playback options." }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [reciter, setReciter] = useState("ar.alafasy");
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUserId(user?.id ?? null);
      setEmail(user?.email ?? null);
      if (user) {
        const { data } = await supabase.from("user_settings").select("*").eq("user_id", user.id).maybeSingle();
        if (data) {
          setLanguage(data.translation_language as LanguageCode);
          setReciter(data.reciter);
          setAutoplay(data.autoplay);
        }
      }
    });
  }, []);

  const save = async () => {
    if (!userId) { navigate({ to: "/auth" }); return; }
    await supabase.from("user_settings").upsert({ user_id: userId, translation_language: language, reciter, autoplay });
    toast.success("Settings saved");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  return (
    <AppShell>
      <div className="max-w-md mx-auto px-4 pt-8 space-y-5">
        <h1 className="text-2xl font-bold gold-text">Settings</h1>

        <Field label="Translation language">
          <select value={language} onChange={(e) => setLanguage(e.target.value as LanguageCode)} className="w-full bg-card border border-border rounded-md px-3 py-2">
            {TRANSLATION_LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
        </Field>

        <Field label="Reciter">
          <select value={reciter} onChange={(e) => setReciter(e.target.value)} className="w-full bg-card border border-border rounded-md px-3 py-2">
            {RECITERS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </Field>

        <Field label="Autoplay next verse">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={autoplay} onChange={(e) => setAutoplay(e.target.checked)} />
            <span className="text-sm text-muted-foreground">Continue to next verse automatically</span>
          </label>
        </Field>

        <button onClick={save} className="w-full rounded-md bg-primary text-primary-foreground py-2 font-medium">Save preferences</button>

        <div className="pt-6 border-t border-border">
          {userId ? (
            <>
              <p className="text-xs text-muted-foreground mb-2">Signed in as {email}</p>
              <button onClick={signOut} className="w-full flex items-center justify-center gap-2 rounded-md border border-border py-2 text-sm hover:bg-card">
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </>
          ) : (
            <button onClick={() => navigate({ to: "/auth" })} className="w-full rounded-md border border-border py-2 text-sm hover:bg-card">Sign in to save preferences</button>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-primary/80 mb-2">{label}</label>
      {children}
    </div>
  );
}
