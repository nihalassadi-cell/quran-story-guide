// Generates animated scenes for a Surah:
// 1. Fetches Arabic + translation from AlQuran.cloud
// 2. Inserts/updates verses + translations rows
// 3. For each verse, builds a reverent prompt and generates an image via Lovable AI Gateway
// 4. Uploads image to scene-images bucket, writes scenes row
// Designed to be called per-verse-batch so it stays under edge function timeouts.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

// Names referencing Prophet Muhammad ﷺ — verses containing these get symbolic imagery.
const PROPHET_TOKENS = ["مُحَمَّد", "محمد", "ٱلنَّبِيّ", "النبي", "ٱلرَّسُول", "الرسول", "أَحْمَد", "أحمد"];

function mentionsProphet(arabic: string): boolean {
  return PROPHET_TOKENS.some((t) => arabic.includes(t));
}

const STYLE =
  "Reverent, painterly Islamic illuminated-manuscript style. Warm gold, deep teal, parchment cream. Soft cinematic light, calligraphic ornament motifs in corners. No text, no writing, no human faces in detail. Modest, dignified, contemplative. Wide cinematic 16:9 composition.";
const SAFETY =
  "Strictly avoid: any depiction of Allah, any depiction of the Prophet Muhammad ﷺ, any depiction of the inside of the Kaaba, any human faces in detail, any modern objects, any text or writing.";

// Step 1: ask an LLM to translate verse meaning into a concrete, paintable visual scene.
async function describeScene(arabic: string, translation: string, isProphetVerse: boolean): Promise<string> {
  const guidance = isProphetVerse
    ? "This verse mentions the Prophet Muhammad ﷺ. Do NOT describe him directly. Use symbolic imagery: light rays, the silhouette of Madinah at dawn, a glowing lantern, calligraphy-inspired forms, an open path."
    : "Describe a concrete, symbolic scene that captures the verse's meaning. Use natural elements (sky, water, mountains, gardens, stars, birds, lamps, doorways, paths) — not people in detail.";

  const sys = `You are an art director for a reverent Quranic visual experience. Given a verse, produce ONE vivid 2-3 sentence visual scene description suitable for an image model. Focus on what the viewer SEES: setting, lighting, key symbolic objects, mood. ${guidance} Never include text, faces, Allah, or the Prophet ﷺ. Output ONLY the scene description, no preface.`;

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: sys },
        { role: "user", content: `Arabic: ${arabic}\n\nTranslation: "${translation}"` },
      ],
    }),
  });
  if (!res.ok) {
    if (res.status === 429) throw new Error("rate_limited");
    if (res.status === 402) throw new Error("payment_required");
    return translation; // fallback
  }
  const json = await res.json();
  const desc: string = json.choices?.[0]?.message?.content?.trim() ?? translation;
  return desc;
}

function buildImagePrompt(sceneDescription: string): string {
  return `${sceneDescription}\n\nStyle: ${STYLE}\n\n${SAFETY}`;
}

async function generateImage(prompt: string): Promise<Uint8Array | null> {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-3.1-flash-image-preview",
      messages: [{ role: "user", content: prompt }],
      modalities: ["image", "text"],
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    console.error("AI gateway error", res.status, txt);
    if (res.status === 429) throw new Error("rate_limited");
    if (res.status === 402) throw new Error("payment_required");
    return null;
  }
  const json = await res.json();
  const dataUrl: string | undefined = json.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (!dataUrl?.startsWith("data:image/")) return null;
  const b64 = dataUrl.split(",")[1];
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

interface AlquranAyah { number: number; numberInSurah: number; text: string; juz: number; page: number }

