import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Heart, Repeat, Film, Play, Sparkles } from "lucide-react";
import { MOODS } from "@/lib/moods";
import { useLanguage, tr } from "@/lib/language";
import { useT, moodLabel } from "@/lib/i18n";
import { allStories, storyForMood } from "@/lib/stories";

export const Route = createFileRoute("/animate")({
  head: () => ({
    meta: [
      { title: "How are you feeling? — Noor" },
      {
        name: "description",
        content:
          "Pick your mood. Choose a short prophetic kalima to repeat, or watch a cinematic Prophet story matched to how you feel.",
      },
    ],
  }),
  component: AnimatePage,
});

type Tab = "kalima" | "story";

function AnimatePage() {
  const [lang] = useLanguage();
  const t = useT();
  const [tab, setTab] = useState<Tab>("kalima");

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-24">
        <div className="flex items-center gap-2 mb-1">
          <Heart className="h-5 w-5 text-primary shrink-0" />
          <h1 className="text-[clamp(1.25rem,5.2vw,1.75rem)] font-bold gold-text leading-tight">
            {t("feel.title")}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mb-5 leading-relaxed">
          {tab === "kalima" ? t("feel.sub.kalima") : t("feel.sub.story")}
        </p>

        {/* Tabs */}
        <div
          role="tablist"
          className="relative grid grid-cols-2 mb-6 rounded-full border border-border/70 bg-card/60 backdrop-blur p-1"
        >
          <span
            aria-hidden
            className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-primary/15 border border-primary/30 shadow-[0_0_20px_-6px_var(--primary)] transition-transform duration-300 ease-out ${
              tab === "story" ? "translate-x-full" : "translate-x-0"
            }`}
          />
          <button
            role="tab"
            aria-selected={tab === "kalima"}
            onClick={() => setTab("kalima")}
            className={`relative z-10 py-2 text-sm font-semibold rounded-full inline-flex items-center justify-center gap-2 transition-colors ${
              tab === "kalima" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {t("feel.tab.kalima")}
          </button>
          <button
            role="tab"
            aria-selected={tab === "story"}
            onClick={() => setTab("story")}
            className={`relative z-10 py-2 text-sm font-semibold rounded-full inline-flex items-center justify-center gap-2 transition-colors ${
              tab === "story" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Film className="h-3.5 w-3.5" />
            {t("feel.tab.story")}
          </button>
        </div>

        {tab === "kalima" ? <KalimaGrid /> : <StoryGrid />}
      </div>
    </AppShell>
  );
}

function KalimaGrid() {
  const [lang] = useLanguage();
  const t = useT();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {MOODS.map((m) => {
        const storyId = storyForMood(m.id);
        return (
          <Link
            key={m.id}
            to="/mood/$id"
            params={{ id: m.id }}
            className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/50 backdrop-blur p-4 flex flex-col gap-2.5 hover:border-primary/60 hover:bg-card active:scale-[0.985] transition-all"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"
            />
            <div className="relative flex items-center justify-between">
              <span className="grid place-items-center h-11 w-11 rounded-full bg-primary/10 border border-primary/20 text-2xl leading-none">
                {m.emoji}
              </span>
              <div className="flex items-center gap-1.5">
                {storyId && (
                  <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider text-indigo-200 border border-indigo-400/40 rounded-full px-1.5 py-0.5 bg-indigo-500/15">
                    <Film className="h-2.5 w-2.5" /> {t("feel.tab.story")}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-primary/80">
                  <Repeat className="h-3 w-3" /> {m.kalima.repeat}×
                </span>
              </div>
            </div>
            <span className="relative font-semibold text-foreground text-base tracking-tight">
              {moodLabel(m.id, m.label, lang)}
            </span>
            <p
              className="relative arabic text-right text-lg leading-snug text-primary/90 line-clamp-2"
              dir="rtl"
            >
              {m.kalima.arabic}
            </p>
            <p className="relative text-[11px] text-muted-foreground italic line-clamp-2">
              “{tr(m.kalima.translation, lang)}”
            </p>
          </Link>
        );
      })}
    </div>
  );
}

function StoryGrid() {
  const [lang] = useLanguage();
  const t = useT();
  const stories = allStories();

  // Moods without a story yet — show a subtle "coming soon" placeholder.
  const covered = new Set(stories.map((s) => s.moodId));
  const uncovered = MOODS.filter((m) => !covered.has(m.id));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {stories.map((s) => {
        const mood = MOODS.find((m) => m.id === s.moodId);
        const cover = s.scenes[0]?.image;
        return (
          <Link
            key={s.id}
            to="/story/$id"
            params={{ id: s.id }}
            className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card active:scale-[0.985] hover:border-primary/60 transition-all"
          >
            {/* Preview image */}
            <div className="relative aspect-[16/10] overflow-hidden">
              {cover && (
                <img
                  src={cover}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />

              {/* Mood chip */}
              {mood && (
                <div className="absolute top-2 left-2 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/90 bg-black/45 backdrop-blur border border-white/15 rounded-full pl-1 pr-2 py-0.5">
                  <span className="text-sm leading-none">{mood.emoji}</span>
                  {moodLabel(mood.id, mood.label, lang)}
                </div>
              )}

              {/* Scenes badge */}
              <div className="absolute top-2 right-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-white/90 bg-black/45 backdrop-blur border border-white/15 rounded-full px-2 py-0.5">
                <Film className="h-2.5 w-2.5" /> {s.scenes.length} {t("feel.scenes")}
              </div>

              {/* Play affordance */}
              <div className="absolute inset-0 grid place-items-center">
                <span className="grid place-items-center h-14 w-14 rounded-full bg-white/95 text-black shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform">
                  <Play className="h-6 w-6 translate-x-[1px]" fill="currentColor" />
                </span>
              </div>

              {/* Title over image */}
              <div className="absolute bottom-2 left-3 right-3">
                <h3 className="font-display-serif italic text-white text-lg leading-tight drop-shadow">
                  {tr(s.title, lang)}
                </h3>
              </div>
            </div>

            {/* Meta strip */}
            <div className="flex items-center justify-between px-3 py-2.5 text-[11px]">
              <span className="text-muted-foreground">
                {Math.round(s.durationSec / 60)} min · {s.sources[0]?.split("·")[1]?.trim() ?? "Qur'an"}
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-primary">
                <Play className="h-3 w-3" fill="currentColor" /> {t("feel.watch")}
              </span>
            </div>
          </Link>
        );
      })}

      {uncovered.map((m) => (
        <div
          key={m.id}
          className="relative overflow-hidden rounded-2xl border border-dashed border-border/60 bg-card/30 backdrop-blur aspect-[16/10] sm:aspect-auto sm:min-h-[220px] flex flex-col items-center justify-center gap-2 p-4 text-center opacity-70"
        >
          <span className="grid place-items-center h-11 w-11 rounded-full bg-muted/40 border border-border/50 text-2xl">
            {m.emoji}
          </span>
          <span className="text-sm font-medium">{moodLabel(m.id, m.label, lang)}</span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {t("feel.noStory")}
          </span>
        </div>
      ))}
    </div>
  );
}
