import { createFileRoute } from "@tanstack/react-router";
import { quranCdnAudioUrl, RECITERS } from "@/lib/quran-api";

const RECITER_IDS = new Set(RECITERS.map((reciter) => reciter.id));

export const Route = createFileRoute("/api/public/quran-audio/$reciter/$ayah")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const ayah = Number(params.ayah);
        if (!RECITER_IDS.has(params.reciter) || !Number.isInteger(ayah) || ayah < 1 || ayah > 6236) {
          return new Response("Not found", { status: 404 });
        }

        const upstream = await fetch(quranCdnAudioUrl(ayah, params.reciter));
        if (!upstream.ok || !upstream.body) return new Response("Audio unavailable", { status: 502 });

        return new Response(upstream.body, {
          headers: {
            "Content-Type": "audio/mpeg",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});