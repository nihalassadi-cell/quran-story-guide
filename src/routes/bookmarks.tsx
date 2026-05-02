import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Bookmark, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/bookmarks")({
  head: () => ({ meta: [{ title: "Bookmarks — Noor" }, { name: "description", content: "Saved verses for easy return." }] }),
  component: BookmarksPage,
});

interface Row { id: string; surah_number: number; verse_number: number; created_at: string; surahs: { name_translit: string; name_ar: string } | null; }

function BookmarksPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [needsAuth, setNeedsAuth] = useState(false);

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setNeedsAuth(true); return; }
    setNeedsAuth(false);
    const { data } = await supabase.from("bookmarks").select("id, surah_number, verse_number, created_at, surahs(name_translit, name_ar)").order("created_at", { ascending: false });
    setRows((data as any) ?? []);
  };
  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    toast.success("Removed");
    load();
  };

  return (
    <AppShell>
      <div className="max-w-md mx-auto px-4 pt-8">
        <h1 className="text-2xl font-bold mb-1 gold-text">Bookmarks</h1>
        <p className="text-sm text-muted-foreground mb-5">Tap a saved verse to resume right where you left off.</p>

        {needsAuth && (
          <div className="rounded-xl border border-border bg-card/60 p-6 text-center">
            <Bookmark className="h-8 w-8 text-primary mx-auto mb-3" />
            <p className="text-sm mb-4">Sign in to save and sync your bookmarks.</p>
            <button onClick={() => navigate({ to: "/auth" })} className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium">Sign in</button>
          </div>
        )}

        {!needsAuth && rows?.length === 0 && (
          <p className="text-center text-sm text-muted-foreground mt-8">No bookmarks yet. Open a Surah and tap the bookmark icon.</p>
        )}

        <ul className="space-y-2">
          {rows?.map((r) => (
            <li key={r.id} className="flex items-stretch gap-2">
              <Link to="/surah/$number" params={{ number: String(r.surah_number) }} search={{ verse: r.verse_number }} className="flex-1 rounded-lg bg-card/60 border border-border px-4 py-3 hover:border-primary/50">
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold">{r.surahs?.name_translit ?? `Surah ${r.surah_number}`}</span>
                  <span className="arabic text-primary/90">{r.surahs?.name_ar}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Verse {r.verse_number}</p>
              </Link>
              <button onClick={() => remove(r.id)} className="rounded-lg border border-border px-3 hover:bg-destructive/10 hover:border-destructive/50">
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}
