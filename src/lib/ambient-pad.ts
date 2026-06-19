// Procedural calming ambient pad using Web Audio.
// Soft sine drones tuned to a meditative chord (A minor 9-ish) with slow LFO
// shimmer and a gentle low-pass filter. No network, no assets — works
// instantly on every device that supports Web Audio.

export type AmbientPad = {
  start: () => Promise<void>;
  stop: () => void;
  setVolume: (v: number) => void;
  isPlaying: () => boolean;
};

export function createAmbientPad(): AmbientPad {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let nodes: OscillatorNode[] = [];
  let lfos: OscillatorNode[] = [];
  let playing = false;
  let targetVol = 0.08; // very gentle by default

  // A meditative drone: A2, E3, A3, C4, E4 (A minor pentatonic feel)
  const freqs = [110, 164.81, 220, 261.63, 329.63];

  const start = async () => {
    if (playing) return;
    const AC = (window.AudioContext || (window as any).webkitAudioContext);
    if (!AC) return;
    ctx = new AC();
    if (ctx.state === "suspended") {
      try { await ctx.resume(); } catch {}
    }

    master = ctx.createGain();
    master.gain.value = 0;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 900;
    filter.Q.value = 0.6;

    master.connect(filter);
    filter.connect(ctx.destination);

    nodes = [];
    lfos = [];

    freqs.forEach((f, i) => {
      const osc = ctx!.createOscillator();
      osc.type = i % 2 === 0 ? "sine" : "triangle";
      osc.frequency.value = f;

      const g = ctx!.createGain();
      g.gain.value = 0.18 / freqs.length;

      // Slow LFO on gain for breathing shimmer
      const lfo = ctx!.createOscillator();
      lfo.frequency.value = 0.05 + i * 0.03; // 0.05–0.2 Hz
      const lfoGain = ctx!.createGain();
      lfoGain.gain.value = 0.05 / freqs.length;
      lfo.connect(lfoGain);
      lfoGain.connect(g.gain);

      osc.connect(g);
      g.connect(master!);

      osc.start();
      lfo.start();

      nodes.push(osc);
      lfos.push(lfo);
    });

    // Fade in
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(targetVol, now + 2.5);

    playing = true;
  };

  const stop = () => {
    if (!playing || !ctx || !master) return;
    const now = ctx.currentTime;
    try {
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + 1.2);
    } catch {}
    const c = ctx;
    const n = nodes;
    const l = lfos;
    window.setTimeout(() => {
      try { n.forEach((o) => o.stop()); } catch {}
      try { l.forEach((o) => o.stop()); } catch {}
      try { c.close(); } catch {}
    }, 1400);
    nodes = [];
    lfos = [];
    ctx = null;
    master = null;
    playing = false;
  };

  const setVolume = (v: number) => {
    targetVol = Math.max(0, Math.min(0.4, v));
    if (ctx && master) {
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.linearRampToValueAtTime(targetVol, now + 0.4);
    }
  };

  return { start, stop, setVolume, isPlaying: () => playing };
}
