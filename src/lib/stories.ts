// Animated Prophet stories. Symbolic art only — no faces, no bodies.
// Sources per story listed on `Story.sources`.

import type { Localized } from "@/lib/language";

// Yunus
import yunus01 from "@/assets/stories/yunus/01-city.jpg";
import yunus02 from "@/assets/stories/yunus/02-storm.jpg";
import yunus03 from "@/assets/stories/yunus/03-lots.jpg";
import yunus04 from "@/assets/stories/yunus/04-depths.jpg";
import yunus05 from "@/assets/stories/yunus/05-darkness.jpg";
import yunus06 from "@/assets/stories/yunus/06-dawn.jpg";
// Musa
import musa01 from "@/assets/stories/musa/01-basket.jpg";
import musa02 from "@/assets/stories/musa/02-staff.jpg";
import musa03 from "@/assets/stories/musa/03-fire.jpg";
import musa04 from "@/assets/stories/musa/04-sea.jpg";
// Maryam
import maryam01 from "@/assets/stories/maryam/01-niche.jpg";
import maryam02 from "@/assets/stories/maryam/02-desert.jpg";
import maryam03 from "@/assets/stories/maryam/03-palm.jpg";
import maryam04 from "@/assets/stories/maryam/04-cradle.jpg";
// Adam
import adam01 from "@/assets/stories/adam/01-garden.jpg";
import adam02 from "@/assets/stories/adam/02-fall.jpg";
import adam03 from "@/assets/stories/adam/03-tears.jpg";
import adam04 from "@/assets/stories/adam/04-mercy.jpg";
// Ibrahim
import ibrahim01 from "@/assets/stories/ibrahim/01-stars.jpg";
import ibrahim02 from "@/assets/stories/ibrahim/02-fire.jpg";
import ibrahim03 from "@/assets/stories/ibrahim/03-ram.jpg";
import ibrahim04 from "@/assets/stories/ibrahim/04-house.jpg";
// Ayyub
import ayyub01 from "@/assets/stories/ayyub/01-orchard.jpg";
import ayyub02 from "@/assets/stories/ayyub/02-loss.jpg";
import ayyub03 from "@/assets/stories/ayyub/03-spring.jpg";
import ayyub04 from "@/assets/stories/ayyub/04-restored.jpg";

export type KenBurns = "in" | "out" | "panLeft" | "panRight";

export interface StoryScene {
  image: string;
  narration: Localized;
  durationMs: number;
  kenBurns: KenBurns;
}

export interface Story {
  id: string;
  moodId: string;
  title: Localized;
  scenes: StoryScene[];
  sources: string[];
  durationSec: number;
}

// Helper: English-only narration (tr() falls back to English for other langs).
const en = (text: string): Localized => ({ en: text });

// ---------- Yunus (AS) — "The Whale's Prayer" (anxious) ----------
const YUNUS: Story = {
  id: "yunus",
  moodId: "anxious",
  title: {
    en: "The Whale's Prayer",
    ur: "مچھلی کی دعا", ru: "Молитва во чреве кита", bn: "মাছের ভেতরের দোয়া",
    fa: "دعای درون ماهی", id: "Doa di Perut Ikan", ms: "Doa di Perut Ikan",
    tr: "Balığın Karnındaki Dua", fr: "La prière dans la baleine", de: "Das Gebet im Wal",
  },
  sources: [
    "Qur'an 21:87 · Al-Anbiya",
    "Qur'an 37:139–148 · As-Saffat",
    "Qur'an 68:48–50 · Al-Qalam",
    "Ibn Kathir · Qisas al-Anbiya",
  ],
  durationSec: 72,
  scenes: [
    { image: yunus01, durationMs: 12000, kenBurns: "in",
      narration: {
        en: "The people of Nineveh had turned away. Prophet Yunus, upon him be peace, called them back to their Lord — and when they refused, he left them behind.",
        ur: "نینوا کے لوگ منہ موڑ چکے تھے۔ حضرت یونس علیہ السلام نے انہیں اپنے رب کی طرف بلایا — اور جب انہوں نے انکار کیا، وہ انہیں چھوڑ گئے۔",
      } },
    { image: yunus02, durationMs: 11000, kenBurns: "panRight",
      narration: en("He boarded a ship, laden with cargo. The sea grew heavy. A storm rose against them, and the ship began to sink.") },
    { image: yunus03, durationMs: 11000, kenBurns: "in",
      narration: en("The sailors cast lots to decide who must be thrown overboard. Three times the lot fell on him. He accepted, and stepped into the sea.") },
    { image: yunus04, durationMs: 12000, kenBurns: "out",
      narration: en("A great whale was sent for him. It swallowed him whole. And Yunus found himself in the depths — of the sea, of the whale, of the night.") },
    { image: yunus05, durationMs: 14000, kenBurns: "in",
      narration: en("In the layered darkness he called out: There is no god but You. Glory be to You. Truly I have been of the wrongdoers. Allah heard him. Every atom of that darkness heard him.") },
    { image: yunus06, durationMs: 12000, kenBurns: "out",
      narration: en("The whale cast him onto an empty shore. Weak, bare. And Allah caused a gourd vine to grow over him — shade, and mercy, and a return. If not for his remembrance, he would have remained there. So call. He is listening.") },
  ],
};

