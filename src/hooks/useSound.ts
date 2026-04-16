// useSound.ts — Web Audio API sound effects, no library needed
import { useCallback, useRef } from "react";

function createCtx() {
  try {
    return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  } catch { return null; }
}

function playTone(
  ctx: AudioContext,
  freq: number,
  type: OscillatorType,
  duration: number,
  gainVal = 0.18,
  delay = 0
) {
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
  gain.gain.setValueAtTime(gainVal, ctx.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration);
}

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = createCtx();
    return ctxRef.current;
  }, []);

  const playCorrect = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    // happy ascending chime
    playTone(ctx, 523, "sine", 0.15, 0.15, 0);
    playTone(ctx, 659, "sine", 0.15, 0.15, 0.1);
    playTone(ctx, 784, "sine", 0.2,  0.15, 0.2);
  }, [getCtx]);

  const playWrong = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    playTone(ctx, 300, "sawtooth", 0.12, 0.12, 0);
    playTone(ctx, 250, "sawtooth", 0.12, 0.12, 0.12);
  }, [getCtx]);

  const playComplete = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    // fanfare
    [523, 659, 784, 1047].forEach((f, i) => {
      playTone(ctx, f, "sine", 0.18, 0.18, i * 0.1);
    });
  }, [getCtx]);

  const playSelect = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    playTone(ctx, 440, "sine", 0.06, 0.08, 0);
  }, [getCtx]);

  return { playCorrect, playWrong, playComplete, playSelect };
}
