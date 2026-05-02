import { Link, useLocation } from "@tanstack/react-router";
import { Home, Search, Bookmark, Settings, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function AppShell({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { if (active) setIsAdmin(false); return; }
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      if (active) setIsAdmin(!!data);
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => check());
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, []);

  const tabs = [
    { to: "/", icon: Home, label: "Surahs" },
    { to: "/search", icon: Search, label: "Search" },
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
          {isAdmin && (
            <li className="flex-1">
              <Link
                to="/admin"
                className={`flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
                  loc.pathname.startsWith("/admin") ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Shield className="h-5 w-5" />
                <span>Admin</span>
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
