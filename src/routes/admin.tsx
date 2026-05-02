import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Shield } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Noor" }] }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "denied" | "ok">("loading");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate({ to: "/auth" }); return; }
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      setStatus(data ? "ok" : "denied");
    })();
  }, [navigate]);

  return (
    <AppShell>
      <div className="max-w-md mx-auto px-4 pt-8">
        <div className="flex items-center gap-2 mb-1"><Shield className="h-5 w-5 text-primary" /><h1 className="text-2xl font-bold gold-text">Admin Generator</h1></div>
        <p className="text-sm text-muted-foreground mb-5">Build the animated library on demand. Generation pipeline (image + translated narration) coming in the next step.</p>

        {status === "loading" && <p className="text-sm text-muted-foreground">Checking permissions…</p>}
        {status === "denied" && (
          <div className="rounded-xl border border-border bg-card/60 p-6">
            <p className="text-sm">You do not have admin access. To enable generation, an existing admin must grant your account the admin role in the backend.</p>
          </div>
        )}
        {status === "ok" && (
          <div className="rounded-xl border border-border bg-card/60 p-6 space-y-2">
            <p className="text-sm">Welcome, admin. The generator UI (select Surah → generate scenes + narration) will be wired up next, along with the ElevenLabs voice integration.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
