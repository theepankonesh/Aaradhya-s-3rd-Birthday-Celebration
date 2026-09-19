import React from 'react';
import { RevealGroup, RevealItem } from './Reveal';

interface SectionHeadingProps {
  kicker: string;
  title: string;
  lede?: string;
  /** Aligns the lede's measure; the heading itself is always centred. */
  className?: string;
}

/**
 * ONE HEADING, EVERYWHERE.
 *
 * Structured's section header is a single centred display line at the top of
 * the type scale with nothing beside it — no rules, no ornament, no box. The
 * one thing kept from the fair is the notched stub above it, because each
 * section here really is a separate attraction and the stub is how a fair
 * names one.
 *
 * The title takes its colour from the room it is in, so this component never
 * sets one. The three lines cascade rather than arriving together — the stub
 * names the attraction, then the title, then the lede, which is the order
 * they would be read in anyway.
 */
export const SectionHeading: React.FC<SectionHeadingProps> = ({
  kicker,
  title,
  lede,
  className = ''
}) => (
  <RevealGroup
    as="header"
    className={`flex flex-col items-center text-center ${className}`}
    beat={0.12}
    amount={0.2}
  >
    <RevealItem y={16} duration={0.7}>
      <p className="section-stub">{kicker}</p>
    </RevealItem>

    <RevealItem className="w-full" y={24} duration={0.95}>
      <h2 className="display-title mx-auto mt-8 max-w-[18ch]">{title}</h2>
    </RevealItem>

    {lede && (
      <RevealItem className="w-full" y={20} duration={0.9}>
        <p className="copy mx-auto mt-7 max-w-[52ch] opacity-70 whitespace-pre-line">{lede}</p>
      </RevealItem>
    )}
  </RevealGroup>
);
