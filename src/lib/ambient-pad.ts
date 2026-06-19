// Calming ambient pad — richer, more audible, with gentle bell-like
// chimes drifting over a soft chord. Pure Web Audio, no assets.

export type AmbientPad = {
  start: () => Promise<void>;
  stop: () => void;
  setVolume: (v: number) => void;
  isPlaying: () => boolean;
};

export function createAmbientPad(): AmbientPad {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let oscs: OscillatorNode[] = [];
  let lfos: OscillatorNode[] = [];
  let chimeTimer: number | null = null;
  let playing = false;
  let targetVol = 0.28; // audible but gentle
  let silentEl: HTMLAudioElement | null = null;

  // Tiny silent looping WAV — when played via <audio> on a user gesture,
  // iOS switches the page's audio session to "playback", which routes
  // WebAudio through the media volume and ignores the silent switch.
  const SILENT_WAV =
    "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";


  // Soft, consonant chord — A minor 9 voicing
  // A2, E3, A3, C4, E4, G4
  const freqs = [110, 164.81, 220, 261.63, 329.63, 392.0];

  // Pentatonic chime notes (A minor pent across octaves)
  const chimeNotes = [440, 523.25, 659.25, 783.99, 880, 1046.5];

  const start = async () => {
    if (playing) return;
    const AC = (window.AudioContext || (window as any).webkitAudioContext);
    if (!AC) return;
    // IMPORTANT: AudioContext must be CREATED inside a user gesture on iOS,
    // otherwise it is born in "suspended" state and resume() won't unlock it.
    if (!ctx) ctx = new AC();
    if (ctx.state !== "running") {
      try { await ctx.resume(); } catch {}
    }
    // iOS: if still not running, the call wasn't from a user gesture — bail
    // and let the next gesture try again with a fresh context.
    if (ctx.state !== "running") {
      try { await ctx.close(); } catch {}
      ctx = null;
      return;
    }


    master = ctx.createGain();
    master.gain.value = 0;

    // Gentle low-pass to keep things warm but not muffled
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 2200;
    filter.Q.value = 0.4;

    // Subtle stereo "reverb" via delay feedback
    const delay = ctx.createDelay();
    delay.delayTime.value = 0.45;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.35;
    const wet = ctx.createGain();
    wet.gain.value = 0.35;

    master.connect(filter);
    filter.connect(ctx.destination);
    filter.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    wet.connect(ctx.destination);

    oscs = [];
    lfos = [];

    // Pad layer
    freqs.forEach((f, i) => {
      const osc = ctx!.createOscillator();
      osc.type = i % 2 === 0 ? "sine" : "triangle";
      osc.frequency.value = f;
      // tiny detune for warmth
      osc.detune.value = (i - 2) * 4;

      const g = ctx!.createGain();
      g.gain.value = 0.22 / freqs.length;

      // Slow LFO breathing
      const lfo = ctx!.createOscillator();
      lfo.frequency.value = 0.07 + i * 0.025;
      const lfoGain = ctx!.createGain();
      lfoGain.gain.value = 0.12 / freqs.length;
      lfo.connect(lfoGain);
      lfoGain.connect(g.gain);

      osc.connect(g);
      g.connect(master!);
      osc.start();
      lfo.start();
      oscs.push(osc);
      lfos.push(lfo);
    });

    // Occasional bell chimes
    const playChime = () => {
      if (!ctx || !master) return;
      const f = chimeNotes[Math.floor(Math.random() * chimeNotes.length)];
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      const g = ctx.createGain();
      const now = ctx.currentTime;
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.18, now + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);
      o.connect(g);
      g.connect(master);
      o.start(now);
      o.stop(now + 3.6);
    };
    const scheduleChime = () => {
      const next = 4500 + Math.random() * 5500;
      chimeTimer = window.setTimeout(() => {
        if (!playing) return;
        playChime();
        scheduleChime();
      }, next);
    };
    scheduleChime();

    // Fade in
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(targetVol, now + 2.0);

    playing = true;
  };

  const stop = () => {
    if (!playing || !ctx || !master) return;
    const now = ctx.currentTime;
    try {
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + 1.0);
    } catch {}
    if (chimeTimer) { clearTimeout(chimeTimer); chimeTimer = null; }
    const c = ctx;
    const o = oscs;
    const l = lfos;
    window.setTimeout(() => {
      try { o.forEach((n) => n.stop()); } catch {}
      try { l.forEach((n) => n.stop()); } catch {}
      try { c.close(); } catch {}
    }, 1200);
    oscs = [];
    lfos = [];
    ctx = null;
    master = null;
    playing = false;
  };

  const setVolume = (v: number) => {
    targetVol = Math.max(0, Math.min(0.6, v));
    if (ctx && master) {
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.linearRampToValueAtTime(targetVol, now + 0.4);
    }
  };

  return { start, stop, setVolume, isPlaying: () => playing };
}
