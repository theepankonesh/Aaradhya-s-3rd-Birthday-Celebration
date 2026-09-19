import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

/**
 * AMBIENT MOTION — the fair's furniture, and the small slow movements it is
 * allowed to make.
 *
 * Each attraction moves the way that attraction moves, and no faster. Every
 * preset is a transform or an opacity, so a whole field of them is composited
 * rather than painted, and all of it is off when a guest has asked for less
 * motion.
 *
 * Lives here rather than in the hero because two rooms now hang furniture —
 * the putty room behind the name, and the dark room where the tickets are.
 */

export type Ambience = 'still' | 'spin' | 'float' | 'sway' | 'twinkle' | 'bob' | 'drift';

type Preset = {
  animate?: Record<string, unknown>;
  transition?: Record<string, unknown>;
  style?: React.CSSProperties;
};

/**
 * `peak` is the opacity the room prints its motifs at. A twinkle has to be
 * given it explicitly: animating opacity overrides whatever the stylesheet
 * set, so the glint would otherwise jump to another room's brightness.
 */
export const ambience = (kind: Ambience, duration?: number, peak = 0.155): Preset => {
  switch (kind) {
    // Kept for anything that should turn as a whole. The ferris wheel does
    // not use it: its rotation lives on the drawing, because the A-frame has
    // to stand still while the rim goes round.
    case 'spin':
      return {
        animate: { rotate: 360 },
        transition: { duration: duration ?? 120, ease: 'linear', repeat: Infinity }
      };
    // Balloons: up, and a lean on the way.
    case 'float':
      return {
        animate: { y: [0, -13, 0], rotate: [-1.6, 1.6, -1.6] },
        transition: { duration: duration ?? 13, ease: 'easeInOut', repeat: Infinity }
      };
    // Bunting hangs from its pegs, so it turns about its own top edge.
    case 'sway':
      return {
        style: { transformOrigin: '50% 0%' },
        animate: { rotate: [-1.9, 1.9, -1.9] },
        transition: { duration: duration ?? 11, ease: 'easeInOut', repeat: Infinity }
      };
    // A glint does not travel, it comes and goes.
    case 'twinkle':
      return {
        animate: { opacity: [peak * 0.28, peak, peak * 0.28], scale: [0.82, 1.1, 0.82] },
        transition: { duration: duration ?? 7, ease: 'easeInOut', repeat: Infinity }
      };
    // A carousel horse rises and falls on its pole. That, rather than a spin,
    // is what the eye actually reads as a carousel.
    case 'bob':
      return {
        animate: { y: [0, -10, 0] },
        transition: { duration: duration ?? 10, ease: 'easeInOut', repeat: Infinity }
      };
    case 'drift':
      return {
        animate: { y: [0, -7, 0], x: [0, 5, 0] },
        transition: { duration: duration ?? 17, ease: 'easeInOut', repeat: Infinity }
      };
    default:
      return {};
  }
};

export interface AmbientMotifProps {
  /**
   * The room's motif class AND its positioning utilities — e.g.
   * `"hero-motif left-[-3%] top-[17%]"`. The size goes on the drawing inside.
   *
   * This component deliberately prepends nothing. The room class is what
   * carries `position: absolute`, the colour and the opacity, so a call that
   * omits it does not render a faint misplaced motif — it renders a full
   * strength, statically positioned one in whatever colour it inherits.
   */
  className?: string;
  kind?: Ambience;
  /** Seconds of offset, so no two pieces of furniture breathe together. */
  delay?: number;
  duration?: number;
  /** The opacity this room prints motifs at. Only a twinkle needs it. */
  peak?: number;
  children: React.ReactNode;
}

export const AmbientMotif = ({
  className = '',
  kind = 'still',
  delay = 0,
  duration,
  peak,
  children
}: AmbientMotifProps) => {
  const still = useReducedMotion();
  const { animate, transition, style } = ambience(kind, duration, peak);

  return (
    <motion.div
      className={className}
      style={style}
      animate={still ? undefined : animate}
      transition={still ? undefined : { ...transition, delay }}
    >
      {children}
    </motion.div>
  );
};
