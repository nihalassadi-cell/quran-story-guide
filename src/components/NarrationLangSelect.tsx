import { Languages } from "lucide-react";
import { SUPPORTED_LANGUAGES, type LangCode } from "@/lib/language";

type Tone = "dark" | "light";

/**
 * Compact narration-language picker used in immersive screens
 * (main kalima + story narration). Lets the user change the
 * narration/translation language without leaving the screen.
 */
export function NarrationLangSelect({
  value,
  onChange,
  tone = "dark",
  title,
}: {
  value: LangCode;
  onChange: (c: LangCode) => void;
  tone?: Tone;
  title?: string;
}) {
  const isDark = tone === "dark";
  const wrap = isDark
    ? "bg-black/40 border-white/15 text-white hover:border-white/40"
    : "bg-card/60 border-border text-foreground hover:border-primary/60";
  return (
    <label
      title={title ?? "Narration language"}
      className={`relative inline-flex items-center gap-1.5 rounded-full backdrop-blur border px-2.5 py-1.5 text-xs font-medium ${wrap}`}
    >
      <Languages className="h-4 w-4 opacity-80" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as LangCode)}
        className="bg-transparent outline-none pr-1 appearance-none cursor-pointer"
      >
        {SUPPORTED_LANGUAGES.map((l) => (
          <option key={l.code} value={l.code} className="text-foreground bg-background">
            {l.native}
          </option>
        ))}
      </select>
    </label>
  );
}
