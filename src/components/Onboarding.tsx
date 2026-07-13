import { useEffect, useState } from "react";
import { BookOpen, Heart, Languages } from "lucide-react";
import { SUPPORTED_LANGUAGES, setLanguage, getLanguage, type LangCode } from "@/lib/language";
import { t as tt } from "@/lib/i18n";


const KEY = "noor:onboarded:v1";

export function Onboarding() {
  const [show, setShow] = useState(false);
  const [i, setI] = useState(0);
  const [lang, setLang] = useState<LangCode>("en");
  // Track whether the user actively picked a language on the language slide.
  // If they don't, we must NOT overwrite any previously-saved preference.
  const [langTouched, setLangTouched] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
      // Seed from any previously-saved preference so returning users don't get reset.
      setLang(getLanguage());
    } catch {}
  }, []);

  if (!show) return null;

  const pickLang = (code: LangCode) => {
    setLang(code);
    setLangTouched(true);
  };

  const finish = () => {
    try {
      if (langTouched) setLanguage(lang);
      localStorage.setItem(KEY, "1");
    } catch {}
    setShow(false);
  };


  const slides = [
    {
      icon: BookOpen,
      title: "The Quran, verse by verse",
      body: "Browse all 114 Surahs with recitation and translation — read at your own pace.",
    },
    {
      icon: Heart,
      title: "How do you feel?",
      body: "Pick a mood and recite a short prophetic kalima — gentle, repetitive, calming.",
    },
    {
      icon: Languages,
      title: "Choose your language",
      body: "Translations of verses and kalimas will appear in this language. The Quran recitation is always in Arabic.",
      isLang: true as const,
    },
  ];

  const total = slides.length;
  const next = () => (i < total - 1 ? setI(i + 1) : finish());
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

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center fade-in overflow-y-auto py-10" key={i}>
        <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary/30 to-accent/20 grid place-items-center glow-shadow mb-8 border border-primary/30 shrink-0">
          <Icon className="h-11 w-11 text-primary" />
        </div>
        <h2 className="text-2xl font-bold gold-text mb-3">{Slide.title}</h2>
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-6">{Slide.body}</p>

        {"isLang" in Slide && Slide.isLang && (
          <div className="w-full max-w-xs grid grid-cols-2 gap-2">
            {SUPPORTED_LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => pickLang(l.code)}
                className={`rounded-xl border px-3 py-2.5 text-left transition-colors ${
                  lang === l.code
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card/70 border-border hover:border-primary/60"
                }`}
              >
                <div className="text-sm font-semibold">{l.label}</div>
                <div className="text-[11px] opacity-80">{l.native}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-8 pb-10 flex flex-col items-center gap-6 shrink-0">
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
          {i < total - 1 ? "Next" : "Begin"}
        </button>
      </div>
    </div>
  );
}
