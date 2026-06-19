export type ThemeId = "default" | "emerald";

export const THEMES: { id: ThemeId; name: string; description: string }[] = [
  { id: "default", name: "Noor (Default)", description: "Warm charcoal & gold" },
  { id: "emerald", name: "Emerald & Sand", description: "Premium warm balance" },
];

const KEY = "noor:theme";

export function getStoredTheme(): ThemeId {
  if (typeof window === "undefined") return "default";
  try {
    const v = localStorage.getItem(KEY);
    if (v === "emerald" || v === "default") return v;
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
