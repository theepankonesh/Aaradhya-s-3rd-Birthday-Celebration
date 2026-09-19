import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { TimelineItem } from '../types';
import { SectionHeading } from './SectionHeading';
import {
  TimelineMotif,
  Sparkle,
  Starburst,
  TicketStub,
  BuntingSwag,
  Rosette,
  CottonCandy
} from './CarnivalMotifs';
import { AmbientMotif as Motif } from './AmbientMotif';
import { Reveal, useSectionProgress, useDrift } from './Reveal';

interface BirthdayTimelineProps {
  timeline: TimelineItem[];
}

/** The opacity this room prints its line art at; a twinkle is pitched on it. */
const ROOM_PEAK = 0.14;

/**
 * THE RUNNING ORDER.
 *
 * A two-column ledger on the putty tier: the hour set in the poster slab on
 * the left, the attraction on the right, a hairline between every entry and
 * a drawn motif marking each one.
 *
 * Three things move here, and all of them slowly. Each entry fades and rises
 * on its own trigger, so the order arrives in the order it will happen. Each
 * entry's motif breathes on its own beat, so the column of icons never
 * pulses in unison. And a hairline rail is drawn down the icon column as the
 * list is scrolled through — the running order literally being written out.
 */
/**
 * The detail line, with one name lifted out of it into the wood type.
 *
 * The description stays a plain string in the data — the name is named
 * separately and matched against it — so nothing here parses markup and
 * nothing is injected as HTML. A highlight that isn't present in the line
 * (a renamed guest, a typo) degrades to ordinary copy rather than throwing.
 */
const detailWithName = (text: string, highlight?: string): React.ReactNode => {
  if (!highlight) return text;
  const at = text.indexOf(highlight);
  if (at === -1) return text;

  return (
    <>
      {text.slice(0, at)}
      <span className="name-display">{highlight}</span>
      {text.slice(at + highlight.length)}
    </>
  );
};

