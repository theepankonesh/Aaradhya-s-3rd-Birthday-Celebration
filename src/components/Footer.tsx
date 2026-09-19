import React from 'react';
import { Bunting } from './CarnivalOrnaments';
import { Monogram, Rosette } from './CarnivalMotifs';
import { RevealGroup, RevealItem } from './Reveal';

interface FooterProps {
  childName: string;
}

/**
 * THE LIGHTEST TIER closes the page — Structured's chalk footer. Minimal top
 * chrome at the head of the page, minimal bottom chrome at its foot: a
 * monogram, a rule, two lines. The bunting hangs off the cut above it, which
 * is the fair getting the last word.
 */
export const Footer: React.FC<FooterProps> = ({ childName }) => (
  <footer className="tier-chalk relative w-full pb-20 text-center">
    <Bunting className="mb-16" />

    <RevealGroup className="measure flex flex-col items-center" beat={0.1} amount={0.25}>
      <RevealItem y={16} duration={0.8}>
        <Monogram className="h-11 w-11 text-cherry" weight={1.25} />
      </RevealItem>

      <RevealItem className="w-32" y={12} duration={0.7}>
        <div className="rule-gold mt-9 w-full" />
      </RevealItem>

      <RevealItem y={16} duration={0.85}>
        <p className="copy mt-9 text-graphite">
          Made with love for {childName}’s special day
        </p>
      </RevealItem>

      <RevealItem y={16} duration={0.85}>
        <div className="mt-8 flex items-center gap-4 text-gold">
          <div className="bulb-rule w-16" aria-hidden="true" />
          <Rosette className="h-8 w-8 shrink-0" weight={1.1} />
          <div className="bulb-rule w-16" aria-hidden="true" />
        </div>
      </RevealItem>

      <RevealItem y={14} duration={0.8}>
        <p className="label mt-8 text-graphite/70">
          {childName}’s Third Birthday · 2026
        </p>
      </RevealItem>
    </RevealGroup>
  </footer>
);
