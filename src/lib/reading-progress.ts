// Micro-reading habit — daily 2-page Qur'an reading.
// Persists to Lovable Cloud when signed in, else localStorage.

import { supabase } from "@/integrations/supabase/client";

export type ReadingProgress = {
  start_surah: number;
  start_verse: number;
  current_surah: number;
  current_verse: number;
  show_streak: boolean;
};

export type ReadingSession = {
  session_date: string; // YYYY-MM-DD
  pages_read: number;
  completed_at: string | null;
};

export type ReadingStreak = {
  current_streak: number;
  longest_streak: number;
  last_completed_date: string | null;
};

export const DAILY_TARGET_PAGES = 2;
// One "page" here matches the reader's own page (VERSES_PER_PAGE = 3 in surah.$number.tsx).
export const VERSES_PER_MICRO_PAGE = 3;
export const MIN_DWELL_MS = 20_000;

const LS_PROGRESS = "noor:reading:progress";
const LS_SESSIONS = "noor:reading:sessions"; // { [date]: {pages_read, completed_at} }
const LS_STREAK = "noor:reading:streak";

// ---------- date helpers ----------
export function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  const ta = Date.UTC(ay, am - 1, ad);
  const tb = Date.UTC(by, bm - 1, bd);
  return Math.round((tb - ta) / 86_400_000);
}

async function getUserId(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.user?.id ?? null;
  } catch {
    return null;
  }
}

// ---------- progress ----------
const DEFAULT_PROGRESS: ReadingProgress = {
  start_surah: 1,
  start_verse: 1,
  current_surah: 1,
  current_verse: 1,
  show_streak: true,
};

export async function getProgress(): Promise<ReadingProgress> {
  const uid = await getUserId();
  if (uid) {
    const { data } = await supabase
      .from("reading_progress")
      .select("start_surah,start_verse,current_surah,current_verse,show_streak")
      .eq("user_id", uid)
      .maybeSingle();
    if (data) return data as ReadingProgress;
    // seed
    await supabase.from("reading_progress").insert({ user_id: uid, ...DEFAULT_PROGRESS });
    return { ...DEFAULT_PROGRESS };
  }
  try {
    const raw = localStorage.getItem(LS_PROGRESS);
    if (raw) return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULT_PROGRESS };
}

export async function setStartingPoint(surah: number, verse = 1): Promise<void> {
  const uid = await getUserId();
  const patch = { start_surah: surah, start_verse: verse, current_surah: surah, current_verse: verse };
  if (uid) {
    await supabase.from("reading_progress").upsert({ user_id: uid, ...patch, show_streak: true });
    return;
  }
  const prev = await getProgress();
  try { localStorage.setItem(LS_PROGRESS, JSON.stringify({ ...prev, ...patch })); } catch {}
}

export async function saveCursor(surah: number, verse: number): Promise<void> {
  const uid = await getUserId();
  if (uid) {
    await supabase.from("reading_progress").update({ current_surah: surah, current_verse: verse }).eq("user_id", uid);
    return;
  }
  const prev = await getProgress();
  try { localStorage.setItem(LS_PROGRESS, JSON.stringify({ ...prev, current_surah: surah, current_verse: verse })); } catch {}
}

export async function setShowStreak(show: boolean): Promise<void> {
  const uid = await getUserId();
  if (uid) {
    await supabase.from("reading_progress").update({ show_streak: show }).eq("user_id", uid);
    return;
  }
  const prev = await getProgress();
  try { localStorage.setItem(LS_PROGRESS, JSON.stringify({ ...prev, show_streak: show })); } catch {}
}

export async function resetProgress(): Promise<void> {
  const uid = await getUserId();
  if (uid) {
    await supabase.from("reading_progress").upsert({ user_id: uid, ...DEFAULT_PROGRESS });
    return;
  }
  try { localStorage.removeItem(LS_PROGRESS); } catch {}
}

