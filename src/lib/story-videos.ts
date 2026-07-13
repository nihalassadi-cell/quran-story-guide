// Pre-generated cinematic video + optional narration/music manifests.
// - Musa is the fully-baked pilot: cinematic videos, 10 languages of narration,
//   and per-scene ambient background music.
// - Yunus, Maryam, Adam, Ibrahim, Ayyub currently ship with the cinematic
//   videos only. Narration falls back to on-video captions (audio will be
//   filled in once the TTS quota is topped up), and music is empty.
// - Any story not listed here uses the still-image + on-the-fly TTS fallback.

const SUPA = "https://uponnojfyseqvvbjbxcf.supabase.co/storage/v1/object/public";

type StoryVideoManifest = {
  /** Scene video URLs, indexed to match the story.scenes order. */
  videos: string[];
  /** narrations[langCode][sceneIndex] = audioUrl */
  narrations: Record<string, string[]>;
  /** Per-scene background music URLs (calm instrumental), indexed to scenes. Optional. */
  music?: string[];
};

// ---------- Musa (fully baked) ----------
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

const MUSA_MUSIC = Array.from({ length: 10 }, (_, i) =>
  `${SUPA}/narrations/musa/music/scene-${String(i + 1).padStart(2, "0")}.mp3`
);

const MUSA: StoryVideoManifest = {
  videos: MUSA_VIDEO_FILES.map((f) => `${SUPA}/scene-images/musa/videos/${f}.mp4`),
  narrations: Object.fromEntries(MUSA_LANGS.map((l) => [l, musaNarrationsFor(l)])),
  music: MUSA_MUSIC,
};

// ---------- Videos-only stories ----------
// Videos are named scene-01.mp4 through scene-10.mp4 in scene order.
function videosOnly(storyId: string): StoryVideoManifest {
  return {
    videos: Array.from({ length: 10 }, (_, i) =>
      `${SUPA}/scene-images/${storyId}/videos/scene-${String(i + 1).padStart(2, "0")}.mp4`
    ),
    narrations: {},
  };
}

export const STORY_VIDEO_MANIFESTS: Record<string, StoryVideoManifest | undefined> = {
  musa: MUSA,
  yunus: videosOnly("yunus"),
  maryam: videosOnly("maryam"),
  adam: videosOnly("adam"),
  ibrahim: videosOnly("ibrahim"),
  ayyub: videosOnly("ayyub"),
};

export function getStoryVideoManifest(id: string): StoryVideoManifest | undefined {
  return STORY_VIDEO_MANIFESTS[id];
}
