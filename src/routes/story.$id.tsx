import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { X, Play, Pause, ChevronLeft, ChevronRight, Volume2, VolumeX, RotateCcw, Film, ImageIcon } from "lucide-react";
import { getStory } from "@/lib/stories";
import { useLanguage, tr } from "@/lib/language";
import { useT } from "@/lib/i18n";
import { speak, prefetchTTS, type Narrator } from "@/lib/narrator";
import { createAmbientPad, type AmbientPad } from "@/lib/ambient-pad";
import { NarrationLangSelect } from "@/components/NarrationLangSelect";
import { getStoryVideoManifest } from "@/lib/story-videos";

export const Route = createFileRoute("/story/$id")({
  loader: ({ params }) => {
    const story = getStory(params.id);
    if (!story) throw notFound();
    return { story };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${tr(loaderData.story.title, "en")} — Noor` },
          { name: "description", content: `An animated Prophet story from Noor.` },
        ]
      : [{ title: "Story — Noor" }, { name: "robots", content: "noindex" }],
  }),
  component: StoryPlayer,
});

// Shared in-memory translation cache — captions and TTS both hit the same
// translation, so we only pay once per (text, lang).
const captionCache = new Map<string, string>();
async function translateCaption(text: string, lang: string): Promise<string> {
  if (lang === "en") return text;
  const key = `${lang}:${text}`;
  const hit = captionCache.get(key);
  if (hit) return hit;
  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, lang }),
    });
    if (!res.ok) return text;
    const json = await res.json() as { text?: string };
    const out = json.text?.trim() || text;
    captionCache.set(key, out);
    return out;
  } catch {
    return text;
  }
}

function StoryPlayer() {
  const { story } = Route.useLoaderData();
  const [lang, setLang] = useLanguage();

  const t = useT();

  const videoManifest = useMemo(() => getStoryVideoManifest(story.id), [story.id]);
  const hasVideo = !!videoManifest;
  const [mode, setMode] = useState<"image" | "video">(hasVideo ? "video" : "image");

  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ended, setEnded] = useState(false);
  const [caption, setCaption] = useState("");

  const scene = story.scenes[idx];
  const total = story.scenes.length;

  const rafRef = useRef<number | null>(null);
  const startedAtRef = useRef<number>(0);
  const narratorRef = useRef<Narrator | null>(null);
  const padRef = useRef<AmbientPad | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Warm the first scene's narration + caption the moment the player mounts,
  // so tapping a story card feels instant instead of waiting on a TTS round
  // trip after we've already navigated in.
  useEffect(() => {
    const first = story.scenes[0];
    if (first) {
      const src = tr(first.narration, "en");
      prefetchTTS(src, lang);
      if (lang !== "en") void translateCaption(src, lang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      narratorRef.current?.stop();
      padRef.current?.stop();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Ambient music follows play state (only in image mode; video has its own atmosphere)
  useEffect(() => {
    if (mode === "image" && playing && !muted) {
      if (!padRef.current) padRef.current = createAmbientPad();
      padRef.current.setVolume(0.14);
      void padRef.current.start();
    } else {
      padRef.current?.stop();
      padRef.current = null;
    }
  }, [playing, muted, mode]);

  // Load caption for the current scene in the selected language
  useEffect(() => {
    let cancelled = false;
    const source = tr(scene.narration, "en");
    const localized = tr(scene.narration, lang);
    // If a hand-written translation exists (differs from en), use it directly.
    if (lang === "en" || (localized && localized !== source)) {
      setCaption(localized || source);
      return;
    }
    // Otherwise translate on the fly.
    setCaption(source);
    translateCaption(source, lang).then((out) => { if (!cancelled) setCaption(out); });
    return () => { cancelled = true; };
  }, [idx, lang, scene.narration]);

  // Prefetch next scene's narration audio while current plays (image mode only)
  useEffect(() => {
    if (mode !== "image") return;
    const next = story.scenes[idx + 1];
    if (next) prefetchTTS(tr(next.narration, "en"), lang);
  }, [idx, lang, story.scenes, mode]);

  // IMAGE MODE: scene ticker + on-demand TTS narration.
  useEffect(() => {
    if (mode !== "image") return;
    if (!playing) return;
    setEnded(false);
    let cancelled = false;
    let started = false;

    const startTick = () => {
      if (started || cancelled) return;
      started = true;
      startedAtRef.current = performance.now();
      const tick = () => {
        const elapsed = performance.now() - startedAtRef.current;
        const p = Math.min(1, elapsed / scene.durationMs);
        setProgress(p);
        if (p >= 1) {
          if (idx < total - 1) setIdx((n) => n + 1);
          else { setPlaying(false); setEnded(true); }
          return;
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    if (!muted) {
      const failsafe = window.setTimeout(startTick, 1500);
      speak(tr(scene.narration, "en"), { lang, volume: 1 })
        .then((n) => {
          if (cancelled) { n.stop(); return; }
          narratorRef.current = n;
          window.clearTimeout(failsafe);
          startTick();
        })
        .catch((e) => {
          console.warn("[story] narration failed", e);
          window.clearTimeout(failsafe);
          startTick();
        });
    } else {
      startTick();
    }

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      narratorRef.current?.stop();
      narratorRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, idx, muted, lang, mode]);

  // VIDEO MODE: sync video + narration audio. Advance on video 'ended'.
  useEffect(() => {
    if (mode !== "video" || !videoManifest) return;
    const v = videoRef.current;
    const a = audioRef.current;
    if (!v) return;
    setEnded(false);
    setProgress(0);

    const audioUrl = videoManifest.narrations[lang]?.[idx] ?? videoManifest.narrations.en?.[idx];
    if (a) {
      a.src = audioUrl ?? "";
      a.muted = muted;
      a.currentTime = 0;
    }
    v.currentTime = 0;
    v.muted = true; // video is silent; audio track is the narration
    v.loop = false;

    const onTime = () => {
      if (!v.duration) return;
      setProgress(Math.min(1, v.currentTime / v.duration));
    };
    const onEnded = () => {
      if (idx < total - 1) setIdx((n) => n + 1);
      else { setPlaying(false); setEnded(true); }
    };
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnded);

    if (playing) {
      v.play().catch(() => {});
      if (a && !muted && audioUrl) a.play().catch(() => {});
    } else {
      v.pause();
      a?.pause();
    }

    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnded);
    };
  }, [mode, idx, lang, playing, muted, videoManifest, total]);

  const go = (delta: number) => {
    const next = Math.max(0, Math.min(total - 1, idx + delta));
    setIdx(next);
    setProgress(0);
    setEnded(false);
  };

  const replay = () => {
    setIdx(0);
    setProgress(0);
    setEnded(false);
    setPlaying(true);
  };

  const kenBurnsClass = useMemo(() => {
    switch (scene.kenBurns) {
      case "in": return "story-kb-in";
      case "out": return "story-kb-out";
      case "panLeft": return "story-kb-panL";
      case "panRight": return "story-kb-panR";
      default: return "story-kb-in";
    }
  }, [scene.kenBurns]);

  return (
    <div className="fixed inset-0 z-[80] bg-black text-white overflow-hidden">
      {/* Image */}
      <div className="absolute inset-0">
        <img
          key={idx}
          src={scene.image}
          alt=""
          className={`w-full h-full object-cover ${kenBurnsClass}`}
          style={{ animationDuration: `${scene.durationMs}ms`, animationPlayState: playing ? "running" : "paused" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85" />
      </div>

      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="absolute block w-1 h-1 rounded-full bg-white/60 story-particle"
            style={{
              left: `${(i * 53) % 100}%`,
              top: `${(i * 37) % 100}%`,
              animationDelay: `${(i % 10) * 0.7}s`,
              animationDuration: `${8 + (i % 5)}s`,
            }}
          />
        ))}
      </div>

      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 pt-[calc(env(safe-area-inset-top)+0.75rem)] px-4 flex items-center gap-2 z-10">
        <Link
          to="/animate"
          search={{ tab: "story" }}
          className="rounded-full bg-black/40 backdrop-blur border border-white/15 p-2 hover:border-white/40"
          title={t("story.close")}
        >
          <X className="h-5 w-5" />
        </Link>
        <div className="flex-1 flex gap-1 items-center">
          {story.scenes.map((_: unknown, i: number) => (
            <span key={i} className="relative flex-1 h-1 rounded-full bg-white/15 overflow-hidden">
              <span
                className="absolute inset-y-0 left-0 bg-white"
                style={{
                  width: i < idx ? "100%" : i === idx ? `${progress * 100}%` : "0%",
                  transition: i === idx ? "none" : "width 200ms linear",
                }}
              />
            </span>
          ))}
        </div>
        <NarrationLangSelect value={lang} onChange={setLang} tone="dark" />
      </div>

      {/* Title */}
      <div className="absolute top-[calc(env(safe-area-inset-top)+3.25rem)] inset-x-0 text-center px-6 z-10">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">
          {idx + 1} / {total}
        </p>
        <h1 className="font-display-serif italic text-2xl mt-1 text-white/95">
          {tr(story.title, lang)}
        </h1>
      </div>

      {/* Caption */}
      <div className="absolute bottom-0 inset-x-0 pb-[calc(env(safe-area-inset-bottom)+7rem)] px-6 z-10">
        <p
          key={`${idx}-${caption}`}
          className="max-w-2xl mx-auto text-base sm:text-lg text-white/95 leading-relaxed text-center fade-in font-display-serif italic"
        >
          {caption}
        </p>
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 inset-x-0 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] px-4 z-10">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2 bg-black/40 backdrop-blur border border-white/10 rounded-full px-3 py-2">
          <button
            onClick={() => go(-1)}
            disabled={idx === 0}
            className="rounded-full p-2 hover:bg-white/10 disabled:opacity-30"
            title={t("story.prev")}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {ended ? (
            <button
              onClick={replay}
              className="rounded-full bg-white text-black font-semibold px-5 py-2 inline-flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" /> {t("story.replay")}
            </button>
          ) : (
            <button
              onClick={() => setPlaying((p) => !p)}
              className="rounded-full bg-white text-black font-semibold px-5 py-2 inline-flex items-center gap-2"
              title={t("story.playPause")}
            >
              {playing ? <><Pause className="h-4 w-4" /> {t("story.playPause")}</> : <><Play className="h-4 w-4" /> {t("story.tap")}</>}
            </button>
          )}

          <button
            onClick={() => setMuted((m) => !m)}
            className="rounded-full p-2 hover:bg-white/10"
            title={muted ? t("story.unmute") : t("story.mute")}
          >
            {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>

          <button
            onClick={() => go(1)}
            disabled={idx >= total - 1}
            className="rounded-full p-2 hover:bg-white/10 disabled:opacity-30"
            title={t("story.next")}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <details className="max-w-md mx-auto mt-3 text-white/60 text-[11px] text-center">
          <summary className="cursor-pointer inline-block px-3 py-1 rounded-full border border-white/10 bg-black/30 backdrop-blur">
            {t("story.sources")}
          </summary>
          <ul className="mt-2 space-y-0.5 text-white/70">
            {story.sources.map((s: string) => <li key={s}>· {s}</li>)}
          </ul>
        </details>
      </div>
    </div>
  );
}
