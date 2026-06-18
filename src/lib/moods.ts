// Curated mood → verse mappings for the "How are you feeling?" experience.
// Each verse cites why it was chosen so the listener understands the connection.

export interface MoodVerse {
  surah: number;
  verse: number;
  surahName: string; // English name for display
  reason: string;    // short note: why this verse for this mood
}

export interface Mood {
  id: string;
  label: string;
  emoji: string;
  blurb: string;
  verses: MoodVerse[];
}

export const MOODS: Mood[] = [
  {
    id: "stressed",
    label: "Stressed",
    emoji: "😣",
    blurb: "When the weight feels too much to carry.",
    verses: [
      { surah: 94, verse: 5, surahName: "Ash-Sharh", reason: "“Indeed, with hardship comes ease.” A direct promise that relief always follows difficulty." },
      { surah: 94, verse: 6, surahName: "Ash-Sharh", reason: "The promise is repeated — ease is paired with every hardship, not just some." },
      { surah: 2, verse: 286, surahName: "Al-Baqarah", reason: "“Allah does not burden a soul beyond what it can bear.” Your capacity is known and honoured." },
      { surah: 65, verse: 3, surahName: "At-Talaq", reason: "“Whoever relies on Allah — He is sufficient for him.” Permission to put the load down." },
      { surah: 13, verse: 28, surahName: "Ar-Ra'd", reason: "“In the remembrance of Allah hearts find rest.” The remedy for a racing mind." },
    ],
  },
  {
    id: "anxious",
    label: "Anxious",
    emoji: "😟",
    blurb: "When tomorrow won't stop knocking.",
    verses: [
      { surah: 9, verse: 51, surahName: "At-Tawbah", reason: "“Nothing will ever befall us except what Allah has decreed.” Anchors you to what you cannot lose." },
      { surah: 3, verse: 173, surahName: "Aal-E-Imran", reason: "“Sufficient for us is Allah, and He is the best Disposer of affairs.” The phrase the Prophet ﷺ used in fear." },
      { surah: 65, verse: 2, surahName: "At-Talaq", reason: "“Whoever fears Allah — He will make a way out for him.” A door opens you cannot yet see." },
      { surah: 20, verse: 46, surahName: "Ta-Ha", reason: "“Do not fear — I am with you both, hearing and seeing.” Allah's reassurance to Musa ﷺ at his most afraid." },
      { surah: 2, verse: 153, surahName: "Al-Baqarah", reason: "“Seek help through patience and prayer — Allah is with the patient.” A practical, repeatable refuge." },
    ],
  },
  {
    id: "sad",
    label: "Sad",
    emoji: "😢",
    blurb: "When the heart is heavy.",
    verses: [
      { surah: 93, verse: 3, surahName: "Ad-Duha", reason: "“Your Lord has not forsaken you, nor has He become displeased.” Revealed when the Prophet ﷺ felt abandoned." },
      { surah: 93, verse: 5, surahName: "Ad-Duha", reason: "“Your Lord will give to you, and you will be satisfied.” A promise of restoration." },
      { surah: 39, verse: 53, surahName: "Az-Zumar", reason: "“Do not despair of the mercy of Allah.” No grief is final in His sight." },
      { surah: 12, verse: 86, surahName: "Yusuf", reason: "Yaqub ﷺ: “I only complain of my suffering and grief to Allah.” Permission to grieve openly with Him." },
      { surah: 65, verse: 7, surahName: "At-Talaq", reason: "“Allah will bring about, after hardship, ease.” Time changes everything by His command." },
    ],
  },
  {
    id: "angry",
    label: "Angry",
    emoji: "😡",
    blurb: "When the fire rises in your chest.",
    verses: [
      { surah: 3, verse: 134, surahName: "Aal-E-Imran", reason: "Praise for “those who restrain anger and pardon people” — Allah loves them." },
      { surah: 41, verse: 34, surahName: "Fussilat", reason: "“Repel evil with what is better, and your enemy will become a devoted friend.”" },
      { surah: 42, verse: 43, surahName: "Ash-Shura", reason: "“Whoever is patient and forgives — that is truly a matter of great resolve.”" },
      { surah: 7, verse: 199, surahName: "Al-A'raf", reason: "“Show forgiveness, enjoin what is good, and turn away from the ignorant.”" },
      { surah: 25, verse: 63, surahName: "Al-Furqan", reason: "“When the ignorant address them, they say words of peace.” The believer's reply." },
    ],
  },
  {
    id: "lonely",
    label: "Lonely",
    emoji: "🥺",
    blurb: "When no one seems to be there.",
    verses: [
      { surah: 50, verse: 16, surahName: "Qaf", reason: "“We are closer to him than his jugular vein.” You are never actually alone." },
      { surah: 2, verse: 186, surahName: "Al-Baqarah", reason: "“When My servants ask about Me — I am near. I respond to the one who calls.”" },
      { surah: 57, verse: 4, surahName: "Al-Hadid", reason: "“He is with you wherever you are.” Companionship that no place can break." },
      { surah: 93, verse: 7, surahName: "Ad-Duha", reason: "“He found you lost and guided you.” He has been finding you all along." },
      { surah: 12, verse: 86, surahName: "Yusuf", reason: "Yaqub's grief carried to Allah alone — loneliness as a doorway to closeness." },
    ],
  },
  {
    id: "grateful",
    label: "Grateful",
    emoji: "🙏",
    blurb: "When you want to thank Him.",
    verses: [
      { surah: 14, verse: 7, surahName: "Ibrahim", reason: "“If you are grateful, I will surely increase you.” Gratitude is itself an opening." },
      { surah: 55, verse: 13, surahName: "Ar-Rahman", reason: "“So which of the favours of your Lord will you deny?” Repeated to keep counting." },
      { surah: 16, verse: 18, surahName: "An-Nahl", reason: "“If you tried to count Allah's blessings, you could never enumerate them.”" },
      { surah: 2, verse: 152, surahName: "Al-Baqarah", reason: "“Remember Me — I will remember you. Be thankful and do not deny Me.”" },
      { surah: 27, verse: 19, surahName: "An-Naml", reason: "Sulayman's du'a: “My Lord, enable me to be grateful for Your favour.”" },
    ],
  },
  {
    id: "hopeful",
    label: "Hopeful",
    emoji: "🌅",
    blurb: "When something better feels possible.",
    verses: [
      { surah: 39, verse: 53, surahName: "Az-Zumar", reason: "“Do not despair of the mercy of Allah — He forgives all sins.” The most hope-giving verse." },
      { surah: 65, verse: 3, surahName: "At-Talaq", reason: "“Allah will accomplish His purpose.” His plan for you is still moving." },
      { surah: 94, verse: 5, surahName: "Ash-Sharh", reason: "“With hardship comes ease.” The exact shape of hope." },
      { surah: 12, verse: 87, surahName: "Yusuf", reason: "“Only the disbelieving people lose hope in the mercy of Allah.”" },
      { surah: 2, verse: 216, surahName: "Al-Baqarah", reason: "“You may dislike a thing that is good for you.” What feels closed may be a door." },
    ],
  },
  {
    id: "guilty",
    label: "Seeking forgiveness",
    emoji: "🤲",
    blurb: "When you want to return.",
    verses: [
      { surah: 39, verse: 53, surahName: "Az-Zumar", reason: "“Do not despair of the mercy of Allah — He forgives all sins.” The door is open." },
      { surah: 4, verse: 110, surahName: "An-Nisa", reason: "“Whoever does wrong then seeks Allah's forgiveness will find Him Forgiving, Merciful.”" },
      { surah: 66, verse: 8, surahName: "At-Tahrim", reason: "“Turn to Allah with sincere repentance.” The clear instruction for returning." },
      { surah: 2, verse: 222, surahName: "Al-Baqarah", reason: "“Allah loves those who turn to Him in repentance.”" },
      { surah: 20, verse: 82, surahName: "Ta-Ha", reason: "“I am the Perpetual Forgiver of whoever repents and believes.”" },
    ],
  },
  {
    id: "fearful",
    label: "Fearful",
    emoji: "😨",
    blurb: "When something scares you.",
    verses: [
      { surah: 3, verse: 173, surahName: "Aal-E-Imran", reason: "“Sufficient for us is Allah, the best Disposer of affairs.” Words that turned fear into strength." },
      { surah: 2, verse: 255, surahName: "Al-Baqarah", reason: "Ayat al-Kursi — the verse of protection and divine sovereignty." },
      { surah: 8, verse: 9, surahName: "Al-Anfal", reason: "“I will reinforce you with a thousand angels.” Help is closer than your fear knows." },
      { surah: 9, verse: 40, surahName: "At-Tawbah", reason: "“Do not grieve; indeed Allah is with us.” Said in the cave when capture seemed certain." },
      { surah: 28, verse: 7, surahName: "Al-Qasas", reason: "“Do not fear, nor grieve. We will return him to you.” Allah's word to Musa's mother." },
    ],
  },
];

export function getMood(id: string): Mood | undefined {
  return MOODS.find((m) => m.id === id);
}
