import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Sparkles, Loader2, Play, CheckCircle2, ExternalLink } from "lucide-react";
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
  const [progress, setProgress] = useState<{ ready: number; total: number } | null>(null);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    supabase
      .from("surahs")
      .select("number, name_ar, name_en, verse_count, is_animated")
      .order("number")
      .then(({ data }) => setSurahs((data as SurahRow[]) ?? []));
  }, []);

  const append = (line: string) => setLog((l) => [...l.slice(-20), line]);

  const generate = async () => {
    setGenerating(true);
    setProgress(null);
    setLog([]);
    try {
      let safety = 0;
      while (safety++ < 200) {
        const startedAt = Date.now();
        append(`Batch ${safety}: requesting (this can take 20-40s)…`);
        const { data, error } = await supabase.functions.invoke("generate-surah", {
          body: { surahNumber: selected, batchSize: 1, regenerate },
        });
        const elapsed = Math.round((Date.now() - startedAt) / 1000);
        if (error) {
          const msg = (error as any)?.message ?? "request failed";
          append(`  ! error after ${elapsed}s: ${msg}`);
          if (msg.includes("429")) { toast.error("Rate limit hit — pausing 20s"); await new Promise((r) => setTimeout(r, 20000)); continue; }
          if (msg.includes("402")) { toast.error("AI credits exhausted. Add credits in Settings → Workspace → Usage."); break; }
          throw error;
        }
        const { readyCount, totalVerses, processed, done } = data as {
          readyCount: number; totalVerses: number; done: boolean;
          processed: { verse: number; ok: boolean; error?: string }[];
        };
        setProgress({ ready: readyCount, total: totalVerses });
        append(`  finished in ${elapsed}s — ${readyCount}/${totalVerses} ready`);
        for (const p of processed) append(p.ok ? `  ✓ verse ${p.verse}` : `  ✗ verse ${p.verse} — ${p.error}`);
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
            <div className="flex gap-2">
              <button
                onClick={generate}
                disabled={generating}
                className="flex-1 rounded-md bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-medium py-2.5 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                {generating ? "Generating…" : "Generate scenes"}
              </button>
              <Link
                to="/surah/$number"
                params={{ number: String(selected) }}
                className="rounded-md border border-border bg-card px-4 py-2.5 text-sm flex items-center gap-2 hover:border-primary/50"
              >
                <ExternalLink className="h-4 w-4" /> Preview
              </Link>
            </div>
            {progress && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress</span><span>{progress.ready}/{progress.total}</span>
                </div>
                <div className="h-2 bg-input rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all" style={{ width: `${(progress.ready / progress.total) * 100}%` }} />
                </div>
                {progress.ready === progress.total && (
                  <p className="text-xs text-primary flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Complete</p>
                )}
              </div>
            )}
          </div>

          {log.length > 0 && (
            <div className="rounded-xl border border-border bg-card/40 p-4 font-mono text-xs space-y-0.5 max-h-64 overflow-auto">
              {log.map((line, i) => <div key={i} className="text-muted-foreground">{line}</div>)}
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Each batch processes 1 verse. The job loops automatically until the Surah is fully animated or hits a rate limit.
            Start with a short Surah like Al-Fatihah (#1, 7 verses) or An-Nas (#114, 6 verses) to test.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
