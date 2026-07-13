// Deterministic daily rotation. Same content for every user on a given date,
// derived from an epoch day number. Curated pools; expand freely.
//
// Phase 2 will move this into a `daily_content` table with scheduled rows.
// For MVP, the rotation is index = daysSinceEpoch % pool.length.

import type { LanguageCode } from "@/lib/quran-api";

export interface DailyVerse {
  surah: number;
  verse: number;
  surahName: string;
  arabic: string;
  translation: Partial<Record<LanguageCode, string>>;
}

export interface DailyHadith {
  arabic?: string;
  text: Partial<Record<LanguageCode, string>>;
  source: string; // e.g. "Bukhari 6502"
  narrator?: string;
}

export interface DailyDhikr {
  arabic: string;
  transliteration: string;
  translation: Partial<Record<LanguageCode, string>>;
  count: number;
  source: string;
}

export interface DailyReflection {
  prompt: Partial<Record<LanguageCode, string>>;
}

export interface DailyStoryTeaser {
  storyId: string; // maps to mood id for now (yunus → anxious). Phase 2 = real story ids.
  moodId: string;
  title: Partial<Record<LanguageCode, string>>;
  blurb: Partial<Record<LanguageCode, string>>;
  durationMin: number;
}

// ---------- Pools (widely-accepted sources; pending scholarly review) ----------

const VERSES: DailyVerse[] = [
  {
    surah: 2, verse: 286, surahName: "Al-Baqarah",
    arabic: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    translation: { en: "Allah does not burden a soul beyond what it can bear." },
  },
  {
    surah: 94, verse: 6, surahName: "Ash-Sharh",
    arabic: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
    translation: { en: "Indeed, with hardship comes ease." },
  },
  {
    surah: 13, verse: 28, surahName: "Ar-Ra'd",
    arabic: "أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ",
    translation: { en: "Truly, in the remembrance of Allah do hearts find rest." },
  },
  {
    surah: 65, verse: 3, surahName: "At-Talaq",
    arabic: "وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُۥ",
    translation: { en: "And whoever puts their trust in Allah — He is sufficient for them." },
  },
  {
    surah: 39, verse: 53, surahName: "Az-Zumar",
    arabic: "لَا تَقْنَطُوا۟ مِن رَّحْمَةِ ٱللَّهِ",
    translation: { en: "Do not despair of the mercy of Allah." },
  },
  {
    surah: 20, verse: 25, surahName: "Ta-Ha",
    arabic: "رَبِّ ٱشْرَحْ لِى صَدْرِى",
    translation: { en: "My Lord, expand for me my chest." },
  },
  {
    surah: 3, verse: 173, surahName: "Aal 'Imran",
    arabic: "حَسْبُنَا ٱللَّهُ وَنِعْمَ ٱلْوَكِيلُ",
    translation: { en: "Allah is sufficient for us, and He is the best disposer of affairs." },
  },
  {
    surah: 2, verse: 152, surahName: "Al-Baqarah",
    arabic: "فَٱذْكُرُونِىٓ أَذْكُرْكُمْ",
    translation: { en: "So remember Me — I will remember you." },
  },
  {
    surah: 55, verse: 13, surahName: "Ar-Rahman",
    arabic: "فَبِأَىِّ ءَالَآءِ رَبِّكُمَا تُكَذِّبَانِ",
    translation: { en: "Then which of the favors of your Lord will you deny?" },
  },
  {
    surah: 14, verse: 7, surahName: "Ibrahim",
    arabic: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
    translation: { en: "If you are grateful, I will surely increase you." },
  },
];

const HADITHS: DailyHadith[] = [
  {
    text: { en: "The strong believer is not the one who overpowers others, but the one who controls himself when angry." },
    source: "Bukhari 6114, Muslim 2609",
    narrator: "Abu Hurairah (RA)",
  },
  {
    text: { en: "Whoever believes in Allah and the Last Day, let him speak good or remain silent." },
    source: "Bukhari 6018, Muslim 47",
    narrator: "Abu Hurairah (RA)",
  },
  {
    text: { en: "None of you truly believes until he loves for his brother what he loves for himself." },
    source: "Bukhari 13, Muslim 45",
    narrator: "Anas ibn Malik (RA)",
  },
  {
    text: { en: "Deeds are judged by intentions, and each person shall have what they intended." },
    source: "Bukhari 1, Muslim 1907",
    narrator: "Umar ibn al-Khattab (RA)",
  },
  {
    text: { en: "Make things easy, do not make them difficult; give good news, do not repel." },
    source: "Bukhari 69, Muslim 1734",
    narrator: "Anas ibn Malik (RA)",
  },
  {
    text: { en: "The most beloved deeds to Allah are those done consistently, even if small." },
    source: "Bukhari 6464, Muslim 783",
    narrator: "'Aisha (RA)",
  },
  {
    text: { en: "Whoever relieves a believer's hardship in this world — Allah will relieve his hardship on the Day of Judgment." },
    source: "Muslim 2699",
    narrator: "Abu Hurairah (RA)",
  },
  {
    text: { en: "Kindness is not found in anything except that it beautifies it." },
    source: "Muslim 2594",
    narrator: "'Aisha (RA)",
  },
  {
    text: { en: "The best of people are those most beneficial to people." },
    source: "Al-Mu'jam al-Awsat 5787 (hasan)",
    narrator: "Jabir (RA)",
  },
  {
    text: { en: "Smiling in your brother's face is charity." },
    source: "Tirmidhi 1956 (hasan)",
    narrator: "Abu Dharr (RA)",
  },
];

