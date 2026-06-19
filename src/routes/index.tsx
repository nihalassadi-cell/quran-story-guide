import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, BookOpen, BookMarked } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Noor — All Surahs" },
      { name: "description", content: "Browse all 114 Surahs of the Quran. Tap any to begin the animated experience." },
    ],
  }),
  component: HomePage,
});

interface Surah {
  number: number;
  name_ar: string;
  name_en: string;
  name_translit: string;
  verse_count: number;
  revelation_place: string;
  is_animated: boolean;
}

type LastPage = { surah: number; page: number; verse: number; surahName?: string; ts: number };

function HomePage() {
  const [surahs, setSurahs] = useState<Surah[] | null>(null);
  const [filter, setFilter] = useState("");
  const [lastPage, setLastPage] = useState<LastPage | null>(null);

  useEffect(() => {
    supabase
      .from("surahs")
      .select("*")
      .order("number")
      .then(({ data }) => setSurahs((data as Surah[]) ?? []));
    try {
      const raw = localStorage.getItem("noor:lastPage");
      if (raw) setLastPage(JSON.parse(raw));
    } catch {}
  }, []);

  const filtered = surahs?.filter((s) => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (
      String(s.number).includes(q) ||
      s.name_en.toLowerCase().includes(q) ||
      s.name_translit.toLowerCase().includes(q) ||
      s.name_ar.includes(filter)
    );
  });

  return (
    <AppShell>
      <div className="max-w-md mx-auto px-4 pt-8">
        <header className="mb-6 fade-in">
          <p className="text-xs uppercase tracking-[0.3em] text-primary/80 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" /> Noor
          </p>
          <h1 className="text-[clamp(1.75rem,7vw,2.5rem)] font-bold mt-2 gold-text leading-tight">The Animated Quran</h1>
          <p className="text-sm text-muted-foreground mt-2">
            114 chapters. Recitation and translation — verse by verse.
          </p>
        </header>

        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Find a Surah..."
            className="pl-9 bg-card/60 border-border"
          />
        </div>

        <Link
          to="/search"
          className="mb-5 flex items-center justify-between rounded-xl bg-card/60 border border-border px-4 py-3 hover:border-primary/40 transition-colors"
        >
          <span className="flex items-center gap-2 text-sm">
            <BookOpen className="h-4 w-4 text-primary" /> Search verses across the entire Quran
          </span>
          <span className="text-xs text-muted-foreground">→</span>
        </Link>

        {lastPage && !filter && (
          <Link
            to="/surah/$number"
            params={{ number: String(lastPage.surah) }}
            search={{ verse: lastPage.verse, page: lastPage.page }}
            className="fade-in mb-3 flex items-center gap-3 rounded-xl border border-primary/40 bg-gradient-to-br from-primary/15 via-card/70 to-accent/10 px-4 py-3 hover:border-primary/70 transition-colors"
          >
            <div className="h-11 w-11 shrink-0 rounded-lg bg-gradient-to-br from-primary to-primary-glow grid place-items-center text-primary-foreground glow-shadow">
              <BookMarked className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-primary/90">Continue reading</p>
              <p className="text-sm font-semibold truncate">
                {lastPage.surahName ?? `Surah ${lastPage.surah}`} · Page {lastPage.page}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">Verse {lastPage.verse} · pick up where you left off</p>
            </div>
            <span className="text-xs text-muted-foreground shrink-0">→</span>
          </Link>
        )}

        <ul className="space-y-2">
          {!surahs &&
            Array.from({ length: 8 }).map((_, i) => (
              <li key={i}><Skeleton className="h-20 w-full rounded-xl" /></li>
            ))}
          {filtered?.map((s) => (
            <li key={s.number} className="fade-in">
              <Link
                to="/surah/$number"
                params={{ number: String(s.number) }}
                className="group flex items-center gap-4 rounded-xl bg-card/60 border border-border px-4 py-3 hover:border-primary/50 hover:bg-card transition-all"
              >
                <div className="relative shrink-0">
                  <div className="h-11 w-11 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 grid place-items-center text-primary font-semibold">
                    {s.number}
                  </div>
                  {s.is_animated && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary glow-shadow" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2 min-w-0">
                    <h3 className="font-semibold truncate min-w-0 flex-1 text-sm sm:text-base">{s.name_translit}</h3>
                    <span className="arabic text-base sm:text-lg text-primary/90 truncate shrink-0 max-w-[45%]">{s.name_ar}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5 text-[11px] sm:text-xs text-muted-foreground gap-2">
                    <span className="truncate">{s.name_en}</span>
                    <span className="shrink-0">{s.verse_count} verses · {s.revelation_place}</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}
