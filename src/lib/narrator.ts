// Client-side narration player.
// Uses /api/tts (ElevenLabs "Brian" multilingual). No device-voice fallback —
// if the network TTS fails, we play nothing rather than switch to a robotic
// system voice.

const cache = new Map<string, string>(); // key -> object URL

function hashKey(text: string, lang: string) {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h) ^ text.charCodeAt(i);
  return `${lang}:${h.toString(36)}:${text.length}`;
}

export interface Narrator {
  audio: HTMLAudioElement | null;
  usedFallback: boolean;
  stop: () => void;
  onEnd: (cb: () => void) => void;
}

async function fetchTTS(text: string, lang: string): Promise<string> {
  const key = hashKey(text, lang);
  const cached = cache.get(key);
  if (cached) return cached;
  const res = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, lang, translate: lang !== "en" }),
  });
  if (!res.ok) throw new Error(`tts ${res.status}`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  cache.set(key, url);
  return url;
}

export function prefetchTTS(text: string, lang = "en"): void {
  fetchTTS(text, lang).catch(() => {});
}

export async function speak(
  text: string,
  opts: { lang?: string; volume?: number } = {},
): Promise<Narrator> {
  const lang = opts.lang ?? "en";
  const endHandlers: Array<() => void> = [];
  const emitEnd = () => endHandlers.forEach((f) => { try { f(); } catch {} });

  try {
    const url = await fetchTTS(text, lang);
    const audio = new Audio(url);
    if (typeof opts.volume === "number") audio.volume = Math.max(0, Math.min(1, opts.volume));
    audio.addEventListener("ended", emitEnd);
    await audio.play();
    return {
      audio,
      usedFallback: false,
      stop: () => { audio.pause(); audio.currentTime = 0; },
      onEnd: (cb) => { endHandlers.push(cb); },
    };
  } catch (e) {
    console.warn("[tts] narration unavailable", e);
    setTimeout(emitEnd, 0);
    return {
      audio: null,
      usedFallback: true,
      stop: () => {},
      onEnd: (cb) => { endHandlers.push(cb); },
    };
  }
}
