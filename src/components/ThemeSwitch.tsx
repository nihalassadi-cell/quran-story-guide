import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
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
    <div className="fixed top-[calc(env(safe-area-inset-top)+0.5rem)] right-2 z-50 flex flex-col items-center gap-0.5">
      <button
        type="button"
        role="switch"
        aria-checked={isLight}
        aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
        title={isLight ? "Light theme" : "Dark theme"}
        onClick={toggle}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-card/85 backdrop-blur-md border border-border shadow-md text-primary hover:border-primary/60 transition-colors"
      >
        {isLight ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
      <span className="text-[10px] font-medium text-primary/90 leading-none">Change theme</span>
    </div>
  );
}
