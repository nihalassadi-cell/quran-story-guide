# Noor — Project Rules

- The site is a single-screen marketing landing at `/` (Noor app promo with Google Play CTA) plus `/privacy` and `/terms` kept for Google Play policy compliance. All former app screens (Today, Quran reader, stories, moods, settings, auth, API routes) were removed at the user's request (2026-10-21). Do not re-add app routes or restore deleted screens/libraries without a new user request.
- The Android app on Google Play is built separately via Capacitor from this repo; if rebuilt after the removal, it opens the landing page too. The user is aware.
- The user's brand logo is the uploaded ornate Quran-crescent icon (`src/assets/noor-logo.png.asset.json`); favicon and launcher icons use the same artwork.
- Use `bun`/`bunx` (never npm) for installs and scripts.
- Lovable Cloud (Supabase) backend still exists with reading-progress/story data, but no frontend uses it now; keep backend tables/functions untouched unless asked.
- Narration/voice convention (if audio work returns): single voice "Brian".
