import { createFileRoute } from "@tanstack/react-router";

// POST /api/tts  { text, lang }  →  audio/mpeg
// Uses Lovable AI Gateway (openai/gpt-4o-mini-tts). Non-streaming for
// simple caching on the client. Falls back gracefully; the player has
// Web Speech backup if this ever fails.

export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        let body: { text?: string; lang?: string; voice?: string };
        try {
          body = (await request.json()) as typeof body;
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        const text = (body.text ?? "").trim();
        if (!text) return new Response("Missing text", { status: 400 });
        if (text.length > 4000) return new Response("Text too long", { status: 400 });

        const voice = body.voice || "onyx"; // warm, calm, narration-friendly

        try {
          const upstream = await fetch(
            "https://ai.gateway.lovable.dev/v1/audio/speech",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${key}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "openai/gpt-4o-mini-tts",
                input: text,
                voice,
                response_format: "mp3",
                speed: 0.95,
                instructions:
                  "Speak slowly, warmly, and reverently, like a cinematic narrator telling a sacred story. Take gentle pauses at punctuation.",
              }),
            },
          );

          if (!upstream.ok) {
            const errText = await upstream.text().catch(() => "");
            return new Response(errText || "TTS upstream failed", {
              status: upstream.status,
            });
          }

          // Pass through as audio/mpeg with long cache (deterministic for same text+voice)
          return new Response(upstream.body, {
            headers: {
              "Content-Type": "audio/mpeg",
              "Cache-Control": "public, max-age=31536000, immutable",
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
