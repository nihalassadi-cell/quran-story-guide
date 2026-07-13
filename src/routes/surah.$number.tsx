import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { fetchSurahWithTranslation, ayahAudioUrl, RECITERS, TRANSLATION_LANGUAGES, hasTranslationAudio, type LanguageCode } from "@/lib/quran-api";
import { useLanguage, type LangCode } from "@/lib/language";
import { localizedSurahMeaning } from "@/lib/surah-names.i18n";
import { ChevronLeft, Play, Pause, ChevronRight, Bookmark, BookmarkCheck, Loader2, Volume2, VolumeX, Youtube } from "lucide-react";
import { track } from "@/lib/analytics";
import { toast } from "sonner";
import { addPagesRead, saveCursor, DAILY_TARGET_PAGES, MIN_DWELL_MS } from "@/lib/reading-progress";
import { ContinueSheet } from "@/components/ContinueSheet";


type SurahSearch = { verse?: number; page?: number; micro?: number };

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

const VERSES_PER_PAGE = 3;

// Ayah count for every surah (1..114) — used for global Quran page tracker
const AYAH_COUNTS = [
  7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,
  112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,
  54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,
  14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,
  29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,
  11,8,3,9,5,4,7,3,6,3,5,4,5,6,
];
const SURAH_PAGES = AYAH_COUNTS.map((c) => Math.ceil(c / VERSES_PER_PAGE));
const PAGES_BEFORE: number[] = (() => {
  const arr = [0];
  for (let i = 0; i < SURAH_PAGES.length; i++) arr.push(arr[i] + SURAH_PAGES[i]);
  return arr;
})();
const TOTAL_QURAN_PAGES = PAGES_BEFORE[PAGES_BEFORE.length - 1];

