import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchSurahWithTranslation, ayahAudioUrl, RECITERS, TRANSLATION_LANGUAGES, type LanguageCode } from "@/lib/quran-api";
import { ChevronLeft, Play, Pause, SkipBack, SkipForward, Bookmark, BookmarkCheck, Loader2, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
type SurahSearch = { verse?: number };

export const Route = createFileRoute("/surah/$number")({
  validateSearch: (search: Record<string, unknown>): SurahSearch => {
    const v = Number(search.verse);
    return { verse: Number.isFinite(v) && v >= 1 ? Math.floor(v) : undefined };
  },
  head: ({ params }) => ({
    meta: [
      { title: `Surah ${params.number} — Noor` },
      { name: "description", content: `Animated recitation of Surah ${params.number} with translation.` },
    ],
  }),
  component: SurahPlayer,
});

function SurahPlayer() {
  const { number } = Route.useParams();
  const { verse } = Route.useSearch();
  const navigate = useNavigate({ from: "/surah/$number" });
  const surahNum = parseInt(number, 10);

  const [data, setData] = useState<Awaited<ReturnType<typeof fetchSurahWithTranslation>> | null>(null);
  const [scenes, setScenes] = useState<Record<number, string>>({});
  const [currentVerse, setCurrentVerse] = useState<number>(verse ?? 1);
  const [playing, setPlaying] = useState(false);
  const [reciter, setReciter] = useState<string>("ar.alafasy");
  const [language, setLanguage] = useState<LanguageCode>("ur");
  const [bookmarked, setBookmarked] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [voiceoverOn, setVoiceoverOn] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [ttsVoicesReady, setTtsVoicesReady] = useState(false);

  // Map translation LanguageCode to BCP47 for SpeechSynthesis
  const ttsLang = useMemo(() => {
    const map: Record<string, string> = { en: "en-US", ur: "ur", id: "id-ID", tr: "tr-TR" };
    return map[language] ?? "en-US";
  }, [language]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    const markReady = () => setTtsVoicesReady(synth.getVoices().length > 0);
    markReady();
    synth.addEventListener("voiceschanged", markReady);
    return () => synth.removeEventListener("voiceschanged", markReady);
  }, []);

  // Load user settings + auth (non-blocking — never await before fetching Surah)
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
    console.log("[surah] fetching", surahNum, language);
    fetchSurahWithTranslation(surahNum, language)
      .then((d) => { console.log("[surah] loaded", d.ayahs.length, "ayahs"); setData(d); })
      .catch((e) => { console.error("[surah] fetch failed", e); toast.error("Failed to load Surah"); });
  }, [surahNum, language]);

  // Load scene images for this Surah from DB + subscribe to realtime updates,
  // and kick off background generation if anything is missing.
  useEffect(() => {
    let verseIdToNumber = new Map<string, number>();
    let cancelled = false;

    const load = async () => {
      const { data: verses } = await supabase
        .from("verses")
        .select("id, verse_number, scenes(image_url, status)")
        .eq("surah_number", surahNum);
      if (!verses || cancelled) return;
      const map: Record<number, string> = {};
      let missing = 0;
      for (const v of verses as any[]) {
        verseIdToNumber.set(v.id, v.verse_number);
        const scene = Array.isArray(v.scenes) ? v.scenes[0] : v.scenes;
        if (scene?.image_url && scene.status === "ready") map[v.verse_number] = scene.image_url;
        else missing++;
      }
      setScenes(map);

      // Kick off background generation if anything's missing — fire and forget,
      // realtime will stream new images in as they become available.
      if (missing > 0) {
        const loop = async () => {
          for (let i = 0; i < 50 && !cancelled; i++) {
            const { data, error } = await supabase.functions.invoke("generate-surah", {
              body: { surahNumber: surahNum, batchSize: 12, concurrency: 6 },
            });
            if (error || !data) break;
            if ((data as any).done) break;
            if (((data as any).processed ?? []).length === 0) break;
          }
        };
        loop();
      }
    };
    load();

    const channel = supabase
      .channel(`scenes-surah-${surahNum}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "scenes" },
        (payload: any) => {
          const row = payload.new ?? payload.old;
          if (!row) return;
          const num = verseIdToNumber.get(row.verse_id);
          if (!num) return;
          if (row.status === "ready" && row.image_url) {
            setScenes((prev) => ({ ...prev, [num]: row.image_url }));
          }
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [surahNum]);

  // Check bookmark
  useEffect(() => {
    if (!userId) { setBookmarked(false); return; }
    supabase
      .from("bookmarks")
      .select("id")
      .eq("user_id", userId)
      .eq("surah_number", surahNum)
      .eq("verse_number", currentVerse)
      .maybeSingle()
      .then(({ data }) => setBookmarked(!!data));
  }, [userId, surahNum, currentVerse]);

  const ayah = useMemo(() => data?.ayahs.find((a) => a.numberInSurah === currentVerse), [data, currentVerse]);
  const translation = useMemo(
    () => data?.translations.find((t) => t.numberInSurah === currentVerse),
    [data, currentVerse],
  );

  // Sequenced playback: Arabic recitation → translation voiceover → next verse (Arabic again)
  useEffect(() => {
    if (!ayah) return;
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;

    // Cancel any in-flight TTS whenever verse/settings change
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    const playTranslationThenAdvance = () => {
      const advance = () => {
        if (data && currentVerse < data.ayahs.length) {
          setCurrentVerse((v: number) => v + 1);
        } else {
          setPlaying(false);
        }
      };
      if (!voiceoverOn || !translation?.text || typeof window === "undefined" || !("speechSynthesis" in window)) {
        advance();
        return;
      }
      const utter = new SpeechSynthesisUtterance(translation.text);
      utter.lang = ttsLang;
      utter.rate = 0.95;
      utter.pitch = 1;

      const voices = window.speechSynthesis.getVoices();
      const langPrefix = ttsLang.split("-")[0].toLowerCase();
      const match = voices.find((v) => v.lang.toLowerCase() === ttsLang.toLowerCase())
        || voices.find((v) => v.lang.toLowerCase().startsWith(`${langPrefix}-`))
        || voices.find((v) => v.lang.toLowerCase() === langPrefix)
        || voices.find((v) => v.name.toLowerCase().includes("urdu"));

      if (match) utter.voice = match;
      utter.onend = advance;
      utter.onerror = advance;

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);

      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    };

    audio.src = ayahAudioUrl(ayah.number, reciter);
    audio.onended = playTranslationThenAdvance;

    if (playing) audio.play().catch(() => setPlaying(false));
    else audio.pause();

    return () => {
      audio.pause();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [ayah, reciter, playing, data, currentVerse, translation?.text, voiceoverOn, ttsLang, ttsVoicesReady]);

  // Sync URL with current verse
  useEffect(() => {
    navigate({ search: { verse: currentVerse }, replace: true });
  }, [currentVerse, navigate]);

  const total = data?.ayahs.length ?? 0;
  const sceneUrl = scenes[currentVerse];

  const toggleBookmark = async () => {
    if (!userId) { toast.error("Sign in to save verses"); navigate({ to: "/auth" }); return; }
    if (bookmarked) {
      await supabase.from("bookmarks").delete().eq("user_id", userId).eq("surah_number", surahNum).eq("verse_number", currentVerse);
      setBookmarked(false);
      toast.success("Bookmark removed");
    } else {
      await supabase.from("bookmarks").insert({ user_id: userId, surah_number: surahNum, verse_number: currentVerse });
      setBookmarked(true);
      toast.success("Verse bookmarked");
    }
  };

  return (
    <div className="fixed inset-0 bg-background overflow-hidden flex flex-col">
      {/* Background scene with cinematic Ken Burns + crossfade */}
      <div className="absolute inset-0">
        {sceneUrl ? (
          <img
            key={sceneUrl}
            src={sceneUrl}
            alt=""
            className={`w-full h-full object-cover scene-fade kb-${(currentVerse % 4) + 1}`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-card via-background to-accent/20" />
        )}
        {/* Drifting light motes for atmospheric depth */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="particle absolute rounded-full bg-primary/40 blur-sm"
              style={{
                width: `${4 + (i % 3) * 3}px`,
                height: `${4 + (i % 3) * 3}px`,
                left: `${(i * 13 + 7) % 100}%`,
                top: `${(i * 19 + 11) % 100}%`,
                animationDelay: `${i * 1.7}s`,
                animationDuration: `${10 + (i % 4) * 3}s`,
              }}
            />
          ))}
        </div>
        {/* Light vignette only — keep imagery visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/85" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4">
        <Link to="/" className="rounded-full bg-card/60 backdrop-blur p-2 border border-border">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-primary/80">Surah {surahNum}</p>
          <p className="arabic text-lg gold-text">{data?.name_ar ?? "..."}</p>
        </div>
        <button onClick={toggleBookmark} className="rounded-full bg-card/60 backdrop-blur p-2 border border-border">
          {bookmarked ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <Bookmark className="h-5 w-5" />}
        </button>
      </header>

      {/* Spacer — let the artwork breathe */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        {!data && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
      </div>

      {/* Subtitle bar — anchored near the bottom, compact, film-style */}
      {ayah && (
        <div className="relative z-10 px-4 pb-2">
          <div
            key={currentVerse}
            className="fade-in mx-auto max-w-2xl text-center space-y-1.5 rounded-xl bg-card/85 backdrop-blur-md px-4 py-2.5 border border-border shadow-lg"
          >
            <p className="arabic text-2xl md:text-3xl leading-snug text-foreground">
              {ayah.text}
            </p>
            <p className="text-sm md:text-base font-medium leading-snug text-foreground/90">
              {translation?.text}
            </p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="relative z-10 p-5 pb-8 space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Verse {currentVerse} of {total}</span>
          <select
            value={reciter}
            onChange={(e) => setReciter(e.target.value)}
            className="bg-card/70 backdrop-blur border border-border rounded px-2 py-1 text-xs"
          >
            {RECITERS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <div className="h-1 bg-card/60 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all" style={{ width: total ? `${(currentVerse / total) * 100}%` : 0 }} />
        </div>
        <div className="flex items-center justify-center gap-6">
          <button
            disabled={currentVerse <= 1}
            onClick={() => setCurrentVerse((v: number) => Math.max(1, v - 1))}
            className="rounded-full bg-card/70 backdrop-blur p-3 border border-border disabled:opacity-30"
          >
            <SkipBack className="h-5 w-5" />
          </button>
          <button
            onClick={() => {
              // iOS Safari requires speechSynthesis to be invoked inside a user
              // gesture at least once per session. Speak an empty utterance now
              // to "unlock" it so later voiceovers (fired from audio.onended)
              // are allowed to play.
              if (typeof window !== "undefined" && "speechSynthesis" in window) {
                try {
                  const unlock = new SpeechSynthesisUtterance("");
                  unlock.volume = 0;
                  window.speechSynthesis.speak(unlock);
                } catch {}
              }
              setPlaying((p) => !p);
            }}
            className="rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground p-5 glow-shadow"
          >
            {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
          </button>
          <button
            disabled={currentVerse >= total}
            onClick={() => setCurrentVerse((v: number) => Math.min(total, v + 1))}
            className="rounded-full bg-card/70 backdrop-blur p-3 border border-border disabled:opacity-30"
          >
            <SkipForward className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            className="flex-1 bg-card/70 backdrop-blur border border-border rounded px-2 py-1 text-xs text-center"
          >
            {TRANSLATION_LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
          <button
            onClick={() => setVoiceoverOn((v) => !v)}
            title={voiceoverOn ? "Mute AI voiceover" : "Enable AI voiceover"}
            className="rounded bg-card/70 backdrop-blur border border-border p-1.5"
          >
            {voiceoverOn ? <Volume2 className="h-4 w-4 text-primary" /> : <VolumeX className="h-4 w-4 text-muted-foreground" />}
          </button>
        </div>
      </div>
    </div>
  );
}
