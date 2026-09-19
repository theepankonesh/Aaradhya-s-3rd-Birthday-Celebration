import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { EventData } from '../types';
import { Copy, Check, Navigation, CalendarPlus } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import {
  Starburst,
  Sparkle,
  TicketStub,
  BuntingSwag,
  FerrisWheel,
  Rosette
} from './CarnivalMotifs';
import { AmbientMotif as Motif } from './AmbientMotif';
import { Reveal, RevealGroup, RevealItem, useSectionProgress, useDrift } from './Reveal';

interface EventDetailsProps {
  eventData: EventData;
}

/** The opacity this room prints its line art at; a twinkle is pitched on it. */
const ROOM_PEAK = 0.1;

/**
 * WHERE & WHEN — the first dark room.
 *
 * Three admission tickets on a three-column grid, cut in the light tier so
 * they read as paper handed across a counter into a dark tent. Flat: the
 * tickets have no shadow and no gradient, and the only thing separating the
 * stub from the body is a perforation.
 *
 * This is also the one room that prints the date, and it prints it twice over
 * — once as the reveal under the title, at display size, and once on the
 * ticket a guest would actually be handed. The hero no longer carries it at
 * all, so nothing on the page repeats a fact a guest has already read.
 */
export const EventDetails: React.FC<EventDetailsProps> = ({ eventData }) => {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const copyTimer = useRef<number | undefined>(undefined);
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useSectionProgress(sectionRef);
  // The gold screen printed into the dark tier drifts against the tickets on
  // it, which is the whole of the depth in this room.
  const groundY = useDrift(progress, -38, 38);
  // The furniture passes the window faster than the ground it stands on.
  const furnitureY = useDrift(progress, -70, 70);

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  const handleCopyAddress = async () => {
    const address = `${eventData.venue}, ${eventData.address}`;
    try {
      await navigator.clipboard.writeText(address);
      setCopyState('copied');
    } catch {
      // Insecure context, a denied permission, or a browser that refuses the
      // write. Say so rather than claiming a copy that never happened.
      setCopyState('failed');
    }
    window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopyState('idle'), 2500);
  };

  const handleAddToCalendar = () => {
    /* Derived from the event date so an edit in the customiser carries through;
       falls back to the printed date if it is ever written in a form Date
       cannot read. The party runs 18:00–24:00 local, EDT being UTC-4. */
    const parsed = new Date(`${eventData.date} 18:00:00`);
    const stamp = (hour: number) => {
      const base = isNaN(parsed.getTime()) ? new Date('October 11, 2026 18:00:00') : parsed;
      const utc = new Date(
        Date.UTC(base.getFullYear(), base.getMonth(), base.getDate(), hour + 4, 0, 0)
      );
      return utc.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };
    const startTime = stamp(18);
    const endTime = stamp(24);
    const ordinal = `${eventData.age}${
      ['th', 'st', 'nd', 'rd'][
        eventData.age % 100 > 10 && eventData.age % 100 < 14 ? 0 : Math.min(eventData.age % 10, 4) % 4
      ]
    }`;
    const title = encodeURIComponent(`${eventData.childName}’s ${ordinal} Birthday Celebration`);
    const details = encodeURIComponent(
      `You're invited to celebrate ${eventData.childName}’s ${ordinal} Birthday at the Carnival!\nHosted by ${eventData.parents}`
    );
    const location = encodeURIComponent(`${eventData.venue}, ${eventData.address}`);
    window.open(
      `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  /* Each detail is printed as an admission ticket: the head names what the
     ticket admits you to, the body carries the answer, the stub below it
     carries the action. */
  const tickets = [
    {
      head: 'Gates open',
      term: 'Date',
      value: eventData.date,
      note: 'Sunday evening at the fair',
      action: (
        <button type="button" onClick={handleAddToCalendar} className="detail-action">
          <CalendarPlus className="h-4 w-4" aria-hidden="true" />
          Add to calendar
        </button>
      )
    },
    {
      head: 'Show times',
      term: 'Time',
      value: eventData.time,
      note: 'Cotton candy from six',
      action: (
        <p className="label flex min-h-[44px] items-center justify-center text-center text-graphite">
          Six hours of it
        </p>
      )
    },
    {
      head: 'The grounds',
      term: 'Venue',
      value: eventData.venue,
      note: eventData.address,
      action: (
        <button type="button" onClick={handleCopyAddress} className="detail-action">
          {copyState === 'copied' ? (
            <Check className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Copy className="h-4 w-4" aria-hidden="true" />
          )}
          {/* Spoken as well as shown. */}
          <span aria-live="polite">
            {copyState === 'copied'
              ? 'Address copied'
              : copyState === 'failed'
                ? 'Copy failed — select it above'
                : 'Copy address'}
          </span>
        </button>
      )
    }
  ];

  return (
    <section id="details" ref={sectionRef} className="tier-ink section">
      {/* The room's own ground, drifting slower than the tickets standing on
          it. Nothing here is content, so nothing here is read. */}
      <motion.div
        className="tier-ink-drift pointer-events-none absolute inset-x-0 -top-24 -bottom-24"
        style={{ y: groundY }}
        aria-hidden="true"
      />

      {/* ------------------------------------------------------------------
          THE ROOM'S FURNITURE. Line art in the lamps' gold at a tenth of its
          strength, hung round the edges and never under the tickets or the
          type. It drifts faster than the ground behind it, which is the only
          depth this flat architecture allows itself.
          ------------------------------------------------------------------ */}
      <motion.div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ y: furnitureY }}
        aria-hidden="true"
      >
        <Motif className="room-motif left-[-3%] top-[3%] w-[34%] sm:w-[26%]" kind="sway" peak={ROOM_PEAK}>
          <BuntingSwag className="w-full" weight={1} flags={6} />
        </Motif>

        <Motif
          className="room-motif right-[-3%] top-[2%] hidden w-[24%] sm:block"
          kind="sway"
          delay={2.6}
          duration={13}
          peak={ROOM_PEAK}
        >
          <BuntingSwag className="w-full" weight={1} flags={5} />
        </Motif>

        <Motif
          className="room-motif left-[3%] top-[27%] hidden lg:block"
          kind="drift"
          delay={1.4}
          duration={19}
          peak={ROOM_PEAK}
        >
          <TicketStub className="h-24 w-24" weight={1.1} />
        </Motif>

        <Motif
          className="room-motif right-[3%] bottom-[24%] hidden lg:block"
          kind="drift"
          delay={5.2}
          duration={21}
          peak={ROOM_PEAK}
        >
          <TicketStub className="h-20 w-20" weight={1.1} />
        </Motif>

        <Motif className="room-motif right-[-4%] bottom-[2%] hidden sm:block" peak={ROOM_PEAK}>
          <FerrisWheel className="h-44 w-44 lg:h-60 lg:w-60" weight={1} spinning />
        </Motif>

        <Motif
          className="room-motif left-[5%] bottom-[8%] hidden lg:block"
          kind="drift"
          delay={3.1}
          duration={23}
          peak={ROOM_PEAK}
        >
          <Rosette className="h-20 w-20" weight={1} />
        </Motif>

        <Motif
          className="room-motif left-[2%] top-[8%] sm:left-[12%] sm:top-[13%]"
          kind="twinkle"
          duration={6.5}
          peak={ROOM_PEAK}
        >
          <Sparkle className="h-7 w-7" weight={1.2} />
        </Motif>

        <Motif
          className="room-motif right-[13%] top-[20%] hidden sm:block"
          kind="twinkle"
          delay={2.2}
          duration={8}
          peak={ROOM_PEAK}
        >
          <Sparkle className="h-9 w-9" weight={1.2} />
        </Motif>

        <Motif
          className="room-motif left-[8%] bottom-[36%] hidden lg:block"
          kind="twinkle"
          delay={4.4}
          duration={7}
          peak={ROOM_PEAK}
        >
          <Sparkle className="h-6 w-6" weight={1.2} />
        </Motif>

        <Motif
          className="room-motif right-[9%] bottom-[42%] hidden xl:block"
          kind="twinkle"
          delay={1.1}
          duration={9}
          peak={ROOM_PEAK}
        >
          <Starburst className="h-8 w-8" weight={1.2} />
        </Motif>

        <Motif
          className="room-motif left-[26%] bottom-[4%] hidden xl:block"
          kind="twinkle"
          delay={5.8}
          duration={7.5}
          peak={ROOM_PEAK}
        >
          <Sparkle className="h-5 w-5" weight={1.2} />
        </Motif>
      </motion.div>

      <div className="measure relative">
        <SectionHeading
          kicker="Admit One"
          title="Where & When"
          lede={eventData.welcomeNote}
        />

        {/* ----------------------------------------------------------------
            THE DATE REVEAL. The one line everybody came for, set at display
            size between two runs of lamps — it was a 12px kicker before, and
            a 12px kicker cannot carry a date.
            ---------------------------------------------------------------- */}
        <Reveal className="mt-13 flex flex-col items-center gap-6" duration={1.05} y={22}>
          <div className="flex w-full max-w-[34rem] items-center gap-4 text-gold-bright sm:gap-6">
            <div className="bulb-rule bulb-rule-lit flex-1" aria-hidden="true" />
            <Starburst className="h-5 w-5 shrink-0" weight={1.5} />
            <div className="bulb-rule bulb-rule-lit flex-1" aria-hidden="true" />
          </div>

          <p className="date-reveal text-center text-gold-pale">
            Turning {eventData.age} · {eventData.date}
          </p>

          <div className="flex w-full max-w-[34rem] items-center gap-4 text-gold-bright sm:gap-6">
            <div className="bulb-rule bulb-rule-lit flex-1" aria-hidden="true" />
            <Starburst className="h-5 w-5 shrink-0" weight={1.5} />
            <div className="bulb-rule bulb-rule-lit flex-1" aria-hidden="true" />
          </div>
        </Reveal>

        <RevealGroup className="mt-15 grid grid-cols-1 gap-7 md:grid-cols-3" beat={0.11}>
          {tickets.map(({ head, term, value, note, action }, i) => (
            <RevealItem
              as="article"
              key={term}
              className="ticket flex flex-col overflow-hidden"
              y={30}
              duration={0.9}
              /* A hand-width lift, on the page's own curve. Through Motion
                 rather than CSS, so it also goes away under reduced motion. */
              whileHover={{ y: -7 }}
            >
              <div
                className="ticket-head px-5 py-3.5 text-center"
                /* Three gleams, well out of step with one another. */
                style={{ ['--gleam-delay' as string]: `${i * 2.4}s` }}
              >
                <span className="label">{head}</span>
              </div>

              <div className="flex flex-1 flex-col items-center px-6 pt-8 pb-6 text-center">
                <p className="label text-gold-ink">{term}</p>
                <p className="ticket-value mt-4 text-balance text-cherry-deep">{value}</p>
                <p className="copy-sm mt-4 min-h-[3rem] text-graphite">{note}</p>
              </div>

              <div className="px-5 pb-4">
                <div className="perforation mb-3" />
                {action}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* The stat pair again, closing the room: hosts and the map. */}
        <Reveal className="mt-15 flex flex-col items-center gap-8" delay={0.1} duration={0.95}>
          <div className="rule-gold w-full max-w-xs" />

          <div className="stat-pair items-center text-center text-chalk">
            <dt>Hosted by</dt>
            <dd className="text-gold-pale">{eventData.parents}</dd>
          </div>

          <a
            id="open-google-maps-btn"
            href={eventData.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold"
          >
            <Navigation className="h-4 w-4" aria-hidden="true" />
            Open in Google Maps
          </a>
        </Reveal>
      </div>
    </section>
  );
};
