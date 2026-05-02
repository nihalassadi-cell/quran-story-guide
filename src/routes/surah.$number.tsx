import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchSurahWithTranslation, ayahAudioUrl, RECITERS, TRANSLATION_LANGUAGES, type LanguageCode } from "@/lib/quran-api";
import { ChevronLeft, Play, Pause, SkipBack, SkipForward, Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
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
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [bookmarked, setBookmarked] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  // Load scene images for this Surah from DB
  useEffect(() => {
    (async () => {
      const { data: verses } = await supabase
        .from("verses")
        .select("verse_number, scenes(image_url, status)")
        .eq("surah_number", surahNum);
      if (!verses) return;
      const map: Record<number, string> = {};
      for (const v of verses as any[]) {
        const scene = Array.isArray(v.scenes) ? v.scenes[0] : v.scenes;
        if (scene?.image_url && scene.status === "ready") map[v.verse_number] = scene.image_url;
      }
      setScenes(map);
    })();
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

  // Audio control
  useEffect(() => {
    if (!ayah) return;
    if (!audioRef.current) audioRef.current = new Audio();
    audioRef.current.src = ayahAudioUrl(ayah.number, reciter);
    audioRef.current.onended = () => {
      if (data && currentVerse < data.ayahs.length) {
        setCurrentVerse((v: number) => v + 1);
      } else {
        setPlaying(false);
      }
    };
    if (playing) audioRef.current.play().catch(() => setPlaying(false));
    else audioRef.current.pause();
    return () => { audioRef.current?.pause(); };
  }, [ayah, reciter, playing, data, currentVerse]);

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
      {/* Background scene */}
      <div className="absolute inset-0">
        {sceneUrl ? (
          <img src={sceneUrl} alt="" className="w-full h-full object-cover ken-burns" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-card via-background to-accent/20" />
        )}
        {/* Stronger darkening for subtitle legibility */}
        <div className="absolute inset-0 bg-background/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/30 to-background/95" />
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

      {/* Verse content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        {!data && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
        {ayah && (
          <div key={currentVerse} className="fade-in space-y-6 max-w-md">
            <p className="arabic text-3xl leading-loose text-foreground">{ayah.text}</p>
            <div className="h-px w-24 mx-auto bg-primary/40" />
            <p className="text-base text-muted-foreground leading-relaxed">{translation?.text}</p>
          </div>
        )}
      </div>

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
            onClick={() => setPlaying((p) => !p)}
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
