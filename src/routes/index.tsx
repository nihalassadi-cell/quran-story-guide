import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, BookMarked, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useT } from "@/lib/i18n";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Noor — Quran" },
      { name: "description", content: "Read all 114 Surahs of the Quran with recitation and translation." },
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

interface VerseHit { surah_number: number; verse_number: number; text: string; }

type LastPage = { surah: number; page: number; verse: number; surahName?: string; ts: number };

function HomePage() {
  const [surahs, setSurahs] = useState<Surah[] | null>(null);
  const [filter, setFilter] = useState("");
  const [verseHits, setVerseHits] = useState<VerseHit[]>([]);
  const [verseLoading, setVerseLoading] = useState(false);
  const [lastPage, setLastPage] = useState<LastPage | null>(null);
  const t = useT();


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

  // Verse-level search across the entire Quran
  useEffect(() => {
    const q = filter.trim();
    if (q.length < 2) { setVerseHits([]); setVerseLoading(false); return; }
    setVerseLoading(true);
    const t = setTimeout(async () => {
      const term = `%${q}%`;
      const { data } = await supabase
        .from("translations")
        .select("text, verses!inner(surah_number, verse_number)")
        .ilike("text", term)
        .limit(20);
      setVerseHits(((data as any) ?? []).map((r: any) => ({
        surah_number: r.verses.surah_number,
        verse_number: r.verses.verse_number,
        text: r.text,
      })));
      setVerseLoading(false);
    }, 250);
    return () => clearTimeout(t);
  }, [filter]);

  const filtered = useMemo(() => surahs?.filter((s) => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (
      String(s.number).includes(q) ||
      s.name_en.toLowerCase().includes(q) ||
      s.name_translit.toLowerCase().includes(q) ||
      s.name_ar.includes(filter)
    );
  }), [surahs, filter]);

  return (
    <AppShell>
      <div className="max-w-md mx-auto px-4 pt-8">
        <header className="mb-6 fade-in">
          <p className="text-xs uppercase tracking-[0.3em] text-primary/80 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" /> Noor
          </p>
          <h1 className="text-[clamp(1.75rem,7vw,2.5rem)] font-bold mt-2 gold-text leading-tight">{t("quran.title")}</h1>
          <p className="text-sm text-muted-foreground mt-2">
            {t("quran.sub")}
          </p>

        </header>

        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder={t("quran.search")}
            className="pl-9 bg-card/60 border-border"
          />
        </div>

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
              <p className="text-[10px] uppercase tracking-widest text-primary/90">{t("quran.continue")}</p>
              <p className="text-sm font-semibold truncate">
                {lastPage.surahName ?? `${t("quran.surah")} ${lastPage.surah}`} · {t("quran.page")} {lastPage.page}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">{t("quran.verse")} {lastPage.verse} · {t("quran.pickup")}</p>

            </div>
            <span className="text-xs text-muted-foreground shrink-0">→</span>
          </Link>
        )}

        {filter && verseHits.length > 0 && (
          <section className="mb-5">
            <h2 className="text-xs uppercase tracking-widest text-primary/80 mb-2 flex items-center gap-2">
              {t("quran.verses")} {verseLoading && <Loader2 className="h-3 w-3 animate-spin" />}
            </h2>
            <ul className="space-y-2">
              {verseHits.map((v, i) => (
                <li key={i}>
                  <Link
                    to="/surah/$number"
                    params={{ number: String(v.surah_number) }}
                    search={{ verse: v.verse_number }}
                    className="block rounded-lg bg-card/60 border border-border px-4 py-2.5 hover:border-primary/50"
                  >
                    <p className="text-[11px] text-primary mb-0.5">Surah {v.surah_number}, verse {v.verse_number}</p>
                    <p className="text-sm line-clamp-2">{v.text}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {filter && (filtered?.length ?? 0) > 0 && (
          <h2 className="text-xs uppercase tracking-widest text-primary/80 mb-2">Surahs</h2>
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

        {filter && (filtered?.length ?? 0) === 0 && verseHits.length === 0 && !verseLoading && (
          <p className="text-center text-sm text-muted-foreground mt-8">
            No matches. Try a different word.
          </p>
        )}
      </div>
    </AppShell>
  );
}
