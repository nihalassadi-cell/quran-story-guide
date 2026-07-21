import { Link, useLocation } from "@tanstack/react-router";
import { Sun, BookOpen, Heart, Settings } from "lucide-react";
import { useT } from "@/lib/i18n";

export function AppShell({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  const t = useT();

  const tabs = [
    { to: "/today", icon: Sun, label: t("tab.today") },
    { to: "/quran", icon: BookOpen, label: t("tab.quran") },
    { to: "/animate", icon: Heart, label: t("tab.feelings") },
    { to: "/settings", icon: Settings, label: t("tab.settings") },
  ] as const;


  return (
    <div className="min-h-screen flex flex-col pb-28">
      <main className="flex-1 pt-[calc(env(safe-area-inset-top)+3.5rem)]">{children}</main>
      <nav
        className="fixed bottom-0 inset-x-0 z-40 border-t border-border/60 bg-card/70 backdrop-blur-2xl"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-background/80 to-transparent"
        />
        <ul className="relative flex items-stretch justify-around max-w-md mx-auto px-1">
          {tabs.map((t) => {
            const active =
              t.to === "/quran"
                ? loc.pathname === "/quran" ||
                  loc.pathname.startsWith("/quran/") ||
                  loc.pathname.startsWith("/surah/")
                : loc.pathname === t.to || loc.pathname.startsWith(t.to + "/");
            const Icon = t.icon;
            return (
              <li key={t.to} className="flex-1">
                <Link
                  to={t.to}
                  className={`group relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span
                    className={`relative grid place-items-center h-9 w-14 rounded-full transition-all ${
                      active
                        ? "bg-primary/12 shadow-[0_0_20px_-6px_var(--primary)]"
                        : "bg-transparent group-hover:bg-foreground/5"
                    }`}
                  >
                    <Icon
                      className={`h-[18px] w-[18px] transition-transform ${
                        active ? "scale-110" : "group-active:scale-90"
                      }`}
                    />
                  </span>
                  <span className="text-center leading-tight tracking-wide">{t.label}</span>
                  {active && (
                    <span
                      aria-hidden
                      className="absolute -top-px left-1/2 -translate-x-1/2 h-[2px] w-8 rounded-full bg-primary"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
