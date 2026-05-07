import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const BUCKET = "narrations";
const VOICE_ID = "EXAVITQu4vr4xnSDxMaL"; // Sarah — multilingual
const DAILY_LIMIT = 50;
const MAX_TEXT_LEN = 600;

export const getNarrationUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { surahNumber: number; verseNumber: number; language: string; text: string }) => data)
  .handler(async ({ data, context }): Promise<{ url: string }> => {
    const { surahNumber, verseNumber, language, text } = data;
    const userId = (context as { userId: string }).userId;
    const path = `surah-${surahNumber}/v${verseNumber}-${language}.mp3`;

    // 1. Cache hit — free, no limit, no auth tracking.
    const { data: existing } = await supabaseAdmin.storage.from(BUCKET).list(`surah-${surahNumber}`, {
      search: `v${verseNumber}-${language}.mp3`,
      limit: 1,
    });
    if (existing && existing.length > 0) {
      const { data: pub } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
      return { url: pub.publicUrl };
    }

    // 2. Cache miss — enforce per-user daily rate limit before spending credits.
    if (text.length > MAX_TEXT_LEN) {
      throw new Error("Translation text too long for voiceover");
    }
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("tts_usage")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", since);
    if ((count ?? 0) >= DAILY_LIMIT) {
      throw new Error(`Daily voiceover limit (${DAILY_LIMIT}) reached. Try again tomorrow.`);
    }

    // 3. Generate via ElevenLabs.
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

    // 4. Cache + record usage.
    const { error: upErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(path, audio, { contentType: "audio/mpeg", upsert: true });
    if (upErr) throw new Error(`Storage upload failed: ${upErr.message}`);

    await supabaseAdmin.from("tts_usage").insert({ user_id: userId });

    const { data: pub } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
    return { url: pub.publicUrl };
  });
