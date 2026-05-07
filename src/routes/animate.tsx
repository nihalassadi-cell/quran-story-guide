import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Sparkles, Play } from "lucide-react";

export const Route = createFileRoute("/animate")({
  head: () => ({
    meta: [
      { title: "Animate a Surah — Noor" },
      { name: "description", content: "Generate reverent AI scenes for any Surah of the Quran." },
    ],
  }),
  component: AnimatePage,
});

interface SurahRow {
  number: number;
  name_ar: string;
  name_en: string;
  verse_count: number;
  is_animated: boolean;
}

function AnimatePage() {
  const [surahs, setSurahs] = useState<SurahRow[] | null>(null);
  const [selected, setSelected] = useState<number>(1);

  useEffect(() => {
    supabase
      .from("surahs")
      .select("number, name_ar, name_en, verse_count, is_animated")
      .order("number")
      .then(({ data }) => setSurahs((data as SurahRow[]) ?? []));
  }, []);

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-24">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold gold-text">Animate a Surah</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-5">
          Generate reverent AI scenes for any Surah. Verses mentioning the Prophet ﷺ get symbolic imagery only.
          Available to everyone — no account needed.
        </p>

        <div className="rounded-xl border border-border bg-card/60 p-5 space-y-3">
          <label className="text-xs uppercase tracking-wider text-muted-foreground">Select Surah</label>
          <select
            value={selected}
            onChange={(e) => setSelected(parseInt(e.target.value, 10))}
            disabled={!surahs}
            className="w-full bg-input border border-border rounded-md px-3 py-2"
          >
            {(surahs ?? []).map((s) => (
              <option key={s.number} value={s.number}>
                {s.number}. {s.name_en} — {s.name_ar} ({s.verse_count} verses) {s.is_animated ? "✓ animated" : ""}
              </option>
            ))}
          </select>
          <Link
            to="/surah/$number"
            params={{ number: String(selected) }}
            className="w-full rounded-md bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-medium py-2.5 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Play className="h-4 w-4" />
            Play
          </Link>
          <p className="text-xs text-muted-foreground text-center">
            Playback starts instantly. Scenes generate in the background and stream in as they're ready.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
