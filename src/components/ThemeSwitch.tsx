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
    <div className="fixed top-3 right-3 z-50 flex items-center gap-2 rounded-full bg-card/80 backdrop-blur-md border border-border px-2 py-1.5 shadow-md">
      <span className="text-xs font-medium text-muted-foreground">Theme</span>
      <button
        type="button"
        role="switch"
        aria-checked={isLight}
        aria-label="Toggle light theme"
        onClick={toggle}
        className="relative flex h-7 w-14 items-center rounded-full bg-muted p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span
          className={`absolute h-6 w-6 rounded-full bg-primary shadow-sm transition-transform duration-200 ease-out ${isLight ? "translate-x-7" : "translate-x-0"}`}
        />
        <span className="relative z-10 flex w-full items-center justify-between px-1.5 text-[10px] font-semibold uppercase tracking-wide">
          <span className={isLight ? "text-muted-foreground" : "text-primary-foreground"}>Dark</span>
          <span className={isLight ? "text-primary-foreground" : "text-muted-foreground"}>Light</span>
        </span>
      </button>
    </div>
  );
}