// ---------- sessions ----------
export async function getTodaySession(): Promise<ReadingSession> {
  const date = todayISO();
  const uid = await getUserId();
  if (uid) {
    const { data } = await supabase
      .from("reading_sessions")
      .select("session_date,pages_read,completed_at")
      .eq("user_id", uid)
      .eq("session_date", date)
      .maybeSingle();
    return (data as ReadingSession) ?? { session_date: date, pages_read: 0, completed_at: null };
  }
  try {
    const raw = localStorage.getItem(LS_SESSIONS);
    const all = raw ? JSON.parse(raw) : {};
    const s = all[date];
    return s ? { session_date: date, ...s } : { session_date: date, pages_read: 0, completed_at: null };
  } catch {
    return { session_date: date, pages_read: 0, completed_at: null };
  }
}

// Adds `delta` pages to today's session. Returns the updated session.
// If pages_read crosses DAILY_TARGET_PAGES for the first time, streak advances.
export async function addPagesRead(delta: number): Promise<{ session: ReadingSession; justCompleted: boolean }> {
  const date = todayISO();
  const prev = await getTodaySession();
  const nextPages = prev.pages_read + delta;
  const wasComplete = !!prev.completed_at;
  const justCompleted = !wasComplete && nextPages >= DAILY_TARGET_PAGES;
  const completed_at = wasComplete ? prev.completed_at : (justCompleted ? new Date().toISOString() : null);

  const uid = await getUserId();
  if (uid) {
    await supabase.from("reading_sessions").upsert(
      { user_id: uid, session_date: date, pages_read: nextPages, completed_at },
      { onConflict: "user_id,session_date" },
    );
  } else {
    try {
      const raw = localStorage.getItem(LS_SESSIONS);
      const all = raw ? JSON.parse(raw) : {};
      all[date] = { pages_read: nextPages, completed_at };
      localStorage.setItem(LS_SESSIONS, JSON.stringify(all));
    } catch {}
  }

  if (justCompleted) await bumpStreak();
  return { session: { session_date: date, pages_read: nextPages, completed_at }, justCompleted };
}

// ---------- streak ----------
export async function getStreak(): Promise<ReadingStreak> {
  const uid = await getUserId();
  if (uid) {
    const { data } = await supabase
      .from("reading_streak")
      .select("current_streak,longest_streak,last_completed_date")
      .eq("user_id", uid)
      .maybeSingle();
    return (data as ReadingStreak) ?? { current_streak: 0, longest_streak: 0, last_completed_date: null };
  }
  try {
    const raw = localStorage.getItem(LS_STREAK);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { current_streak: 0, longest_streak: 0, last_completed_date: null };
}

async function bumpStreak(): Promise<ReadingStreak> {
  const date = todayISO();
  const prev = await getStreak();
  let current = 1;
  if (prev.last_completed_date) {
    const gap = daysBetween(prev.last_completed_date, date);
    if (gap === 0) current = prev.current_streak; // same day, no double-count
    else if (gap === 1) current = prev.current_streak + 1;
    else current = 1;
  }
  const longest = Math.max(prev.longest_streak, current);
  const next: ReadingStreak = { current_streak: current, longest_streak: longest, last_completed_date: date };

  const uid = await getUserId();
  if (uid) {
    await supabase.from("reading_streak").upsert({ user_id: uid, ...next });
  } else {
    try { localStorage.setItem(LS_STREAK, JSON.stringify(next)); } catch {}
  }
  return next;
}

// ---------- planning helpers ----------
const AYAH_COUNTS = [
  7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,
  112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,
  54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,
  14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,
  29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,
  11,8,3,9,5,4,7,3,6,3,5,4,5,6,
];

// Advance a cursor forward by `pages` (VERSES_PER_MICRO_PAGE verses each).
// Returns the new (surah, verse) — the next unread ayah.
export function advanceCursor(surah: number, verse: number, pages: number): { surah: number; verse: number } {
  let s = surah;
  let v = verse + pages * VERSES_PER_MICRO_PAGE;
  while (s <= 114 && v > AYAH_COUNTS[s - 1]) {
    v -= AYAH_COUNTS[s - 1];
    s += 1;
  }
  if (s > 114) return { surah: 114, verse: AYAH_COUNTS[113] };
  return { surah: s, verse: v };
}

export function ayahCount(surah: number): number {
  return AYAH_COUNTS[surah - 1] ?? 0;
}
