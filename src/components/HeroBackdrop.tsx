import React from 'react';
import { motion, useReducedMotion, type MotionValue } from 'motion/react';
/* The ambient presets live next door now — the dark room hangs furniture too. */
import { AmbientMotif as Motif } from './AmbientMotif';
import { useDrift } from './Reveal';
import { StringLights } from './CarnivalOrnaments';
import { SparkleEffect } from './SparkleEffect';
import {
  BigTop,
  FerrisWheel,
  Carousel,
  CarouselHorse,
  Balloons,
  CottonCandy,
  Popcorn,
  TicketStub,
  BuntingSwag,
  Sparkle,
  Starburst,
  Rosette
} from './CarnivalMotifs';

/**
 * THE ROOM BEHIND THE NAME.
 *
 * The hero used to be a flat sheet of putty with one run of lamps on it, and
 * above the type it read as nothing at all. This is the fair filling that
 * space — everything here is furniture, none of it is content, and it is all
 * drawn rather than photographed so it stays inside the flat system:
 *
 *   · a warm wash falling from the top, which is the lamps' own light
 *   · the big top's rays fanning down behind it
 *   · the attractions, printed faint at the edges as a bill's background is
 *   · two runs of lamps at different depths, warm and hung low
 *   · bunting strung along the foot, and glints round the whole edge
 *
 * Two rules hold the composition together. Nothing sits in the centre column,
 * where the name and the type run — the fair is arranged round the bill,
 * never over it. And every layer takes a different share of the hero's
 * scroll, so the back of the room sinks slowly and the front of it leaves
 * quickly; that difference, and not a shadow, is where the depth comes from.
 */

