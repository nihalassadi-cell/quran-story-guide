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

function buildPrompt(arabic: string, translation: string, isProphetVerse: boolean): string {
  const base =
    "Reverent, painterly Islamic illuminated-manuscript style scene. Warm gold, deep teal, parchment cream. Soft cinematic light, calligraphic ornament motifs in corners. No text, no writing, no characters with detailed faces. Modest, dignified, contemplative mood. Wide cinematic 16:9 composition.";
  const safety =
    " Strictly avoid: any depiction of Allah, any depiction of the Prophet Muhammad ﷺ, any depiction of the inside of the Kaaba, any human faces in detail, any modern objects.";

  if (isProphetVerse) {
    return `Symbolic scene representing this Quranic verse without depicting the Prophet Muhammad ﷺ. Use light rays, the silhouette of the city of Madinah at dawn, calligraphy-inspired forms, or a single glowing lantern. Verse meaning: "${translation}". ${base}${safety}`;
  }
  return `Symbolic scene illustrating the meaning of this Quranic verse: "${translation}". ${base}${safety}`;
}

async function generateImage(prompt: string): Promise<Uint8Array | null> {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-image",
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
    // Auth: require admin role
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const { data: roleRow } = await userClient.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
    if (!roleRow) return new Response(JSON.stringify({ error: "Admin only" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const body = await req.json();
    const surahNumber: number = body.surahNumber;
    const batchSize: number = Math.min(body.batchSize ?? 3, 5);
    if (!surahNumber || surahNumber < 1 || surahNumber > 114) {
      return new Response(JSON.stringify({ error: "Invalid surahNumber" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // 1. Ensure verses + translations exist
    const verses = await ensureVerses(admin, surahNumber);

    // 2. Find verses without a ready scene
    const verseIds = verses.map((v) => v.id);
    const { data: existingScenes } = await admin.from("scenes").select("verse_id, status").in("verse_id", verseIds);
    const sceneMap = new Map<string, string>((existingScenes ?? []).map((s: any) => [s.verse_id, s.status]));
    const pending = verses.filter((v) => sceneMap.get(v.id) !== "ready").slice(0, batchSize);

    // 3. Load translations for those verses
    const { data: translations } = await admin.from("translations").select("verse_id, text").eq("language", "en").in("verse_id", pending.map((v) => v.id));
    const trMap = new Map<string, string>((translations ?? []).map((t: any) => [t.verse_id, t.text]));

    const results: { verse: number; ok: boolean; error?: string }[] = [];

    for (const v of pending) {
      try {
        // mark pending
        await admin.from("scenes").upsert({ verse_id: v.id, status: "pending" }, { onConflict: "verse_id" });
        const prompt = buildPrompt(v.text_ar, trMap.get(v.id) ?? "", v.mentions_prophet_muhammad);
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
