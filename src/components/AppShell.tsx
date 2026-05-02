import { Link, useLocation } from "@tanstack/react-router";
import { Home, Search, Bookmark, Settings, Sparkles } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const loc = useLocation();

  const tabs = [
    { to: "/", icon: Home, label: "Surahs" },
    { to: "/search", icon: Search, label: "Search" },
    { to: "/animate", icon: Sparkles, label: "Animate" },
    { to: "/bookmarks", icon: Bookmark, label: "Saved" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <main className="flex-1">{children}</main>
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-card/90 backdrop-blur-xl border-t border-border">
        <ul className="flex items-stretch justify-around max-w-md mx-auto">
          {tabs.map((t) => {
            const active = loc.pathname === t.to || (t.to !== "/" && loc.pathname.startsWith(t.to));
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
                  <span>{t.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
