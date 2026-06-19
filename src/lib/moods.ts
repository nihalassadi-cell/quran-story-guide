// Curated mood → kalima + verse mappings for the "How are you feeling?" experience.
// For each mood we offer a small set of short, repeatable remembrances taught by
// the Prophet ﷺ (or directly from the Qur'an). The user picks the one that
// resonates and repeats it like a heartbeat.

export interface MoodVerse {
  surah: number;
  verse: number;
  surahName: string;
  reason: string;
}

export interface Kalima {
  arabic: string;
  transliteration: string;
  translation: string;
  repeat: number;          // recommended count
  source: string;          // hadith / Qur'an citation
  why: string;             // one-line reason this dhikr fits the mood
  /** When this kalima is taken from a Qur'anic verse, the (surah, verse)
   *  reference so we can play the same studio recital used in surah pages. */
  ayah?: { surah: number; verse: number };
}

export interface Mood {
  id: string;
  label: string;
  emoji: string;
  blurb: string;
  /** All available kalimas for this mood; the first is the default. */
  kalimas: Kalima[];
  /** Backward-compat alias for the default kalima (kalimas[0]). */
  kalima: Kalima;
  verses: MoodVerse[];
}

// ---- Reusable kalimas (so the same authentic dhikr can serve multiple moods) ----
const SUBHANALLAH_BIHAMDIH: Kalima = {
  arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
  transliteration: "Subḥāna-llāhi wa bi-ḥamdih, subḥāna-llāhi-l-ʿaẓīm",
  translation: "Glory to Allah and praise to Him; glory to Allah the Magnificent.",
  repeat: 100,
  source: "Bukhari 6406, Muslim 2694 — “two phrases light on the tongue, heavy on the scales, beloved to the Most Merciful.”",
  why: "When the heart needs steady ground, return to the two phrases the Prophet ﷺ called the heaviest on the scales.",
};

const HASBIYALLAH: Kalima = {
  arabic: "حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
  transliteration: "Ḥasbiya-llāhu, lā ilāha illā huwa, ʿalayhi tawakkaltu wa huwa rabbu-l-ʿarshi-l-ʿaẓīm",
  translation: "Allah is enough for me — there is no god but Him. In Him I trust, and He is Lord of the magnificent throne.",
  repeat: 7,
  source: "Abū Dāwūd 5081 — recite seven times: “Allah will suffice him in whatever worries him.”",
  why: "When you feel alone or overrun, the Prophet ﷺ taught: say it seven times — Allah is enough.",
};

const ISTIGHFAR: Kalima = {
  arabic: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
  transliteration: "Astaghfiru-llāha wa atūbu ilayh",
  translation: "I seek Allah's forgiveness and turn back to Him.",
  repeat: 100,
  source: "Bukhari 6307, Muslim 2702 — the Prophet ﷺ said it more than seventy times daily.",
  why: "Abū Dāwūd 1518: “Whoever persists on istighfār — Allah makes a way out of every distress.”",
};

const LA_HAWLA: Kalima = {
  arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
  transliteration: "Lā ḥawla wa lā quwwata illā billāh",
  translation: "There is no power and no strength except with Allah.",
  repeat: 100,
  source: "Bukhari 6384, Muslim 2704 — “a treasure from the treasures of Paradise.”",
  why: "Hand the weight back to the One who actually carries it. Ibn al-Qayyim: a cure for ninety-nine ailments — the lightest of which is grief.",
};

const YA_HAYYU: Kalima = {
  arabic: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ",
  transliteration: "Yā Ḥayyu yā Qayyūm, bi-raḥmatika astaghīth",
  translation: "O Ever-Living, O Sustainer — by Your mercy I seek relief.",
  repeat: 33,
  source: "Tirmidhī 3524 — the Prophet ﷺ would say it in moments of distress.",
  why: "When grief is too large for sentences: two of His names and one need — His mercy.",
};

const HASBUNALLAH: Kalima = {
  arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
  transliteration: "Ḥasbunā-llāhu wa niʿma-l-wakīl",
  translation: "Allah is sufficient for us — the best Disposer of affairs.",
  repeat: 70,
  source: "Qur'an 3:173 · Bukhari 4563 — said by Ibrāhīm ﷺ in the fire and by the Prophet ﷺ at Uḥud.",
  why: "Words spoken inside flames and on a battlefield — they did not burn, they did not lose. Borrow them.",
};

