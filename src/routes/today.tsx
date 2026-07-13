import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { getToday, pickTr } from "@/lib/today";
import { useLanguage } from "@/lib/language";
import { BookOpen, Feather, Repeat, Film, PenLine, ArrowRight } from "lucide-react";
import { useMemo } from "react";

export const Route = createFileRoute("/today")({
  head: () => ({
    meta: [
      { title: "Today — Noor" },
      { name: "description", content: "Your daily guidance: one verse, one hadith, one dhikr, one story, one reflection." },
    ],
  }),
  component: TodayPage,
});

function TodayPage() {
  const [lang] = useLanguage();
  const today = useMemo(() => getToday(), []);
  const dateLabel = useMemo(
    () => new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }),
    [],
  );

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-24">
        {/* Header */}
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-[0.25em] text-primary/70 font-bold">Today's Guidance</p>
          <h1 className="mt-1 font-display-serif italic text-3xl sm:text-4xl text-foreground leading-tight">
            {dateLabel}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">Five small things. Take them slowly.</p>
        </div>

        <div className="space-y-4">
          {/* 1 · Verse */}
          <section className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#141432]/60 to-[#08090C] p-5">
            <CardChip icon={<BookOpen className="h-3 w-3" />} label="Verse" tone="indigo" />
            <p className="arabic text-right text-2xl leading-loose mt-3 text-foreground" dir="rtl">
              {today.verse.arabic}
            </p>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              "{pickTr(today.verse.translation, lang)}"
            </p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-[10px] uppercase tracking-widest text-primary/60">
                Qur'an {today.verse.surah}:{today.verse.verse} · {today.verse.surahName}
              </span>
              <Link
                to="/surah/$number"
                params={{ number: String(today.verse.surah) }}
                className="text-xs font-semibold text-primary hover:text-primary-glow inline-flex items-center gap-1"
              >
                Open surah <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </section>

          {/* 2 · Hadith */}
          <section className="relative rounded-3xl overflow-hidden border border-white/10 bg-card/40 p-5">
            <CardChip icon={<Feather className="h-3 w-3" />} label="Hadith" tone="gold" />
            <p className="font-display-serif italic text-lg leading-relaxed mt-3 text-foreground">
              "{pickTr(today.hadith.text, lang)}"
            </p>
            <div className="mt-3 text-[11px] text-muted-foreground">
              {today.hadith.narrator ? <span>Narrated by {today.hadith.narrator} · </span> : null}
              <span className="text-primary/60">{today.hadith.source}</span>
            </div>
          </section>

          {/* 3 · Dhikr */}
          <section className="relative rounded-3xl overflow-hidden border border-emerald-400/15 bg-emerald-950/20 p-5">
            <div className="absolute right-[-40px] top-[-40px] w-48 h-48 opacity-20 pointer-events-none">
              <div className="absolute inset-0 border border-emerald-300 rounded-full animate-pulse" />
              <div className="absolute inset-6 border border-emerald-300/60 rounded-full" />
              <div className="absolute inset-12 border border-emerald-300/30 rounded-full" />
            </div>
            <div className="relative">
              <CardChip icon={<Repeat className="h-3 w-3" />} label="Dhikr" tone="emerald" />
              <p className="arabic text-right text-2xl leading-loose mt-3 text-emerald-100" dir="rtl">
                {today.dhikr.arabic}
              </p>
              <p className="text-xs text-emerald-200/70 mt-1 italic text-right">
                {today.dhikr.transliteration}
              </p>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                "{pickTr(today.dhikr.translation, lang)}"
              </p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-[10px] uppercase tracking-widest text-emerald-300/70">
                  {today.dhikr.count}× · {today.dhikr.source}
                </span>
                <Link
                  to="/animate"
                  className="text-xs font-semibold text-emerald-300 hover:text-emerald-200 inline-flex items-center gap-1"
                >
                  Practice <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </section>

          {/* 4 · Story of the day */}
          <Link
            to="/mood/$id"
            params={{ id: today.story.moodId }}
            className="group relative block rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-indigo-950 via-slate-900 to-black p-5 min-h-[180px]"
          >
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,theme(colors.indigo.500/40),transparent_60%)]" />
            <div className="relative">
              <CardChip icon={<Film className="h-3 w-3" />} label="Story" tone="indigo" />
              <h3 className="font-display-serif italic text-2xl text-white mt-3">
                {pickTr(today.story.title, lang)}
              </h3>
              <p className="text-sm text-white/60 mt-2 leading-relaxed line-clamp-2">
                {pickTr(today.story.blurb, lang)}
              </p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-[10px] uppercase tracking-widest text-indigo-300/80">
                  {today.story.durationMin} min · Prophet story
                </span>
                <span className="text-xs font-bold text-white uppercase tracking-wider inline-flex items-center gap-1 group-hover:text-primary transition-colors">
                  Watch <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </Link>

          {/* 5 · Reflection */}
          <section className="relative rounded-3xl overflow-hidden border border-white/10 bg-card/30 p-5">
            <CardChip icon={<PenLine className="h-3 w-3" />} label="Reflect" tone="gold" />
            <p className="font-display-serif italic text-xl leading-snug mt-3 text-foreground">
              {pickTr(today.reflection.prompt, lang)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-3">
              Sit with it for a moment. Journaling coming soon.
            </p>
          </section>
        </div>
      </div>
    </AppShell>
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
