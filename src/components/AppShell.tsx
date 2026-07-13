import { Link, useLocation } from "@tanstack/react-router";
import { Sun, BookOpen, Heart, Settings } from "lucide-react";
import { useT } from "@/lib/i18n";

export function AppShell({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  const t = useT();

  const tabs = [
    { to: "/today", icon: Sun, label: t("tab.today") },
    { to: "/", icon: BookOpen, label: t("tab.quran") },
    { to: "/animate", icon: Heart, label: t("tab.feelings") },
    { to: "/settings", icon: Settings, label: t("tab.settings") },
  ] as const;


  return (
    <div className="min-h-screen flex flex-col pb-20">
      <main className="flex-1 pt-[calc(env(safe-area-inset-top)+3.5rem)]">{children}</main>
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-card/90 backdrop-blur-xl border-t border-border">
        <ul className="flex items-stretch justify-around max-w-md mx-auto">
          {tabs.map((t) => {
            const active =
              t.to === "/"
                ? loc.pathname === "/"
                : loc.pathname === t.to || loc.pathname.startsWith(t.to + "/");
            const Icon = t.icon;
            return (
              <li key={t.to} className="flex-1">
                <Link
                  to={t.to}
                  className={`flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-center leading-tight">{t.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
