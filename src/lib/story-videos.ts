// Pre-generated cinematic video + multi-language narration audio for stories.
// Narrations use ElevenLabs "Brian" (voice ID nPczCjzI2devNBz1zQrb) for a
// warm, consistent male voice across scenes and languages.
// Currently only Musa is generated as a pilot. If a story is absent here, the
// player falls back to the still-image + on-the-fly TTS experience.

const SUPA = "https://uponnojfyseqvvbjbxcf.supabase.co/storage/v1/object/public";

type StoryVideoManifest = {
  /** Scene video URLs, indexed to match the story.scenes order. */
  videos: string[];
  /** narrations[langCode][sceneIndex] = audioUrl */
  narrations: Record<string, string[]>;
};

const MUSA_LANGS = ["en", "ur", "ru", "bn", "fa", "id", "ms", "tr", "fr", "de"];

// Musa scene order in stories.ts:
// 05-palace, 01-basket, 02-staff, 06-well, 03-fire, 07-sign, 08-signs,
// 04-sea, 09-crossing, 10-mountain
const MUSA_VIDEO_FILES = [
  "05-palace", "01-basket", "02-staff", "06-well", "03-fire",
  "07-sign", "08-signs", "04-sea", "09-crossing", "10-mountain",
];

function musaNarrationsFor(lang: string) {
  return Array.from({ length: 10 }, (_, i) =>
    `${SUPA}/narrations/musa/${lang}/scene-${String(i + 1).padStart(2, "0")}.mp3`
  );
}

const MUSA: StoryVideoManifest = {
  videos: MUSA_VIDEO_FILES.map((f) => `${SUPA}/scene-images/musa/videos/${f}.mp4`),
  narrations: Object.fromEntries(MUSA_LANGS.map((l) => [l, musaNarrationsFor(l)])),
};

export const STORY_VIDEO_MANIFESTS: Record<string, StoryVideoManifest | undefined> = {
  musa: MUSA,
};

export function getStoryVideoManifest(id: string): StoryVideoManifest | undefined {
  return STORY_VIDEO_MANIFESTS[id];
}
