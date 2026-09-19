import React, { useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { EventData } from '../types';
import { invitationAssets } from '../data/eventData';
import {
  HexRow,
  TopHat,
  CircusDrum,
  CandyCane,
  PrizeBell,
  StrongmanWeight,
  JugglingClubs,
  Streamers
} from './CarnivalMotifs';
import { AmbientMotif as Motif } from './AmbientMotif';
import { Reveal, useSectionProgress, useDrift } from './Reveal';

interface CarouselBandProps {
  eventData: EventData;
}

/** The opacity this room prints its line art at; a twinkle is pitched on it. */
const ROOM_PEAK = 0.14;

/**
 * THE FULL-BLEED BAND.
 *
 * Structured puts one section aside for a single edge-to-edge image with a
 * dark notched card floating on it and no overlay at all. This is that
 * section: the carousel the whole palette came from, running the full width
 * of the page, with the age and the couplet printed on a card in the dark
 * tier so the eye has one hard object to land on.
 *
 * The clip already carries the site's own warm ground, so it is set into the
 * page exactly as it is — no blend mode, no pool, no feathered edges.
 */
export const CarouselBand: React.FC<CarouselBandProps> = ({ eventData }) => {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useSectionProgress(sectionRef);

  /* The ride passes the window slightly slower than the page does. Its own
     eleven-second float is a separate element inside this one: a scroll-bound
     transform and a keyframed one cannot share a property.

     Both ranges are deliberately small now that the ride stands beside the
     card rather than alone. The drift only moves one of the two columns, so
     it is also the distance they fall out of centre with each other; and the
     scale grows the ride into the gap between them from both sides. At 46px
     and 4% they were 89px apart with 16px of the gap eaten. */
  const rideY = useDrift(progress, -20, 20);
  // The furniture passes the window faster than the ride standing on it.
  const furnitureY = useDrift(progress, -56, 56);
  /* There is no scroll-scale on the ride any more. The frame now runs to the
     viewport edge at both ends of the range — full bleed when stacked, and
     out to the right gutter in its column — so ANY scale above 1 pushes it
     past the edge and the section's overflow trims the frame. A few pixels of
     empty ground, but this clip is meant to be shown whole, and "whole"
     cannot depend on scroll position. The vertical drift stays: it is a
     translate, and there is padding above and below to absorb it. */

  return (
    <section
      id="carousel"
      ref={sectionRef}
      aria-label="The carousel"
      className="tier-ride section"
    >
      {/* ------------------------------------------------------------------
          THE ROOM'S FURNITURE — the sideshow set, drawn for this band and
          used in no other room. Everything already hanging in the hero, the
          dark room and the running order was deliberately left out: a section
          decorated in its neighbours' marks reads as wallpaper rather than as
          a room of its own.

          This layer is painted BEFORE the grid, so the card and the ride
          cover whatever falls behind them and the drawings only ever show in
          the gold left over — which is exactly the space to fill.
          ------------------------------------------------------------------ */}
      <motion.div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ y: furnitureY }}
        aria-hidden="true"
      >
        <Motif
          className="motif-putty left-[2%] top-[3%]"
          kind="drift"
          duration={19}
          peak={ROOM_PEAK}
        >
          <TopHat className="h-16 w-16 sm:h-20 sm:w-20" weight={1.1} />
        </Motif>

        <Motif
          className="motif-putty right-[4%] top-[3%] hidden sm:block"
          kind="sway"
          delay={1.8}
          duration={12}
          peak={ROOM_PEAK}
        >
          <PrizeBell className="h-16 w-16 sm:h-20 sm:w-20" weight={1.1} />
        </Motif>

        <Motif
          className="motif-putty right-[3%] bottom-[4%] hidden sm:block"
          kind="bob"
          delay={3.4}
          duration={13}
          peak={ROOM_PEAK}
        >
          <CircusDrum className="h-20 w-20 sm:h-24 sm:w-24" weight={1.1} />
        </Motif>

        <Motif
          className="motif-putty left-[7%] bottom-[3%] hidden lg:block"
          kind="sway"
          delay={5.1}
          duration={14}
          peak={ROOM_PEAK}
        >
          <CandyCane className="h-20 w-20" weight={1.1} />
        </Motif>

        <Motif
          className="motif-putty left-[-3%] top-[45%] w-[26%] sm:w-[16%] lg:left-[-2%] lg:top-[8%]"
          kind="sway"
          delay={2.6}
          duration={15}
          peak={ROOM_PEAK}
        >
          <Streamers className="w-full" weight={1.1} />
        </Motif>

        <Motif
          className="motif-putty left-[31%] top-[2%] hidden xl:block"
          kind="float"
          delay={4.2}
          duration={15}
          peak={ROOM_PEAK}
        >
          <JugglingClubs className="h-16 w-16" weight={1.1} />
        </Motif>

        <Motif
          className="motif-putty right-[26%] bottom-[2%] hidden xl:block"
          kind="bob"
          delay={6.3}
          duration={16}
          peak={ROOM_PEAK}
        >
          <StrongmanWeight className="h-14 w-14" weight={1.1} />
        </Motif>
      </motion.div>

      {/* Two columns from `lg` up — the card standing beside the ride rather
          than under it, so the empty ground to its left is filled and the two
          read as one object. Below that they stack, ride first, which is the
          order a phone wants: the picture, then the caption about it.

          The ride is given every pixel the composition can spare: the card
          column is held to 19rem, the gap to 40px, and the right gutter is
          dropped entirely at `lg` so the frame runs out to the edge. That is
          about 900px of ride at a 1280 screen against 808 before.

          The DOM keeps the ride first; `order` does the swap on wide screens,
          so the card is on the left without the markup having to lead with
          it. */}
      <div className="relative mx-auto grid w-full max-w-[1700px] items-center gap-10 px-5 md:px-10 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:gap-10 lg:pr-0">
        {/* The ride. The stage declares the box, so the column can never
            collapse while the clip's metadata is in flight.

            One aspect at every width, and it is the clip's own: at 16/9 there
            is nothing to crop and nothing to letterbox, so the whole ride is
            on screen from a phone to a desktop. */}
        {/* Stacked, the ride runs the FULL width of the screen: the negative
            margins cancel the grid's own gutters, so a grid item that would
            otherwise stop at the padding edge stretches the whole way out.
            (`w-full` is deliberately absent — it would pin the width back to
            the column and undo exactly this.) That is as large as the clip
            can be drawn without cropping it. From `lg` the margins go and it
            returns to its column beside the card. */}
        <motion.div
          className="-mx-5 md:-mx-10 lg:mx-0 lg:order-2"
          style={{ y: rideY }}
        >
          {/* The float lives on the STAGE, not on the clip. Moving the clip
              inside a box it exactly fills would walk the flag off the top. */}
          <motion.div
            className="ride-stage aspect-[16/9]"
            /* One slow rise and fall, eleven seconds end to end — long enough
               that the eye reads it as floating rather than bobbing. */
            animate={shouldReduceMotion ? undefined : { y: [0, -14, 0] }}
            transition={
              shouldReduceMotion
                ? undefined
                : { duration: 11, repeat: Infinity, ease: 'easeInOut', times: [0, 0.5, 1] }
            }
          >
            <video
              src={invitationAssets.carousel}
              poster={invitationAssets.carouselPoster}
              /* An animated graphic, not a film: no controls, no sound. The
                 ride carries Aaradhya's name and her age in lights, so the
                 label has to say so — that text is content, not decoration. */
              role="img"
              aria-label="A neon cherry-and-gold carousel with painted horses, lit up and turning, its centre spelling out “Aaradhya — turning 3”"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="ride-video"
            />
          </motion.div>
        </motion.div>

        {/* The card. It used to float ON the ride — absolutely placed over
            its lower left — and hid part of it; then it followed underneath,
            which left the ground beside the ride empty. Now it stands in that
            ground as the left column, centred against the ride, and nothing
            is ever in front of the clip. */}
        <Reveal
          className="notched-frame mx-auto w-full max-w-[420px] lg:order-1 lg:mx-0 lg:max-w-none"
          y={32}
          duration={1}
          amount={0.15}
        >
          <div
            className="notched tier-ink px-6 py-7 sm:px-8 sm:py-9"
            style={{ ['--notch' as string]: '23px' }}
          >
            <p className="label text-gold-bright">The ride is running</p>

            {/* The age, printed the way a fairground prints a figure. */}
            <div className="mt-5 flex items-end gap-5 sm:mt-7">
              <span className="font-poster text-[4.5rem] leading-[0.8] text-gold-bright sm:text-[5.5rem]">
                {eventData.age}
              </span>
              <div className="pb-2">
                <p className="label text-chalk/60">Years</p>
                <p className="label mt-1 text-chalk/60">Old</p>
              </div>
            </div>

            <div className="rule-gold mt-6 sm:mt-8" />

            <blockquote className="display-sm mt-6 whitespace-pre-line text-gold-pale sm:mt-8">
              {eventData.invitationQuote}
            </blockquote>

            <div className="mt-7 flex items-center justify-between sm:mt-9">
              <span className="label text-chalk/45">Keep scrolling</span>
              <HexRow count={4} active={0} className="text-gold-bright/70" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