const DHIKRS: DailyDhikr[] = [
  {
    arabic: "سُبْحَانَ ٱللَّهِ وَبِحَمْدِهِ",
    transliteration: "Subḥāna-llāhi wa bi-ḥamdih",
    translation: { en: "Glory to Allah and praise to Him." },
    count: 100,
    source: "Bukhari 6405",
  },
  {
    arabic: "لَا إِلَٰهَ إِلَّا ٱللَّهُ",
    transliteration: "Lā ilāha illa-llāh",
    translation: { en: "There is no god but Allah." },
    count: 100,
    source: "Tirmidhi 3585",
  },
  {
    arabic: "أَسْتَغْفِرُ ٱللَّهَ",
    transliteration: "Astaghfiru-llāh",
    translation: { en: "I seek forgiveness from Allah." },
    count: 100,
    source: "Muslim 2702",
  },
  {
    arabic: "ٱلْحَمْدُ لِلَّهِ",
    transliteration: "Al-ḥamdu li-llāh",
    translation: { en: "All praise is due to Allah." },
    count: 33,
    source: "Muslim 2731",
  },
  {
    arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِٱللَّهِ",
    transliteration: "Lā ḥawla wa lā quwwata illā bi-llāh",
    translation: { en: "There is no might nor power except with Allah." },
    count: 33,
    source: "Bukhari 6384",
  },
  {
    arabic: "حَسْبِيَ ٱللَّهُ لَا إِلَٰهَ إِلَّا هُوَ",
    transliteration: "Ḥasbiya-llāhu lā ilāha illā huwa",
    translation: { en: "Allah is enough for me; there is no god but Him." },
    count: 7,
    source: "Abu Dawud 5081",
  },
  {
    arabic: "ٱللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ",
    transliteration: "Allāhumma ṣalli ʿalā Muḥammad",
    translation: { en: "O Allah, send blessings upon Muhammad." },
    count: 10,
    source: "Tirmidhi 484",
  },
];

const REFLECTIONS: DailyReflection[] = [
  { prompt: { en: "What is one blessing today you almost overlooked?" } },
  { prompt: { en: "Where did you feel Allah's mercy today, even quietly?" } },
  { prompt: { en: "Whose burden could you lighten this week?" } },
  { prompt: { en: "What are you trying to control that isn't yours to carry?" } },
  { prompt: { en: "When did you last make du'a for someone by name?" } },
  { prompt: { en: "What word did you speak today that you'd want recorded?" } },
  { prompt: { en: "What is one small act of worship you can be consistent in?" } },
  { prompt: { en: "What are you rushing that deserves patience?" } },
  { prompt: { en: "Whom do you need to forgive — for your own peace?" } },
  { prompt: { en: "What is one thing you're grateful for that money can't buy?" } },
];

// Story teasers cycle across the 6 prophet stories mapped to emotions.
// Phase 2 wires these to real story routes; today they deep-link to the mood.
const STORY_TEASERS: DailyStoryTeaser[] = [
  {
    storyId: "yunus", moodId: "anxious", durationMin: 4,
    title: { en: "The Whale's Prayer" },
    blurb: { en: "Prophet Yunus (AS) in the depths — and the words that brought him back." },
  },
  {
    storyId: "musa", moodId: "impatient", durationMin: 5,
    title: { en: "The Sea Parts" },
    blurb: { en: "Prophet Musa (AS) at the edge — trapped, told to strike, and trusting anyway." },
  },
  {
    storyId: "maryam", moodId: "lonely", durationMin: 4,
    title: { en: "Under the Palm Tree" },
    blurb: { en: "Maryam (AS) alone in the desert — and the sustenance that fell to her." },
  },
  {
    storyId: "adam", moodId: "guilty", durationMin: 4,
    title: { en: "The First Return" },
    blurb: { en: "Adam (AS), the first sin, and the words Allah taught him to come home." },
  },
  {
    storyId: "ibrahim", moodId: "afraid", durationMin: 5,
    title: { en: "Into the Fire" },
    blurb: { en: "Prophet Ibrahim (AS) — and the flame that was commanded to be cool." },
  },
  {
    storyId: "sulaiman", moodId: "grateful", durationMin: 4,
    title: { en: "The King Who Bowed" },
    blurb: { en: "Prophet Sulaiman (AS), given kingdoms — and only wanting to be thankful." },
  },
];

// ---------- Rotation ----------

function daysSinceEpoch(d = new Date()): number {
  // UTC day index, stable across timezones for a rough shared "today".
  return Math.floor(d.getTime() / 86400000);
}

function pick<T>(pool: T[], offset: number): T {
  const day = daysSinceEpoch();
  return pool[(day + offset) % pool.length];
}

export function todayKey(d = new Date()): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getToday() {
  return {
    date: todayKey(),
    verse: pick(VERSES, 0),
    hadith: pick(HADITHS, 3),
    dhikr: pick(DHIKRS, 1),
    reflection: pick(REFLECTIONS, 5),
    story: pick(STORY_TEASERS, 2),
  };
}

export function pickTr<T>(map: Partial<Record<LanguageCode, string>>, lang: string, fallback = ""): string {
  return (map as Record<string, string | undefined>)[lang] ?? map.en ?? fallback;
}
