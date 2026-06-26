import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ChevronLeft, Play, Pause, RotateCcw, BookOpen, Sparkles, ChevronDown, ChevronUp, Loader2, SkipBack, SkipForward, Music, VolumeX, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchSurahWithTranslation, ayahAudioUrl, RECITERS, type LanguageCode } from "@/lib/quran-api";
import { getMood } from "@/lib/moods";
import { getKalimaAudio } from "@/lib/kalima-tts.functions";
import { createAmbientPad } from "@/lib/ambient-pad";
import { track } from "@/lib/analytics";
import { shareContent } from "@/lib/share";
import { useLanguage, tr, isRtl } from "@/lib/language";
import { toast } from "sonner";

export const Route = createFileRoute("/mood/$id")({
  head: ({ params }) => {
    const m = getMood(params.id);
    return {
      meta: [
        { title: `${m?.label ?? "Mood"} — Noor` },
        { name: "description", content: tr(m?.blurb, "en") || "A short remembrance for how you're feeling." },
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
  const [lang] = useLanguage();
  const rtl = isRtl(lang);

  // Track mood selection once per mount
  useEffect(() => {
    track.moodSelected(mood.id, mood.label);
  }, [mood.id, mood.label]);

  // Selected kalima (user can switch between options)
  const [kalimaIdx, setKalimaIdx] = useState(0);
  const kalima = mood.kalimas[kalimaIdx] ?? mood.kalima;

  // Tasbih state
  const [count, setCount] = useState(0);
  const [auto, setAuto] = useState(false);
  const [pulse, setPulse] = useState(false);
  const target = kalima.repeat;
  const progress = Math.min(1, count / target);

  // Audio element used for both kalima and verse playback. Created up here so
  // the kalima recital can use the same studio audio as the surah pages.
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [reciter, setReciter] = useState<string>("ar.alafasy");
  const [language] = useState<LanguageCode>("en");
  const [cache, setCache] = useState<AyahCache>({});
  // When the user taps recite before the surah audio URL is ready, queue it.
  const pendingPlayRef = useRef(false);

  // Resolve the global ayah number for the current kalima (when it's a verse).
  const kalimaSurah = kalima.ayah ? cache[kalima.ayah.surah] : undefined;
  const kalimaAyah = kalima.ayah && kalimaSurah?.ayahs.find((a) => a.numberInSurah === kalima.ayah!.verse);
  const kalimaAudioUrl = kalimaAyah ? ayahAudioUrl(kalimaAyah.number, reciter) : null;

  const playKalimaAudio = (url: string) => {
    if (!audioRef.current) audioRef.current = new Audio();
    const a = audioRef.current;
    a.onended = null;
    a.src = url;
    a.play().catch((e) => console.warn("[mood] audio play failed", e));
  };

  // Recite the kalima. If we have a Qur'anic ayah for it, play the same
  // studio recital used in the surah pages. If the surah hasn't loaded yet,
  // queue the play. Only fall back to speech-synthesis for hadith-only dhikr
  // (no ayah configured).
  const reciteKalima = () => {
    try {
      try { window.speechSynthesis?.cancel(); } catch {}
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }

      // Create the Audio element synchronously inside the user gesture so
      // mobile browsers allow later play() once the URL resolves.
      if (!audioRef.current) audioRef.current = new Audio();

      if (kalima.ayah) {
        if (kalimaAudioUrl) {
          playKalimaAudio(kalimaAudioUrl);
        } else {
          pendingPlayRef.current = true;
        }
        return;
      }

      const synth = window.speechSynthesis;
      if (!synth) return;
      const u = new SpeechSynthesisUtterance(kalima.arabic);
      u.lang = "ar-SA";
      u.rate = 0.85;
      const voices = synth.getVoices();
      const arVoice = voices.find((v) => v.lang?.toLowerCase().startsWith("ar"));
      if (arVoice) u.voice = arVoice;
      synth.speak(u);
    } catch (e) {
      console.warn("[mood] recite failed", e);
    }
  };
  const speakKalima = reciteKalima;

  // Prefetch the surah for the current kalima so audio is ready
  useEffect(() => {
    if (!kalima.ayah) return;
    const s = kalima.ayah.surah;
    if (cache[s]) return;
    fetchSurahWithTranslation(s, language)
      .then((d) => setCache((c) => ({ ...c, [s]: d })))
      .catch((e) => console.error("[mood] kalima surah fetch failed", e));
  }, [kalima.ayah, language, cache]);

  // When the surah audio URL becomes available after a tap, fulfill the queued play.
  useEffect(() => {
    if (pendingPlayRef.current && kalimaAudioUrl) {
      pendingPlayRef.current = false;
      playKalimaAudio(kalimaAudioUrl);
    }
  }, [kalimaAudioUrl]);

  // Clear any queued play when switching kalima
  useEffect(() => {
    pendingPlayRef.current = false;
  }, [kalimaIdx]);

  // Auto loop — pulse + recite every 3s
  useEffect(() => {
    if (!auto) return;
    const tick = () => {
      setPulse(true);
      speakKalima();
      setCount((c) => {
        const next = c + 1;
        if (next >= target) {
          setAuto(false);
          toast.success(`Completed ${target}× — barakAllāhu fīk 🌙`);
        }
        return next;
      });
      window.setTimeout(() => setPulse(false), 600);
    };
    tick();
    const iv = window.setInterval(tick, 3000);
    return () => window.clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, target]);

  const tap = () => {
    speakKalima();
    setPulse(true);
    setCount((c) => {
      const next = c + 1;
      if (next === target) toast.success(`Completed ${target}× — barakAllāhu fīk 🌙`);
      return next;
    });
    window.setTimeout(() => setPulse(false), 350);
  };

  const reset = () => {
    setCount(0);
    setAuto(false);
    try { window.speechSynthesis?.cancel(); } catch {}
  };

  // Prime voices list (some browsers load voices async)
  useEffect(() => {
    try {
      window.speechSynthesis?.getVoices();
      const handler = () => window.speechSynthesis?.getVoices();
      window.speechSynthesis?.addEventListener?.("voiceschanged", handler);
      return () => window.speechSynthesis?.removeEventListener?.("voiceschanged", handler);
    } catch { /* ignore */ }
  }, []);

  // Calming ambient background music — auto-starts on first user interaction,
  // can be toggled, and stops on unmount. Persisted preference.
  const padRef = useRef<ReturnType<typeof createAmbientPad> | null>(null);
  const [ambientOn, setAmbientOn] = useState<boolean>(() => {
    try { return localStorage.getItem("noor:ambient") !== "0"; } catch { return true; }
  });
  useEffect(() => {
    if (!padRef.current) padRef.current = createAmbientPad();
    return () => { padRef.current?.stop(); };
  }, []);
  // Persist toggle. Do NOT call start() here — on iOS, AudioContext must be
  // created inside a real user gesture or it stays suspended forever.
  useEffect(() => {
    try { localStorage.setItem("noor:ambient", ambientOn ? "1" : "0"); } catch {}
    if (!padRef.current) return;
    if (ambientOn) padRef.current.start().catch(() => {});
    else padRef.current.stop();
  }, [ambientOn]);
  const startAmbient = () => {
    if (!ambientOn) return;
    padRef.current?.start().catch(() => {});
  };



  // Optional verse player (opens when user expands a verse)
  const [versesOpen, setVersesOpen] = useState(false);
  const [playerIdx, setPlayerIdx] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [scenes, setScenes] = useState<Record<string, string>>({});

  const playerVerse = playerIdx != null ? mood.verses[playerIdx] : null;
  const surahData = playerVerse ? cache[playerVerse.surah] : undefined;
  const ayah = surahData?.ayahs.find((a) => a.numberInSurah === playerVerse?.verse);
  const translation = surahData?.translations.find((t) => t.numberInSurah === playerVerse?.verse);

  // Prefetch surahs only when the verses section is opened
  useEffect(() => {
    if (!versesOpen) return;
    const unique = Array.from(new Set(mood.verses.map((v) => v.surah))).filter((n) => !cache[n]);
    unique.forEach((n) => {
      fetchSurahWithTranslation(n, language)
        .then((d) => setCache((c) => ({ ...c, [n]: d })))
        .catch((e) => { console.error("[mood] fetch failed", n, e); });
    });
  }, [versesOpen, language, mood.verses, cache]);

  // Load scene images for verses (lazy — when opened)
  useEffect(() => {
    if (!versesOpen) return;
    let cancelled = false;
    (async () => {
      const next: Record<string, string> = {};
      for (const v of mood.verses) {
        const { data } = await supabase
          .from("verses")
          .select("id, scenes(image_url, status)")
          .eq("surah_number", v.surah)
          .eq("verse_number", v.verse)
          .maybeSingle();
        if (cancelled) return;
        const row: any = data;
        const scene = Array.isArray(row?.scenes) ? row.scenes[0] : row?.scenes;
        if (scene?.image_url && scene.status === "ready") {
          next[`${v.surah}:${v.verse}`] = scene.image_url;
        }
      }
      if (!cancelled) setScenes((prev) => ({ ...prev, ...next }));
    })();
    return () => { cancelled = true; };
  }, [versesOpen, mood.verses]);

  // Verse playback
  useEffect(() => {
    if (playerIdx == null || !ayah) return;
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;
    let cancelled = false;
    const advance = () => {
      if (cancelled) return;
      if (playerIdx < mood.verses.length - 1) setPlayerIdx(playerIdx + 1);
      else setPlaying(false);
    };
    audio.src = ayahAudioUrl(ayah.number, reciter);
    audio.onended = advance;
    if (playing) audio.play().catch(() => setPlaying(false));
    else audio.pause();
    return () => { cancelled = true; audio.pause(); };
  }, [ayah, reciter, playing, playerIdx, mood.verses.length]);

  // Vibrate on tap (mobile, harmless if unsupported)
  const tapWithBuzz = () => {
    try { (navigator as any).vibrate?.(15); } catch {}
    startAmbient();
    tap();
  };

  // ===== Render: full-screen verse player overlay =====
  if (playerIdx != null && playerVerse) {
    const sceneUrl = scenes[`${playerVerse.surah}:${playerVerse.verse}`];
    const total = mood.verses.length;
    return (
      <div className="fixed inset-0 bg-background overflow-hidden flex flex-col">
        <div className="absolute inset-0">
          {sceneUrl ? (
            <img src={sceneUrl} alt="" className={`w-full h-full object-cover scene-fade kb-${(playerIdx % 4) + 1}`} />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-card via-background to-accent/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background/95" />
        </div>

        <header className="relative z-10 flex items-center justify-between px-4 pb-4 pt-[calc(env(safe-area-inset-top)+1rem)]">
          <button onClick={() => { setPlayerIdx(null); setPlaying(false); }} className="rounded-full bg-card/60 backdrop-blur p-2 border border-border">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <p className="text-sm font-semibold gold-text">{mood.emoji} {mood.label}</p>
          <div className="w-9" />
        </header>

        <div className="relative z-10 flex-1 flex items-center justify-center px-4">
          {!ayah && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
        </div>

        {ayah && (
          <div className="relative z-10 px-3 pb-2 space-y-1.5">
            <div className="mx-auto max-w-2xl flex items-center justify-between gap-2 text-[10px] uppercase tracking-wider">
              <Link
                to="/surah/$number"
                params={{ number: String(playerVerse.surah) }}
                search={{ verse: playerVerse.verse }}
                className="inline-flex items-center gap-1 text-primary/90 bg-background/40 backdrop-blur px-2 py-0.5 rounded-full border border-border/60"
              >
                <BookOpen className="h-3 w-3" />
                {playerVerse.surahName} · {playerVerse.surah}:{playerVerse.verse}
              </Link>
              <span className="text-foreground/70">{playerIdx + 1} / {total}</span>
            </div>
            <div key={`${playerVerse.surah}:${playerVerse.verse}`} className="fade-in mx-auto max-w-2xl text-center space-y-1 rounded-lg bg-background/55 backdrop-blur-sm px-3 py-2 border border-border/40">
              <p className="arabic text-lg sm:text-xl md:text-2xl leading-relaxed text-foreground line-clamp-3">{ayah.text}</p>
              <p className="text-[11px] sm:text-xs text-foreground/85 leading-snug line-clamp-4" dir={rtl ? "rtl" : "ltr"}>{translation?.text}</p>
              <p className="text-[10px] text-primary/80 italic mt-1" dir={rtl ? "rtl" : "ltr"}>
                <Sparkles className="inline h-3 w-3 mr-1" />
                {tr(playerVerse.reason, lang)}
              </p>
            </div>
          </div>
        )}

        <div className="relative z-10 p-4 pb-7 space-y-3">
          <div className="h-1 bg-card/60 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all" style={{ width: `${((playerIdx + 1) / total) * 100}%` }} />
          </div>
          <div className="flex items-center justify-center gap-6">
            <button disabled={playerIdx <= 0} onClick={() => setPlayerIdx(Math.max(0, playerIdx - 1))} className="rounded-full bg-card/70 backdrop-blur p-3 border border-border disabled:opacity-30">
              <SkipBack className="h-5 w-5" />
            </button>
            <button onClick={() => setPlaying((p) => !p)} className="rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground p-5 glow-shadow">
              {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
            </button>
            <button disabled={playerIdx >= total - 1} onClick={() => setPlayerIdx(Math.min(total - 1, playerIdx + 1))} className="rounded-full bg-card/70 backdrop-blur p-3 border border-border disabled:opacity-30">
              <SkipForward className="h-5 w-5" />
            </button>
          </div>
          <select value={reciter} onChange={(e) => setReciter(e.target.value)} className="w-full bg-card/70 backdrop-blur border border-border rounded px-2 py-1 text-xs">
            {RECITERS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
      </div>
    );
  }

  // ===== Render: kalima screen =====
  const ringSize = 280;
  const stroke = 8;
  const radius = (ringSize - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Ambient backdrop */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/12 via-background to-accent/12" />
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl kalima-orb-a" />
        <div className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-accent/15 blur-3xl kalima-orb-b" />
        {/* Floating positive particles */}
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="kalima-particle"
            style={{
              left: `${(i * 5.7) % 100}%`,
              animationDelay: `${(i * 0.6) % 9}s`,
              animationDuration: `${9 + (i % 6) * 2}s`,
              fontSize: `${12 + (i % 4) * 5}px`,
            }}
          >
            {["✦", "✧", "❀", "✺", "✿", "★"][i % 6]}
          </span>
        ))}
      </div>

      <div className="relative max-w-2xl mx-auto px-4 pt-[calc(env(safe-area-inset-top)+3.5rem)] pb-28">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <Link to="/animate" className="rounded-full bg-card/60 backdrop-blur p-2 border border-border hover:border-primary/60">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="text-center min-w-0 flex-1 px-2">
            <p className="text-[10px] sm:text-[11px] uppercase tracking-widest text-primary/80 truncate">For when you feel</p>
            <p className="text-base sm:text-lg font-semibold gold-text truncate">{mood.emoji} {mood.label}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                const shareUrl = typeof window !== "undefined" ? window.location.href : undefined;
                shareContent({
                  title: `Noor — ${mood.label}`,
                  text: `${mood.emoji} ${mood.label}\n\n${kalima.arabic}\n${kalima.transliteration}\n"${tr(kalima.translation, lang)}"\n\nRepeat ${kalima.repeat}× — from Noor`,
                  url: shareUrl,
                });
              }}
              title="Share this kalima"
              className="rounded-full bg-card/60 backdrop-blur p-2 border border-border hover:border-primary/60"
            >
              <Share2 className="h-5 w-5 text-primary" />
            </button>
            <button
              onClick={() => setAmbientOn((v) => !v)}
              title={ambientOn ? "Mute ambient music" : "Play ambient music"}
              className="rounded-full bg-card/60 backdrop-blur p-2 border border-border hover:border-primary/60"
            >
              {ambientOn ? <Music className="h-5 w-5 text-primary" /> : <VolumeX className="h-5 w-5 text-muted-foreground" />}
            </button>
          </div>
        </div>

        {/* Kalima picker */}
        {mood.kalimas.length > 1 && (
          <div className="mb-4">
            <p className="text-[10px] uppercase tracking-widest text-primary/70 text-center mb-2">Choose a kalima</p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {mood.kalimas.map((k, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setKalimaIdx(i);
                    setCount(0);
                    setAuto(false);
                    try { window.speechSynthesis?.cancel(); } catch {}
                  }}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    i === kalimaIdx
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card/70 backdrop-blur border-border hover:border-primary/60"
                  }`}
                  title={tr(k.translation, lang)}
                >
                  Kalima {i + 1} · {k.repeat}×
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Why this kalima */}
        <p className="text-xs sm:text-sm text-muted-foreground text-center italic mb-5 leading-relaxed" dir={rtl ? "rtl" : "ltr"}>
          {tr(kalima.why, lang)}
        </p>

        {/* Kalima card */}
        <div key={kalimaIdx} className="rounded-2xl border border-primary/30 bg-card/70 backdrop-blur px-5 py-6 text-center shadow-lg fade-in">
          <p className={`arabic text-[clamp(1.65rem,5.5vw,2.5rem)] leading-[1.7] gold-text break-words ${pulse ? "kalima-glow" : ""}`} dir="rtl">
            {kalima.arabic}
          </p>
          <p className="mt-3 text-xs sm:text-sm text-foreground/90 italic">{kalima.transliteration}</p>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground" dir={rtl ? "rtl" : "ltr"}>“{tr(kalima.translation, lang)}”</p>
          <p className="mt-3 text-[10px] uppercase tracking-widest text-primary/70">{kalima.source}</p>
          {kalima.ayah ? (
            <div className="mt-3 flex items-center justify-center gap-2 text-[11px]">
              <span className="text-muted-foreground">Reciter:</span>
              <select
                value={reciter}
                onChange={(e) => setReciter(e.target.value)}
                className="bg-card/70 backdrop-blur border border-border rounded px-2 py-0.5 text-[11px]"
              >
                {RECITERS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
          ) : (
            <p className="mt-2 text-[10px] text-muted-foreground italic">
              (Hadith dhikr — recited via device voice)
            </p>
          )}
        </div>

        {/* Tasbih counter */}
        <div className="mt-7 flex flex-col items-center">
          <div className="relative" style={{ width: ringSize, height: ringSize, maxWidth: "82vw", maxHeight: "82vw" }}>
            <svg viewBox={`0 0 ${ringSize} ${ringSize}`} className="absolute inset-0 -rotate-90 w-full h-full">
              <circle cx={ringSize / 2} cy={ringSize / 2} r={radius} stroke="currentColor" className="text-border" strokeWidth={stroke} fill="none" />
              <circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                stroke="url(#kalima-grad)"
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                fill="none"
                style={{ transition: "stroke-dashoffset 0.4s ease" }}
              />
              <defs>
                <linearGradient id="kalima-grad" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
                </linearGradient>
              </defs>
            </svg>
            <button
              onClick={tapWithBuzz}
              aria-label="Count one"
              className={`absolute inset-3 rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground glow-shadow flex flex-col items-center justify-center select-none active:scale-[0.97] transition-transform ${pulse ? "kalima-pulse" : ""}`}
            >
              <span className="text-5xl sm:text-6xl font-bold tabular-nums leading-none">{count}</span>
              <span className="text-[11px] uppercase tracking-widest opacity-80 mt-1">of {target}</span>
              <span className="text-[10px] opacity-70 mt-2">tap to count</span>
            </button>
          </div>

          <div className="flex items-center gap-2 mt-5">
            <button
              onClick={() => setAuto((a) => { const next = !a; if (next) startAmbient(); return next; })}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm border transition-colors ${
                auto ? "bg-primary text-primary-foreground border-primary" : "bg-card/70 backdrop-blur border-border hover:border-primary/60"
              }`}
            >
              {auto ? <><Pause className="h-4 w-4" /> Pause auto</> : <><Play className="h-4 w-4" /> Auto-recite</>}
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm bg-card/70 backdrop-blur border border-border hover:border-primary/60"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </div>

          {count >= target && (
            <p className="mt-4 text-sm text-primary text-center fade-in">
              ✨ Completed. <button onClick={reset} className="underline">Begin another round</button>
            </p>
          )}
        </div>

        {/* Supporting verses (collapsible) */}
        <div className="mt-8">
          <button
            onClick={() => setVersesOpen((v) => !v)}
            className="w-full flex items-center justify-between rounded-xl border border-border bg-card/60 backdrop-blur px-4 py-3 hover:border-primary/50"
          >
            <span className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4 text-primary" />
              Verses for this feeling · {mood.verses.length}
            </span>
            {versesOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {versesOpen && (
            <ul className="mt-2 space-y-2 fade-in">
              {mood.verses.map((v, i) => {
                const sd = cache[v.surah];
                const a = sd?.ayahs.find((x) => x.numberInSurah === v.verse);
                return (
                  <li key={`${v.surah}:${v.verse}`}>
                    <button
                      onClick={() => { setPlayerIdx(i); setPlaying(true); }}
                      className="group w-full text-left rounded-xl border border-border bg-card/60 backdrop-blur hover:border-primary/60 hover:bg-card transition-colors flex"
                    >
                      <div className="w-14 sm:w-16 shrink-0 grid place-items-center bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-bold">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div className="flex-1 min-w-0 p-3 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] uppercase tracking-wider text-primary/90">
                            {v.surahName} · {v.surah}:{v.verse}
                          </span>
                          <Play className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {a ? (
                          <p className="arabic text-sm leading-relaxed text-foreground/95 line-clamp-2" dir="rtl">{a.text}</p>
                        ) : (
                          <p className="text-[11px] text-muted-foreground italic">Loading…</p>
                        )}
                        <p className="text-[11px] text-muted-foreground line-clamp-2" dir={rtl ? "rtl" : "ltr"}>{tr(v.reason, lang)}</p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