// ---------- Musa (AS) — "The Sea That Opened" (fearful) ----------
const MUSA: Story = {
  id: "musa",
  moodId: "fearful",
  title: {
    en: "The Sea That Opened",
    ur: "کھلنے والا سمندر", tr: "Yarılan Deniz", fr: "La mer qui s'ouvrit",
    de: "Das Meer, das sich öffnete", id: "Laut yang Terbelah", ms: "Laut yang Terbelah",
  },
  sources: [
    "Qur'an 20:9–98 · Ta-Ha",
    "Qur'an 28:7–35 · Al-Qasas",
    "Qur'an 26:52–66 · Ash-Shu'ara",
    "Ibn Kathir · Qisas al-Anbiya",
  ],
  durationSec: 50,
  scenes: [
    { image: musa01, durationMs: 12000, kenBurns: "in",
      narration: en("A mother placed her infant in a basket and set him upon the Nile. She was afraid. Allah whispered to her heart: do not fear. We will return him to you.") },
    { image: musa02, durationMs: 12000, kenBurns: "panRight",
      narration: en("Years later, in the valley of Madyan, he stood beside his shepherd's staff — a fugitive, weary, alone. But Allah had never left him.") },
    { image: musa03, durationMs: 13000, kenBurns: "in",
      narration: en("On the slope of a mountain, a fire burned that did not consume. A voice called: O Musa. Truly I am your Lord. Take off your sandals — you are in the sacred valley.") },
    { image: musa04, durationMs: 13000, kenBurns: "out",
      narration: en("Pharaoh's army closed in behind him. The sea stretched wide ahead. His people cried, We are overtaken. He said: Never. My Lord is with me. He will guide me. He struck the sea — and the water stood aside.") },
  ],
};

// ---------- Maryam (AS) — "The Palm and the Spring" (lonely) ----------
const MARYAM: Story = {
  id: "maryam",
  moodId: "lonely",
  title: {
    en: "The Palm and the Spring",
    ur: "کھجور اور چشمہ", tr: "Hurma ve Pınar", fr: "Le palmier et la source",
    de: "Die Palme und die Quelle",
  },
  sources: [
    "Qur'an 19:16–34 · Maryam",
    "Qur'an 3:35–47 · Aal-'Imran",
    "Ibn Kathir · Qisas al-Anbiya",
  ],
  durationSec: 48,
  scenes: [
    { image: maryam01, durationMs: 12000, kenBurns: "in",
      narration: en("In the quiet of her prayer niche, unseasonal fruit was always with her. Zakariyya asked, from where? She said: it is from Allah. He provides without measure.") },
    { image: maryam02, durationMs: 12000, kenBurns: "panRight",
      narration: en("When the pains came, she withdrew to a distant place. Alone, afraid, she cried out: would that I had died before this, and been forgotten.") },
    { image: maryam03, durationMs: 12000, kenBurns: "in",
      narration: en("A voice from beneath her called: do not grieve. Your Lord has placed a stream beneath you. Shake the trunk of the palm — fresh ripe dates will fall. Eat, drink, and be comforted.") },
    { image: maryam04, durationMs: 12000, kenBurns: "out",
      narration: en("She returned carrying her child. The people accused. She pointed to the cradle. And from that cradle, an infant spoke: Truly, I am a servant of Allah. Peace be upon me the day I was born, and the day I die, and the day I am raised again.") },
  ],
};

// ---------- Adam (AS) — "The First Return" (guilty) ----------
const ADAM: Story = {
  id: "adam",
  moodId: "guilty",
  title: {
    en: "The First Return",
    ur: "پہلی توبہ", tr: "İlk Dönüş", fr: "Le premier retour", de: "Die erste Umkehr",
  },
  sources: [
    "Qur'an 2:30–37 · Al-Baqarah",
    "Qur'an 7:19–25 · Al-A'raf",
    "Qur'an 20:115–122 · Ta-Ha",
  ],
  durationSec: 48,
  scenes: [
    { image: adam01, durationMs: 12000, kenBurns: "in",
      narration: en("They dwelt in the Garden — Adam and his wife — with every fruit before them, and only one tree forbidden. Do not approach it, their Lord said. Or you will be among the wrongdoers.") },
    { image: adam02, durationMs: 12000, kenBurns: "panRight",
      narration: en("The whisperer came. They tasted. And what was covered was uncovered. They fell — from ease into effort, from certainty into longing.") },
    { image: adam03, durationMs: 13000, kenBurns: "in",
      narration: en("Then Adam received words from his Lord — words placed on his tongue: Our Lord, we have wronged ourselves. If You do not forgive us and have mercy on us, we will surely be among the losers.") },
    { image: adam04, durationMs: 11000, kenBurns: "out",
      narration: en("And He turned to him in mercy. Truly He is the Ever-Relenting, the Most Merciful. Every child of Adam sins — and the best of sinners are those who return. The door was never closed.") },
  ],
};

