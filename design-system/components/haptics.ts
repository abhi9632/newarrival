// Haptic feedback for touch devices. Rules and the haptic map: rules/craft-and-delight.md.
//
// Android (Chrome, Samsung Internet): navigator.vibrate, after the first user tap.
// iOS Safari: no Vibration API, and script-triggered switch tricks stopped working in
// iOS 26.5. The only native iOS haptic is a real tap on <input type="checkbox" switch>,
// so build binary toggles on that element and use the return value below to show a
// visual press pulse everywhere else.
// Desktop: no-op.

const PATTERNS = {
  tick: 4, // detent, scrubber step, a scroll mark crossed
  tap: 10, // toggle, drag start, drop
  success: [10, 40, 16],
  warn: [24, 60, 24],
} satisfies Record<string, number | number[]>;

export type Haptic = keyof typeof PATTERNS;

/** Returns true if the device vibrated; false means show the visual fallback instead. */
export function haptic(kind: Haptic = "tap"): boolean {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return false;
  if (!matchMedia("(pointer: coarse)").matches) return false;
  try {
    return navigator.vibrate(PATTERNS[kind]);
  } catch {
    return false;
  }
}
