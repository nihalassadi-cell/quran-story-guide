// Helpers for AlQuran.cloud public CDN.
// Audio CDN: https://cdn.islamic.network/quran/audio/128/{reciter}/{ayahGlobalNumber}.mp3

export const RECITERS = [
  { id: "ar.alafasy", name: "Mishary Alafasy" },
  { id: "ar.husary", name: "Mahmoud Khalil Al-Husary" },
  { id: "ar.abdulbasitmurattal", name: "Abdul Basit (Murattal)" },
  { id: "ar.minshawi", name: "Mohamed Siddiq Al-Minshawi" },
  { id: "ar.hudhaify", name: "Ali Al-Hudhaify" },
] as const;

// 10 languages — codes align with src/lib/language.ts. `edition` is the
// alquran.cloud translation edition code.
export const TRANSLATION_LANGUAGES = [
  { code: "en", name: "English", edition: "en.sahih" },
  { code: "ur", name: "اردو (Urdu)", edition: "ur.jalandhry" },
  { code: "ru", name: "Русский (Russian)", edition: "ru.kuliev" },
  { code: "bn", name: "বাংলা (Bengali)", edition: "bn.bengali" },
  { code: "fa", name: "فارسی (Persian)", edition: "fa.makarem" },
  { code: "id", name: "Bahasa Indonesia", edition: "id.indonesian" },
  { code: "ms", name: "Bahasa Melayu", edition: "ms.basmeih" },
  { code: "tr", name: "Türkçe (Turkish)", edition: "tr.diyanet" },
  { code: "fr", name: "Français (French)", edition: "fr.hamidullah" },
  { code: "de", name: "Deutsch (German)", edition: "de.aburida" },
] as const;

export type LanguageCode = (typeof TRANSLATION_LANGUAGES)[number]["code"];

/** Languages for which recorded translation-recitation audio is available. */
const TRANSLATION_AUDIO_LANGS: ReadonlySet<string> = new Set(["en", "ur"]);

export function hasTranslationAudio(language: string): boolean {
  return TRANSLATION_AUDIO_LANGS.has(language);
}

export function ayahAudioUrl(globalNumber: number, reciter: string) {
  return `https://cdn.islamic.network/quran/audio/128/${reciter}/${globalNumber}.mp3`;
}

export interface AyahData {
  number: number; // global ayah number (1..6236)
  numberInSurah: number;
  text: string;
  juz: number;
  page: number;
}

export interface FetchedSurah {
  number: number;
  name_ar: string;
  name_en: string;
  ayahs: AyahData[];
  translations: { numberInSurah: number; text: string }[];
}

export async function fetchSurahWithTranslation(
  surahNumber: number,
  language: LanguageCode = "en",
): Promise<FetchedSurah> {
  const lang = TRANSLATION_LANGUAGES.find((l) => l.code === language) ?? TRANSLATION_LANGUAGES[0];
  const url = `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,${lang.edition}`;
  let res = await fetch(url);
  if (!res.ok) {
    // Fallback to English if the requested translation edition isn't available.
    const fallback = `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,${TRANSLATION_LANGUAGES[0].edition}`;
    res = await fetch(fallback);
    if (!res.ok) throw new Error(`Failed to fetch Surah ${surahNumber}`);
  }
  const json = await res.json();
  const [arabic, translation] = json.data;
  return {
    number: arabic.number,
    name_ar: arabic.name,
    name_en: arabic.englishName,
    ayahs: arabic.ayahs.map((a: any) => ({
      number: a.number,
      numberInSurah: a.numberInSurah,
      text: a.text,
      juz: a.juz,
      page: a.page,
    })),
    translations: translation.ayahs.map((a: any) => ({
      numberInSurah: a.numberInSurah,
      text: a.text,
    })),
  };
}
