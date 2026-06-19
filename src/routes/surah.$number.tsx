import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchSurahWithTranslation, ayahAudioUrl, RECITERS, TRANSLATION_LANGUAGES, type LanguageCode } from "@/lib/quran-api";
import { ChevronLeft, Play, Pause, ChevronRight, ChevronLeft as ChevLeft, Bookmark, BookmarkCheck, Loader2, Volume2, VolumeX, Youtube } from "lucide-react";
import { toast } from "sonner";

type SurahSearch = { verse?: number; page?: number };

const EVERYAYAH_TRANSLATIONS: Record<string, string> = {
  en: "English/Sahih_Intnl_Ibrahim_Walk_192kbps",
  ur: "translations/urdu_shamshad_ali_khan_46kbps",
};
function translationAudioUrl(language: string, surah: number, verse: number): string | null {
  const folder = EVERYAYAH_TRANSLATIONS[language];
  if (!folder) return null;
  const s = String(surah).padStart(3, "0");
  const v = String(verse).padStart(3, "0");
  return `https://everyayah.com/data/${folder}/${s}${v}.mp3`;
}

const VERSES_PER_PAGE = 8;

export const Route = createFileRoute("/surah/$number")({
  validateSearch: (search: Record<string, unknown>): SurahSearch => {
    const v = Number(search.verse);
    const p = Number(search.page);
    return {
      verse: Number.isFinite(v) && v >= 1 ? Math.floor(v) : undefined,
      page: Number.isFinite(p) && p >= 1 ? Math.floor(p) : undefined,
    };
  },
  head: ({ params }) => ({
    meta: [
      { title: `Surah ${params.number} — Noor` },
      { name: "description", content: `Read Surah ${params.number} in a Quran-style book layout with page-turn navigation.` },
    ],
  }),
  component: SurahPlayer,
});

