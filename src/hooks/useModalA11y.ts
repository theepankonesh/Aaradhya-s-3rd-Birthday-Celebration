import { useEffect, useRef } from 'react';
import { lockScroll, unlockScroll } from '../lib/smoothScroll';

/** Everything the browser considers tabbable inside a dialog. */
const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

/**
 * The four things every overlay on this page owes a keyboard or screen-reader
 * guest, applied from one place so the three modals and the mobile drawer can
 * never drift apart:
 *
 *   1. Escape closes it.
 *   2. Tab stays inside it — no wandering into the invitation behind.
 *   3. The page underneath stops scrolling.
 *   4. Focus goes back to whatever opened it on the way out.
 *
 * Returns the ref to attach to the dialog's outermost element.
 */
export function useModalA11y<T extends HTMLElement>(
  isOpen: boolean,
  onClose: () => void,
  options: { autoFocus?: boolean } = {}
) {
  const containerRef = useRef<T>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const { autoFocus = true } = options;

  useEffect(() => {
    if (!isOpen) return;

    restoreFocusRef.current = document.activeElement as HTMLElement | null;

    // Lock the page without the layout jump that removing the scrollbar causes.
    // The virtual scroller has to be told separately: it moves the window
    // itself and never sees `overflow: hidden`.
    lockScroll();
    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    // Move focus in, so the first Tab lands inside rather than in the page behind.
    if (autoFocus) {
      const first = containerRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? containerRef.current)?.focus({ preventScroll: true });
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key !== 'Tab' || !containerRef.current) return;

      const focusable = (
        Array.from(containerRef.current.querySelectorAll(FOCUSABLE)) as HTMLElement[]
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);

      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey && (active === first || !containerRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      unlockScroll();
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
      restoreFocusRef.current?.focus({ preventScroll: true });
    };
  }, [isOpen, onClose, autoFocus]);

  return containerRef;
}