export const HeroBackdrop: React.FC<{ progress: MotionValue<number> }> = ({ progress }) => {
  const still = useReducedMotion();

  // Furthest back moves least. The numbers are px of travel across the whole
  // pass of the section, and they are all small: this is a drift, not a slide.
  const washY = useDrift(progress, 0, 46);
  const raysY = useDrift(progress, 0, 92);
  const raysOpacity = useDrift(progress, 1, 0.25);
  const motifsBackY = useDrift(progress, 0, 96);
  const motifsFrontY = useDrift(progress, 0, 148);
  const lightsBackY = useDrift(progress, 0, 40);
  const lightsFrontY = useDrift(progress, 0, 74);
  const glintY = useDrift(progress, 0, 110);

  /* The lamps breathe as a run rather than bulb by bulb — the glass already
     twinkles individually inside the drawing, and this is the current behind
     it rising and falling. Two runs, out of phase. */
  const pulse = (from: number, to: number, duration: number, delay: number) =>
    still
      ? {}
      : {
          animate: { opacity: [from, to, from] },
          transition: { duration, ease: 'easeInOut' as const, repeat: Infinity, delay }
        };

  const backPulse = pulse(0.58, 0.8, 9, 0);
  const frontPulse = pulse(0.85, 1, 7.5, 1.6);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* The light off the lamps, pooling at the top of the room. */}
      <motion.div className="hero-wash absolute inset-0" style={{ y: washY }} />

      {/* The big top, implied: rays fanning from a point above the name. */}
      <motion.div
        className="hero-rays absolute inset-x-0 top-0 h-[78%]"
        style={{ y: raysY, opacity: raysOpacity }}
      />

      {/* ------------------------------------------------------------------
          THE BACK ROW — the big attractions, at the edges, sinking slowly.
          ------------------------------------------------------------------ */}
      <motion.div className="absolute inset-0" style={{ y: motifsBackY }}>
        {/* The tent and the wheel are the two biggest drawings in the room,
            and on a phone they land squarely on the name — 160px and 176px of
            line art across a 375px screen, at the exact height the wordmark
            sits. They start at `sm`, where there is width to hold them. */}
        <Motif className="hero-motif left-[-3%] top-[17%] hidden sm:block">
          <BigTop className="h-56 w-56 sm:h-64 sm:w-64" weight={1} />
        </Motif>

        <Motif className="hero-motif right-[-4%] top-[9%] hidden sm:block">
          <FerrisWheel className="h-60 w-60 sm:h-72 sm:w-72" weight={1} spinning />
        </Motif>

        <Motif className="hero-motif left-[5%] bottom-[7%] hidden sm:block" kind="drift" delay={3}>
          <Carousel className="h-40 w-40" weight={1} />
        </Motif>

        <Motif className="hero-motif right-[4%] bottom-[7%]" kind="float" delay={0.8}>
          <Balloons className="h-24 w-24 sm:h-44 sm:w-44" weight={1} />
        </Motif>
      </motion.div>

      {/* ------------------------------------------------------------------
          THE FRONT ROW — the small things, nearer, leaving faster.
          ------------------------------------------------------------------ */}
      <motion.div className="absolute inset-0" style={{ y: motifsFrontY }}>
        {/* Bunting strung across the two bottom corners, where the room was
            emptiest. Each swag turns about its own pegs. */}
        <Motif className="hero-motif left-[-4%] bottom-[6%] w-[30%] sm:bottom-[14%] sm:w-[30%]" kind="sway">
          <BuntingSwag className="w-full" weight={1} flags={7} />
        </Motif>

        <Motif
          className="hero-motif right-[-4%] bottom-[17%] hidden w-[28%] sm:block"
          kind="sway"
          delay={2.4}
          duration={13}
        >
          <BuntingSwag className="w-full" weight={1} flags={6} />
        </Motif>

        {/* The horse off the outside row of the ride. */}
        <Motif
          className="hero-motif left-[23%] bottom-[4%] hidden lg:block"
          kind="bob"
          delay={1.2}
          duration={11}
        >
          <CarouselHorse className="h-28 w-28" weight={1} />
        </Motif>

        <Motif className="hero-motif left-[9%] top-[13%] hidden lg:block" kind="drift" delay={5} duration={19}>
          <TicketStub className="h-20 w-20" weight={1.1} />
        </Motif>

        <Motif
          className="hero-motif right-[21%] bottom-[6%] hidden lg:block"
          kind="bob"
          delay={4}
          duration={13}
        >
          <CottonCandy className="h-24 w-24" weight={1.1} />
        </Motif>

        <Motif
          className="hero-motif left-[13%] bottom-[28%] hidden xl:block"
          kind="bob"
          delay={6}
          duration={15}
        >
          <Popcorn className="h-20 w-20" weight={1.1} />
        </Motif>

        <Motif className="hero-motif left-[20%] top-[8%] hidden lg:block" kind="drift" delay={2} duration={21}>
          <Rosette className="h-20 w-20" weight={1} />
        </Motif>

        <Motif
          className="hero-motif right-[30%] bottom-[30%] hidden lg:block"
          kind="twinkle"
          delay={1.5}
          duration={8}
        >
          <Starburst className="h-16 w-16" weight={1.2} />
        </Motif>

        {/* The glints. Small, scattered wide, and every one on its own beat,
            so the edge of the room never blinks in unison. */}
        <Motif className="hero-motif left-[6%] top-[22%] sm:left-[15%] sm:top-[31%]" kind="twinkle" duration={6.5}>
          <Sparkle className="h-7 w-7" weight={1.2} />
        </Motif>

        <Motif
          className="hero-motif right-[13%] top-[26%] hidden sm:block"
          kind="twinkle"
          delay={2.2}
          duration={7.5}
        >
          <Sparkle className="h-9 w-9" weight={1.2} />
        </Motif>

        <Motif
          className="hero-motif left-[31%] bottom-[19%] hidden xl:block"
          kind="twinkle"
          delay={4.1}
          duration={9}
        >
          <Sparkle className="h-6 w-6" weight={1.2} />
        </Motif>

        <Motif
          className="hero-motif right-[33%] top-[15%] hidden xl:block"
          kind="twinkle"
          delay={5.6}
          duration={7}
        >
          <Sparkle className="h-5 w-5" weight={1.2} />
        </Motif>

        <Motif
          className="hero-motif right-[9%] bottom-[32%] hidden sm:block"
          kind="twinkle"
          delay={3.3}
          duration={8.5}
        >
          <Sparkle className="h-6 w-6" weight={1.2} />
        </Motif>
      </motion.div>

      {/* ------------------------------------------------------------------
          THE LAMPS. Two runs, half a span out of register, the front one hung
          lower and burning brighter — one row reads as a decoration, two read
          as a fairground. Each run breathes on its own slow cycle.
          ------------------------------------------------------------------ */}
      <motion.div
        className="absolute inset-x-0 top-12 sm:top-14"
        style={{ y: lightsBackY, opacity: still ? 0.7 : undefined }}
        animate={backPulse.animate}
        transition={backPulse.transition}
      >
        <StringLights
          className="h-16 sm:h-20"
          swags={4}
          tone="warm"
          drop={30}
          lamp={3}
          phase={160}
        />
      </motion.div>

      <motion.div
        className="absolute inset-x-0 top-[5.5rem] sm:top-24"
        style={{ y: lightsFrontY }}
        animate={frontPulse.animate}
        transition={frontPulse.transition}
      >
        <StringLights className="h-20 sm:h-24" swags={3} tone="warm" drop={44} lamp={4.6} />
      </motion.div>

      {/* Points of light, only in the upper half — the part that was empty. */}
      <motion.div className="absolute inset-x-0 top-0 h-[62%]" style={{ y: glintY }}>
        <SparkleEffect density={14} theme="gold" />
      </motion.div>
    </div>
  );
};
