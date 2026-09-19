import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Canopy, MarqueeFrame } from './CarnivalOrnaments';
import { TicketStub } from './CarnivalMotifs';
import { RevealGroup, RevealItem, useSectionProgress, useDrift } from './Reveal';

interface RSVPSectionProps {
  childName: string;
  onOpenRSVP: () => void;
}

/**
 * THE TICKET BOOTH.
 *
 * The last light room, and the one place the architecture's flatness is
 * allowed a single exception: the booth keeps its striped canopy and its ring
 * of chasing lamps, because a ticket booth without them is a desk. Everything
 * else obeys — flat cherry fill, hairline keyline, 9px corners, one pill.
 */
export const RSVPSection: React.FC<RSVPSectionProps> = ({ childName, onOpenRSVP }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useSectionProgress(sectionRef);
  const groundY = useDrift(progress, -30, 30);

  return (
    <section id="rsvp" ref={sectionRef} className="tier-putty section">
      <motion.div
        className="tier-putty-drift pointer-events-none absolute inset-x-0 -top-24 -bottom-24"
        style={{ y: groundY }}
        aria-hidden="true"
      />

      <div className="measure measure-narrow relative">
        {/* The booth comes forward a little as it arrives — the one place on
            the page a scale is used, because a booth is an object you walk up
            to rather than a line you read. */}
        <RevealGroup
          className="relative overflow-hidden rounded-[9px] border border-vellum bg-bone px-6 pt-20 pb-16 text-center sm:px-14 sm:pt-24 sm:pb-20"
          beat={0.11}
          amount={0.2}
        >
          <Canopy />
          <MarqueeFrame />

          <div className="relative">
            <RevealItem y={18} duration={0.8}>
              <TicketStub className="mx-auto h-14 w-14 text-cherry" weight={1.2} />
            </RevealItem>

            <RevealItem y={16} duration={0.75}>
              <p className="section-stub mt-8">Replies by October 1st</p>
            </RevealItem>

            <RevealItem y={24} duration={0.95}>
              <h2 className="display-title mt-8 text-cherry">Will you be there?</h2>
            </RevealItem>

            <RevealItem y={20} duration={0.9}>
              <p className="copy mx-auto mt-7 max-w-[46ch] text-graphite">
                {childName} is turning three, and she would like everyone she loves in the room.
              </p>
            </RevealItem>

            <RevealItem y={20} duration={0.9}>
              <div className="mt-11 flex flex-col items-center gap-6">
                <button id="rsvp-section-cta" onClick={onOpenRSVP} className="btn btn-cherry px-10">
                  Claim your ticket
                </button>
                <p className="label text-graphite/70">Thank you for celebrating with us</p>
              </div>
            </RevealItem>
          </div>
        </RevealGroup>
      </div>
    </section>
  );
};
