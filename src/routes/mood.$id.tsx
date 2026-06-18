import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, Play, Pause, SkipBack, SkipForward, Loader2, BookOpen, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchSurahWithTranslation, ayahAudioUrl, RECITERS, TRANSLATION_LANGUAGES, type LanguageCode } from "@/lib/quran-api";
import { getMood } from "@/lib/moods";
import { toast } from "sonner";

const EVERYAYAH_TRANSLATIONS: Record<string, string> = {
  en: "English/Sahih_Intnl_Ibrahim_Walk_192kbps",
  ur: "translations/urdu_shamshad_ali_khan_46kbps",
};
function translationAudioUrl(language: string, surah: number, verse: number): string | null {
  const folder = EVERYAYAH_TRANSLATIONS[language];
  if (!folder) return null;
  return `https://everyayah.com/data/${folder}/${String(surah).padStart(3, "0")}${String(verse).padStart(3, "0")}.mp3`;
}

const DEFAULT_LANGUAGE: LanguageCode = "ur";

export const Route = createFileRoute("/mood/$id")({
  head: ({ params }) => {
    const m = getMood(params.id);
    return {
      meta: [
        { title: `${m?.label ?? "Mood"} — Noor` },
        { name: "description", content: m?.blurb ?? "Verses chosen for how you're feeling." },
      ],
    };
  },
  component: MoodPlayer,
});

type AyahCache = Record<number, Awaited<ReturnType<typeof fetchSurahWithTranslation>>>;

