import Lenis from 'lenis';

/**
 * THE PAGE'S SCROLL.
 *
 * One Lenis instance, owned here rather than by a component, so that the
 * navigation, the hero's two buttons and the modals can all reach it without
 * threading a ref through the tree. Everything about it is tuned long and
 * soft: a 1.3s glide on a cubic tail, so a flick of the wheel coasts to rest
 * the way a carousel does rather than snapping.
 *
 * Lenis honours `prefers-reduced-motion` itself (`respectReducedMotion`), in
 * which case the lerp is forced to 1 and the page tracks the wheel one to one
 * — no smoothing, no inertia, and programmatic scrolls land instantly.
 */

let lenis: Lenis | null = null;
let frame = 0;
/** Every open overlay holds one lock; scroll resumes when the last is gone. */
let locks = 0;

/** A long, decelerating tail — expo out, softened a little at the top. */
const glide = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -9 * t));

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Starts the scroll and returns its teardown. Safe to call twice. */
export function initSmoothScroll(): () => void {
  if (typeof window === 'undefined' || lenis) return () => {};

  lenis = new Lenis({
    duration: 1.3,
    easing: glide,
    smoothWheel: true,
    // Touch keeps the platform's own momentum; hijacking it on a phone costs
    // more in responsiveness than it buys in polish.
    syncTouch: false,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.1,
    gestureOrientation: 'vertical',
    autoRaf: false,
    respectReducedMotion: true
  });

  const tick = (time: number) => {
    lenis?.raf(time);
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frame);
    lenis?.destroy();
    lenis = null;
    locks = 0;
  };
}

/**
 * Holds the page still while an overlay is open. The modals already set
 * `overflow: hidden` on the body, which a virtual scroller does not see — so
 * it has to be told, or the page drifts underneath the dialog.
 */
export function lockScroll() {
  locks += 1;
  if (locks === 1) lenis?.stop();
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) lenis?.start();
}

/**
 * Sends the page to a section. `offset` clears the fixed bar overhead so a
 * section's stub is never parked underneath it.
 */
export function scrollToTarget(target: string | HTMLElement, offset = -72) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!(el instanceof HTMLElement)) return;

  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 1.5, easing: glide });
    return;
  }
  el.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'start' });
}
