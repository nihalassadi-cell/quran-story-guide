import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookOpen, ArrowRight, Sparkles, Moon } from "lucide-react";
import { getProgress, getTodaySession, getStreak, DAILY_TARGET_PAGES, VERSES_PER_MICRO_PAGE, type ReadingProgress, type ReadingSession, type ReadingStreak } from "@/lib/reading-progress";
import { getSurahMeta, type SurahMeta } from "@/lib/surah-meta";
import { useLanguage } from "@/lib/language";
import { localizedSurahMeaning } from "@/lib/surah-names.i18n";
import { useT } from "@/lib/i18n";
import { useAuthUser } from "@/hooks/use-auth-user";

export function MicroReadCard() {
  const [lang] = useLanguage();
  const t = useT();
  const { user } = useAuthUser();
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [session, setSession] = useState<ReadingSession | null>(null);
  const [streak, setStreak] = useState<ReadingStreak | null>(null);
  const [meta, setMeta] = useState<SurahMeta | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [p, s, st] = await Promise.all([getProgress(), getTodaySession(), getStreak()]);
      if (!alive) return;
      setProgress(p); setSession(s); setStreak(st);
      const m = await getSurahMeta(p.current_surah);
      if (alive) setMeta(m);
    })();
    return () => { alive = false; };
    // re-run when auth changes so signed-in data replaces localStorage
  }, [user?.id]);

  const pagesRead = session?.pages_read ?? 0;
  const complete = !!session?.completed_at;
  const target = DAILY_TARGET_PAGES;
  const pct = Math.min(1, pagesRead / target);
  const startVerse = progress?.current_verse ?? 1;
  const endVerse = startVerse + target * VERSES_PER_MICRO_PAGE - 1;
  const meaning = meta ? localizedSurahMeaning(meta.number, lang, meta.name_en) : "";
  const streakCount = streak?.current_streak ?? 0;
  const showStreak = (progress?.show_streak ?? true) && streakCount > 0;

  return (
    <Link
      to="/surah/$number"
      params={{ number: String(progress?.current_surah ?? 1) }}
      search={{ verse: startVerse, page: Math.max(1, Math.ceil(startVerse / VERSES_PER_MICRO_PAGE)), micro: 1 } as any}
      className="group relative block rounded-3xl overflow-hidden border border-primary/25 bg-gradient-to-br from-[#1a1206] via-[#0b0a06] to-[#08090C] p-5 shadow-[0_0_60px_-20px_rgba(212,175,55,0.35)]"
    >
      {/* Noor glow */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_right,theme(colors.amber.500/25),transparent_55%)] pointer-events-none" />
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-primary/10 blur-3xl pointer-events-none animate-pulse" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border bg-primary/15 border-primary/40 text-primary text-[9px] uppercase tracking-widest font-bold">
            <Sparkles className="h-3 w-3" /> {t("micro.eyebrow")}
          </span>
          {showStreak && (
            <span className="inline-flex items-center gap-1 text-[10px] text-primary/80 font-semibold">
              <Moon className="h-3 w-3" /> {streakCount}
            </span>
          )}
        </div>

        {complete ? (
          <>
            <h3 className="font-display-serif italic text-2xl text-foreground mt-3 leading-tight">
              {t("micro.doneTitle")}
            </h3>
            <p className="text-sm text-muted-foreground mt-2">{t("micro.doneSub")}</p>
          </>
        ) : (
          <>
            <h3 className="font-display-serif italic text-2xl text-foreground mt-3 leading-tight">
              {meaning || t("micro.loading")} <span className="text-primary/70">·</span>{" "}
              <span className="text-base text-muted-foreground font-normal not-italic">
                {t("quran.verse")} {startVerse}–{endVerse}
              </span>
            </h3>
            <p className="text-sm text-primary/80 mt-2 leading-relaxed">
              {t("micro.preRead")}
            </p>
            <p className="text-xs text-muted-foreground/80 mt-1">
              {t("micro.est")} ~{target * 3} {t("micro.min")}
            </p>
          </>
        )}

        {/* Progress bar */}
        <div className="mt-4 h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-500"
            style={{ width: `${pct * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] uppercase tracking-widest text-primary/70">
            {pagesRead} {t("micro.of")} {target} {t("micro.pages")}
          </span>
          <span className="text-xs font-bold text-primary uppercase tracking-wider inline-flex items-center gap-1">
            {complete ? t("micro.readMore") : (user ? t("micro.begin") : t("micro.begin"))}
            <ArrowRight className="h-3 w-3" />
          </span>
        </div>

        {!user && (
          <p className="mt-3 text-[10px] text-muted-foreground/70">
            <BookOpen className="inline h-3 w-3 mr-1" />
            {t("micro.signInHint")}
          </p>
        )}
      </div>
    </Link>
  );
}