function MoodPlayer() {
  const { id } = Route.useParams();
  const mood = getMood(id);
  if (!mood) throw notFound();

  const [idx, setIdx] = useState(0);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [reciter, setReciter] = useState<string>("ar.alafasy");
  const [language, setLanguage] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [cache, setCache] = useState<AyahCache>({});
  const [scenes, setScenes] = useState<Record<string, string>>({}); // key `${surah}:${verse}`
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startAt = (i: number) => {
    setIdx(i);
    setStarted(true);
    setPlaying(true);
  };

  const current = mood.verses[idx];
  const surahData = cache[current.surah];
  const ayah = surahData?.ayahs.find((a) => a.numberInSurah === current.verse);
  const translation = surahData?.translations.find((t) => t.numberInSurah === current.verse);

  // Prefetch all surahs referenced by this mood so the list & player are instant.
  useEffect(() => {
    const unique = Array.from(new Set(mood.verses.map((v) => v.surah))).filter((n) => !cache[n]);
    unique.forEach((n) => {
      fetchSurahWithTranslation(n, language)
        .then((d) => setCache((c) => ({ ...c, [n]: d })))
        .catch((e) => { console.error("[mood] fetch failed", n, e); toast.error(`Failed to load Surah ${n}`); });
    });
  }, [language, mood.verses, cache]);

  // Refetch all loaded surahs when language changes
  useEffect(() => {
    setCache({});
  }, [language]);

  // Load scene images + trigger background generation + subscribe to realtime updates
  useEffect(() => {
    let cancelled = false;
    const verseIdToKey = new Map<string, string>();
    

    (async () => {
      const next: Record<string, string> = {};
      const missingSurahs = new Set<number>();
      for (const v of mood.verses) {
        const { data } = await supabase
          .from("verses")
          .select("id, verse_number, surah_number, scenes(image_url, status)")
          .eq("surah_number", v.surah)
          .eq("verse_number", v.verse)
          .maybeSingle();
        if (cancelled) return;
        const row: any = data;
        if (row?.id) verseIdToKey.set(row.id, `${v.surah}:${v.verse}`);
        const scene = Array.isArray(row?.scenes) ? row.scenes[0] : row?.scenes;
        if (scene?.image_url && scene.status === "ready") {
          next[`${v.surah}:${v.verse}`] = scene.image_url;
        } else {
          missingSurahs.add(v.surah);
        }
      }
      if (cancelled) return;
      setScenes(next);

      // Kick off background generation per surah that has any missing verse.
      for (const surahNumber of missingSurahs) {
        (async () => {
          for (let i = 0; i < 20 && !cancelled; i++) {
            const { data, error } = await supabase.functions.invoke("generate-surah", {
              body: { surahNumber, batchSize: 8, concurrency: 4 },
            });
            if (error || !data) break;
            if ((data as any).done) break;
            if (((data as any).processed ?? []).length === 0) break;
          }
        })();
      }
    })();

    const channel = supabase
      .channel(`scenes-mood-${mood.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "scenes" },
        (payload: any) => {
          const row = payload.new ?? payload.old;
          if (!row) return;
          const key = verseIdToKey.get(row.verse_id);
          if (!key) return;
          if (row.status === "ready" && row.image_url) {
            setScenes((prev) => ({ ...prev, [key]: row.image_url }));
          }
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [mood.id]);

  // Sequenced playback: Arabic → translation → next
  useEffect(() => {
    if (!ayah || !started) return;
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;

    let cancelled = false;
    const ttsRef: { current: HTMLAudioElement | null } = { current: null };

    const advance = () => {
      if (cancelled) return;
      if (idx < mood.verses.length - 1) setIdx((i) => i + 1);
      else setPlaying(false);
    };

    const playTranslationThenAdvance = () => {
      const url = translationAudioUrl(language, current.surah, current.verse);
      if (!url) { advance(); return; }
      const tts = new Audio(url);
      ttsRef.current = tts;
      tts.onended = advance;
      tts.onerror = advance;
      tts.play().catch(advance);
    };

    audio.src = ayahAudioUrl(ayah.number, reciter);
    audio.onended = playTranslationThenAdvance;
    if (playing) audio.play().catch(() => setPlaying(false));
    else audio.pause();

    return () => {
      cancelled = true;
      audio.pause();
      if (ttsRef.current) ttsRef.current.pause();
    };
  }, [ayah, reciter, playing, idx, current.surah, current.verse, language, mood.verses.length]);

  const sceneUrl = scenes[`${current.surah}:${current.verse}`];
  const total = mood.verses.length;

  if (!started) {
    return (
      <div className="min-h-screen bg-background">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="relative max-w-2xl mx-auto px-4 pt-6 pb-24">
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/animate"
              className="rounded-full bg-card/60 backdrop-blur p-2 border border-border hover:border-primary/60"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div className="text-center">
              <p className="text-[11px] uppercase tracking-widest text-primary/80">For when you feel</p>
              <p className="text-lg font-semibold gold-text">{mood.emoji} {mood.label}</p>
            </div>
            <div className="w-9" />
          </div>

          <p className="text-sm text-muted-foreground text-center mb-5 italic">{mood.blurb}</p>

          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground/90">Choose a verse</h2>
            <button
              onClick={() => startAt(0)}
              className="text-xs inline-flex items-center gap-1 rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground px-3 py-1.5 glow-shadow"
            >
              <Play className="h-3 w-3" /> Play all
            </button>
          </div>

          <ul className="space-y-2.5">
            {mood.verses.map((v, i) => {
              const surahData = cache[v.surah];
              const ayah = surahData?.ayahs.find((a) => a.numberInSurah === v.verse);
              const sceneUrl = scenes[`${v.surah}:${v.verse}`];
              return (
                <li key={`${v.surah}:${v.verse}`}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => startAt(i)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); startAt(i); } }}
                    className="group w-full text-left rounded-xl border border-border bg-card/60 backdrop-blur hover:border-primary/60 hover:bg-card transition-colors flex cursor-pointer"
                  >
                    <div className="relative w-20 sm:w-24 shrink-0 min-h-[72px] bg-gradient-to-br from-primary/20 to-accent/20">
                      {sceneUrl ? (
                        <img src={sceneUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-primary/60 text-2xl font-bold">
                          {String(i + 1).padStart(2, "0")}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 p-3 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-primary/90 shrink-0">
                          <BookOpen className="h-3 w-3" />
                          {v.surahName} · {v.surah}:{v.verse}
                        </span>
                        <Play className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </div>
                      {ayah && (
                        <p className="arabic text-sm leading-snug text-foreground/95 truncate" dir="rtl">
                          {ayah.text}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground leading-snug break-words">
                        <Sparkles className="inline h-3 w-3 text-primary/80 mr-1 -mt-0.5 shrink-0" />
                        {v.reason}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background overflow-hidden flex flex-col">
      <div className="absolute inset-0">
        {sceneUrl ? (
          <img
            key={sceneUrl}
            src={sceneUrl}
            alt=""
            className={`w-full h-full object-cover scene-fade kb-${(idx % 4) + 1}`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-card via-background to-accent/20" />
        )}
        <div className="light-leak" />
        <div className="lens-shimmer" />
        <div className="film-grain" />
        <div className="vignette-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background/90" />
      </div>

      <header className="relative z-10 flex items-center justify-between p-4">
        <button
          onClick={() => { setStarted(false); setPlaying(false); }}
          className="rounded-full bg-card/60 backdrop-blur p-2 border border-border"
          aria-label="Back to verse list"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-primary/80">For when you feel</p>
          <p className="text-lg font-semibold gold-text">{mood.emoji} {mood.label}</p>
        </div>
        <div className="w-9" />
      </header>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4">
        {!ayah && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
      </div>

      {ayah && (
        <div className="relative z-10 px-3 pb-1 space-y-1.5">
          <div className="mx-auto max-w-2xl flex items-center justify-between gap-2 text-[10px] uppercase tracking-wider">
            <Link
              to="/surah/$number"
              params={{ number: String(current.surah) }}
              search={{ verse: current.verse }}
              className="inline-flex items-center gap-1 text-primary/90 hover:text-primary bg-background/40 backdrop-blur px-2 py-0.5 rounded-full border border-border/60"
            >
              <BookOpen className="h-3 w-3" />
              {current.surahName} · {current.surah}:{current.verse}
            </Link>
            <span className="inline-flex items-center gap-1 text-foreground/80 bg-background/40 backdrop-blur px-2 py-0.5 rounded-full border border-border/60">
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="normal-case tracking-normal text-[11px]">{current.reason}</span>
            </span>
          </div>
          <div
            key={`${current.surah}:${current.verse}`}
            className="fade-in mx-auto max-w-2xl text-center space-y-1 rounded-lg bg-background/55 backdrop-blur-sm px-3 py-2 border border-border/40"
          >
            <p className="arabic text-xl md:text-2xl leading-snug text-foreground">{ayah.text}</p>
            <p className="text-xs md:text-sm leading-snug text-foreground/85">{translation?.text}</p>
          </div>
        </div>
      )}

      <div className="relative z-10 p-5 pb-8 space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Verse {idx + 1} of {total}</span>
          <select
            value={reciter}
            onChange={(e) => setReciter(e.target.value)}
            className="bg-card/70 backdrop-blur border border-border rounded px-2 py-1 text-xs"
          >
            {RECITERS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <div className="h-1 bg-card/60 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all" style={{ width: `${((idx + 1) / total) * 100}%` }} />
        </div>
        <div className="flex items-center justify-center gap-6">
          <button
            disabled={idx <= 0}
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
            className="rounded-full bg-card/70 backdrop-blur p-3 border border-border disabled:opacity-30"
          >
            <SkipBack className="h-5 w-5" />
          </button>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground p-5 glow-shadow"
          >
            {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
          </button>
          <button
            disabled={idx >= total - 1}
            onClick={() => setIdx((i) => Math.min(total - 1, i + 1))}
            className="rounded-full bg-card/70 backdrop-blur p-3 border border-border disabled:opacity-30"
          >
            <SkipForward className="h-5 w-5" />
          </button>
        </div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as LanguageCode)}
          className="w-full bg-card/70 backdrop-blur border border-border rounded px-2 py-1 text-xs text-center"
        >
          {TRANSLATION_LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
        </select>
      </div>
    </div>
  );
}