function SurahPlayer() {
  const { number } = Route.useParams();
  const { verse, page } = Route.useSearch();
  const navigate = useNavigate({ from: "/surah/$number" });
  const surahNum = parseInt(number, 10);

  const [data, setData] = useState<Awaited<ReturnType<typeof fetchSurahWithTranslation>> | null>(null);
  const [pageIdx, setPageIdx] = useState<number>((page ?? 1) - 1);
  const [activeVerse, setActiveVerse] = useState<number>(verse ?? 1);
  const [playing, setPlaying] = useState(false);
  const [reciter, setReciter] = useState<string>("ar.alafasy");
  const [language, setLanguage] = useState<LanguageCode>("ur");
  const [bookmarked, setBookmarked] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [voiceoverOn, setVoiceoverOn] = useState(true);
  const [ytOpen, setYtOpen] = useState(false);
  const [flipDir, setFlipDir] = useState<"next" | "prev" | null>(null);
  const [wordIdx, setWordIdx] = useState<number>(-1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auth + saved settings
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (cancelled) return;
        const user = session?.user ?? null;
        setUserId(user?.id ?? null);
        if (user) {
          const { data: s } = await supabase.from("user_settings").select("*").eq("user_id", user.id).maybeSingle();
          if (cancelled || !s) return;
          setReciter(s.reciter);
          setLanguage(s.translation_language as LanguageCode);
        }
      } catch (e) {
        console.warn("auth/settings load failed", e);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Load Surah text + translation
  useEffect(() => {
    setData(null);
    fetchSurahWithTranslation(surahNum, language)
      .then((d) => setData(d))
      .catch((e) => { console.error("[surah] fetch failed", e); toast.error("Failed to load Surah"); });
  }, [surahNum, language]);

  // Pages: chunk ayahs into fixed-size pages
  const pages = useMemo(() => {
    const ayahs = data?.ayahs ?? [];
    const out: typeof ayahs[] = [];
    for (let i = 0; i < ayahs.length; i += VERSES_PER_PAGE) {
      out.push(ayahs.slice(i, i + VERSES_PER_PAGE));
    }
    return out;
  }, [data]);

  const totalPages = pages.length;

  // If a saved verse was passed in search, jump to its page once data loads
  useEffect(() => {
    if (!data || !verse) return;
    const idx = Math.max(0, Math.floor((verse - 1) / VERSES_PER_PAGE));
    setPageIdx(idx);
    setActiveVerse(verse);
  }, [data, verse]);

  // Keep active verse pointing to the first verse of the page when changing pages
  useEffect(() => {
    const pageAyahs = pages[pageIdx];
    if (!pageAyahs || pageAyahs.length === 0) return;
    if (!pageAyahs.find((a) => a.numberInSurah === activeVerse)) {
      setActiveVerse(pageAyahs[0].numberInSurah);
    }
  }, [pageIdx, pages]); // eslint-disable-line react-hooks/exhaustive-deps

  // Bookmark check
  useEffect(() => {
    if (!userId) { setBookmarked(false); return; }
    supabase
      .from("bookmarks")
      .select("id")
      .eq("user_id", userId)
      .eq("surah_number", surahNum)
      .eq("verse_number", activeVerse)
      .maybeSingle()
      .then(({ data }) => setBookmarked(!!data));
  }, [userId, surahNum, activeVerse]);

  const ayah = useMemo(() => data?.ayahs.find((a) => a.numberInSurah === activeVerse), [data, activeVerse]);
  const translation = useMemo(
    () => data?.translations.find((t) => t.numberInSurah === activeVerse),
    [data, activeVerse],
  );

  // Sequenced playback
  useEffect(() => {
    if (!ayah) return;
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;

    let cancelled = false;
    const ttsRef: { current: HTMLAudioElement | null } = { current: null };

    const advance = () => {
      if (cancelled || !data) return;
      if (activeVerse < data.ayahs.length) setActiveVerse((v) => v + 1);
      else setPlaying(false);
    };
    const playTranslationThenAdvance = () => {
      if (!voiceoverOn || !translation?.text) { advance(); return; }
      const url = translationAudioUrl(language, surahNum, activeVerse);
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
  }, [ayah, reciter, playing, data, activeVerse, translation?.text, voiceoverOn, language, surahNum]);

  // Auto-advance page when active verse moves out of current page during playback
  useEffect(() => {
    const pageAyahs = pages[pageIdx];
    if (!pageAyahs || !pageAyahs.length) return;
    const last = pageAyahs[pageAyahs.length - 1].numberInSurah;
    if (activeVerse > last && pageIdx < totalPages - 1) {
      setFlipDir("next");
      setPageIdx((p) => p + 1);
    }
  }, [activeVerse, pageIdx, pages, totalPages]);

  // Persist last page to localStorage so the home tab can offer "Continue reading"
  useEffect(() => {
    if (!data) return;
    try {
      const payload = {
        surah: surahNum,
        page: pageIdx + 1,
        verse: activeVerse,
        surahName: data.name_en ?? `Surah ${surahNum}`,
        ts: Date.now(),
      };
      localStorage.setItem("noor:lastPage", JSON.stringify(payload));
    } catch {}
  }, [data, surahNum, pageIdx, activeVerse]);

  // Sync URL with current page + verse
  useEffect(() => {
    navigate({ search: { verse: activeVerse, page: pageIdx + 1 }, replace: true });
  }, [activeVerse, pageIdx, navigate]);

  const goPage = (delta: number) => {
    const next = Math.max(0, Math.min(totalPages - 1, pageIdx + delta));
    if (next === pageIdx) return;
    setFlipDir(delta > 0 ? "next" : "prev");
    setPageIdx(next);
  };

  const toggleBookmark = async () => {
    if (!userId) { toast.error("Sign in to save this page"); navigate({ to: "/auth" }); return; }
    if (bookmarked) {
      await supabase.from("bookmarks").delete().eq("user_id", userId).eq("surah_number", surahNum).eq("verse_number", activeVerse);
      setBookmarked(false);
      toast.success("Page bookmark removed");
    } else {
      await supabase.from("bookmarks").insert({ user_id: userId, surah_number: surahNum, verse_number: activeVerse });
      setBookmarked(true);
      toast.success("Page saved");
    }
    // Always update localStorage continue-reading anchor on save action
    if (data) {
      try {
        localStorage.setItem("noor:lastPage", JSON.stringify({
          surah: surahNum, page: pageIdx + 1, verse: activeVerse,
          surahName: data.name_en ?? `Surah ${surahNum}`,
          ts: Date.now(),
        }));
      } catch {}
    }
  };

  const currentPageAyahs = pages[pageIdx] ?? [];

  return (
    <div className="fixed inset-0 overflow-hidden flex flex-col bg-gradient-to-br from-background via-background to-accent/10">
      {/* Header */}
      <header className="relative z-20 flex items-center justify-between p-3 border-b border-border/50 bg-background/80 backdrop-blur">
        <Link to="/" className="rounded-full bg-card/70 backdrop-blur p-2 border border-border shrink-0">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="text-center min-w-0 flex-1 px-2">
          <p className="text-[10px] uppercase tracking-widest text-primary/80 truncate">Surah {surahNum} · {data?.name_en ?? "..."}</p>
          <p className="arabic text-base sm:text-lg gold-text truncate">{data?.name_ar ?? "..."}</p>
        </div>
        <button onClick={toggleBookmark} className="rounded-full bg-card/70 backdrop-blur p-2 border border-border shrink-0" aria-label="Save page">
          {bookmarked ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <Bookmark className="h-5 w-5" />}
        </button>
      </header>

      {/* Book stage */}
      <div className="book-stage relative z-10 flex-1 overflow-hidden flex items-stretch justify-center px-2 sm:px-6 py-3">
        {!data && (
          <div className="absolute inset-0 grid place-items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {data && (
          <div
            key={`${surahNum}-${pageIdx}`}
            className={`mushaf-page parchment relative w-full max-w-2xl rounded-xl overflow-y-auto ${flipDir === "next" ? "page-turn-next" : flipDir === "prev" ? "page-turn-prev" : "fade-in"}`}
            onAnimationEnd={() => setFlipDir(null)}
          >
            {/* Page header — show Bismillah only on page 1 (and only if not Surah 1 or 9) */}
            <div className="px-5 sm:px-8 pt-5 pb-3 text-center">
              {pageIdx === 0 && surahNum !== 1 && surahNum !== 9 && (
                <p className="arabic text-xl sm:text-2xl mb-2" style={{ color: "oklch(0.35 0.10 60)" }}>
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              )}
              <div className="flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.25em] opacity-70">
                <span className="page-divider h-px flex-1" />
                <span>Page {pageIdx + 1} of {totalPages}</span>
                <span className="page-divider h-px flex-1" />
              </div>
            </div>

            {/* Verses */}
            <div className="px-5 sm:px-8 pb-24 space-y-5">
              {currentPageAyahs.map((a) => {
                const tr = data.translations.find((t) => t.numberInSurah === a.numberInSurah);
                const isActive = a.numberInSurah === activeVerse;
                return (
                  <div
                    key={a.numberInSurah}
                    onClick={() => { setActiveVerse(a.numberInSurah); setPlaying(true); }}
                    className={`group cursor-pointer rounded-lg px-2 py-2 transition-colors ${isActive ? "bg-amber-500/15 ring-1 ring-amber-600/30" : "hover:bg-amber-500/10"}`}
                  >
                    <p className="arabic text-right text-2xl sm:text-3xl leading-[2.4] tracking-wide" dir="rtl">
                      <span className="inline-flex items-center justify-center align-middle h-7 w-7 sm:h-8 sm:w-8 mx-1 rounded-full text-[11px] sm:text-xs font-bold verse-num">
                        {a.numberInSurah}
                      </span>
                      {a.text}
                    </p>
                    {tr?.text && (
                      <p className="ayah-translation text-xs sm:text-sm leading-relaxed mt-1.5 italic">
                        {tr.text}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Page-turn controls */}
      <div className="relative z-20 flex items-center justify-between gap-2 px-3 py-2 bg-background/80 backdrop-blur border-t border-border/50">
        <button
          onClick={() => goPage(-1)}
          disabled={pageIdx <= 0}
          className="flex items-center gap-1.5 rounded-full bg-card/80 backdrop-blur px-3 py-2 border border-border disabled:opacity-30 text-sm"
        >
          <ChevLeft className="h-4 w-4" /> Prev
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPlaying((p) => !p)}
            className="rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground p-3 glow-shadow"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </button>
        </div>

        <button
          onClick={() => goPage(1)}
          disabled={pageIdx >= totalPages - 1}
          className="flex items-center gap-1.5 rounded-full bg-card/80 backdrop-blur px-3 py-2 border border-border disabled:opacity-30 text-sm"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Secondary controls */}
      <div className="relative z-20 flex items-center gap-2 px-3 pb-3 pt-1 bg-background/80 backdrop-blur">
        <span className="text-[10px] text-muted-foreground shrink-0">V {activeVerse}/{data?.ayahs.length ?? 0}</span>
        <select
          value={reciter}
          onChange={(e) => setReciter(e.target.value)}
          className="flex-1 min-w-0 bg-card/70 backdrop-blur border border-border rounded px-2 py-1 text-[11px]"
        >
          {RECITERS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as LanguageCode)}
          className="flex-1 min-w-0 bg-card/70 backdrop-blur border border-border rounded px-2 py-1 text-[11px]"
        >
          {TRANSLATION_LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
        </select>
        <button
          onClick={() => setVoiceoverOn((v) => !v)}
          title={voiceoverOn ? "Mute voiceover" : "Enable voiceover"}
          className="rounded bg-card/70 backdrop-blur border border-border p-1.5 shrink-0"
        >
          {voiceoverOn ? <Volume2 className="h-4 w-4 text-primary" /> : <VolumeX className="h-4 w-4 text-muted-foreground" />}
        </button>
        <button
          onClick={() => setYtOpen(true)}
          title="Watch full surah"
          className="rounded bg-card/70 backdrop-blur border border-border p-1.5 shrink-0"
        >
          <Youtube className="h-4 w-4 text-red-500" />
        </button>
      </div>

      {ytOpen && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-border bg-background">
            <p className="text-sm font-medium truncate">Surah {data?.name_en ?? surahNum} — Mishary Alafasy</p>
            <button onClick={() => setYtOpen(false)} className="rounded-full bg-card border border-border px-3 py-1 text-xs shrink-0">Close</button>
          </div>
          <div className="flex-1 w-full">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/videoseries?list=PLOtPOkjqhbM3VfTZ8KV6WWSuTtUKB8rFr&index=${surahNum}&autoplay=1`}
              title={`Surah ${surahNum} — full recitation`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
