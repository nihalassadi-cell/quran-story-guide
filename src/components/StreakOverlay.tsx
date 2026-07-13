import { useEffect, useState } from "react";
import { getStreak, todayISO } from "@/lib/reading-progress";
import { useT } from "@/lib/i18n";
import { useAuthUser } from "@/hooks/use-auth-user";

const LS_KEY = "noor:streakOverlay:lastShown";

export function StreakOverlay() {
  const t = useT();
  const { user } = useAuthUser();
  const [count, setCount] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const s = await getStreak();
      if (!alive) return;
      const today = todayISO();
      // Show only if: current_streak > 0, last completed yesterday (returning after success),
      // and we haven't shown it today.
      if (!s.last_completed_date || s.current_streak < 1) return;
      const shownAt = (() => { try { return localStorage.getItem(LS_KEY); } catch { return null; } })();
      if (shownAt === today) return;
      // Only celebrate on a NEW day (last_completed was before today).
      if (s.last_completed_date === today) return;
      try { localStorage.setItem(LS_KEY, today); } catch {}
      setCount(s.current_streak);
    })();
    return () => { alive = false; };
  }, [user?.id]);

  if (count == null || dismissed) return null;

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-background/85 backdrop-blur-md animate-in fade-in duration-500"
      onClick={() => setDismissed(true)}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-primary/70 animate-ping"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
      <div className="relative text-center px-8 max-w-sm">
        <p className="font-display-serif italic text-4xl gold-text leading-tight">
          {t("streak.alhamdulillah")}
        </p>
        <p className="mt-3 text-lg text-foreground">
          {count} {count === 1 ? t("streak.day") : t("streak.days")} {t("streak.inARow")}
        </p>
        <p className="mt-6 text-xs text-muted-foreground uppercase tracking-widest">
          {t("streak.tapToContinue")}
        </p>
      </div>
    </div>
  );
}