async function ensureVerses(admin: any, surahNumber: number): Promise<{ id: string; verse_number: number; text_ar: string; mentions_prophet_muhammad: boolean }[]> {
  const { data: existing } = await admin
    .from("verses")
    .select("id, verse_number, text_ar, mentions_prophet_muhammad")
    .eq("surah_number", surahNumber)
    .order("verse_number");
  if (existing && existing.length > 0) return existing;

  const url = `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.sahih`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch Surah from AlQuran.cloud");
  const json = await res.json();
  const [arabic, english] = json.data;

  const versesRows = arabic.ayahs.map((a: AlquranAyah) => ({
    surah_number: surahNumber,
    verse_number: a.numberInSurah,
    text_ar: a.text,
    juz: a.juz,
    page: a.page,
    mentions_prophet_muhammad: mentionsProphet(a.text),
  }));
  const { data: inserted, error: insErr } = await admin
    .from("verses")
    .insert(versesRows)
    .select("id, verse_number, text_ar, mentions_prophet_muhammad");
  if (insErr) throw insErr;

  const byVerseNum = new Map<number, string>(inserted.map((v: any) => [v.verse_number, v.id]));
  const translationRows = english.ayahs.map((a: AlquranAyah) => ({
    verse_id: byVerseNum.get(a.numberInSurah)!,
    language: "en",
    source: "en.sahih",
    text: a.text,
  }));
  await admin.from("translations").insert(translationRows);
  return inserted;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Open to all users — no auth required for scene generation.
    const body = await req.json();
    const surahNumber: number = body.surahNumber;
    const batchSize: number = Math.min(body.batchSize ?? 3, 5);
    if (!surahNumber || surahNumber < 1 || surahNumber > 114) {
      return new Response(JSON.stringify({ error: "Invalid surahNumber" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // 1. Ensure verses + translations exist
    const verses = await ensureVerses(admin, surahNumber);

    const regenerate: boolean = !!body.regenerate;

    // 2. Find verses to process
    const verseIds = verses.map((v) => v.id);
    const { data: existingScenes } = await admin.from("scenes").select("verse_id, status").in("verse_id", verseIds);
    const sceneMap = new Map<string, string>((existingScenes ?? []).map((s: any) => [s.verse_id, s.status]));
    const pending = (regenerate ? verses : verses.filter((v) => sceneMap.get(v.id) !== "ready")).slice(0, batchSize);

    // 3. Load translations for those verses
    const { data: translations } = await admin.from("translations").select("verse_id, text").eq("language", "en").in("verse_id", pending.map((v) => v.id));
    const trMap = new Map<string, string>((translations ?? []).map((t: any) => [t.verse_id, t.text]));

    const results: { verse: number; ok: boolean; error?: string }[] = [];

    for (const v of pending) {
      try {
        // mark pending
        await admin.from("scenes").upsert({ verse_id: v.id, status: "pending" }, { onConflict: "verse_id" });
        const sceneDesc = await describeScene(v.text_ar, trMap.get(v.id) ?? "", v.mentions_prophet_muhammad);
        const prompt = buildImagePrompt(sceneDesc);
        const bytes = await generateImage(prompt);
        if (!bytes) {
          await admin.from("scenes").upsert({ verse_id: v.id, status: "failed", error: "no_image", image_prompt: prompt }, { onConflict: "verse_id" });
          results.push({ verse: v.verse_number, ok: false, error: "no_image" });
          continue;
        }
        const path = `${surahNumber}/${v.verse_number}.png`;
        const { error: upErr } = await admin.storage.from("scene-images").upload(path, bytes, { contentType: "image/png", upsert: true });
        if (upErr) throw upErr;
        const { data: pub } = admin.storage.from("scene-images").getPublicUrl(path);
        await admin.from("scenes").upsert({ verse_id: v.id, status: "ready", image_url: pub.publicUrl, image_prompt: prompt, error: null }, { onConflict: "verse_id" });
        results.push({ verse: v.verse_number, ok: true });
      } catch (e: any) {
        const msg = e?.message ?? String(e);
        await admin.from("scenes").upsert({ verse_id: v.id, status: "failed", error: msg }, { onConflict: "verse_id" });
        results.push({ verse: v.verse_number, ok: false, error: msg });
        if (msg === "rate_limited" || msg === "payment_required") break;
      }
    }

    // 4. Recompute is_animated
    const { data: allScenes } = await admin.from("scenes").select("verse_id, status").in("verse_id", verseIds);
    const readyCount = (allScenes ?? []).filter((s: any) => s.status === "ready").length;
    const isAnimated = readyCount === verses.length;
    await admin.from("surahs").update({ is_animated: isAnimated }).eq("number", surahNumber);

    return new Response(
      JSON.stringify({
        surahNumber,
        totalVerses: verses.length,
        readyCount,
        processed: results,
        done: readyCount === verses.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e: any) {
    console.error("generate-surah error", e);
    return new Response(JSON.stringify({ error: e?.message ?? "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
