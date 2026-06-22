// Thin wrapper around Firebase Analytics for the Capacitor Android shell.
// On web (and iOS, until we add it) this is a no-op so the same call sites
// work everywhere. Native Android calls go through @capacitor-firebase/analytics
// which reads google-services.json at native build time.

import { Capacitor } from "@capacitor/core";

type Params = Record<string, string | number | boolean | undefined>;

let nativeReady: Promise<typeof import("@capacitor-firebase/analytics").FirebaseAnalytics> | null = null;

function getNative() {
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== "android") return null;
  if (!nativeReady) {
    nativeReady = import("@capacitor-firebase/analytics").then((m) => m.FirebaseAnalytics);
  }
  return nativeReady;
}

export async function logEvent(name: string, params: Params = {}) {
  const native = getNative();
  if (!native) {
    if (typeof window !== "undefined" && (window as any).__NOOR_DEBUG_ANALYTICS) {
      console.log("[analytics]", name, params);
    }
    return;
  }
  try {
    const FA = await native;
    // Strip undefined values
    const clean: Record<string, string | number | boolean> = {};
    for (const [k, v] of Object.entries(params)) if (v !== undefined) clean[k] = v;
    await FA.logEvent({ name, params: clean });
  } catch (e) {
    console.warn("[analytics] logEvent failed", name, e);
  }
}

export async function setScreen(screenName: string, screenClass?: string) {
  const native = getNative();
  if (!native) return;
  try {
    const FA = await native;
    await FA.setCurrentScreen({ screenName, screenClassOverride: screenClass });
  } catch (e) {
    console.warn("[analytics] setScreen failed", screenName, e);
  }
}

// Named helpers for the events we care about.
export const track = {
  moodSelected: (moodId: string, moodLabel: string) =>
    logEvent("mood_selected", { mood_id: moodId, mood_label: moodLabel }),
  storyOpened: (surah: number, surahName?: string) =>
    logEvent("story_opened", { surah, surah_name: surahName }),
  bookmarkAdded: (surah: number, verse: number) =>
    logEvent("bookmark_added", { surah, verse }),
  bookmarkRemoved: (surah: number, verse: number) =>
    logEvent("bookmark_removed", { surah, verse }),
};
