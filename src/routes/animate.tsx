import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Heart, Repeat } from "lucide-react";
import { MOODS } from "@/lib/moods";

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
  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-24">
        <div className="flex items-center gap-2 mb-1">
          <Heart className="h-5 w-5 text-primary shrink-0" />
          <h1 className="text-[clamp(1.25rem,5.2vw,1.75rem)] font-bold gold-text leading-tight">How are you feeling right now?</h1>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mb-6 leading-relaxed">
          Pick a mood. For each feeling, the Prophet ﷺ taught a short remembrance — a kalima you can repeat like a heartbeat. Tap a mood to begin.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MOODS.map((m) => (
            <Link
              key={m.id}
              to="/mood/$id"
              params={{ id: m.id }}
              className="group rounded-xl border border-border bg-card/60 backdrop-blur p-4 flex flex-col gap-2 hover:border-primary/60 hover:bg-card transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl">{m.emoji}</span>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-primary/80">
                  <Repeat className="h-3 w-3" /> {m.kalima.repeat}×
                </span>
              </div>
              <span className="font-semibold text-foreground text-sm sm:text-base">{m.label}</span>
              <p className="arabic text-right text-base sm:text-lg leading-snug text-primary/90 line-clamp-2" dir="rtl">
                {m.kalima.arabic}
              </p>
              <p className="text-[11px] text-muted-foreground italic line-clamp-2">“{m.kalima.translation}”</p>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
