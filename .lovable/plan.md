# Phase 2 — Full i18n + Animated Stories

Two tracks land in Phase 2. Track A is a thorough translation sweep across every screen and sub-screen. Track B builds the animated Story player and ships the Yunus (AS) pilot.

---

## Track A — App-wide translations

### Scope (every visible English string)

- **Bottom tab bar** (already done — verify)
- **Today** (`/today`)
  - Date label — currently forced to `en-US`; switch to the user's language locale (`ur-PK`, `fr-FR`, `de-DE`, `tr-TR`, `id-ID`, `ms-MY`, `ru-RU`, `bn-BD`, `fa-IR`)
  - Card chips: "Verse", "Hadith", "Dhikr", "Story", "Reflection"
  - Card actions: "Open Surah", "Reveal reflection", "×N", "min · Prophet story", source labels
- **Quran home** (`/`) — done, verify
- **Feelings** (`/animate`) — headers done; mood tile labels ("Anxious", "Grateful", …) still English
- **Mood detail** (`/mood/$id`)
  - Top bar, Practice card headings, "Repeat ×N", counter, "Verses for this feeling", verse-player controls, share sheet, tafsir/reflection accordions, "Related verses"
- **Surah reader** (`/surah/$number`)
  - Header, page/verse counter, reciter dropdown label, translation toggle, autoplay indicator, "Bookmark", "Continue from here", empty/loading states
- **Onboarding** — 3 slide titles + bodies + "Skip" / "Next" / "Begin"
- **Settings** — done
- **Auth** (`/auth`) — sign-in labels, email/password fields, OAuth buttons, errors
- **Terms / Privacy** — leave English (legal), add a note at top in user's language: "Legal text is provided in English."
- **Toasts** — every `toast.success/error` string
- **Common** — Loading, Error, Retry, Back, Close, Play, Pause, Next, Previous

### Implementation

- Extend `src/lib/i18n.ts` with all keys above across all 10 languages
- Add `localeFor(lang)` helper mapping `LangCode → BCP-47` for `toLocaleDateString`/`toLocaleTimeString`
- Localize `MOODS[].label` by converting it from `string` to `Localized` (add `label_i18n` field, keep `label` as English fallback for logging/analytics)
- Add RTL support: when `isRtl(lang)` is true, set `dir="rtl"` on `<AppShell>` root and mirror icons where directional
- Add a `scripts/check-i18n.mjs` audit that greps for hardcoded English strings in JSX and fails CI (optional stretch)

### Acceptance

- Switching Settings → Urdu changes every visible label on Today, Quran, Feelings, Mood, Surah, Onboarding
- Date on Today reads "پیر، 13 جولائی" for Urdu, "lundi 13 juillet" for French, etc.
- No English string remains on any of the 4 main tabs or the mood/surah detail pages

---

## Track B — Animated Story infrastructure

### New data model (`src/lib/stories.ts`)

```ts
Story {
  id: 'yunus' | 'musa' | 'maryam' | 'adam' | 'ibrahim' | 'sulaiman'
  moodId: string
  title: Localized
  scenes: Scene[]     // 6–8 stills with narration + captions
  sources: string[]   // Qur'an refs + Ibn Kathir citation
  durationSec: number
}
Scene {
  image: string           // /src/assets/stories/yunus/01.jpg
  narration: Localized    // caption text; also fed to TTS
  durationMs: number      // 8–15s per scene
  kenBurns: 'in' | 'out' | 'panLeft' | 'panRight'
}
```

### New route (`/story/$id`)

- Full-bleed cinematic player: image with Ken Burns pan/zoom, captions bottom-safe, ambient particle overlay, progress bar of scene dots
- Controls: Play/Pause, Prev/Next scene, Mute, Language menu, Close
- Narration: ElevenLabs "Brian" via existing kalima TTS server function, extended with a `story-narration` mode; cache audio by `${storyId}:${sceneIdx}:${lang}` in IndexedDB
- Auto-advance scenes on narration end; falls back to `durationMs` when muted
- Fully symbolic art — light, silhouettes, boat, cave, staff — no faces or bodies (as agreed)

### Yunus (AS) pilot content

6 scenes, symbolic art via nano-banana (imagegen premium.gemini):
1. City of Nineveh at dusk — turning away
2. Boat on the sea, storm gathering
3. Boat tossed; lots drawn (rope + wooden lots on deck)
4. Silhouette falling into moonlit water; whale shape below as light
5. Inside the darkness — three concentric arcs of light, the du'a in Arabic calligraphy
6. Shore at dawn, gourd vine and soft light

Narration script (English) drafted from Qur'an 21:87, 37:139–148, and Ibn Kathir's *Qisas al-Anbiya*, translated to all 10 languages.

### Wire-up

- Today's Story card → `/story/${today.story.storyId}` (currently points to `/mood/$id`)
- Mood detail v3 Story card → `/story/${storyForMood(id)}` when a story exists for the mood
- Feelings tile: small "▶ story" badge on moods that have a pilot story

### Acceptance

- `/story/yunus` plays 6 scenes end-to-end with narration, captions, and ambient
- Switching language mid-story swaps captions immediately and re-narrates on next scene
- Today's Story deep-link opens the player, not the kalimah page
- Symbolic art passes the "no faces/bodies" rule on every frame

---

## Order of execution

1. Land Track A first (~1 turn). Verify with screenshots on Urdu + French.
2. Build Track B infrastructure (route + player + TTS extension) with placeholder images.
3. Generate Yunus art (6 stills).
4. Wire Today + Mood entry points, ship pilot.
5. Subsequent stories (Musa, Maryam, Adam, Ibrahim, Sulaiman) added incrementally in Phase 2.5 without further architecture changes.

## Out of scope for Phase 2

- Scholarly review workflow (still "widely-accepted sources" + citations)
- Human VO (ElevenLabs Brian remains)
- `daily_content` DB migration (still deterministic in-code pool)
- Legal doc localization
