import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Heart, Repeat, Film } from "lucide-react";
import { MOODS } from "@/lib/moods";
import { useLanguage, tr } from "@/lib/language";
import { useT, moodLabel } from "@/lib/i18n";
import { storyForMood } from "@/lib/stories";



export const Route = createFileRoute("/animate")({
  head: () => ({
    meta: [
      { title: "How are you feeling? — Noor" },
      { name: "description", content: "Pick your mood. The Prophet ﷺ taught a short kalima for each — repeat it like a heartbeat." },
    ],
  }),
  component: AnimatePage,
});

function AnimatePage() {
  const [lang] = useLanguage();
  const t = useT();
  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-24">
        <div className="flex items-center gap-2 mb-1">
          <Heart className="h-5 w-5 text-primary shrink-0" />
          <h1 className="text-[clamp(1.25rem,5.2vw,1.75rem)] font-bold gold-text leading-tight">{t("feel.title")}</h1>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mb-6 leading-relaxed">
          {t("feel.sub")}
        </p>


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
                        <Film className="h-2.5 w-2.5" /> {t("today.chip.story")}
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
                <p className="relative arabic text-right text-lg leading-snug text-primary/90 line-clamp-2" dir="rtl">
                  {m.kalima.arabic}
                </p>
                <p className="relative text-[11px] text-muted-foreground italic line-clamp-2">
                  “{tr(m.kalima.translation, lang)}”
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