const YUNUS_DUA: Kalima = {
  arabic: "لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
  transliteration: "Lā ilāha illā anta, subḥānaka, innī kuntu mina-ẓ-ẓālimīn",
  translation: "There is no god but You — glory be to You. Truly, I have been among the wrongdoers.",
  repeat: 40,
  source: "Qur'an 21:87 · Tirmidhī 3505 — the duʿāʾ of Yūnus ﷺ from the belly of the whale.",
  why: "“No Muslim ever supplicates with these words for anything except Allah answers him.”",
};

const TAHLIL: Kalima = {
  arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
  transliteration: "Lā ilāha illā-llāhu waḥdahu lā sharīka lah, lahu-l-mulku wa lahu-l-ḥamd, wa huwa ʿalā kulli shay'in qadīr",
  translation: "There is no god but Allah, alone, with no partner. To Him belongs the dominion and all praise — and He is over all things able.",
  repeat: 100,
  source: "Bukhari 3293, Muslim 2691 — equal to freeing ten slaves; a fortress until evening.",
  why: "The sentence that contains everything. Hope is built on the truth of who runs the universe.",
};

const TAAWUDH: Kalima = {
  arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
  transliteration: "Aʿūdhu billāhi mina-sh-shayṭāni-r-rajīm",
  translation: "I seek refuge in Allah from the accursed Satan.",
  repeat: 7,
  source: "Bukhari 3282, Muslim 2610 — the Prophet ﷺ told an angry man this would calm him.",
  why: "Anger is Shayṭān's heat in your chest. Name the source, name the cure — say it, sit down, drink water.",
};

const ALHAMDU_NIMAH: Kalima = {
  arabic: "الْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ",
  transliteration: "Al-ḥamdu lillāhi-lladhī bi-niʿmatihi tatimmu-ṣ-ṣāliḥāt",
  translation: "All praise is for Allah by whose favour all good things are completed.",
  repeat: 33,
  source: "Ibn Mājah 3803 — what the Prophet ﷺ said when something pleased him.",
  why: "Gratitude is itself a doorway: “If you are grateful, I will surely increase you.” (Qur'an 14:7)",
};

const TASBIH_FATIMI_TASBIH: Kalima = {
  arabic: "سُبْحَانَ اللَّهِ",
  transliteration: "Subḥāna-llāh",
  translation: "Glory be to Allah.",
  repeat: 33,
  source: "Bukhari 3705 — the tasbīḥ of Fāṭimah ﷺ taught after every prayer and at rest.",
  why: "When tongue and heart are tired, the lightest praise still tilts the scales.",
};

const TAHMID: Kalima = {
  arabic: "الْحَمْدُ لِلَّهِ",
  transliteration: "Al-ḥamdu lillāh",
  translation: "All praise is due to Allah.",
  repeat: 33,
  source: "Muslim 223 — “Al-ḥamdu lillāh fills the scale.”",
  why: "One word that fills the scale and reframes the whole day.",
};

const TAKBIR: Kalima = {
  arabic: "اللَّهُ أَكْبَرُ",
  transliteration: "Allāhu akbar",
  translation: "Allah is the Greatest.",
  repeat: 34,
  source: "Bukhari 3705 — completing the tasbīḥ of Fāṭimah ﷺ.",
  why: "Whatever is troubling you — He is greater. Say it until your heart hears it.",
};

const SALAWAT: Kalima = {
  arabic: "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ",
  transliteration: "Allāhumma ṣalli ʿalā Muḥammadin wa ʿalā āli Muḥammad",
  translation: "O Allah, send blessings upon Muhammad and the family of Muhammad.",
  repeat: 100,
  source: "Tirmidhī 2457 — “Whoever sends one ṣalāh upon me, Allah sends ten upon him.”",
  why: "When the heart is heavy, send blessings on the one who was sent as a mercy — and mercy returns multiplied.",
};

const BISMILLAH_LA_YADURR: Kalima = {
  arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ، وَهُوَ السَّمِيعُ الْعَلِيمُ",
  transliteration: "Bismillāhi-lladhī lā yaḍurru maʿa-smihi shay'un fī-l-arḍi wa lā fī-s-samā', wa huwa-s-samīʿu-l-ʿalīm",
  translation: "In the name of Allah — with whose name nothing in the earth or sky can harm. He is the All-Hearing, All-Knowing.",
  repeat: 3,
  source: "Abū Dāwūd 5088, Tirmidhī 3388 — “nothing will harm him.”",
  why: "Three times — a fortress against harm seen and unseen.",
};

