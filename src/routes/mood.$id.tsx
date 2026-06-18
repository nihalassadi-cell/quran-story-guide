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
  const [playing, setPlaying] = useState(false);
  const [reciter, setReciter] = useState<string>("ar.alafasy");
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [cache, setCache] = useState<AyahCache>({});
  const [scenes, setScenes] = useState<Record<string, string>>({}); // key `${surah}:${verse}`
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const current = mood.verses[idx];
  const surahData = cache[current.surah];
  const ayah = surahData?.ayahs.find((a) => a.numberInSurah === current.verse);
  const translation = surahData?.translations.find((t) => t.numberInSurah === current.verse);

  // Fetch current + next surah (prefetch)
  useEffect(() => {
    const toFetch = [current.surah, mood.verses[idx + 1]?.surah].filter(
      (n): n is number => !!n && !cache[n],
    );
    toFetch.forEach((n) => {
      fetchSurahWithTranslation(n, language)
        .then((d) => setCache((c) => ({ ...c, [n]: d })))
        .catch((e) => { console.error("[mood] fetch failed", n, e); toast.error(`Failed to load Surah ${n}`); });
    });
  }, [current.surah, idx, language, mood.verses, cache]);

  // Refetch all loaded surahs when language changes
  useEffect(() => {
    setCache({});
  }, [language]);

  // Load scene images for the verses in this mood
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const next: Record<string, string> = {};
      for (const v of mood.verses) {
        const { data } = await supabase
          .from("verses")
          .select("verse_number, surah_number, scenes(image_url, status)")
          .eq("surah_number", v.surah)
          .eq("verse_number", v.verse)
          .maybeSingle();
        if (cancelled) return;
        const scene = Array.isArray((data as any)?.scenes) ? (data as any).scenes[0] : (data as any)?.scenes;
        if (scene?.image_url && scene.status === "ready") {
          next[`${v.surah}:${v.verse}`] = scene.image_url;
        }
      }
      if (!cancelled) setScenes(next);
    })();
    return () => { cancelled = true; };
  }, [mood.id]);

  // Sequenced playback: Arabic → translation → next
  useEffect(() => {
    if (!ayah) return;
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
        <Link to="/animate" className="rounded-full bg-card/60 backdrop-blur p-2 border border-border">
          <ChevronLeft className="h-5 w-5" />
        </Link>
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
        <div className="relative z-10 px-4 pb-2 space-y-2">
          <div
            key={`${current.surah}:${current.verse}`}
            className="fade-in mx-auto max-w-2xl text-center space-y-2 rounded-xl bg-card/85 backdrop-blur-md px-4 py-3 border border-border shadow-lg"
          >
            <p className="arabic text-2xl md:text-3xl leading-snug text-foreground">{ayah.text}</p>
            <p className="text-sm md:text-base font-medium leading-snug text-foreground/90">{translation?.text}</p>
            <Link
              to="/surah/$number"
              params={{ number: String(current.surah) }}
              search={{ verse: current.verse }}
              className="inline-flex items-center gap-1.5 text-xs text-primary/90 hover:text-primary"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Surah {current.surahName} · {current.surah}:{current.verse}
            </Link>
          </div>
          <div className="mx-auto max-w-2xl rounded-lg bg-primary/10 border border-primary/30 px-3 py-2 flex gap-2 items-start">
            <Sparkles className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-foreground/85 leading-snug">
              <span className="font-semibold text-primary">Why this verse: </span>
              {current.reason}
            </p>
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
