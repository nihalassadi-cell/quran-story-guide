import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const BUCKET = "narrations";
const VOICE_ID = "EXAVITQu4vr4xnSDxMaL"; // Sarah — multilingual
const DAILY_LIMIT = 50;
const MAX_TEXT_LEN = 600;

type Result = { url: string | null; error?: string };

async function cachedUrl(surahNumber: number, verseNumber: number, language: string): Promise<string | null> {
  const path = `surah-${surahNumber}/v${verseNumber}-${language}.mp3`;
  const { data: existing } = await supabaseAdmin.storage.from(BUCKET).list(`surah-${surahNumber}`, {
    search: `v${verseNumber}-${language}.mp3`,
    limit: 1,
  });
  if (existing && existing.length > 0) {
    const { data: pub } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
    return pub.publicUrl;
  }
  return null;
}

// Public — anyone can fetch a cached narration. Returns null if not cached.
export const getCachedNarrationUrl = createServerFn({ method: "POST" })
  .inputValidator((data: { surahNumber: number; verseNumber: number; language: string }) => data)
  .handler(async ({ data }): Promise<Result> => {
    try {
      const url = await cachedUrl(data.surahNumber, data.verseNumber, data.language);
      return { url };
    } catch (e) {
      console.error("[tts] cache lookup failed", e);
      return { url: null, error: "lookup_failed" };
    }
  });

// Authenticated — generates if not cached. Rate-limited per user.
export const generateNarration = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { surahNumber: number; verseNumber: number; language: string; text: string }) => data)
  .handler(async ({ data, context }): Promise<Result> => {
    try {
      const { surahNumber, verseNumber, language, text } = data;
      const userId = (context as { userId: string }).userId;

      const cached = await cachedUrl(surahNumber, verseNumber, language);
      if (cached) return { url: cached };

      if (text.length > MAX_TEXT_LEN) {
        return { url: null, error: "text_too_long" };
      }

      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { count } = await supabaseAdmin
        .from("tts_usage")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", since);
      if ((count ?? 0) >= DAILY_LIMIT) {
        return { url: null, error: "daily_limit" };
      }

      const apiKey = process.env.ELEVENLABS_API_KEY;
      if (!apiKey) return { url: null, error: "missing_api_key" };

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
        const errText = await res.text();
        console.error("[tts] elevenlabs error", res.status, errText);
        return { url: null, error: `elevenlabs_${res.status}` };
      }
      const audio = new Uint8Array(await res.arrayBuffer());

      const path = `surah-${surahNumber}/v${verseNumber}-${language}.mp3`;
      const { error: upErr } = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(path, audio, { contentType: "audio/mpeg", upsert: true });
      if (upErr) {
        console.error("[tts] upload failed", upErr);
        return { url: null, error: "upload_failed" };
      }

      await supabaseAdmin.from("tts_usage").insert({ user_id: userId });

      const { data: pub } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
      return { url: pub.publicUrl };
    } catch (e) {
      console.error("[tts] generate failed", e);
      return { url: null, error: "unexpected" };
    }
  });
