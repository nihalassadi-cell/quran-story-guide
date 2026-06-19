export type ThemeId = "default" | "sage" | "forest";

export const THEMES: { id: ThemeId; name: string; description: string }[] = [
  { id: "default", name: "Noor (Default)", description: "Warm charcoal & gold" },
  { id: "sage", name: "Sage & Cream", description: "Serene morning light" },
  { id: "forest", name: "Forest & Moss", description: "Grounded nature green" },
];

const KEY = "noor:theme";

export function getStoredTheme(): ThemeId {
  if (typeof window === "undefined") return "default";
  try {
    const v = localStorage.getItem(KEY);
    if (v === "sage" || v === "forest" || v === "default") return v;
  } catch {}
  return "default";
}

export function applyTheme(theme: ThemeId) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "default") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
}

export function setTheme(theme: ThemeId) {
  try { localStorage.setItem(KEY, theme); } catch {}
  applyTheme(theme);
}
