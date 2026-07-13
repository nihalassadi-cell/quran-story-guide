## Micro-Reading Habit — Implementation Plan

Build a daily 2-page Qur'an reading habit, surfaced on the Today tab, persisted in Lovable Cloud, with a soft "continue?" prompt and a return-visit celebration.

---

### 1. Decisions locked in

- **Starting point:** user picks during a one-time setup (surah OR juz OR "start from Al-Fatihah"). Editable later from Settings.
- **What counts as "read":** hybrid — a page is marked complete when the user **scrolls to the bottom of that page's ayahs AND spends ≥20 seconds on it**. Prevents flick-through gaming without requiring an explicit tap. A subtle "✓ Page complete" chip animates in when the threshold is met.
- **Persistence:** Lovable Cloud (auth already exists). Syncs across devices; anonymous users see a "Sign in to save your progress" prompt on the micro-read card.
- **Translation:** respects the user's existing language setting (already in `src/lib/language.ts`). Arabic + translation shown side-by-side by default; a toggle in the reader lets them switch to Arabic-only for that session.

---

### 2. Database (one migration)

```
reading_progress
  user_id uuid PK → auth.users
  start_surah int, start_verse int   -- user's chosen starting point
  current_surah int, current_verse int  -- cursor — next unread ayah
  updated_at timestamptz

reading_sessions
  id uuid PK
  user_id uuid → auth.users
  session_date date          -- local date; one row per calendar day
  pages_read int default 0
  completed_at timestamptz   -- set when pages_read >= 2
  unique (user_id, session_date)

reading_streak
  user_id uuid PK
  current_streak int default 0
  longest_streak int default 0
  last_completed_date date
```

RLS: owner-only (`auth.uid() = user_id`) on all three. GRANT to authenticated + service_role.

---

### 3. Today tab — hero card

Replaces nothing; **inserted at the top** above the existing Verse card.

```text
┌──────────────────────────────────────────┐
│ ✦ TODAY'S READING                        │
│                                          │
│ Al-Baqarah · pages 3–4                   │
│ ~6 min                                   │
│                                          │
│ ◐──────  0 of 2 pages                    │
│                                          │
│ [ Begin reading  → ]                     │
└──────────────────────────────────────────┘
```

- Larger than sibling cards, warm gold accent, subtle animated noor gradient.
- Progress ring fills as pages complete.
- If already complete today: card shows *"Alhamdulillah — today's reading is done"* + secondary "Read one more page" button, no primary CTA.
- Anonymous user: same card, CTA reads "Sign in to begin".

---

### 4. Reader flow

Reuses `src/routes/surah.$number.tsx`, launched with a `?micro=1&pages=2` param.

- Reader jumps to the cursor position (`current_surah`, `current_verse`).
- Small persistent header: *"Page 1 of 2"* + thin progress bar.
- Page completion detected via IntersectionObserver on the last ayah of each mushaf page + 20s dwell timer.
- On completion: subtle ✓ animation, `pages_read` increments, cursor advances.
- **After page 2:** calm bottom-sheet:
  - *"You've completed today's reading."*
  - **Primary:** "End here" → celebration screen → back to Today.
  - **Secondary:** "Read one more page" → continues; no further prompts this session.
- Exit at any time saves the cursor at the last fully-read ayah.

---

### 5. Return-visit moments

On Today mount, compare `last_completed_date` to today:

- **Streak continues** (yesterday completed): one-time overlay per day — *"Alhamdulillah — 3 days in a row"* with soft noor particles, dismissible tap-anywhere. Then Today loads normally.
- **Streak broken** (gap): no overlay, no red. Today's card just reads *"Welcome back. Let's begin again."* Streak silently resets to 0 on first completion of the new session.
- **Same-day return after completion:** no overlay; hero card shows the completed state.

Streak indicator: small crescent + number in the Today header, next to the date. Never a large badge.

---

### 6. Settings addition

New section: **Reading**
- Starting point (surah picker + verse, or juz picker)
- Reset progress (with confirm)
- Show streak (toggle — some users don't want gamification visible)

---

### 7. Files touched

**New**
- `supabase/migrations/<ts>_reading_progress.sql`
- `src/lib/reading.functions.ts` — server fns: `getReadingState`, `markPageRead`, `resetProgress`, `setStartingPoint`
- `src/lib/mushaf-pages.ts` — static map of ayah → mushaf page boundaries (for "2 pages" definition)
- `src/components/MicroReadCard.tsx` — Today hero
- `src/components/StreakOverlay.tsx` — return-visit celebration
- `src/components/ContinueSheet.tsx` — after-page-2 bottom-sheet

**Edited**
- `src/routes/today.tsx` — insert `<MicroReadCard />` at top; mount `<StreakOverlay />` conditionally
- `src/routes/surah.$number.tsx` — read `?micro=1&pages=2`, add per-page detection, mount `<ContinueSheet />`
- `src/routes/settings.tsx` — new Reading section
- `src/lib/i18n.ts` — copy strings for all 10 languages

---

### 8. Out of scope (future)

- Push/local notifications ("your 2 pages are waiting")
- Weekly/monthly reading stats
- Sharing streaks socially
- Adjustable daily goal (locked at 2 for now to keep the promise simple)

---

Ready to build when you approve. I'll ship the migration + hero card + reader integration first, then the celebration overlay and settings in a second pass so we can verify the core flow feels right before layering polish.
