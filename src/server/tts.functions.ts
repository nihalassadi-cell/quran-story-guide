import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const BUCKET = "narrations";
// Sarah — multilingual voice that handles Urdu, Indonesian, Turkish, etc.
const VOICE_ID = "EXAVITQu4vr4xnSDxMaL";

export const getNarrationUrl = createServerFn({ method: "POST" })
  .inputValidator((data: { surahNumber: number; verseNumber: number; language: string; text: string }) => data)
  .handler(async ({ data }): Promise<{ url: string }> => {
    const { surahNumber, verseNumber, language, text } = data;
    const path = `surah-${surahNumber}/v${verseNumber}-${language}.mp3`;

    // 1. If already cached, return the public URL immediately (no API cost).
    const { data: existing } = await supabaseAdmin.storage.from(BUCKET).list(`surah-${surahNumber}`, {
      search: `v${verseNumber}-${language}.mp3`,
      limit: 1,
    });
    if (existing && existing.length > 0) {
      const { data: pub } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
      return { url: pub.publicUrl };
    }

    // 2. Otherwise, generate via ElevenLabs.
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) throw new Error("ELEVENLABS_API_KEY is not configured");

    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: { stability: 0.55, similarity_boost: 0.75, style: 0.3, use_speaker_boost: true, speed: 0.95 },
        }),
      },
    );
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`ElevenLabs TTS failed [${res.status}]: ${err}`);
    }
    const audio = new Uint8Array(await res.arrayBuffer());

    // 3. Cache to storage and return public URL.
    const { error: upErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(path, audio, { contentType: "audio/mpeg", upsert: true });
    if (upErr) throw new Error(`Storage upload failed: ${upErr.message}`);

    const { data: pub } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
    return { url: pub.publicUrl };
  });
