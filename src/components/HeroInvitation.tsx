import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll } from 'motion/react';
import { EventData } from '../types';
import { ChevronDown } from 'lucide-react';
import { HeroBackdrop } from './HeroBackdrop';
import { Starburst } from './CarnivalMotifs';
import { Wordmark } from './Wordmark';
import { withOrdinals } from './Ordinal';
import { EASE, useDrift } from './Reveal';

interface HeroInvitationProps {
  eventData: EventData;
  onOpenRSVP: () => void;
  onScrollToDetails: () => void;
}

/** One entrance sequence for the whole room — the page's single orchestrated moment. */
const rise = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.95, delay: 0.55 + 0.14 * i, ease: EASE }
  })
};

/**
 * THE HERO.
 *
 * One putty room, read straight down the middle: the name first and at the
 * size of a fairground bill, then what the bill is for, then who is putting
 * it on, then the two things to do about it. Nothing is boxed, nothing is
 * carded, and the only chrome is the bar overhead.
 *
 * The name is the one thing on the page with a life of its own — see
 * `Wordmark`. Everything beneath it arrives once and then holds still.
 *
 * The facts — the date, the doors, the grounds — are not here. They are
 * printed once, on the tickets in the room below, because a guest who has to
 * read the same three lines twice stops reading them.
 *
 * On scroll the whole block drifts up a little and dims, and the furniture
 * behind it drifts at its own several speeds, so the room has depth without
 * a single shadow being drawn.
 */
export const HeroInvitation: React.FC<HeroInvitationProps> = ({
  eventData,
  onOpenRSVP,
  onScrollToDetails
}) => {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  });

  // The name is the furthest forward thing on the page, so it travels least
  // and holds its colour longest; the cluster beneath it leaves first.
  const nameY = useDrift(scrollYProgress, 0, -26);
  const nameScale = useDrift(scrollYProgress, 1, 1.045);
  const nameOpacity = useDrift(scrollYProgress, 1, 0, [0, 0.82]);
  const clusterY = useDrift(scrollYProgress, 0, -72);
  const clusterOpacity = useDrift(scrollYProgress, 1, 0, [0, 0.55]);
  const cueOpacity = useDrift(scrollYProgress, 1, 0, [0, 0.22]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="tier-putty relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden pt-28 pb-12 sm:pt-32"
    >
      <HeroBackdrop progress={scrollYProgress} />

      {/* ------------------------------------------------------------------
          One centred block, top to bottom: name → tagline → host → actions.
          ------------------------------------------------------------------ */}
      <div className="measure relative z-10 flex w-full flex-col items-center text-center">
        {/* 1. THE NAME — lettered in, gilded, and breathing. The scroll drift
            stays out here on its own element: a scroll-bound transform and a
            keyframed one cannot share a property without fighting over it. */}
        <motion.div
          className="w-full"
          style={{ y: nameY, scale: nameScale, opacity: nameOpacity }}
        >
          <Wordmark name={eventData.childName} className="w-full text-center" />
        </motion.div>

        <motion.div
          className="flex w-full flex-col items-center"
          style={{ y: clusterY, opacity: clusterOpacity }}
        >
          {/* 2. WHAT THE BILL IS FOR, with a printer's mark either side. */}
          <motion.div
            custom={0}
            variants={rise}
            initial={shouldReduceMotion ? false : 'hidden'}
            animate="show"
            className="mt-1 flex items-center justify-center gap-4 sm:gap-5"
          >
            <Starburst className="h-3.5 w-3.5 shrink-0 text-gold" weight={1.6} />
            <p className="hero-tagline text-cherry-deep">
              {withOrdinals(`${eventData.tagline} · The Carnival`)}
            </p>
            <Starburst className="h-3.5 w-3.5 shrink-0 text-gold" weight={1.6} />
          </motion.div>

          {/* 3. WHO IS PUTTING IT ON. */}
          {/* Set in capitals, the way the dark room already sets it — the
              hosts read as a credit line on a bill, not as a sentence. At
              16px the caps need the tracking to stay legible.

              The weight is split rather than applied to the whole line: the
              preposition stays a quiet graphite lead-in and the two names take
              bold cherry, so the eye lands on the hosts and not on the word
              "hosted". Bolding the line entire would have put a second solid
              bar of text directly under the wordmark and started an argument
              with it — this way the credit gains presence and still reads
              second. */}
          <motion.p
            custom={1}
            variants={rise}
            initial={shouldReduceMotion ? false : 'hidden'}
            animate="show"
            className="copy mt-6 max-w-[42ch] text-graphite uppercase tracking-[0.12em]"
          >
            Hosted by{' '}
            <strong className="font-bold text-cherry-deep">{eventData.parents}</strong>
          </motion.p>

          {/* 4. THE TWO THINGS TO DO ABOUT IT. */}
          <motion.div
            custom={2}
            variants={rise}
            initial={shouldReduceMotion ? false : 'hidden'}
            animate="show"
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <button id="hero-rsvp-button" onClick={onOpenRSVP} className="btn btn-cherry">
              Claim your ticket
            </button>
            <button onClick={onScrollToDetails} className="btn btn-outline-ink">
              See the details
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* The scroll cue, in the ghost-link voice rather than as a button
          pretending to be chrome. It is the first thing to go on scroll. */}
      <motion.button
        onClick={onScrollToDetails}
        className="relative z-10 mx-auto mt-14 flex min-h-[44px] cursor-pointer flex-col items-center gap-1.5 px-4 text-graphite transition-colors hover:text-cherry"
        style={{ opacity: cueOpacity }}
        aria-label="Scroll to event details"
      >
        <motion.span
          className="label"
          animate={shouldReduceMotion ? undefined : { y: [0, 4, 0] }}
          transition={
            shouldReduceMotion ? undefined : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          This way to the fair
        </motion.span>
        <motion.span
          animate={shouldReduceMotion ? undefined : { y: [0, 5, 0] }}
          transition={
            shouldReduceMotion
              ? undefined
              : { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.12 }
          }
        >
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </motion.span>
      </motion.button>
    </section>
  );
};
