import { useEffect, useState } from "react";
import { BookOpen, Sparkles, Heart } from "lucide-react";

const KEY = "noor:onboarded:v1";

const slides = [
  {
    icon: BookOpen,
    title: "The Quran, verse by verse",
    body: "Browse all 114 Surahs with recitation and translation — read at your own pace.",
  },
  {
    icon: Sparkles,
    title: "Animated Surahs",
    body: "Selected chapters come alive as scenes with narration and synced subtitles.",
  },
  {
    icon: Heart,
    title: "How do you feel?",
    body: "Pick a mood and recite a short prophetic kalima — gentle, repetitive, calming.",
  },
];

export function Onboarding() {
  const [show, setShow] = useState(false);
  const [i, setI] = useState(0);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {}
  }, []);

  if (!show) return null;

  const finish = () => {
    try { localStorage.setItem(KEY, "1"); } catch {}
    setShow(false);
  };

  const next = () => (i < slides.length - 1 ? setI(i + 1) : finish());
  const Slide = slides[i];
  const Icon = Slide.icon;

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col">
      <button
        onClick={finish}
        className="absolute top-5 right-5 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
      >
        Skip
      </button>

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center fade-in" key={i}>
        <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary/30 to-accent/20 grid place-items-center glow-shadow mb-8 border border-primary/30">
          <Icon className="h-11 w-11 text-primary" />
        </div>
        <h2 className="text-2xl font-bold gold-text mb-3">{Slide.title}</h2>
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">{Slide.body}</p>
      </div>

      <div className="px-8 pb-10 flex flex-col items-center gap-6">
        <div className="flex gap-2">
          {slides.map((_, n) => (
            <span
              key={n}
              className={`h-1.5 rounded-full transition-all ${n === i ? "w-8 bg-primary" : "w-1.5 bg-muted-foreground/30"}`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="w-full max-w-xs rounded-full bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-semibold py-3.5 glow-shadow"
        >
          {i < slides.length - 1 ? "Next" : "Begin"}
        </button>
      </div>
    </div>
  );
}