export const Route = createFileRoute("/surah/$number")({
  validateSearch: (search: Record<string, unknown>): SurahSearch => {
    const v = Number(search.verse);
    const p = Number(search.page);
    const m = Number(search.micro);
    return {
      verse: Number.isFinite(v) && v >= 1 ? Math.floor(v) : undefined,
      page: Number.isFinite(p) && p >= 1 ? Math.floor(p) : undefined,
      micro: m === 1 ? 1 : undefined,
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
  const { verse, page, micro } = Route.useSearch();
  const navigate = useNavigate({ from: "/surah/$number" });
  const surahNum = parseInt(number, 10);
  const microMode = micro === 1;
  const [microPagesRead, setMicroPagesRead] = useState(0);
  const [showSheet, setShowSheet] = useState(false);
  const pageStartRef = useRef<number>(Date.now());
  const microStartVerseRef = useRef<number>(verse ?? 1);

  const [data, setData] = useState<Awaited<ReturnType<typeof fetchSurahWithTranslation>> | null>(null);
  const [pageIdx, setPageIdx] = useState<number>((page ?? 1) - 1);
  const [activeVerse, setActiveVerse] = useState<number>(verse ?? 1);
  const [playing, setPlaying] = useState(false);
  const [reciter, setReciter] = useState<string>("ar.alafasy");
  const [globalLang, setGlobalLang] = useLanguage();
  const language: LanguageCode = globalLang as LanguageCode;
  const setLanguage = (l: LanguageCode) => setGlobalLang(l as LangCode);
  const [bookmarked, setBookmarked] = useState(false);
  
  const [voiceoverOn, setVoiceoverOn] = useState(true);
  const [ytOpen, setYtOpen] = useState(false);
  const [flipDir, setFlipDir] = useState<"next" | "prev" | null>(null);
  const [prevPageIdx, setPrevPageIdx] = useState<number | null>(null);
  const [wordIdx, setWordIdx] = useState<number>(-1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load saved reciter from localStorage (language is global via useLanguage)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("noor:settings");
      if (raw) {
        const s = JSON.parse(raw);
        if (s.reciter) setReciter(s.reciter);
      }
    } catch {}
  }, []);

  // Load Surah text + translation
  useEffect(() => {
    setData(null);
    fetchSurahWithTranslation(surahNum, language)
      .then((d) => {
        setData(d);
        track.storyOpened(surahNum, d?.name_en);
        try {
          if (localStorage.getItem("noor:autoplay") === "1") {
            localStorage.removeItem("noor:autoplay");
            setPageIdx(0);
            setActiveVerse(1);
            setPlaying(true);
          }
        } catch {}
      })
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
    if (playing) return;
    if (!pageAyahs.find((a) => a.numberInSurah === activeVerse)) {
      setActiveVerse(pageAyahs[0].numberInSurah);
    }
  }, [activeVerse, pageIdx, pages, playing]);

  const turnToPage = useCallback((nextIdx: number, dir: "next" | "prev", verseToPlay?: number) => {
    if (!pages[nextIdx] || nextIdx === pageIdx || flipDir) return;
    setPrevPageIdx(pageIdx);
    setFlipDir(dir);
    setPageIdx(nextIdx);
    setActiveVerse(verseToPlay ?? pages[nextIdx][0].numberInSurah);
  }, [flipDir, pageIdx, pages]);

  // Bookmark check (local-only, no sign-in)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("noor:bookmarks");
      const list: Array<{ surah: number; verse: number }> = raw ? JSON.parse(raw) : [];
      setBookmarked(list.some((b) => b.surah === surahNum && b.verse === activeVerse));
    } catch { setBookmarked(false); }
  }, [surahNum, activeVerse]);

  const ayah = useMemo(() => data?.ayahs.find((a) => a.numberInSurah === activeVerse), [data, activeVerse]);
  const translation = useMemo(
    () => data?.translations.find((t) => t.numberInSurah === activeVerse),
    [data, activeVerse],
  );

  // Sequenced playback + per-word highlight via linear progress
  useEffect(() => {
    if (!ayah) return;
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;

    let cancelled = false;
    const ttsRef: { current: HTMLAudioElement | null } = { current: null };
    const wordCount = (ayah.text.trim().split(/\s+/).length) || 1;
    setWordIdx(playing ? 0 : -1);

    const onTime = () => {
      if (!audio.duration || !isFinite(audio.duration)) return;
      const p = Math.min(0.999, Math.max(0, audio.currentTime / audio.duration));
      setWordIdx(Math.min(wordCount - 1, Math.floor(p * wordCount)));
    };

    const advance = () => {
      if (cancelled || !data) return;
      setWordIdx(-1);
      if (activeVerse >= data.ayahs.length) {
        // End of surah — auto-proceed to next surah if available
        if (surahNum < 114) {
          try { localStorage.setItem("noor:autoplay", "1"); } catch {}
          setPlaying(false);
          toast.success(`Starting Surah ${surahNum + 1}`);
          navigate({ to: "/surah/$number", params: { number: String(surahNum + 1) }, search: { verse: 1, page: 1 } });
        } else {
          setPlaying(false);
          toast.success("You have completed the Quran 🌙");
        }
        return;
      }

      const nextVerse = activeVerse + 1;
      const nextPageIdx = pages.findIndex((pageAyahs) => pageAyahs.some((a) => a.numberInSurah === nextVerse));
      if (nextPageIdx >= 0 && nextPageIdx !== pageIdx) turnToPage(nextPageIdx, "next", nextVerse);
      else setActiveVerse(nextVerse);
    };
    const playTranslationThenAdvance = () => {
      setWordIdx(-1);
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
    audio.ontimeupdate = onTime;
    if (playing) audio.play().catch(() => setPlaying(false));
    else { audio.pause(); setWordIdx(-1); }

    return () => {
      cancelled = true;
      audio.pause();
      audio.ontimeupdate = null;
      if (ttsRef.current) ttsRef.current.pause();
    };
  }, [ayah, reciter, playing, data, activeVerse, translation?.text, voiceoverOn, language, surahNum, pages, pageIdx, turnToPage]);

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

  // Sync URL with current page + verse (preserve micro flag)
  useEffect(() => {
    navigate({ search: (prev) => ({ ...prev, verse: activeVerse, page: pageIdx + 1 }), replace: true });
  }, [activeVerse, pageIdx, navigate]);

  // Reset dwell timer whenever the page changes in micro mode
  useEffect(() => {
    if (microMode) pageStartRef.current = Date.now();
  }, [pageIdx, microMode]);

  // Save cursor + notify when leaving in micro mode
  useEffect(() => {
    return () => {
      if (microMode) {
        void saveCursor(surahNum, activeVerse);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microMode]);

  const goPage = (delta: number) => {
    const next = Math.max(0, Math.min(totalPages - 1, pageIdx + delta));
    if (next === pageIdx) return;

    if (microMode && delta > 0) {
      const dwell = Date.now() - pageStartRef.current;
      if (dwell >= MIN_DWELL_MS) {
        const newCount = microPagesRead + 1;
        setMicroPagesRead(newCount);
        void addPagesRead(1);
        // After hitting the daily target, gate the next turn behind the sheet.
        if (newCount >= DAILY_TARGET_PAGES) {
          setPlaying(false);
          setShowSheet(true);
          return;
        }
      } else {
        const remaining = Math.ceil((MIN_DWELL_MS - dwell) / 1000);
        toast(`Take a breath — ${remaining}s more on this page`, { duration: 1500 });
        return;
      }
    }

    setPlaying(false);
    turnToPage(next, delta > 0 ? "next" : "prev");
  };


  const toggleBookmark = () => {
    try {
      const raw = localStorage.getItem("noor:bookmarks");
      const list: Array<{ surah: number; verse: number; page: number; surahName?: string; ts: number }> =
        raw ? JSON.parse(raw) : [];
      const exists = list.some((b) => b.surah === surahNum && b.verse === activeVerse);
      const next = exists
        ? list.filter((b) => !(b.surah === surahNum && b.verse === activeVerse))
        : [
            { surah: surahNum, verse: activeVerse, page: pageIdx + 1, surahName: data?.name_en ?? `Surah ${surahNum}`, ts: Date.now() },
            ...list,
          ];
      localStorage.setItem("noor:bookmarks", JSON.stringify(next));
      setBookmarked(!exists);
      if (exists) track.bookmarkRemoved(surahNum, activeVerse);
      else track.bookmarkAdded(surahNum, activeVerse);
      toast.success(exists ? "Page bookmark removed" : "Page saved");
      // Saving a page also updates "Continue reading" anchor
      if (!exists && data) {
        localStorage.setItem("noor:lastPage", JSON.stringify({
          surah: surahNum, page: pageIdx + 1, verse: activeVerse,
          surahName: data.name_en ?? `Surah ${surahNum}`,
          ts: Date.now(),
        }));
      }
    } catch {
      toast.error("Could not save bookmark");
    }
  };

  const currentPageAyahs = pages[pageIdx] ?? [];
  const prevPageAyahs = prevPageIdx != null ? (pages[prevPageIdx] ?? []) : [];

  const renderPageContent = (idx: number, ayahs: typeof currentPageAyahs) => {
    const quranPage = PAGES_BEFORE[surahNum - 1] + idx + 1;
    return (
    <>
      <div className="px-4 sm:px-7 pt-4 pb-2 text-center shrink-0">
        {idx === 0 && (
          <div className="mb-3">
            <p className="text-[10px] uppercase tracking-[0.3em] opacity-60">Surah {surahNum}</p>
            <p className="arabic text-3xl sm:text-4xl gold-text leading-tight mt-0.5">{data?.name_ar ?? ""}</p>
            <p className="text-sm sm:text-base font-semibold mt-0.5" style={{ color: "oklch(0.35 0.10 60)" }}>
              {data ? localizedSurahMeaning(surahNum, globalLang, data.name_en ?? "") : ""}
            </p>
            <p className="text-[10px] opacity-60 mt-0.5">{data?.ayahs.length ?? 0} verses</p>
          </div>
        )}
        {idx === 0 && surahNum !== 1 && surahNum !== 9 && (
          <p className="arabic text-xl sm:text-2xl mb-2" style={{ color: "oklch(0.35 0.10 60)" }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        )}
        <div className="flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.25em] opacity-70">
          <span className="page-divider h-px flex-1" />
          <span>Page {idx + 1}/{totalPages} · Quran {quranPage}/{TOTAL_QURAN_PAGES}</span>
          <span className="page-divider h-px flex-1" />
        </div>
      </div>
      <div className="px-4 sm:px-7 pb-12 flex-1 min-h-0 grid content-start gap-2 sm:gap-3">
        {ayahs.map((a) => {
          const tr = data!.translations.find((t) => t.numberInSurah === a.numberInSurah);
          const isActive = a.numberInSurah === activeVerse && idx === pageIdx;
          const words = a.text.split(/\s+/).filter(Boolean);
          return (
            <div
              key={a.numberInSurah}
              onClick={() => { if (idx !== pageIdx) return; setActiveVerse(a.numberInSurah); setPlaying(true); }}
              className={`group cursor-pointer rounded-lg px-2 py-1.5 min-h-0 transition-colors ${isActive ? "bg-amber-500/15 ring-1 ring-amber-600/30" : "hover:bg-amber-500/10"}`}
            >
              <p className="arabic text-right text-[clamp(1.1rem,2.9vh,1.85rem)] leading-[1.95]" dir="rtl">
                <span className="inline-flex items-center justify-center align-middle h-7 w-7 sm:h-8 sm:w-8 mx-1 rounded-full text-[11px] sm:text-xs font-bold verse-num">
                  {a.numberInSurah}
                </span>
                {words.map((w, i) => {
                  const highlight = isActive && playing && i === wordIdx;
                  return (
                    <span key={i} className={highlight ? "word-active" : "word"}>
                      {w}{i < words.length - 1 ? " " : ""}
                    </span>
                  );
                })}
              </p>
              {tr?.text && (
                <p className="ayah-translation text-[clamp(0.68rem,1.45vh,0.9rem)] leading-snug mt-1 italic line-clamp-2">
                  {tr.text}
                </p>
              )}
            </div>
          );
        })}
      </div>
      {/* Per-page bookmark button — visible inside the page */}
      <button
        onClick={(e) => { e.stopPropagation(); if (idx === pageIdx) toggleBookmark(); }}
        className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border shadow-sm bg-white/70 backdrop-blur border-amber-700/30 text-amber-900 hover:bg-amber-100 transition-colors"
        aria-label="Save this page"
      >
        {bookmarked && idx === pageIdx
          ? <><BookmarkCheck className="h-4 w-4 text-amber-700" /> Saved</>
          : <><Bookmark className="h-4 w-4" /> Save page</>}
      </button>
    </>
    );
  };

  return (
    <div className="fixed inset-0 overflow-hidden flex flex-col bg-gradient-to-br from-background via-background to-accent/10">
      {/* Header */}
      <header className="relative z-20 flex items-center justify-between p-3 border-b border-border/50 bg-background/80 backdrop-blur">
        <Link to="/" className="rounded-full bg-card/70 backdrop-blur p-2 border border-border shrink-0">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="text-center min-w-0 flex-1 px-2 hidden sm:block">
          <p className="text-[10px] uppercase tracking-widest text-primary/80 truncate">Surah {surahNum} · {data ? localizedSurahMeaning(surahNum, globalLang, data.name_en ?? "...") : "..."}</p>
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
          <div className="relative w-full max-w-2xl h-full">
            {/* Incoming page (always rendered) */}
            <div
              key={`page-${surahNum}-${pageIdx}`}
              className={`mushaf-page parchment relative w-full rounded-xl overflow-hidden h-full flex flex-col ${flipDir ? "page-rise" : "fade-in"}`}
            >
              {renderPageContent(pageIdx, currentPageAyahs)}
            </div>

            {/* Outgoing page overlay during flip */}
            {flipDir && prevPageIdx != null && (
              <div
                key={`flip-${prevPageIdx}-${flipDir}`}
                className={`mushaf-page parchment page-flip-layer rounded-xl overflow-hidden ${flipDir === "next" ? "page-flip-next" : "page-flip-prev"}`}
                onAnimationEnd={() => { setFlipDir(null); setPrevPageIdx(null); }}
              >
                {renderPageContent(prevPageIdx, prevPageAyahs)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Page-turn controls — RTL Quran: Next page is on the left, Previous on the right */}
      <div className="relative z-20 flex items-center justify-between gap-2 px-3 py-2 bg-background/80 backdrop-blur border-t border-border/50">
        <button
          onClick={() => goPage(1)}
          disabled={pageIdx >= totalPages - 1}
          className="flex items-center gap-1.5 rounded-full bg-card/80 backdrop-blur px-3 py-2 border border-border disabled:opacity-30 text-sm"
        >
          <ChevronLeft className="h-4 w-4" /> Next page
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
          onClick={() => goPage(-1)}
          disabled={pageIdx <= 0}
          className="flex items-center gap-1.5 rounded-full bg-card/80 backdrop-blur px-3 py-2 border border-border disabled:opacity-30 text-sm"
        >
          Prev page <ChevronRight className="h-4 w-4" />
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
        {hasTranslationAudio(language) ? (
          <button
            onClick={() => setVoiceoverOn((v) => !v)}
            title={voiceoverOn ? "Mute translation voiceover" : "Enable translation voiceover"}
            className="rounded bg-card/70 backdrop-blur border border-border p-1.5 shrink-0"
          >
            {voiceoverOn ? <Volume2 className="h-4 w-4 text-primary" /> : <VolumeX className="h-4 w-4 text-muted-foreground" />}
          </button>
        ) : (
          <span
            className="rounded border border-border/60 p-1.5 shrink-0 opacity-40"
            title="Translation audio not available in this language"
          >
            <VolumeX className="h-4 w-4" />
          </span>
        )}
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
            <p className="text-sm font-medium truncate">Surah {data ? localizedSurahMeaning(surahNum, globalLang, data.name_en ?? String(surahNum)) : surahNum} — Mishary Alafasy</p>
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
