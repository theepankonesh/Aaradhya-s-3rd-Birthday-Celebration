import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { EASE } from './Reveal';

/**
 * THE NAME.
 *
 * A fairground bill is painted, not printed, and the one thing a painted sign
 * does that a printed one cannot is catch the light. So the name does three
 * things and no more:
 *
 *   1. it assembles, letter by letter from the left, each glyph fading up
 *      into place on the page's own curve — the sign being lettered;
 *   2. it is gilded, once every nine seconds, by a narrow band of lamp gold
 *      crossing it on the diagonal, with a long pause between passes — the
 *      light catching the gold leaf;
 *   3. it breathes, by seven pixels over eleven seconds, which is under the
 *      threshold of anything a guest would call movement.
 *
 * The gilding is a second copy of the name in gold, laid exactly over the
 * first and revealed only through a moving mask. Both copies carry identical
 * per-letter markup, so their metrics cannot drift apart by a hairline, and
 * the gold layer stays at zero opacity until the lettering has finished.
 *
 * Under `prefers-reduced-motion` none of it is built: the name renders as one
 * static line of text, which is also the cleanest thing a screen reader can
 * be handed.
 */

interface WordmarkProps {
  name: string;
  className?: string;
}

/** Per-letter, left to right. Slow enough to read as lettering, not as a wipe. */
const LETTER_BEAT = 0.075;

const line = {
  hidden: {},
  show: { transition: { staggerChildren: LETTER_BEAT, delayChildren: 0.18 } }
};

const glyph = {
  // In `em`, so the rise is proportional to the name at every viewport width.
  hidden: { opacity: 0, y: '0.24em' },
  show: { opacity: 1, y: '0em', transition: { duration: 1.05, ease: EASE } }
};

export const Wordmark: React.FC<WordmarkProps> = ({ name, className = '' }) => {
  const still = useReducedMotion();
  const letters = useMemo(() => Array.from(name), [name]);

  if (still) {
    return <h1 className={`wordmark ${className}`}>{name}</h1>;
  }

  /* A space cannot be an inline-block on its own — it collapses — so it is set
     as a non-breaking one and the box survives. */
  const glyphs = (key: string) =>
    letters.map((char, i) => (
      <span className="wordmark-letter" key={`${key}-${i}`}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));

  return (
    // The breathing sits on its own element: the letters own their entrance
    // transform and the gold layer owns its mask, and none of the three may
    // share a property with another.
    <motion.div
      className="w-full"
      animate={{ y: [0, -7, 0], scale: [1, 1.005, 1] }}
      transition={{
        duration: 11,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 1.9
      }}
    >
      <h1 className={`wordmark ${className}`} aria-label={name}>
        <motion.span
          className="block"
          variants={line}
          initial="hidden"
          animate="show"
          aria-hidden="true"
        >
          {letters.map((char, i) => (
            <motion.span className="wordmark-letter" key={`cut-${i}`} variants={glyph}>
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.span>

        {/* The gilding. Identical markup, no motion of its own — the band
            moving across it is the whole of the effect. */}
        <span className="wordmark-shine" aria-hidden="true">
          {glyphs('gilt')}
        </span>
      </h1>
    </motion.div>
  );
};
