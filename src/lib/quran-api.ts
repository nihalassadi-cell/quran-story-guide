// Helpers for AlQuran.cloud public CDN.
// Audio CDN: https://cdn.islamic.network/quran/audio/128/{reciter}/{ayahGlobalNumber}.mp3

export const RECITERS = [
  { id: "ar.alafasy", name: "Mishary Alafasy" },
  { id: "ar.husary", name: "Mahmoud Khalil Al-Husary" },
  { id: "ar.abdulbasitmurattal", name: "Abdul Basit (Murattal)" },
  { id: "ar.minshawi", name: "Mohamed Siddiq Al-Minshawi" },
  { id: "ar.hudhaify", name: "Ali Al-Hudhaify" },
] as const;

export const TRANSLATION_LANGUAGES = [
  { code: "en", name: "English", edition: "en.sahih" },
  { code: "ur", name: "اردو (Urdu)", edition: "ur.jalandhry" },
] as const;

export type LanguageCode = (typeof TRANSLATION_LANGUAGES)[number]["code"];

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
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch Surah ${surahNumber}`);
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
