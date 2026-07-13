import { createFileRoute } from "@tanstack/react-router";
import { KALIMA_VOICE_ID } from "@/lib/kalima-tts.shared";

// POST /api/tts  { text, lang? }  →  audio/mpeg
// Uses ElevenLabs "Brian" (multilingual v2) — same calm voice used for kalimahs.
// If `lang` is a non-English target and the client asks (via `translate: true`),
// the server translates the English text via Lovable AI Gateway first, then
// synthesizes speech in that language with the multilingual model.

const LANG_NAMES: Record<string, string> = {
  en: "English", ur: "Urdu", ru: "Russian", bn: "Bengali", fa: "Persian",
  id: "Indonesian", ms: "Malay", tr: "Turkish", fr: "French", de: "German",
};

async function translate(text: string, langCode: string, lovableKey: string): Promise<string> {
  const target = LANG_NAMES[langCode] || langCode;
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${lovableKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-lite",
      messages: [
        { role: "system", content: `You are a reverent translator of sacred narration. Translate the user's text into ${target}. Preserve tone, cadence and meaning. Reply with ONLY the translation — no preface, no quotes.` },
        { role: "user", content: text },
      ],
      temperature: 0.2,
    }),
  });
  if (!res.ok) throw new Error(`translate ${res.status}`);
  const json = await res.json() as { choices?: Array<{ message?: { content?: string } }> };
  const out = json.choices?.[0]?.message?.content?.trim();
  if (!out) throw new Error("translate empty");
  return out;
}

export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const elevenKey = process.env.ELEVENLABS_API_KEY;
        if (!elevenKey) return new Response("Missing ELEVENLABS_API_KEY", { status: 503 });

        let body: { text?: string; lang?: string; translate?: boolean };
        try { body = await request.json() as typeof body; }
        catch { return new Response("Invalid JSON", { status: 400 }); }

        let text = (body.text ?? "").trim();
        if (!text) return new Response("Missing text", { status: 400 });
        if (text.length > 4000) return new Response("Text too long", { status: 400 });

        const lang = (body.lang || "en").toLowerCase();

        if (body.translate && lang !== "en") {
          const lovableKey = process.env.LOVABLE_API_KEY;
          if (lovableKey) {
            try { text = await translate(text, lang, lovableKey); }
            catch (e) { console.warn("[tts] translate failed, using original", e); }
          }
        }

        try {
          const upstream = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${KALIMA_VOICE_ID}?output_format=mp3_44100_128`,
            {
              method: "POST",
              headers: { "xi-api-key": elevenKey, "Content-Type": "application/json" },
              body: JSON.stringify({
                text,
                model_id: "eleven_multilingual_v2",
                voice_settings: {
                  stability: 0.6,
                  similarity_boost: 0.8,
                  style: 0.25,
                  use_speaker_boost: true,
                  speed: 0.92,
                },
              }),
            },
          );

          if (!upstream.ok) {
            const errText = await upstream.text().catch(() => "");
            console.error("[tts] elevenlabs error", upstream.status, errText);
            return new Response(errText || "TTS upstream failed", { status: upstream.status });
          }

          return new Response(upstream.body, {
            headers: {
              "Content-Type": "audio/mpeg",
              "Cache-Control": "public, max-age=31536000, immutable",
              "X-TTS-Lang": lang,
            },
          });
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          return new Response(`TTS error: ${msg}`, { status: 500 });
        }
      },
    },
  },
});
