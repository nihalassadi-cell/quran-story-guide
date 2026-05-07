import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Sparkles, Loader2, Play, ExternalLink } from "lucide-react";
import { toast } from "sonner";

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
  const [generating, setGenerating] = useState(false);
  const [regenerate, setRegenerate] = useState(false);

  useEffect(() => {
    supabase
      .from("surahs")
      .select("number, name_ar, name_en, verse_count, is_animated")
      .order("number")
      .then(({ data }) => setSurahs((data as SurahRow[]) ?? []));
  }, []);

  const generate = async () => {
    setGenerating(true);
    try {
      let safety = 0;
      while (safety++ < 200) {
        const { data, error } = await supabase.functions.invoke("generate-surah", {
          body: { surahNumber: selected, batchSize: 12, concurrency: 6, regenerate },
        });
        if (error) {
          const msg = (error as any)?.message ?? "request failed";
          if (msg.includes("429")) { toast.error("Rate limit hit — pausing 20s"); await new Promise((r) => setTimeout(r, 20000)); continue; }
          if (msg.includes("402")) { toast.error("AI credits exhausted. Add credits in Settings → Workspace → Usage."); break; }
          throw error;
        }
        const { processed, done } = data as {
          readyCount: number; totalVerses: number; done: boolean;
          processed: { verse: number; ok: boolean; error?: string }[];
        };
        if (done) { toast.success("Surah fully animated!"); break; }
        if (processed.length === 0) { toast.message("Nothing left to process"); break; }
      }
      const { data: list } = await supabase
        .from("surahs")
        .select("number, name_ar, name_en, verse_count, is_animated")
        .order("number");
      setSurahs((list as SurahRow[]) ?? []);
    } catch (e: any) {
      toast.error(e?.message ?? "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

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

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card/60 p-5 space-y-3">
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Select Surah</label>
            <select
              value={selected}
              onChange={(e) => setSelected(parseInt(e.target.value, 10))}
              disabled={generating || !surahs}
              className="w-full bg-input border border-border rounded-md px-3 py-2"
            >
              {(surahs ?? []).map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. {s.name_en} — {s.name_ar} ({s.verse_count} verses) {s.is_animated ? "✓ animated" : ""}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={regenerate}
                onChange={(e) => setRegenerate(e.target.checked)}
                disabled={generating}
                className="accent-primary"
              />
              Regenerate existing scenes (use the latest pipeline)
            </label>
            <Link
              to="/surah/$number"
              params={{ number: String(selected) }}
              className="w-full rounded-md bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-medium py-2.5 flex items-center justify-center gap-2"
            >
              <Play className="h-4 w-4" />
              Play
            </Link>
            {generating && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                <Loader2 className="h-3 w-3 animate-spin text-primary" />
                <span>Play in progress — generating scenes…</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
