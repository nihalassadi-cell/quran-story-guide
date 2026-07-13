// Client-side narration player.
// Primary: Lovable AI TTS via POST /api/tts (openai/gpt-4o-mini-tts, warm "onyx" voice).
// Cached in-memory by text hash to avoid re-hitting the endpoint on scene replays.
// Fallback: Web Speech API if the fetch fails or audio can't play.

const cache = new Map<string, string>(); // key -> object URL

function hashKey(text: string, voice: string) {
  // Small stable hash — text length usually < 4KB
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h) ^ text.charCodeAt(i);
  return `${voice}:${h.toString(36)}:${text.length}`;
}

export interface Narrator {
  audio: HTMLAudioElement | null;
  usedFallback: boolean;
  stop: () => void;
  onEnd: (cb: () => void) => void;
}

async function fetchTTS(text: string, voice: string): Promise<string> {
  const key = hashKey(text, voice);
  const cached = cache.get(key);
  if (cached) return cached;
  const res = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voice }),
  });
  if (!res.ok) throw new Error(`tts ${res.status}`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  cache.set(key, url);
  return url;
}

// Prefetch in the background — best-effort, ignore errors.
export function prefetchTTS(text: string, voice = "onyx"): void {
  fetchTTS(text, voice).catch(() => {});
}

export async function speak(
  text: string,
  opts: { lang?: string; voice?: string } = {},
): Promise<Narrator> {
  const voice = opts.voice ?? "onyx";
  const endHandlers: Array<() => void> = [];
  const emitEnd = () => endHandlers.forEach((f) => { try { f(); } catch {} });

  try {
    const url = await fetchTTS(text, voice);
    const audio = new Audio(url);
    audio.addEventListener("ended", emitEnd);
    // Attempt playback — may be blocked by autoplay policy; caller triggers on user gesture
    await audio.play();
    return {
      audio,
      usedFallback: false,
      stop: () => { audio.pause(); audio.currentTime = 0; },
      onEnd: (cb) => { endHandlers.push(cb); },
    };
  } catch (e) {
    console.warn("[tts] falling back to web speech", e);
    // Web Speech fallback
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = opts.lang || "en";
        u.rate = 0.92;
        u.onend = emitEnd;
        window.speechSynthesis.speak(u);
        return {
          audio: null,
          usedFallback: true,
          stop: () => window.speechSynthesis.cancel(),
          onEnd: (cb) => { endHandlers.push(cb); },
        };
      } catch {}
    }
    // Silent no-op narrator
    setTimeout(emitEnd, 0);
    return {
      audio: null,
      usedFallback: true,
      stop: () => {},
      onEnd: (cb) => { endHandlers.push(cb); },
    };
  }
}
