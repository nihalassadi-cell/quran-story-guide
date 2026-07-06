import { createFileRoute } from "@tanstack/react-router";
import {
  KALIMA_TTS_BUCKET,
  KALIMA_VOICE_ID,
  KALIMA_VOICE_SETTINGS,
  isValidKalimaText,
  kalimaAudioPath,
  kalimaCacheHash,
} from "@/lib/kalima-tts.shared";

export const Route = createFileRoute("/api/public/kalima-tts/$hash")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        if (!/^[a-f0-9]{64}$/.test(params.hash)) {
          return new Response("Not found", { status: 404 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const path = kalimaAudioPath(params.hash);
        const { data, error } = await supabaseAdmin.storage
          .from(KALIMA_TTS_BUCKET)
          .download(path);

        if (!error && data) {
          return new Response(data, {
            headers: {
              "Content-Type": "audio/mpeg",
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          });
        }

        const text = new URL(request.url).searchParams.get("text")?.trim() ?? "";
        if (!isValidKalimaText(text)) return new Response("Not found", { status: 404 });
        if ((await kalimaCacheHash(text)) !== params.hash) return new Response("Not found", { status: 404 });

        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (!apiKey) return new Response("Audio unavailable", { status: 503 });

        const generated = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${KALIMA_VOICE_ID}/stream?output_format=mp3_44100_128`,
          {
            method: "POST",
            headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
            body: JSON.stringify({
              text,
              model_id: "eleven_turbo_v2_5",
              voice_settings: KALIMA_VOICE_SETTINGS,
            }),
          },
        );

        if (!generated.ok || !generated.body) return new Response("Audio unavailable", { status: 502 });

        const [clientStream, cacheStream] = generated.body.tee();
        void new Response(cacheStream).arrayBuffer().then((audio) => {
          return supabaseAdmin.storage
            .from(KALIMA_TTS_BUCKET)
            .upload(path, new Uint8Array(audio), { contentType: "audio/mpeg", upsert: true });
        }).catch((e) => console.warn("[tts:kalima] stream cache failed", e));

        return new Response(clientStream, {
          headers: {
            "Content-Type": "audio/mpeg",
            "Cache-Control": "public, max-age=86400",
          },
        });
      },
    },
  },
});