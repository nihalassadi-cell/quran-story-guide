import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { X, Play, Pause, ChevronLeft, ChevronRight, Volume2, VolumeX, RotateCcw } from "lucide-react";
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

// Shared in-memory translation cache
const captionCache = new Map<string, string>();
const VIDEO_CROSSFADE_MS = 1200;
const SCENE_BREATH_MS = 1800;
const MUSIC_CROSSFADE_MS = 1800;
const MUSIC_TARGET_VOLUME = 0.18;
const NARRATION_FADE_IN_MS = 650;

function fadeMediaVolume(
  media: HTMLMediaElement | null,
  to: number,
  durationMs: number,
  onComplete?: () => void,
) {
  if (!media) return () => {};
  const from = media.volume;
  const startedAt = performance.now();
  let frame = 0;
  const step = (now: number) => {
    const raw = durationMs <= 0 ? 1 : Math.min(1, (now - startedAt) / durationMs);
    const eased = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
    try { media.volume = Math.max(0, Math.min(1, from + (to - from) * eased)); } catch { /* noop */ }
    if (raw < 1) frame = requestAnimationFrame(step);
    else onComplete?.();
  };
  frame = requestAnimationFrame(step);
  return () => cancelAnimationFrame(frame);
}

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

  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ended, setEnded] = useState(false);
  const [caption, setCaption] = useState("");
  const [showControls, setShowControls] = useState(true);
  // Two-layer crossfade for video mode: which layer is currently visible
  const [activeLayer, setActiveLayer] = useState<0 | 1>(0);

  const scene = story.scenes[idx];
  const total = story.scenes.length;

  const rafRef = useRef<number | null>(null);
  const startedAtRef = useRef<number>(0);
  const narratorRef = useRef<Narrator | null>(null);
  const padRef = useRef<AmbientPad | null>(null);
  const videoRefs = useRef<[HTMLVideoElement | null, HTMLVideoElement | null]>([null, null]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const nextAudioRef = useRef<HTMLAudioElement | null>(null);
  const musicRefs = useRef<[HTMLAudioElement | null, HTMLAudioElement | null]>([null, null]);
  const activeMusicLayerRef = useRef<0 | 1>(0);
  const musicSceneIdxRef = useRef<number | null>(null);
  const fadeStopsRef = useRef<(() => void)[]>([]);
  const transitionTimersRef = useRef<number[]>([]);
  const advancedRef = useRef(false);
  const idleTimerRef = useRef<number | null>(null);

  // Auto-hide controls after inactivity
  const bumpControls = useCallback(() => {
    setShowControls(true);
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => setShowControls(false), 3500);
  }, []);
  useEffect(() => {
    bumpControls();
    return () => { if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current); };
  }, [bumpControls]);

  // Warm first scene
  useEffect(() => {
    const first = story.scenes[0];
    if (first && !hasVideo) {
      const src = tr(first.narration, "en");
      prefetchTTS(src, lang);
      if (lang !== "en") void translateCaption(src, lang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      narratorRef.current?.stop();
      padRef.current?.stop();
      fadeStopsRef.current.forEach((stop) => stop());
      transitionTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      musicRefs.current.forEach((music) => { try { music?.pause(); } catch { /* noop */ } });
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Ambient music only in image mode
  useEffect(() => {
    if (!hasVideo && playing && !muted) {
      if (!padRef.current) padRef.current = createAmbientPad();
      padRef.current.setVolume(0.14);
      void padRef.current.start();
    } else {
      padRef.current?.stop();
      padRef.current = null;
    }
  }, [playing, muted, hasVideo]);

  // Load caption
  useEffect(() => {
    let cancelled = false;
    const source = tr(scene.narration, "en");
    const localized = tr(scene.narration, lang);
    if (lang === "en" || (localized && localized !== source)) {
      setCaption(localized || source);
      return;
    }
    setCaption(source);
    translateCaption(source, lang).then((out) => { if (!cancelled) setCaption(out); });
    return () => { cancelled = true; };
  }, [idx, lang, scene.narration]);

  // Prefetch next narration (image mode) or next audio (video mode)
  useEffect(() => {
    const next = story.scenes[idx + 1];
    if (!next) return;
    if (!hasVideo) {
      prefetchTTS(tr(next.narration, "en"), lang);
    } else if (videoManifest) {
      const url = videoManifest.narrations[lang]?.[idx + 1] ?? videoManifest.narrations.en?.[idx + 1];
      if (url && nextAudioRef.current) {
        nextAudioRef.current.src = url;
        nextAudioRef.current.load();
      }
      const nextMusicUrl = videoManifest.music?.[idx + 1];
      const inactiveMusic = musicRefs.current[activeMusicLayerRef.current === 0 ? 1 : 0];
      if (nextMusicUrl && inactiveMusic && inactiveMusic.src !== nextMusicUrl) {
        inactiveMusic.src = nextMusicUrl;
        inactiveMusic.load();
      }
    }
  }, [idx, lang, story.scenes, hasVideo, videoManifest]);

  // ================= IMAGE MODE =================
  useEffect(() => {
    if (hasVideo) return;
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
        .catch(() => { window.clearTimeout(failsafe); startTick(); });
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
  }, [playing, idx, muted, lang, hasVideo]);

  // ================= VIDEO MODE =================
  // Two-layer crossfade: on scene change we load next scene into the INACTIVE
  // layer, then swap active. Audio drives advancement (not video), so voice
  // never gets cut off.
  useEffect(() => {
    if (!hasVideo || !videoManifest) return;
    fadeStopsRef.current.forEach((stop) => stop());
    fadeStopsRef.current = [];
    transitionTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    transitionTimersRef.current = [];
    advancedRef.current = false;
    setEnded(false);
    setProgress(0);

    const targetLayer = idx === 0 ? 0 : activeLayer; // first render uses layer 0
    const layerEl = videoRefs.current[targetLayer];
    if (!layerEl) return;

    // Ensure current active layer has the correct src for this idx.
    const wanted = videoManifest.videos[idx];
    if (layerEl.src !== wanted) {
      layerEl.src = wanted;
      layerEl.load();
    }
    layerEl.currentTime = 0;
    layerEl.muted = true;
    layerEl.loop = false;

    const audioUrl = videoManifest.narrations[lang]?.[idx] ?? videoManifest.narrations.en?.[idx];
    const a = audioRef.current;
    if (a) {
      if (a.src !== audioUrl) a.src = audioUrl ?? "";
      a.muted = muted;
      a.currentTime = 0;
      a.volume = muted ? 0 : 0;
    }

    // Per-scene background music (calm Middle-Eastern instrumental), crossfaded
    // between two audio layers so the old scene never cuts off abruptly.
    const musicUrl = videoManifest.music?.[idx];
    const musicSceneChanged = musicSceneIdxRef.current !== idx;
    let musicLayer = activeMusicLayerRef.current;
    if (musicSceneChanged) {
      musicLayer = musicSceneIdxRef.current === null ? 0 : activeMusicLayerRef.current === 0 ? 1 : 0;
      musicSceneIdxRef.current = idx;
      activeMusicLayerRef.current = musicLayer;
    }
    const currentMusic = musicRefs.current[musicLayer];
    const outgoingMusic = musicRefs.current[musicLayer === 0 ? 1 : 0];
    if (currentMusic && musicUrl) {
      if (currentMusic.src !== musicUrl) {
        currentMusic.src = musicUrl;
        currentMusic.load();
      }
      currentMusic.loop = true;
      currentMusic.muted = muted;
      if (playing && !muted) {
        if (musicSceneChanged) currentMusic.volume = 0;
        currentMusic.play().catch(() => {});
        fadeStopsRef.current.push(fadeMediaVolume(currentMusic, MUSIC_TARGET_VOLUME, musicSceneChanged ? MUSIC_CROSSFADE_MS : 450));
      } else {
        currentMusic.pause();
      }
    }
    if (outgoingMusic && outgoingMusic.src && musicSceneChanged) {
      outgoingMusic.muted = muted;
      fadeStopsRef.current.push(fadeMediaVolume(outgoingMusic, 0, MUSIC_CROSSFADE_MS, () => {
        try { outgoingMusic.pause(); } catch { /* noop */ }
      }));
    }
    if (!playing || muted) {
      musicRefs.current.forEach((music) => { try { music?.pause(); } catch { /* noop */ } });
    }

    const queueTransition = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(() => {
        transitionTimersRef.current = transitionTimersRef.current.filter((id) => id !== timer);
        callback();
      }, delay);
      transitionTimersRef.current.push(timer);
      return timer;
    };

    const beginNextScene = () => {
      const nextLayer: 0 | 1 = targetLayer === 0 ? 1 : 0;
      const nextEl = videoRefs.current[nextLayer];
      const nextSrc = videoManifest.videos[idx + 1];
      if (nextEl && nextSrc) {
        if (nextEl.src !== nextSrc) {
          nextEl.src = nextSrc;
          nextEl.load();
        }
        try { nextEl.currentTime = 0; } catch { /* noop */ }
        nextEl.muted = true;
        nextEl.play().catch(() => {});
      }
      queueTransition(() => {
        setActiveLayer(nextLayer);
        setIdx((n) => n + 1);
      }, 120);
    };

    const advance = () => {
      if (advancedRef.current) return;
      advancedRef.current = true;

      if (idx < total - 1) {
        // Preload next video into inactive layer (kept muted, paused on last frame)
        const nextLayer: 0 | 1 = targetLayer === 0 ? 1 : 0;
        const nextEl = videoRefs.current[nextLayer];
        const nextSrc = videoManifest.videos[idx + 1];
        if (nextEl && nextSrc) {
          nextEl.src = nextSrc;
          nextEl.muted = true;
          nextEl.load();
        }
        // Hold the last frame briefly, then begin the visual crossfade while
        // the new narration fades in and the music layers crossfade.
        queueTransition(beginNextScene, SCENE_BREATH_MS);
      } else {
        musicRefs.current.forEach((music) => {
          fadeStopsRef.current.push(fadeMediaVolume(music, 0, MUSIC_CROSSFADE_MS, () => {
            try { music?.pause(); } catch { /* noop */ }
          }));
        });
        queueTransition(() => {
          setPlaying(false);
          setEnded(true);
        }, 1400);
      }
    };

    const onAudioTime = () => {
      if (!a?.duration) return;
      setProgress(Math.min(1, a.currentTime / a.duration));
    };
    const onAudioEnded = () => advance();
    const onVideoEnded = () => {
      // Freeze on last frame while narration continues
      try {
        layerEl.pause();
        layerEl.currentTime = Math.max(0, layerEl.duration - 0.05);
      } catch { /* noop */ }
    };

    a?.addEventListener("timeupdate", onAudioTime);
    a?.addEventListener("ended", onAudioEnded);
    layerEl.addEventListener("ended", onVideoEnded);
    let onEndNoAudio: (() => void) | null = null;

    if (playing) {
      layerEl.play().catch(() => {});
      // If muted or no audio => advance when video ends
      if (muted || !audioUrl) {
        layerEl.removeEventListener("ended", onVideoEnded);
        onEndNoAudio = () => advance();
        layerEl.addEventListener("ended", onEndNoAudio);
      } else {
        a?.play().then(() => {
          fadeStopsRef.current.push(fadeMediaVolume(a, 1, NARRATION_FADE_IN_MS));
        }).catch(() => {});
      }
    } else {
      layerEl.pause();
      a?.pause();
      musicRefs.current.forEach((music) => music?.pause());
    }

    return () => {
      a?.removeEventListener("timeupdate", onAudioTime);
      a?.removeEventListener("ended", onAudioEnded);
      layerEl.removeEventListener("ended", onVideoEnded);
      if (onEndNoAudio) layerEl.removeEventListener("ended", onEndNoAudio);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasVideo, idx, lang, playing, muted, videoManifest, total, activeLayer]);

  const go = (delta: number) => {
    const next = Math.max(0, Math.min(total - 1, idx + delta));
    setIdx(next);
    setProgress(0);
    setEnded(false);
    bumpControls();
  };

  const replay = () => {
    setIdx(0);
    setProgress(0);
    setEnded(false);
    setPlaying(true);
    bumpControls();
  };

  const togglePlay = () => {
    setPlaying((p) => !p);
    bumpControls();
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
    <div
      className="fixed inset-0 z-[80] bg-black text-white overflow-hidden"
      onMouseMove={bumpControls}
      onTouchStart={bumpControls}
      onClick={bumpControls}
    >
      {/* Media */}
      <div className="absolute inset-0">
        {hasVideo && videoManifest ? (
          <>
            <video
              ref={(el) => { videoRefs.current[0] = el; }}
              className="absolute inset-0 w-full h-full object-cover transition-opacity ease-in-out"
              style={{ opacity: activeLayer === 0 ? 1 : 0, transitionDuration: `${VIDEO_CROSSFADE_MS}ms` }}
              playsInline
              muted
              preload="auto"
            />
            <video
              ref={(el) => { videoRefs.current[1] = el; }}
              className="absolute inset-0 w-full h-full object-cover transition-opacity ease-in-out"
              style={{ opacity: activeLayer === 1 ? 1 : 0, transitionDuration: `${VIDEO_CROSSFADE_MS}ms` }}
              playsInline
              muted
              preload="auto"
            />
            <audio ref={audioRef} preload="auto" />
            <audio ref={nextAudioRef} preload="auto" />
            <audio ref={(el) => { musicRefs.current[0] = el; }} preload="auto" loop />
            <audio ref={(el) => { musicRefs.current[1] = el; }} preload="auto" loop />

          </>
        ) : (
          <img
            key={idx}
            src={scene.image}
            alt=""
            className={`w-full h-full object-cover ${kenBurnsClass}`}
            style={{ animationDuration: `${scene.durationMs}ms`, animationPlayState: playing ? "running" : "paused" }}
          />
        )}
        {/* Subtle vignette — lighter than before so it doesn't wash out the video */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />
      </div>

      {/* Ambient particles — only in image mode; distracting on video */}
      {!hasVideo && (
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
      )}

      {/* Progress bar — always visible at top, minimal */}
      <div className="absolute top-0 inset-x-0 pt-[calc(env(safe-area-inset-top)+0.5rem)] px-3 z-10 pointer-events-none">
        <div className="flex gap-1 items-center">
          {story.scenes.map((_: unknown, i: number) => (
            <span key={i} className="relative flex-1 h-[3px] rounded-full bg-white/20 overflow-hidden">
              <span
                className="absolute inset-y-0 left-0 bg-white/95"
                style={{
                  width: i < idx ? "100%" : i === idx ? `${progress * 100}%` : "0%",
                  transition: i === idx ? "none" : "width 200ms linear",
                }}
              />
            </span>
          ))}
        </div>
      </div>

      {/* Top bar — auto-hides */}
      <div
        className={`absolute top-0 inset-x-0 pt-[calc(env(safe-area-inset-top)+1.25rem)] px-4 flex items-center gap-2 z-20 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <Link
          to="/animate"
          search={{ tab: "story" }}
          className="rounded-full bg-black/50 backdrop-blur border border-white/15 p-2 hover:border-white/40"
          title={t("story.close")}
        >
          <X className="h-5 w-5" />
        </Link>
        <div className="flex-1" />
        <NarrationLangSelect value={lang} onChange={setLang} tone="dark" />
      </div>

      {/* Title — small badge, auto-hides with controls */}
      <div
        className={`absolute top-[calc(env(safe-area-inset-top)+4rem)] inset-x-0 text-center px-6 z-10 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
      >
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/70">
          {idx + 1} / {total}
        </p>
        <h1 className="font-display-serif italic text-xl mt-1 text-white/95 drop-shadow-lg">
          {tr(story.title, lang)}
        </h1>
        {story.subtitle && (
          <p className="text-[10px] text-white/75 mt-0.5">
            {tr(story.subtitle, lang)}
          </p>
        )}
      </div>

      {/* Caption — persistent but discreet, translucent panel */}
      <div className="absolute bottom-0 inset-x-0 pb-[calc(env(safe-area-inset-bottom)+5rem)] px-4 z-10 pointer-events-none">
        <p
          key={`${idx}-${caption}`}
          className="max-w-2xl mx-auto text-[15px] sm:text-base text-white leading-relaxed text-center fade-in font-display-serif italic drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
        >
          {caption}
        </p>
      </div>

      {/* Bottom controls — auto-hide, floating */}
      <div
        className={`absolute bottom-0 inset-x-0 pb-[calc(env(safe-area-inset-bottom)+1rem)] px-4 z-20 transition-all duration-300 ${showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
      >
        <div className="max-w-md mx-auto flex items-center justify-between gap-2 bg-black/45 backdrop-blur-md border border-white/10 rounded-full px-2 py-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); go(-1); }}
            disabled={idx === 0}
            className="rounded-full p-2 hover:bg-white/10 disabled:opacity-30"
            title={t("story.prev")}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {ended ? (
            <button
              onClick={(e) => { e.stopPropagation(); replay(); }}
              className="rounded-full bg-white text-black font-semibold px-4 py-1.5 inline-flex items-center gap-2 text-sm"
            >
              <RotateCcw className="h-4 w-4" /> {t("story.replay")}
            </button>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); togglePlay(); }}
              className="rounded-full bg-white/95 text-black font-semibold p-2.5 inline-flex items-center justify-center"
              title={t("story.playPause")}
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
          )}

          <button
            onClick={(e) => { e.stopPropagation(); setMuted((m) => !m); bumpControls(); }}
            className="rounded-full p-2 hover:bg-white/10"
            title={muted ? t("story.unmute") : t("story.mute")}
          >
            {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); go(1); }}
            disabled={idx >= total - 1}
            className="rounded-full p-2 hover:bg-white/10 disabled:opacity-30"
            title={t("story.next")}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
