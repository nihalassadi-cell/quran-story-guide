// Animated Prophet stories. Symbolic art only — no faces, no bodies.
// Sources per story listed on `Story.sources`.

import type { Localized } from "@/lib/language";

// Yunus (10 scenes)
import yunus01 from "@/assets/stories/yunus/01-city.jpg";
import yunus02 from "@/assets/stories/yunus/02-storm.jpg";
import yunus03 from "@/assets/stories/yunus/03-lots.jpg";
import yunus04 from "@/assets/stories/yunus/04-depths.jpg";
import yunus05 from "@/assets/stories/yunus/05-darkness.jpg";
import yunus06 from "@/assets/stories/yunus/06-dawn.jpg";
import yunus07 from "@/assets/stories/yunus/07-warning.jpg";
import yunus08 from "@/assets/stories/yunus/08-heard.jpg";
import yunus09 from "@/assets/stories/yunus/09-vine.jpg";
import yunus10 from "@/assets/stories/yunus/10-return.jpg";
// Musa (10 scenes)
import musa01 from "@/assets/stories/musa/01-basket.jpg";
import musa02 from "@/assets/stories/musa/02-staff.jpg";
import musa03 from "@/assets/stories/musa/03-fire.jpg";
import musa04 from "@/assets/stories/musa/04-sea.jpg";
import musa05 from "@/assets/stories/musa/05-palace.jpg";
import musa06 from "@/assets/stories/musa/06-well.jpg";
import musa07 from "@/assets/stories/musa/07-sign.jpg";
import musa08 from "@/assets/stories/musa/08-signs.jpg";
import musa09 from "@/assets/stories/musa/09-crossing.jpg";
import musa10 from "@/assets/stories/musa/10-mountain.jpg";
// Maryam (10 scenes)
import maryam01 from "@/assets/stories/maryam/01-niche.jpg";
import maryam02 from "@/assets/stories/maryam/02-desert.jpg";
import maryam03 from "@/assets/stories/maryam/03-palm.jpg";
import maryam04 from "@/assets/stories/maryam/04-cradle.jpg";
import maryam05 from "@/assets/stories/maryam/05-birth.jpg";
import maryam06 from "@/assets/stories/maryam/06-guardian.jpg";
import maryam07 from "@/assets/stories/maryam/07-annunciation.jpg";
import maryam08 from "@/assets/stories/maryam/08-palmnight.jpg";
import maryam09 from "@/assets/stories/maryam/09-square.jpg";
import maryam10 from "@/assets/stories/maryam/10-home.jpg";
// Adam (10 scenes)
import adam01 from "@/assets/stories/adam/01-garden.jpg";
import adam02 from "@/assets/stories/adam/02-fall.jpg";
import adam03 from "@/assets/stories/adam/03-tears.jpg";
import adam04 from "@/assets/stories/adam/04-mercy.jpg";
import adam05 from "@/assets/stories/adam/05-clay.jpg";
import adam06 from "@/assets/stories/adam/06-bow.jpg";
import adam07 from "@/assets/stories/adam/07-refusal.jpg";
import adam08 from "@/assets/stories/adam/08-earth.jpg";
import adam09 from "@/assets/stories/adam/09-reunion.jpg";
import adam10 from "@/assets/stories/adam/10-door.jpg";
// Ibrahim (10 scenes)
import ibrahim01 from "@/assets/stories/ibrahim/01-stars.jpg";
import ibrahim02 from "@/assets/stories/ibrahim/02-fire.jpg";
import ibrahim03 from "@/assets/stories/ibrahim/03-ram.jpg";
import ibrahim04 from "@/assets/stories/ibrahim/04-house.jpg";
import ibrahim05 from "@/assets/stories/ibrahim/05-idols.jpg";
import ibrahim06 from "@/assets/stories/ibrahim/06-shattered.jpg";
import ibrahim07 from "@/assets/stories/ibrahim/07-garden.jpg";
import ibrahim08 from "@/assets/stories/ibrahim/08-caravan.jpg";
import ibrahim09 from "@/assets/stories/ibrahim/09-zamzam.jpg";
import ibrahim10 from "@/assets/stories/ibrahim/10-pilgrims.jpg";
// Ayyub (10 scenes)
import ayyub01 from "@/assets/stories/ayyub/01-orchard.jpg";
import ayyub02 from "@/assets/stories/ayyub/02-loss.jpg";
import ayyub03 from "@/assets/stories/ayyub/03-spring.jpg";
import ayyub04 from "@/assets/stories/ayyub/04-restored.jpg";
import ayyub05 from "@/assets/stories/ayyub/05-table.jpg";
import ayyub06 from "@/assets/stories/ayyub/06-gratitude.jpg";
import ayyub07 from "@/assets/stories/ayyub/07-illness.jpg";
import ayyub08 from "@/assets/stories/ayyub/08-turned.jpg";
import ayyub09 from "@/assets/stories/ayyub/09-devotion.jpg";
import ayyub10 from "@/assets/stories/ayyub/10-heal.jpg";

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
  subtitle?: Localized;
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
  subtitle: { en: "The story of Prophet Yunus" },
  sources: [
    "Qur'an 21:87 · Al-Anbiya",
    "Qur'an 37:139–148 · As-Saffat",
    "Qur'an 68:48–50 · Al-Qalam",
    "Ibn Kathir · Qisas al-Anbiya",
  ],
  durationSec: 115,
  scenes: [
    { image: yunus01, durationMs: 11000, kenBurns: "in",
      narration: en("The city of Nineveh was old and vast. Its people had forgotten their Lord — they filled their days with idols and their nights with heedlessness.") },
    { image: yunus07, durationMs: 12000, kenBurns: "panRight",
      narration: en("Prophet Yunus, upon him be peace, called them back. Return to the One who gave you your city, your bread, your breath. But warning after warning was met with silence and scorn.") },
    { image: yunus02, durationMs: 11000, kenBurns: "panLeft",
      narration: en("When he could bear it no more, he left them behind. He boarded a ship, laden with cargo. The sea grew heavy. A storm rose against them, and the ship began to sink.") },
    { image: yunus03, durationMs: 11000, kenBurns: "in",
      narration: en("The sailors cast lots to decide who must be thrown overboard to save the rest. Three times the lot fell on him. He accepted, and stepped into the sea.") },
    { image: yunus04, durationMs: 12000, kenBurns: "out",
      narration: en("A great whale was sent for him. It swallowed him whole. And Yunus found himself in the depths — of the sea, of the whale, of the night.") },
    { image: yunus05, durationMs: 13000, kenBurns: "in",
      narration: en("In the layered darkness he called out: There is no god but You. Glory be to You. Truly I have been of the wrongdoers.") },
    { image: yunus08, durationMs: 12000, kenBurns: "out",
      narration: en("Allah heard him. Every atom of that darkness heard him. Light travels where despair cannot reach — and no cry from a sincere heart is ever lost.") },
    { image: yunus06, durationMs: 11000, kenBurns: "out",
      narration: en("The whale cast him onto an empty shore. Weak, bare, small as a newborn — and yet, alive.") },
    { image: yunus09, durationMs: 11000, kenBurns: "in",
      narration: en("Allah caused a gourd vine to grow over him — shade for his skin, fruit for his body, mercy for his soul. If not for his remembrance, he would have remained there forever.") },
    { image: yunus10, durationMs: 11000, kenBurns: "out",
      narration: en("Restored, Yunus returned. And this time Nineveh answered — a whole city turned back to its Lord. So call. Even from the deepest dark. He is listening.") },
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
  subtitle: { en: "The story of Prophet Moses" },
  sources: [
    "Qur'an 20:9–98 · Ta-Ha",
    "Qur'an 28:7–35 · Al-Qasas",
    "Qur'an 26:52–66 · Ash-Shu'ara",
    "Ibn Kathir · Qisas al-Anbiya",
  ],
  durationSec: 118,
  scenes: [
    { image: musa05, durationMs: 12000, kenBurns: "in",
      narration: en("In the halls of Pharaoh, a decree was given: every son born to the Children of Israel was to be killed. Fear settled over every doorway.") },
    { image: musa01, durationMs: 12000, kenBurns: "panRight",
      narration: en("A mother placed her infant in a basket and set him upon the Nile. She was afraid. Allah whispered to her heart: do not fear. We will return him to you.") },
    { image: musa02, durationMs: 12000, kenBurns: "panLeft",
      narration: en("Years later, in the valley of Madyan, he stood beside his shepherd's staff — a fugitive, weary, alone. But Allah had never left him.") },
    { image: musa06, durationMs: 11000, kenBurns: "in",
      narration: en("At a stone well, he helped two sisters water their flocks and asked nothing in return. My Lord, he prayed, whatever good You send down to me, I am in need of it. Shelter came that same day.") },
    { image: musa03, durationMs: 12000, kenBurns: "in",
      narration: en("On the slope of a mountain, a fire burned that did not consume. A voice called: O Musa. Truly I am your Lord. Take off your sandals — you are in the sacred valley.") },
    { image: musa07, durationMs: 12000, kenBurns: "out",
      narration: en("Throw down your staff, He said. It became a living sign. Musa was afraid — and Allah said: do not fear. You are of the secure.") },
    { image: musa08, durationMs: 12000, kenBurns: "panRight",
      narration: en("Musa returned to Pharaoh with signs the tyrant could not answer. Sign after sign came — and still Pharaoh's heart hardened, until the day of reckoning arrived.") },
    { image: musa04, durationMs: 12000, kenBurns: "in",
      narration: en("Pharaoh's army closed in behind him. The sea stretched wide ahead. His people cried, We are overtaken. He said: Never. My Lord is with me. He will guide me.") },
    { image: musa09, durationMs: 12000, kenBurns: "in",
      narration: en("He struck the sea — and the water stood aside. A dry road opened between two walls of turquoise water. The people crossed. The tyrant did not.") },
    { image: musa10, durationMs: 11000, kenBurns: "out",
      narration: en("Later he climbed the mountain alone to meet his Lord. Fear does not have the last word. The Lord who split the sea is with you on every narrow path.") },
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
  subtitle: { en: "The story of Maryam" },
  sources: [
    "Qur'an 19:16–34 · Maryam",
    "Qur'an 3:35–47 · Aal-'Imran",
    "Ibn Kathir · Qisas al-Anbiya",
  ],
  durationSec: 115,
  scenes: [
    { image: maryam05, durationMs: 12000, kenBurns: "in",
      narration: en("Her mother had vowed the child in her womb to the service of Allah. When Maryam was born, she was given to the sanctuary — dedicated before she could speak.") },
    { image: maryam06, durationMs: 11000, kenBurns: "panRight",
      narration: en("Zakariyya became her guardian. Whenever he entered her chamber, he found provision she had not asked for. From where does this come? he wondered. She said: it is from Allah.") },
    { image: maryam01, durationMs: 11000, kenBurns: "in",
      narration: en("In the quiet of her prayer niche, unseasonal fruit was always with her. Allah provides without measure — to whom He wills, when He wills.") },
    { image: maryam07, durationMs: 12000, kenBurns: "out",
      narration: en("Then one day, in that same chamber of light, a messenger came with news no one had heard: a pure son, a word from Allah, a mercy to the worlds. How can this be? she asked. He said: your Lord has said, it is easy for Me.") },
    { image: maryam02, durationMs: 11000, kenBurns: "panLeft",
      narration: en("When the time came, she withdrew to a distant place. Alone, afraid, she cried out: would that I had died before this, and been forgotten.") },
    { image: maryam08, durationMs: 12000, kenBurns: "in",
      narration: en("Under a lone palm tree in the vast quiet, her pain was hers alone to carry. No hand held hers. But she was never truly alone.") },
    { image: maryam03, durationMs: 12000, kenBurns: "out",
      narration: en("A voice from beneath her called: do not grieve. Your Lord has placed a stream beneath you. Shake the trunk of the palm — fresh ripe dates will fall. Eat, drink, and be comforted.") },
    { image: maryam09, durationMs: 12000, kenBurns: "in",
      narration: en("She returned carrying her child to the moonlit square of her people. The whispers turned to accusations, and her heart to prayer.") },
    { image: maryam04, durationMs: 12000, kenBurns: "out",
      narration: en("She pointed to the cradle. And from that cradle, an infant spoke: Truly, I am a servant of Allah. Peace be upon me the day I was born, and the day I die, and the day I am raised again.") },
    { image: maryam10, durationMs: 10000, kenBurns: "out",
      narration: en("What loneliness could break the one Allah honours? Every hidden tear, every silent chamber — He sees, and He replies.") },
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
  durationSec: 115,
  scenes: [
    { image: adam05, durationMs: 12000, kenBurns: "in",
      narration: en("Before there were cities or seasons, there was a decision: I am placing upon the earth a successor. From dust and shaped clay, the first human was formed.") },
    { image: adam06, durationMs: 11000, kenBurns: "panRight",
      narration: en("He was taught the names — knowledge no other creature carried. Then Allah commanded the angels: bow to Adam. And they bowed.") },
    { image: adam07, durationMs: 11000, kenBurns: "in",
      narration: en("Only one refused. Iblis stood apart, filled with pride: I am better than him. His refusal became his ruin — and a whisper he swore to carry to every human heart.") },
    { image: adam01, durationMs: 12000, kenBurns: "out",
      narration: en("Adam and his wife dwelt in the Garden, with every fruit before them, and only one tree forbidden. Do not approach it, their Lord said. Or you will be among the wrongdoers.") },
    { image: adam02, durationMs: 12000, kenBurns: "panLeft",
      narration: en("The whisperer came. They tasted. And what was covered was uncovered. They fell — from ease into effort, from certainty into longing.") },
    { image: adam08, durationMs: 12000, kenBurns: "in",
      narration: en("Down onto the earth they came, into a world of cracked ground and long shadows. Every step now carried the weight of a home left behind.") },
    { image: adam03, durationMs: 12000, kenBurns: "in",
      narration: en("Adam wept — not because Allah had punished him, but because he had disobeyed the One he loved. Tears are not the end of a story. They are often its turning.") },
    { image: adam09, durationMs: 12000, kenBurns: "out",
      narration: en("Then Adam received words from his Lord — words placed on his tongue: Our Lord, we have wronged ourselves. If You do not forgive us and have mercy on us, we will surely be among the losers.") },
    { image: adam04, durationMs: 11000, kenBurns: "in",
      narration: en("And He turned to him in mercy. Truly He is the Ever-Relenting, the Most Merciful. Every child of Adam sins — and the best of sinners are those who return.") },
    { image: adam10, durationMs: 10000, kenBurns: "out",
      narration: en("The door of repentance stays open until the last breath. It was opened first for our father. It has never been closed.") },
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
  durationSec: 118,
  scenes: [
    { image: ibrahim01, durationMs: 12000, kenBurns: "panRight",
      narration: en("As a young man, Ibrahim looked at the stars, the moon, the sun — each rose, each set. He said: I do not love that which sets. I turn my face to the One who made the heavens and the earth.") },
    { image: ibrahim05, durationMs: 12000, kenBurns: "in",
      narration: en("His people carved idols of stone and asked them for rain and sons. Ibrahim spoke gently, then plainly: these cannot hear, see, or help. Still their hearts remained closed.") },
    { image: ibrahim06, durationMs: 12000, kenBurns: "panLeft",
      narration: en("When they were away, he broke the idols and left his axe upon the largest. Ask them, he said, if they can speak. They could not answer even for themselves.") },
    { image: ibrahim02, durationMs: 12000, kenBurns: "in",
      narration: en("Enraged, his people built a great fire and cast him in. Enough for us is Allah, he said. He is the best disposer of affairs.") },
    { image: ibrahim07, durationMs: 12000, kenBurns: "out",
      narration: en("And Allah commanded the fire: be coolness, and peace, upon Ibrahim. Inside the ring of flames, roses bloomed and birds returned. What burns others cannot touch what Allah protects.") },
    { image: ibrahim08, durationMs: 12000, kenBurns: "panRight",
      narration: en("Years later, he brought Hajar and their infant son Isma'il into a barren valley — and left them there by command. My Lord will not neglect them, he said, and walked away in trust.") },
    { image: ibrahim09, durationMs: 12000, kenBurns: "in",
      narration: en("When the water ran out, Hajar ran between two hills seeking help. And Allah brought forth a spring at the child's feet — Zamzam — which has never dried up since.") },
    { image: ibrahim03, durationMs: 12000, kenBurns: "in",
      narration: en("Later he saw in a dream that he must offer his son. Father, do what you are commanded, the boy said. When both surrendered, Allah called out: enough. You have fulfilled the vision — and sent a ram in his place.") },
    { image: ibrahim04, durationMs: 12000, kenBurns: "out",
      narration: en("With his son Isma'il, he raised the foundations of a simple stone house in that same valley. Our Lord, accept this from us. Truly You are the All-Hearing, the All-Knowing.") },
    { image: ibrahim10, durationMs: 10000, kenBurns: "out",
      narration: en("Then he called: proclaim the pilgrimage to the people. And they answer him still — from every land, every century. Hope planted in obedience becomes a garden that outlives you.") },
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
  durationSec: 115,
  scenes: [
    { image: ayyub01, durationMs: 11000, kenBurns: "in",
      narration: en("Ayyub was given health, family, and orchards heavy with fruit. In every season, he remembered the One who gave the season.") },
    { image: ayyub05, durationMs: 12000, kenBurns: "panRight",
      narration: en("His home was open. Travellers were fed. The orphan and the poor had a place at his table. Blessing, in his hands, became blessing for others.") },
    { image: ayyub06, durationMs: 11000, kenBurns: "in",
      narration: en("He gave thanks in every state, and his praise did not depend on his blessings. He knew: the One who gave can also entrust me with less.") },
    { image: ayyub02, durationMs: 12000, kenBurns: "panLeft",
      narration: en("Then the trial came. His wealth was gone. His children were taken. And still — he did not turn away.") },
    { image: ayyub07, durationMs: 12000, kenBurns: "in",
      narration: en("Illness settled into his body until only his tongue and heart were left in ease — and with those two he never stopped remembering his Lord.") },
    { image: ayyub08, durationMs: 12000, kenBurns: "panRight",
      narration: en("Old friends turned away. The road past his door grew quiet. Those who once praised him now averted their eyes.") },
    { image: ayyub09, durationMs: 11000, kenBurns: "in",
      narration: en("Only his wife stayed. She served him, fed him, protected his dignity. In her devotion, Allah kept a lamp burning at his doorway.") },
    { image: ayyub03, durationMs: 12000, kenBurns: "in",
      narration: en("At last he whispered: harm has afflicted me, and You are the Most Merciful of the merciful. He did not accuse. He did not despair. He simply called.") },
    { image: ayyub10, durationMs: 12000, kenBurns: "out",
      narration: en("Allah said: strike the ground with your foot. And a cool spring rose from the cracked earth. Here is a place to wash, and a drink. Truly, We found him patient — an excellent servant.") },
    { image: ayyub04, durationMs: 10000, kenBurns: "out",
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
