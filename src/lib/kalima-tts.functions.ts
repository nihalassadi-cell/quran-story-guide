import { createServerFn } from "@tanstack/react-start";
import {
  KALIMA_TTS_BUCKET,
  KALIMA_VOICE_ID,
  KALIMA_VOICE_SETTINGS,
  kalimaAudioEndpoint,
  kalimaAudioPath,
  kalimaCacheHash,
  isValidKalimaText,
} from "@/lib/kalima-tts.shared";

type Result = { url: string | null; error?: string; warming?: boolean };

// Public — Arabic TTS for short kalimas/dhikr. Cached by sha256 of the text so
// repeat callers always hit storage. No auth required: input is a bounded
// Arabic string and the cost is one-time per unique kalima.
export const getKalimaAudio = createServerFn({ method: "POST" })
  .inputValidator((data: { text: string; warmOnly?: boolean }) => {
    if (!data || typeof data.text !== "string") throw new Error("invalid_text");
    const text = data.text.trim();
    if (!isValidKalimaText(text)) throw new Error("invalid_length");
    return { text, warmOnly: data.warmOnly === true };
  })
  .handler(async ({ data }): Promise<Result> => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

      const key = await kalimaCacheHash(data.text);
      const path = kalimaAudioPath(key);
      const cachedUrl = kalimaAudioEndpoint(key);
      const streamUrl = kalimaAudioEndpoint(key, data.text);

      const { data: existing } = await supabaseAdmin.storage.from(KALIMA_TTS_BUCKET).list("kalimas", {
        search: `${key}.mp3`,
        limit: 1,
      });
      if (existing && existing.length > 0) {
        return { url: cachedUrl };
      }

      if (data.warmOnly) {
        return { url: streamUrl, warming: true };
      }

      const apiKey = process.env.ELEVENLABS_API_KEY;
      if (!apiKey) return { url: null, error: "missing_api_key" };

      const res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${KALIMA_VOICE_ID}?output_format=mp3_44100_128`,
        {
          method: "POST",
          headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
          body: JSON.stringify({
            text: data.text,
            model_id: "eleven_multilingual_v2",
            voice_settings: KALIMA_VOICE_SETTINGS,
          }),
        },
      );
      if (!res.ok) {
        const errText = await res.text();
        console.error("[tts:kalima] elevenlabs error", res.status, errText);
        return { url: null, error: `elevenlabs_${res.status}` };
      }
      const audio = new Uint8Array(await res.arrayBuffer());

      const { error: upErr } = await supabaseAdmin.storage
        .from(KALIMA_TTS_BUCKET)
        .upload(path, audio, { contentType: "audio/mpeg", upsert: true });
      if (upErr) {
        console.error("[tts:kalima] upload failed", upErr);
        return { url: null, error: "upload_failed" };
      }

      return { url: cachedUrl };
    } catch (e) {
      console.error("[tts:kalima] generate failed", e);
      return { url: null, error: "unexpected" };
    }
  });
