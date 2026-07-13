import { createFileRoute } from "@tanstack/react-router";

const LANG_NAMES: Record<string, string> = {
  en: "English", ur: "Urdu", ru: "Russian", bn: "Bengali", fa: "Persian",
  id: "Indonesian", ms: "Malay", tr: "Turkish", fr: "French", de: "German",
};

export const Route = createFileRoute("/api/translate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response(JSON.stringify({ error: "missing_key" }), { status: 503 });
        let body: { text?: string; lang?: string };
        try { body = await request.json() as typeof body; }
        catch { return new Response(JSON.stringify({ error: "invalid_json" }), { status: 400 }); }
        const text = (body.text ?? "").trim();
        const lang = (body.lang ?? "").toLowerCase();
        if (!text || !lang || lang === "en") {
          return new Response(JSON.stringify({ text }), { headers: { "Content-Type": "application/json" } });
        }
        const target = LANG_NAMES[lang] || lang;
        try {
          const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash-lite",
              messages: [
                { role: "system", content: `You are a reverent translator of sacred narration. Translate into ${target}. Preserve tone, cadence and meaning. Reply with ONLY the translation — no preface, no quotes.` },
                { role: "user", content: text },
              ],
              temperature: 0.2,
            }),
          });
          if (!res.ok) return new Response(JSON.stringify({ error: `upstream_${res.status}`, text }), { status: 200, headers: { "Content-Type": "application/json" } });
          const json = await res.json() as { choices?: Array<{ message?: { content?: string } }> };
          const out = json.choices?.[0]?.message?.content?.trim() || text;
          return new Response(JSON.stringify({ text: out }), {
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          });
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          return new Response(JSON.stringify({ error: msg, text }), { status: 200, headers: { "Content-Type": "application/json" } });
        }
      },
    },
  },
});
