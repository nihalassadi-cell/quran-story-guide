// Lightweight cache for all 114 surah metas (number, name_ar, name_translit, verses).
import { supabase } from "@/integrations/supabase/client";

export type SurahMeta = {
  number: number;
  name_ar: string;
  name_translit: string;
  verses_count: number;
};

let cache: SurahMeta[] | null = null;
let pending: Promise<SurahMeta[]> | null = null;

export async function getAllSurahMeta(): Promise<SurahMeta[]> {
  if (cache) return cache;
  if (pending) return pending;
  pending = (async () => {
    const { data, error } = await supabase
      .from("surahs")
      .select("number,name_ar,name_translit,verses_count")
      .order("number", { ascending: true });
    if (error || !data) {
      pending = null;
      return [];
    }
    cache = data as SurahMeta[];
    pending = null;
    return cache;
  })();
  return pending;
}

export async function getSurahMeta(number: number): Promise<SurahMeta | null> {
  const all = await getAllSurahMeta();
  return all.find((s) => s.number === number) ?? null;
}
