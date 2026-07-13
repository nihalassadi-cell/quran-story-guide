import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { getStoredTheme, setTheme, type ThemeId } from "@/lib/theme";

export function ThemeSwitch() {
  const [theme, setThemeState] = useState<ThemeId>("default");

  useEffect(() => {
    setThemeState(getStoredTheme());
  }, []);

  const isLight = theme === "emerald";

  const toggle = () => {
    const next: ThemeId = isLight ? "default" : "emerald";
    setThemeState(next);
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      title={isLight ? "Switch to dark" : "Switch to light"}
      className="fixed top-[calc(env(safe-area-inset-top)+0.75rem)] right-3 z-50 h-9 w-9 grid place-items-center rounded-full bg-card/80 backdrop-blur-md border border-border text-primary shadow-md hover:bg-card hover:border-primary/50 active:scale-95 transition-all"
    >
      <span className="relative block h-4 w-4">
        <Sun
          className={`absolute inset-0 h-4 w-4 transition-all ${isLight ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"}`}
        />
        <Moon
          className={`absolute inset-0 h-4 w-4 transition-all ${isLight ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"}`}
        />
      </span>
    </button>
  );
}
