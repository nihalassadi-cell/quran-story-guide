import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Sparkles, Heart } from "lucide-react";
import { MOODS } from "@/lib/moods";

export const Route = createFileRoute("/animate")({
  head: () => ({
    meta: [
      { title: "How are you feeling? — Noor" },
      { name: "description", content: "Pick your mood and let the Quran meet you where you are." },
    ],
  }),
  component: AnimatePage,
});

function AnimatePage() {
  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-24">
        <div className="flex items-center gap-2 mb-1">
          <Heart className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold gold-text">How are you feeling right now?</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Pick a mood. We'll play a few hand-picked verses chosen for that feeling — with the reason each one was chosen, and where it comes from in the Quran.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {MOODS.map((m) => (
            <Link
              key={m.id}
              to="/mood/$id"
              params={{ id: m.id }}
              className="group rounded-xl border border-border bg-card/60 backdrop-blur p-4 flex flex-col items-start gap-1 hover:border-primary/60 hover:bg-card transition-colors"
            >
              <span className="text-3xl">{m.emoji}</span>
              <span className="font-semibold text-foreground">{m.label}</span>
              <span className="text-xs text-muted-foreground leading-snug">{m.blurb}</span>
              <span className="text-[10px] uppercase tracking-wider text-primary/70 mt-1 flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> {m.verses.length} verses
              </span>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
