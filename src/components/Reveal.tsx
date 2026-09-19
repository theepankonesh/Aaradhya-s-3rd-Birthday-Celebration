import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';

/**
 * SCROLL MOTION — the whole page's vocabulary, in one file.
 *
 * The rule for this architecture is that motion behaves like the type: slow,
 * unhurried, and always in the same voice. So there is exactly one easing
 * curve, one distance, and one duration band on the page, and everything that
 * moves borrows them from here.
 *
 *   · reveals   — fade and rise as a thing enters the room, once, never again
 *   · stagger   — grouped items cascade in on a 90ms beat
 *   · parallax  — background furniture drifts slower than the content on it
 *
 * Every one of them collapses to "already there, holding still" under
 * `prefers-reduced-motion`, which is checked per hook rather than per
 * stylesheet because Motion animates in JS where the media query cannot reach.
 */

/** The page's one curve — a long expo-out. Nothing bounces, nothing overshoots. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/** How far a revealing element travels. Small: this is a settle, not an entrance. */
const RISE = 26;

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Seconds of delay before this one starts. */
  delay?: number;
  duration?: number;
  /** Travel distance in px. 0 for a pure fade. */
  y?: number;
  /** A touch of scale, for the things that should feel like they come forward. */
  scale?: number;
  /** How much of the element must be in view before it goes. */
  amount?: number;
  as?: 'div' | 'section' | 'li' | 'article' | 'figure' | 'header' | 'p' | 'span';
};

/** One element, fading and rising into place as it enters the viewport. */
export const Reveal: React.FC<RevealProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.9,
  y = RISE,
  scale,
  amount = 0.12,
  as = 'div'
}) => {
  const still = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;

  if (still) return <Tag className={className}>{children}</Tag>;

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, ...(scale ? { scale } : null) }}
      whileInView={{ opacity: 1, y: 0, ...(scale ? { scale: 1 } : null) }}
      viewport={{ once: true, amount, margin: '0px 0px -8% 0px' }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
};

/* ---------------------------------------------------------------------------
   STAGGER — a group whose children cascade rather than arriving together.
   The parent owns the trigger; each child inherits the beat.
   ------------------------------------------------------------------------ */

export const groupVariants = (beat = 0.09, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: beat, delayChildren: delay } }
});

export const itemVariants = (y = RISE, duration = 0.85) => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: { duration, ease: EASE } }
});

type GroupOwnProps = {
  children: React.ReactNode;
  className?: string;
  /** Seconds between one child and the next. */
  beat?: number;
  delay?: number;
  amount?: number;
  as?: 'div' | 'ul' | 'ol' | 'dl' | 'header' | 'section';
};

/* Plain DOM props (role, aria-*, onScroll…) pass straight through, so a group
   can also be the thing a component measures or labels. */
type GroupProps = GroupOwnProps &
  Omit<React.HTMLAttributes<HTMLElement>, keyof GroupOwnProps>;

/** Wrap a row of cards in this and give each card `<RevealItem>`. */
export const RevealGroup = React.forwardRef<HTMLElement, GroupProps>(
  (
    { children, className = '', beat = 0.09, delay = 0, amount = 0.1, as = 'div', ...rest },
    ref
  ) => {
    const still = useReducedMotion();
    const Tag = motion[as] as typeof motion.div;
    const tagRef = ref as React.Ref<HTMLDivElement>;

    if (still) {
      return (
        <Tag ref={tagRef} className={className} {...rest}>
          {children}
        </Tag>
      );
    }

    return (
      <Tag
        ref={tagRef}
        className={className}
        variants={groupVariants(beat, delay)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount, margin: '0px 0px -8% 0px' }}
        {...rest}
      >
        {children}
      </Tag>
    );
  }
);
RevealGroup.displayName = 'RevealGroup';

type ItemProps = {
  children: React.ReactNode;
  className?: string;
  y?: number;
  duration?: number;
  style?: React.CSSProperties;
  as?: 'div' | 'li' | 'article' | 'figure';
  /* A CSS `:hover` transform cannot win on one of these: Motion writes an
     inline transform when the reveal lands, and inline beats a stylesheet
     rule. So the hover state has to come through Motion as well — which also
     means it disappears for free when less motion is asked for. */
  whileHover?: Record<string, unknown>;
  hoverTransition?: Record<string, unknown>;
};

/** A child of `RevealGroup`. Carries no trigger of its own — the group has it. */
export const RevealItem: React.FC<ItemProps> = ({
  children,
  className = '',
  y = RISE,
  duration = 0.85,
  style,
  as = 'div',
  whileHover,
  hoverTransition
}) => {
  const still = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;

  if (still) return <Tag className={className} style={style}>{children}</Tag>;

  return (
    <Tag
      className={className}
      style={style}
      variants={itemVariants(y, duration)}
      whileHover={whileHover}
      transition={whileHover ? { duration: 0.45, ease: EASE, ...hoverTransition } : undefined}
    >
      {children}
    </Tag>
  );
};

/* ---------------------------------------------------------------------------
   PARALLAX — depth by differential speed. Backgrounds only: nothing a guest
   has to read is ever allowed to move at a speed the page is not moving at.
   ------------------------------------------------------------------------ */

/**
 * Progress through a section, 0 as its top meets the bottom of the viewport,
 * 1 as its bottom leaves the top. Feed it to `useDrift`.
 */
export function useSectionProgress(ref: React.RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });
  return scrollYProgress;
}

/**
 * Maps a progress value onto a range. When the guest has asked for less
 * motion the range collapses to its starting value and holds there — which
 * for a `y` means no travel, and for an opacity or a scale means the element
 * simply stays as it was rather than fading to nothing. Always call it
 * unconditionally: it is a hook.
 */
export function useDrift(
  progress: MotionValue<number>,
  from: number,
  to: number,
  input: [number, number] = [0, 1]
) {
  const still = useReducedMotion();
  return useTransform(progress, input, still ? [from, from] : [from, to]);
}

/** Convenience for a background layer that owns its own section reference. */
export function useParallaxLayer(distance = 80) {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useSectionProgress(ref);
  const y = useDrift(progress, -distance / 2, distance / 2);
  return { ref, y, progress };
}
