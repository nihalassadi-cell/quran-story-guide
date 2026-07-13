import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { getToday, pickTr } from "@/lib/today";
import { useLanguage } from "@/lib/language";
import { useT, localeFor } from "@/lib/i18n";
import { hasStory } from "@/lib/stories";
import { MicroReadCard } from "@/components/MicroReadCard";
import { StreakOverlay } from "@/components/StreakOverlay";
import { Button } from "@/components/ui/button";

import { BookOpen, Feather, Repeat, Film, ArrowRight, Share2 } from "lucide-react";
import { useMemo } from "react";
import { shareContent } from "@/lib/share";


export const Route = createFileRoute("/today")({
  head: () => ({
    meta: [
      { title: "Today — Noor" },
      { name: "description", content: "Your daily guidance: one verse, one hadith, one dhikr, one story." },
    ],
  }),
  component: TodayPage,
});

function TodayPage() {
  const [lang] = useLanguage();
  const t = useT();

  const today = useMemo(() => getToday(), []);
  const dateLabel = useMemo(
    () => new Date().toLocaleDateString(localeFor(lang), { weekday: "long", month: "long", day: "numeric" }),
    [lang],
  );
  const storyReady = hasStory(today.story.storyId);

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-24">
        {/* Header */}
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-[0.28em] text-primary/70 font-bold">{t("today.eyebrow")}</p>
          <h1 className="mt-1.5 font-display-serif italic text-3xl sm:text-4xl text-foreground leading-tight">
            {dateLabel}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">{t("today.sub")}</p>
        </div>

        {/* Tier 1 — Habit */}
        <div className="mb-8">
          <MicroReadCard />
        </div>

        {/* Tier 2 — Guidance (Verse hero + Hadith) */}
        <SectionLabel>{t("today.section.guidance")}</SectionLabel>

        {/* Verse — editorial hero */}
        <section className="relative rounded-3xl overflow-hidden border border-primary/20 bg-gradient-to-br from-[#0f0f26]/80 via-[#0b0b1a] to-[#08090C] p-6 sm:p-8 mb-4">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,theme(colors.indigo.500/30),transparent_60%)] pointer-events-none" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <CardChip icon={<BookOpen className="h-3 w-3" />} label={t("today.chip.verse")} tone="indigo" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-primary/70 border border-primary/25 rounded-full px-2 py-0.5">
                {today.verse.surah}:{today.verse.verse}
              </span>
            </div>
            <p className="arabic text-right text-3xl sm:text-4xl leading-loose text-foreground" dir="rtl">
              {today.verse.arabic}
            </p>
            <div className="mt-5 flex items-center gap-3 text-primary/30" aria-hidden>
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
              <span className="text-[10px]">✦</span>
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
            </div>
            <p className="text-base text-foreground/85 mt-5 leading-relaxed font-display-serif italic">
              "{pickTr(today.verse.translation, lang)}"
            </p>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground mt-3">
              {today.verse.surahName}
            </p>
            <Button asChild variant="outline" className="mt-5 w-full border-primary/40 bg-primary/5 text-primary hover:bg-primary/15 hover:text-primary">
              <Link to="/surah/$number" params={{ number: String(today.verse.surah) }}>
                {t("quran.openSurah")} <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Hadith */}
        <section className="relative rounded-3xl overflow-hidden border border-white/10 bg-card/40 p-5 mb-8">
          <CardChip icon={<Feather className="h-3 w-3" />} label={t("today.chip.hadith")} tone="gold" />
          <p className="font-display-serif italic text-lg leading-relaxed mt-3 text-foreground">
            "{pickTr(today.hadith.text, lang)}"
          </p>
          <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-muted-foreground">
            {today.hadith.narrator ? <span>{t("today.narratedBy")} <span className="text-foreground/80">{today.hadith.narrator}</span> · </span> : null}
            <span className="text-primary/70">{today.hadith.source}</span>
          </div>
        </section>

        {/* Tier 3 — Practice & Story */}
        <SectionLabel>{t("today.section.practice")}</SectionLabel>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Dhikr */}
          <section className="relative rounded-3xl overflow-hidden border border-emerald-400/20 bg-gradient-to-br from-emerald-950/40 to-[#08090C] p-5 flex flex-col">
            <div className="absolute right-[-40px] top-[-40px] w-48 h-48 opacity-20 pointer-events-none">
              <div className="absolute inset-0 border border-emerald-300 rounded-full animate-pulse" />
              <div className="absolute inset-6 border border-emerald-300/60 rounded-full" />
              <div className="absolute inset-12 border border-emerald-300/30 rounded-full" />
            </div>
            <div className="relative flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <CardChip icon={<Repeat className="h-3 w-3" />} label={t("today.chip.dhikr")} tone="emerald" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-300/80 border border-emerald-300/25 rounded-full px-2 py-0.5">
                  {today.dhikr.count}×
                </span>
              </div>
              <p className="arabic text-right text-2xl leading-loose mt-3 text-emerald-100" dir="rtl">
                {today.dhikr.arabic}
              </p>
              <p className="text-xs text-emerald-200/70 mt-1 italic text-right">
                {today.dhikr.transliteration}
              </p>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed flex-1">
                "{pickTr(today.dhikr.translation, lang)}"
              </p>
              <p className="text-[10px] uppercase tracking-widest text-emerald-300/60 mt-3">
                {today.dhikr.source}
              </p>
              <Button asChild className="mt-4 w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-semibold">
                <Link to="/animate">
                  {t("today.practice")} <ArrowRight className="h-4 w-4 ml-1.5" />
                </Link>
              </Button>
            </div>
          </section>

          {/* Story */}
          <section className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-indigo-950 via-slate-900 to-black p-5 flex flex-col">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,theme(colors.indigo.500/40),transparent_60%)] pointer-events-none" />
            <div className="relative flex-1 flex flex-col">
              <CardChip icon={<Film className="h-3 w-3" />} label={t("today.chip.story")} tone="indigo" />
              <h3 className="font-display-serif italic text-2xl text-white mt-3 leading-tight">
                {pickTr(today.story.title, lang)}
              </h3>
              <p className="text-sm text-white/60 mt-2 leading-relaxed line-clamp-3 flex-1">
                {pickTr(today.story.blurb, lang)}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-indigo-300/80 mt-3">
                {today.story.durationMin} {t("today.prophetStory")}
              </p>
              {storyReady ? (
                <Button asChild className="mt-4 w-full bg-indigo-500 hover:bg-indigo-400 text-white font-semibold">
                  <Link to="/story/$id" params={{ id: today.story.storyId }}>
                    {t("today.watch")} <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Link>
                </Button>
              ) : (
                <Button asChild className="mt-4 w-full bg-indigo-500 hover:bg-indigo-400 text-white font-semibold">
                  <Link to="/mood/$id" params={{ id: today.story.moodId }}>
                    {t("today.watch")} <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Link>
                </Button>
              )}
            </div>
          </section>
        </div>
      </div>
      <StreakOverlay />
    </AppShell>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-3 mt-1">
      <span className="text-[10px] uppercase tracking-[0.28em] text-primary/60 font-bold">{children}</span>
      <span className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
    </div>
  );
}

function CardChip({
  icon,
  label,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  tone: "gold" | "indigo" | "emerald";
}) {
  const styles = {
    gold: "bg-primary/15 border-primary/30 text-primary",
    indigo: "bg-indigo-500/20 border-indigo-400/30 text-indigo-200",
    emerald: "bg-emerald-500/20 border-emerald-400/30 text-emerald-200",
  }[tone];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border backdrop-blur-md text-[9px] uppercase tracking-widest font-bold ${styles}`}>
      {icon}
      {label}
    </span>
  );
}