export const MOODS: Mood[] = [
  {
    id: "stressed",
    label: "Stressed",
    emoji: "😣",
    blurb: "When the weight feels too much to carry.",
    kalimas: [LA_HAWLA, SUBHANALLAH_BIHAMDIH, HASBUNALLAH],
    verses: [
      { surah: 94, verse: 5, surahName: "Ash-Sharh", reason: "“Indeed, with hardship comes ease.”" },
      { surah: 94, verse: 6, surahName: "Ash-Sharh", reason: "The promise repeated — ease is paired with every hardship." },
      { surah: 2, verse: 286, surahName: "Al-Baqarah", reason: "“Allah does not burden a soul beyond what it can bear.”" },
      { surah: 65, verse: 3, surahName: "At-Talaq", reason: "“Whoever relies on Allah — He is sufficient for him.”" },
      { surah: 13, verse: 28, surahName: "Ar-Ra'd", reason: "“In the remembrance of Allah hearts find rest.”" },
    ],
  },
  {
    id: "anxious",
    label: "Anxious",
    emoji: "😟",
    blurb: "When tomorrow won't stop knocking.",
    kalimas: [YUNUS_DUA, HASBIYALLAH, LA_HAWLA],
    verses: [
      { surah: 9, verse: 51, surahName: "At-Tawbah", reason: "“Nothing will befall us except what Allah has decreed.”" },
      { surah: 3, verse: 173, surahName: "Aal-E-Imran", reason: "“Sufficient for us is Allah — the best Disposer of affairs.”" },
      { surah: 65, verse: 2, surahName: "At-Talaq", reason: "“Whoever fears Allah — He will make a way out.”" },
      { surah: 20, verse: 46, surahName: "Ta-Ha", reason: "“Do not fear — I am with you both, hearing and seeing.”" },
      { surah: 2, verse: 153, surahName: "Al-Baqarah", reason: "“Seek help through patience and prayer — Allah is with the patient.”" },
    ],
  },
  {
    id: "sad",
    label: "Sad",
    emoji: "😢",
    blurb: "When the heart is heavy.",
    kalimas: [YA_HAYYU, SALAWAT, ISTIGHFAR],
    verses: [
      { surah: 93, verse: 3, surahName: "Ad-Duha", reason: "“Your Lord has not forsaken you, nor become displeased.”" },
      { surah: 93, verse: 5, surahName: "Ad-Duha", reason: "“Your Lord will give to you, and you will be satisfied.”" },
      { surah: 39, verse: 53, surahName: "Az-Zumar", reason: "“Do not despair of the mercy of Allah.”" },
      { surah: 12, verse: 86, surahName: "Yusuf", reason: "Yaqub ﷺ: “I only complain of my suffering and grief to Allah.”" },
      { surah: 65, verse: 7, surahName: "At-Talaq", reason: "“Allah will bring about, after hardship, ease.”" },
    ],
  },
  {
    id: "angry",
    label: "Angry",
    emoji: "😡",
    blurb: "When the fire rises in your chest.",
    kalimas: [TAAWUDH, LA_HAWLA, SUBHANALLAH_BIHAMDIH],
    verses: [
      { surah: 3, verse: 134, surahName: "Aal-E-Imran", reason: "Praise for those who restrain anger and pardon people." },
      { surah: 41, verse: 34, surahName: "Fussilat", reason: "“Repel evil with what is better.”" },
      { surah: 42, verse: 43, surahName: "Ash-Shura", reason: "“Whoever is patient and forgives — that is great resolve.”" },
      { surah: 7, verse: 199, surahName: "Al-A'raf", reason: "“Show forgiveness, enjoin good, turn from the ignorant.”" },
      { surah: 25, verse: 63, surahName: "Al-Furqan", reason: "“When the ignorant address them, they say: peace.”" },
    ],
  },
  {
    id: "lonely",
    label: "Lonely",
    emoji: "🥺",
    blurb: "When no one seems to be there.",
    kalimas: [HASBIYALLAH, SALAWAT, YA_HAYYU],
    verses: [
      { surah: 50, verse: 16, surahName: "Qaf", reason: "“We are closer to him than his jugular vein.”" },
      { surah: 2, verse: 186, surahName: "Al-Baqarah", reason: "“When My servants ask about Me — I am near.”" },
      { surah: 57, verse: 4, surahName: "Al-Hadid", reason: "“He is with you wherever you are.”" },
      { surah: 93, verse: 7, surahName: "Ad-Duha", reason: "“He found you lost and guided you.”" },
      { surah: 12, verse: 86, surahName: "Yusuf", reason: "Yaqub's grief carried to Allah alone — closeness." },
    ],
  },
  {
    id: "grateful",
    label: "Grateful",
    emoji: "🙏",
    blurb: "When you want to thank Him.",
    kalimas: [ALHAMDU_NIMAH, TAHMID, SUBHANALLAH_BIHAMDIH],
    verses: [
      { surah: 14, verse: 7, surahName: "Ibrahim", reason: "“If you are grateful, I will increase you.”" },
      { surah: 55, verse: 13, surahName: "Ar-Rahman", reason: "“Which of the favours of your Lord will you deny?”" },
      { surah: 16, verse: 18, surahName: "An-Nahl", reason: "“If you tried to count Allah's blessings, you could never enumerate them.”" },
      { surah: 2, verse: 152, surahName: "Al-Baqarah", reason: "“Remember Me — I will remember you.”" },
      { surah: 27, verse: 19, surahName: "An-Naml", reason: "Sulayman: “My Lord, enable me to be grateful for Your favour.”" },
    ],
  },
  {
    id: "hopeful",
    label: "Hopeful",
    emoji: "🌅",
    blurb: "When something better feels possible.",
    kalimas: [TAHLIL, TAKBIR, ALHAMDU_NIMAH],
    verses: [
      { surah: 39, verse: 53, surahName: "Az-Zumar", reason: "“Do not despair of the mercy of Allah.”" },
      { surah: 65, verse: 3, surahName: "At-Talaq", reason: "“Allah will accomplish His purpose.”" },
      { surah: 94, verse: 5, surahName: "Ash-Sharh", reason: "“With hardship comes ease.”" },
      { surah: 12, verse: 87, surahName: "Yusuf", reason: "“Only the disbelievers lose hope in the mercy of Allah.”" },
      { surah: 2, verse: 216, surahName: "Al-Baqarah", reason: "“You may dislike a thing that is good for you.”" },
    ],
  },
  {
    id: "guilty",
    label: "Seeking forgiveness",
    emoji: "🤲",
    blurb: "When you want to return.",
    kalimas: [ISTIGHFAR, YUNUS_DUA, SUBHANALLAH_BIHAMDIH],
    verses: [
      { surah: 39, verse: 53, surahName: "Az-Zumar", reason: "“Do not despair of the mercy of Allah — He forgives all sins.”" },
      { surah: 4, verse: 110, surahName: "An-Nisa", reason: "“Whoever does wrong then seeks forgiveness will find Him Forgiving, Merciful.”" },
      { surah: 66, verse: 8, surahName: "At-Tahrim", reason: "“Turn to Allah with sincere repentance.”" },
      { surah: 2, verse: 222, surahName: "Al-Baqarah", reason: "“Allah loves those who turn to Him in repentance.”" },
      { surah: 20, verse: 82, surahName: "Ta-Ha", reason: "“I am the Perpetual Forgiver of whoever repents.”" },
    ],
  },
  {
    id: "fearful",
    label: "Fearful",
    emoji: "😨",
    blurb: "When something scares you.",
    kalimas: [HASBUNALLAH, BISMILLAH_LA_YADURR, HASBIYALLAH],
    verses: [
      { surah: 3, verse: 173, surahName: "Aal-E-Imran", reason: "“Sufficient for us is Allah, the best Disposer of affairs.”" },
      { surah: 2, verse: 255, surahName: "Al-Baqarah", reason: "Ayat al-Kursi — divine sovereignty and protection." },
      { surah: 8, verse: 9, surahName: "Al-Anfal", reason: "“I will reinforce you with a thousand angels.”" },
      { surah: 9, verse: 40, surahName: "At-Tawbah", reason: "“Do not grieve; indeed Allah is with us.”" },
      { surah: 28, verse: 7, surahName: "Al-Qasas", reason: "“Do not fear, nor grieve. We will return him to you.”" },
    ],
  },
  // Fill in the legacy `kalima` alias for each mood below.
].map((m) => ({ ...m, kalima: m.kalimas[0] })) as Mood[];

export function getMood(id: string): Mood | undefined {
  return MOODS.find((m) => m.id === id);
}
