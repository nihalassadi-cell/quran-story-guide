## Language & Translation Support — Implementation Plan

### Decisions confirmed
1. One global "Preferred Language" setting (asked on onboarding + editable in Settings).
2. Mood translations hand-written into `src/lib/moods.ts` for all languages.
3. When translation audio is unavailable for a language, hide the translation audio button. Arabic recitation always plays.
4. Default = **English** (recommended — broadest reach, already in place). Detecting device language adds edge cases (unsupported locales, mismatched scripts). English default + easily changeable in onboarding/Settings is the cleanest path.

### Supported languages
English (en), Urdu (ur), Hindi (hi), Bengali (bn), Persian/Farsi (fa), Indonesian (id), Malay (ms), Turkish (tr), French (fr), German (de) — 10 total.

### Files to create
- **`src/lib/language.ts`** — `SUPPORTED_LANGUAGES` array (code, label, nativeLabel, rtl flag), `getLanguage()`, `setLanguage()`, `useLanguage()` hook with storage event sync. Key: `noor.language`.

### Files to edit
- **`src/components/Onboarding.tsx`** — Add a 3rd step "Choose your language" with a list of the 10 languages (radio buttons). Mention: "Quran recitation is always in Arabic. This setting controls translations only."

- **`src/routes/settings.tsx`** — Add "Preferred Language" dropdown at the top (replaces/sits alongside the existing translation language dropdown which was scoped to Surah). Add the note about Arabic recitation.

- **`src/lib/moods.ts`** —
  - Change `Kalima.translation: string` → `Kalima.translation: Record<LangCode, string>` (or `{ en, ur, hi, bn, fa, id, ms, tr, fr, de }`).
  - Same for `Kalima.explanation` and `MoodVerse.reason`.
  - Add `Mood.blurb` as `Record<LangCode, string>`.
  - Hand-write translations for all 14 kalimas + verse reasons + mood blurbs across 10 languages.

- **`src/routes/mood.$id.tsx`** — Use `useLanguage()` to pick the right translation/explanation/blurb/reason strings. Apply `dir="rtl"` for Urdu/Persian translation text.

- **`src/routes/surah.$number.tsx`** — Replace local language dropdown with global language from `useLanguage()`. Expand language list. When a chosen language has no translation audio, hide the translation audio button (keep Arabic recital). Show small caption: "Translation audio not available in <Language>".

- **`src/lib/quran-api.ts`** — Add a `hasTranslationAudio(lang)` helper (whitelist: en, ur — confirm against existing API; others return false → hide button).

### Out of scope (for this turn)
- TTS fallback for missing translation audio.
- RTL layout flip for the whole app (only translation text blocks get `dir="rtl"`).
- Translating UI chrome (buttons, nav labels) — only Quran/kalima content is translated.

### Rollout
Single PR. After merge, existing users see English by default; they can change in Settings. New users pick during onboarding.