export const BirthdayTimeline: React.FC<BirthdayTimelineProps> = ({ timeline }) => {
  const still = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  const progress = useSectionProgress(sectionRef);
  const groundY = useDrift(progress, -34, 34);
  // The furniture passes the window faster than the ground it stands on.
  const furnitureY = useDrift(progress, -62, 62);

  /* The rail draws from the moment the list's top is well into view until its
     foot is most of the way up — so it finishes with the last entry rather
     than long before it. Asked for less motion it is simply already drawn. */
  const { scrollYProgress: railProgress } = useScroll({
    target: listRef,
    offset: ['start 85%', 'end 65%']
  });
  const railScale = useTransform(railProgress, [0, 1], still ? [1, 1] : [0, 1]);

  return (
    <section id="timeline" ref={sectionRef} className="tier-putty section">
      <motion.div
        className="tier-putty-drift pointer-events-none absolute inset-x-0 -top-24 -bottom-24"
        style={{ y: groundY }}
        aria-hidden="true"
      />

      {/* ------------------------------------------------------------------
          THE ROOM'S FURNITURE. The measure here is the narrow one, so there
          is real room either side of the column — which is exactly where all
          of this goes. Nothing sits over the schedule or its icons.
          ------------------------------------------------------------------ */}
      <motion.div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ y: furnitureY }}
        aria-hidden="true"
      >
        <Motif
          className="motif-putty left-[-3%] top-[4%] w-[32%] sm:w-[26%]"
          kind="sway"
          peak={ROOM_PEAK}
        >
          <BuntingSwag className="w-full" weight={1} flags={6} />
        </Motif>

        <Motif
          className="motif-putty right-[-3%] top-[3%] hidden w-[22%] sm:block"
          kind="sway"
          delay={2.8}
          duration={13}
          peak={ROOM_PEAK}
        >
          <BuntingSwag className="w-full" weight={1} flags={5} />
        </Motif>

        <Motif
          className="motif-putty left-[3%] top-[31%] hidden lg:block"
          kind="drift"
          delay={1.6}
          duration={19}
          peak={ROOM_PEAK}
        >
          <TicketStub className="h-20 w-20" weight={1.1} />
        </Motif>

        <Motif
          className="motif-putty right-[4%] bottom-[27%] hidden lg:block"
          kind="drift"
          delay={5.4}
          duration={22}
          peak={ROOM_PEAK}
        >
          <TicketStub className="h-24 w-24" weight={1.1} />
        </Motif>

        <Motif
          className="motif-putty right-[5%] top-[17%] hidden xl:block"
          kind="drift"
          delay={3.3}
          duration={24}
          peak={ROOM_PEAK}
        >
          <Rosette className="h-20 w-20" weight={1} />
        </Motif>

        <Motif
          className="motif-putty left-[5%] bottom-[11%] hidden xl:block"
          kind="bob"
          delay={4.1}
          duration={14}
          peak={ROOM_PEAK}
        >
          <CottonCandy className="h-24 w-24" weight={1.1} />
        </Motif>

        <Motif
          className="motif-putty left-[2%] top-[9%] sm:left-[12%] sm:top-[14%]"
          kind="twinkle"
          duration={6.5}
          peak={ROOM_PEAK}
        >
          <Sparkle className="h-7 w-7" weight={1.2} />
        </Motif>

        <Motif
          className="motif-putty right-[11%] bottom-[13%] hidden sm:block"
          kind="twinkle"
          delay={2.4}
          duration={8}
          peak={ROOM_PEAK}
        >
          <Sparkle className="h-8 w-8" weight={1.2} />
        </Motif>

        <Motif
          className="motif-putty left-[8%] bottom-[41%] hidden lg:block"
          kind="twinkle"
          delay={4.6}
          duration={7}
          peak={ROOM_PEAK}
        >
          <Sparkle className="h-6 w-6" weight={1.2} />
        </Motif>

        <Motif
          className="motif-putty right-[9%] top-[44%] hidden lg:block"
          kind="twinkle"
          delay={1.2}
          duration={9}
          peak={ROOM_PEAK}
        >
          <Starburst className="h-8 w-8" weight={1.2} />
        </Motif>
      </motion.div>

      <div className="measure measure-narrow relative">
        <SectionHeading
          kicker="Programme"
          title="The Order of the Day"
          lede="From the first cotton candy to the last piñata swing."
        />

        {/* Each entry carries its own trigger. A single group trigger would
            cascade the whole running order the moment the first hour appeared,
            and the last two would have played out below the fold. */}
        <ol ref={listRef} className="relative mt-15 border-t border-vellum">
          {/* The rail, drawn down the icon column as the list is read. */}
          <motion.span
            className="timeline-rail"
            style={{ scaleY: railScale }}
            aria-hidden="true"
          />

          {timeline.map((item, i) => (
            <Reveal
              as="li"
              key={item.id}
              className="relative grid grid-cols-[auto_1fr] items-start gap-x-5 border-b border-vellum py-7 sm:grid-cols-[6rem_auto_1fr] sm:gap-x-8"
              y={22}
              duration={0.8}
              delay={Math.min(i, 3) * 0.08}
              amount={0.3}
            >
              {/* The hour, in the only place figures are printed in the slab. */}
              <p className="font-poster col-span-2 text-[0.9375rem] leading-none tracking-wide text-cherry sm:col-span-1 sm:pt-1">
                {item.time}
              </p>

              {/* The drawn motif for this attraction, breathing on its own
                  beat — the periods are deliberately not multiples of one
                  another, so the column never falls into step. The putty
                  disc behind it is what keeps the rail from running through
                  the drawing. */}
              <motion.span
                className="timeline-icon mt-4 flex h-10 w-10 shrink-0 items-center justify-center text-gold-ink sm:mt-0"
                aria-hidden="true"
                animate={still ? undefined : { y: [0, -3.5, 0], scale: [1, 1.07, 1] }}
                transition={
                  still
                    ? undefined
                    : {
                        duration: 6.4 + i * 0.7,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.55
                      }
                }
              >
                <TimelineMotif name={item.icon} className="h-9 w-9" />
              </motion.span>

              <div className="mt-4 sm:mt-0">
                <h3 className="display-sm text-ink">{item.title}</h3>
                {item.description && (
                  <p className="copy mt-2 text-graphite">
                    {detailWithName(item.description, item.highlight)}
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
};
