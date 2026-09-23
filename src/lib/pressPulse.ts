// Visual fallback for haptic(): a short scale pulse for a coarse pointer with no
// vibration. Skipped under reduced motion. Rules: rules/craft-and-delight.md.
export function pressPulse(el: Element | null): void {
  if (!el || typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  el.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.35)" },
      { transform: "scale(1)" },
    ],
    { duration: 140, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }
  );
}
