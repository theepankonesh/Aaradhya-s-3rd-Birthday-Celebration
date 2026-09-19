import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useModalA11y } from '../hooks/useModalA11y';
import { Monogram } from './CarnivalMotifs';
import { Ordinal } from './Ordinal';
import { scrollToTarget } from '../lib/smoothScroll';

interface FloatingNavigationProps {
  onOpenRSVP: () => void;
  onOpenEdit?: () => void;
}

const NAV_LINKS = [
  { label: 'Details', id: 'details' },
  { label: 'Programme', id: 'timeline' },
  { label: 'Sideshow', id: 'gallery' },
  { label: 'RSVP', id: 'rsvp' }
] as const;

/**
 * TOP CHROME.
 *
 * Structured's header is the quietest thing on its page: a monoline monogram
 * at one end, ghost text at the other, on a row that simply matches the page
 * ground — no pill, no blur, no floating capsule, no visible menu bar.
 *
 * This is that row. It is transparent over the hero and takes the putty with
 * a single hairline once the page has moved, so it never floats above the
 * design as a separate object. The links are ghost text; only the ticket
 * action is a filled pill, because it is the one thing being asked for.
 */
export const FloatingNavigation: React.FC<FloatingNavigationProps> = ({ onOpenRSVP, onOpenEdit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const closeDrawer = useCallback(() => setIsOpen(false), []);
  // Escape closes the drawer and Tab stays inside it, same as the modals.
  const drawerRef = useModalA11y<HTMLDivElement>(isOpen, closeDrawer, { autoFocus: false });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Which section is in view. An observer does this off the main thread; the
     old version measured every section on every scroll event. */
  useEffect(() => {
    const ids = ['hero', ...NAV_LINKS.map(({ id }) => id)];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: '-30% 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // A drawer left open behind a desktop breakpoint is a keyboard trap with
  // nothing visible in it.
  useEffect(() => {
    if (!isOpen) return;
    // Must match the breakpoint the drawer is hidden at, or it can be
    // left open and unreachable behind a desktop layout.
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setIsOpen(false);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [isOpen]);

  const scrollTo = (id: string) => {
    setIsOpen(false);
    // Through the page's own scroller, so a nav jump glides on the same curve
    // as a wheel does and clears the fixed bar on the way in.
    scrollToTarget(`#${id}`, id === 'hero' ? 0 : -72);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
          scrolled ? 'border-b border-vellum bg-putty' : 'border-b border-transparent'
        }`}
      >
        <nav
          aria-label="Main"
          className="mx-auto flex h-16 w-full max-w-[1180px] items-center justify-between gap-4 px-5 md:px-10"
        >
          {/* The mark, and the name beside it. */}
          <button
            type="button"
            onClick={() => scrollTo('hero')}
            className="group -ml-1 flex min-h-[44px] cursor-pointer items-center gap-3 px-1 text-left text-ink"
            aria-label="Back to the top of the invitation"
          >
            <Monogram className="h-8 w-8 shrink-0 text-cherry" weight={1.25} />
            {/* Monogram, name and ordinal are one cherry lockup: the name in
                the hero's own wood type, the ordinal left in the label voice
                so the raised "rd" stays legible at 12px. */}
            <span className="flex items-baseline gap-1.5 whitespace-nowrap text-cherry">
              <span className="logotype">Aaradhya</span>
              <Ordinal value={3} className="label" />
            </span>
          </button>

          {/* Ghost text, centred-right. No boxes, no chips, no menu bar. */}
          <ul className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <button
                  type="button"
                  onClick={() => scrollTo(link.id)}
                  aria-current={activeSection === link.id ? 'true' : undefined}
                  className="link-ghost text-ink"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            {onOpenEdit && (
              <button
                type="button"
                onClick={onOpenEdit}
                className="link-ghost hidden min-h-[44px] cursor-pointer items-center gap-1.5 px-1 text-graphite sm:inline-flex"
              >
                <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Edit</span>
              </button>
            )}

            <button id="nav-rsvp-btn" type="button" onClick={onOpenRSVP} className="btn btn-cherry">
              Tickets
            </button>

            <button
              id="mobile-nav-toggle"
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="-mr-2 flex h-11 w-11 cursor-pointer items-center justify-center text-ink lg:hidden"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-nav-menu"
            >
              {isOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* The drawer. A sheet in the light tier, cut square against the bar. */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Tapping away closes it — the standard escape hatch on a phone. */}
            <div className="fixed inset-0 z-30 lg:hidden" aria-hidden="true" onClick={closeDrawer} />
            <motion.div
              ref={drawerRef}
              id="mobile-nav-menu"
              className="fixed inset-x-0 top-16 z-40 border-b border-vellum bg-putty px-5 py-8 lg:hidden"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <ul className="flex flex-col">
                {NAV_LINKS.map((link) => (
                  <li key={link.id} className="border-b border-vellum last:border-b-0">
                    <button
                      type="button"
                      onClick={() => scrollTo(link.id)}
                      aria-current={activeSection === link.id ? 'true' : undefined}
                      className="label flex min-h-[52px] w-full cursor-pointer items-center text-ink"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>

              {onOpenEdit && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenEdit();
                  }}
                  className="label mt-6 flex min-h-[44px] cursor-pointer items-center gap-2 text-graphite"
                >
                  <Edit3 className="h-4 w-4" aria-hidden="true" />
                  Edit the billing
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenRSVP();
                }}
                className="btn btn-cherry mt-8 w-full"
              >
                Claim your ticket
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
