import { useEffect, useState } from "react";
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
    <div className="fixed top-3 right-3 z-50 flex items-center gap-2 rounded-full bg-card/80 backdrop-blur-md border border-border px-2 py-1 shadow-md">
      <span className={`text-[10px] font-medium uppercase tracking-wider transition-colors ${!isLight ? "text-primary" : "text-muted-foreground"}`}>
        Dark
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={isLight}
        aria-label="Toggle light/dark theme"
        onClick={toggle}
        className={`relative h-5 w-9 rounded-full transition-colors ${isLight ? "bg-primary" : "bg-muted"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-background shadow transition-transform ${isLight ? "translate-x-4" : "translate-x-0"}`}
        />
      </button>
      <span className={`text-[10px] font-medium uppercase tracking-wider transition-colors ${isLight ? "text-primary" : "text-muted-foreground"}`}>
        Light
      </span>
    </div>
  );
}
