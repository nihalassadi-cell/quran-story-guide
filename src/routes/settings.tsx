import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { TRANSLATION_LANGUAGES, RECITERS, type LanguageCode } from "@/lib/quran-api";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Noor" }, { name: "description", content: "Choose translation language, reciter, and playback options." }] }),
  component: SettingsPage,
});

const STORAGE_KEY = "noor:settings";

function SettingsPage() {
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [reciter, setReciter] = useState("ar.alafasy");
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.translation_language) setLanguage(s.translation_language);
        if (s.reciter) setReciter(s.reciter);
        if (typeof s.autoplay === "boolean") setAutoplay(s.autoplay);
      }
    } catch {}
  }, []);



  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ translation_language: language, reciter, autoplay }));
      toast.success("Preferences saved");
    } catch {
      toast.error("Could not save preferences");
    }
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

        <button onClick={save} className="w-full rounded-md bg-primary text-primary-foreground py-2 font-medium transition-transform duration-150 active:scale-[0.97] hover:bg-primary/90">Save preferences</button>
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