// ---------- Ibrahim (AS) — "The Cool Fire" (hopeful) ----------
const IBRAHIM: Story = {
  id: "ibrahim",
  moodId: "hopeful",
  title: {
    en: "The Cool Fire",
    ur: "ٹھنڈی آگ", tr: "Serin Ateş", fr: "Le feu apaisé", de: "Das kühle Feuer",
  },
  sources: [
    "Qur'an 6:74–79 · Al-An'am",
    "Qur'an 21:51–70 · Al-Anbiya",
    "Qur'an 37:100–113 · As-Saffat",
    "Qur'an 2:127 · Al-Baqarah",
  ],
  durationSec: 50,
  scenes: [
    { image: ibrahim01, durationMs: 13000, kenBurns: "panRight",
      narration: en("As a young man, Ibrahim looked at the stars, the moon, the sun — each rose, each set. He said: I do not love that which sets. I turn my face to the One who made the heavens and the earth.") },
    { image: ibrahim02, durationMs: 12000, kenBurns: "in",
      narration: en("His people built a fire and cast him in. Enough for us is Allah, he said. He is the best disposer of affairs. And Allah commanded the fire: be coolness, and peace, upon Ibrahim.") },
    { image: ibrahim03, durationMs: 12000, kenBurns: "in",
      narration: en("Years later he saw in a dream that he must offer his son. Father, do what you are commanded, the boy said. When both surrendered, Allah called out: enough. You have fulfilled the vision — and sent a ram in his place.") },
    { image: ibrahim04, durationMs: 13000, kenBurns: "out",
      narration: en("With his son Isma'il, he raised the foundations of a simple stone house in an empty valley. Our Lord, accept this from us. Truly You are the All-Hearing, the All-Knowing. The valley is no longer empty.") },
  ],
};

// ---------- Ayyub (AS) — "The Well That Returned" (sad) ----------
const AYYUB: Story = {
  id: "ayyub",
  moodId: "sad",
  title: {
    en: "The Well That Returned",
    ur: "پلٹنے والا چشمہ", tr: "Geri Dönen Pınar", fr: "La source qui revint",
    de: "Der Brunnen, der zurückkehrte",
  },
  sources: [
    "Qur'an 21:83–84 · Al-Anbiya",
    "Qur'an 38:41–44 · Sad",
    "Ibn Kathir · Qisas al-Anbiya",
  ],
  durationSec: 48,
  scenes: [
    { image: ayyub01, durationMs: 12000, kenBurns: "in",
      narration: en("Ayyub was given health, family, and orchards heavy with fruit. He gave thanks in every state, and his praise did not depend on his blessings.") },
    { image: ayyub02, durationMs: 12000, kenBurns: "panRight",
      narration: en("Then the trial came. His wealth was gone. His children were taken. His body was worn thin. And still — he did not turn away. He whispered: harm has afflicted me, and You are the Most Merciful of the merciful.") },
    { image: ayyub03, durationMs: 12000, kenBurns: "in",
      narration: en("Allah said: strike the ground with your foot. And a cool spring rose from the cracked earth. Here is a place to wash, and a drink. Truly, We found him patient — an excellent servant.") },
    { image: ayyub04, durationMs: 12000, kenBurns: "out",
      narration: en("His family was returned to him — and the like of them with them, as mercy from Us, and a reminder to those with understanding. What the fire took, the Merciful can restore. The green comes back.") },
  ],
};

// ---------- Registry ----------
const STORIES: Record<string, Story> = {
  yunus: YUNUS,
  musa: MUSA,
  maryam: MARYAM,
  adam: ADAM,
  ibrahim: IBRAHIM,
  ayyub: AYYUB,
};

export function getStory(id: string): Story | undefined {
  return STORIES[id];
}

export function hasStory(id: string): boolean {
  return id in STORIES;
}

export function allStories(): Story[] {
  return Object.values(STORIES);
}

// Reverse map: mood → story id (first story matching that mood).
const MOOD_TO_STORY: Record<string, string> = Object.values(STORIES).reduce(
  (acc, s) => {
    if (!acc[s.moodId]) acc[s.moodId] = s.id;
    return acc;
  },
  {} as Record<string, string>,
);

export function storyForMood(moodId: string): string | undefined {
  return MOOD_TO_STORY[moodId];
}
