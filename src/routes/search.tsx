import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, Loader2 } from "lucide-react";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "Search — Noor" }, { name: "description", content: "Search Surahs and verses across the Quran." }] }),
  component: SearchPage,
});

interface SurahHit { number: number; name_en: string; name_translit: string; name_ar: string; }
interface VerseHit { surah_number: number; verse_number: number; text: string; }

function SearchPage() {
  const [q, setQ] = useState("");
  const [surahHits, setSurahHits] = useState<SurahHit[]>([]);
  const [verseHits, setVerseHits] = useState<VerseHit[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q.trim()) { setSurahHits([]); setVerseHits([]); return; }
    setLoading(true);
    const t = setTimeout(async () => {
      const term = `%${q}%`;
      const [s, v] = await Promise.all([
        supabase.from("surahs").select("number,name_en,name_translit,name_ar")
          .or(`name_en.ilike.${term},name_translit.ilike.${term},name_ar.ilike.${term}`).limit(10),
        supabase.from("translations").select("text, verses!inner(surah_number, verse_number)")
          .ilike("text", term).limit(20),
      ]);
      setSurahHits((s.data as any) ?? []);
      setVerseHits(((v.data as any) ?? []).map((r: any) => ({
        surah_number: r.verses.surah_number, verse_number: r.verses.verse_number, text: r.text,
      })));
      setLoading(false);
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <AppShell>
      <div className="max-w-md mx-auto px-4 pt-8">
        <h1 className="text-2xl font-bold mb-1 gold-text">Search</h1>
        <p className="text-sm text-muted-foreground mb-5">Find a Surah or any word in translated verses.</p>
        <div className="relative mb-5">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. mercy, light, Yusuf" className="pl-9 bg-card/60 border-border" autoFocus />
        </div>
        {loading && <Loader2 className="h-5 w-5 animate-spin text-primary mx-auto" />}

        {surahHits.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs uppercase tracking-widest text-primary/80 mb-2">Surahs</h2>
            <ul className="space-y-2">
              {surahHits.map((s) => (
                <li key={s.number}>
                  <Link to="/surah/$number" params={{ number: String(s.number) }} className="block rounded-lg bg-card/60 border border-border px-4 py-3 hover:border-primary/50">
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold">{s.number}. {s.name_translit}</span>
                      <span className="arabic text-primary/90">{s.name_ar}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.name_en}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {verseHits.length > 0 && (
          <section>
            <h2 className="text-xs uppercase tracking-widest text-primary/80 mb-2">Verses</h2>
            <ul className="space-y-2">
              {verseHits.map((v, i) => (
                <li key={i}>
                  <Link to="/surah/$number" params={{ number: String(v.surah_number) }} search={{ verse: v.verse_number }} className="block rounded-lg bg-card/60 border border-border px-4 py-3 hover:border-primary/50">
                    <p className="text-xs text-primary mb-1">Surah {v.surah_number}, verse {v.verse_number}</p>
                    <p className="text-sm">{v.text}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {q && !loading && surahHits.length === 0 && verseHits.length === 0 && (
          <p className="text-center text-sm text-muted-foreground mt-8">
            No results. Verses appear here only after a Surah has been processed by the admin generator.
          </p>
        )}
      </div>
    </AppShell>
  );
}
