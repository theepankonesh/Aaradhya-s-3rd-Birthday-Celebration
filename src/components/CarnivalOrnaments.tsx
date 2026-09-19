import React from 'react';
import { useReducedMotion } from 'motion/react';
import { TicketStub } from './CarnivalMotifs';

/**
 * THE FAIR'S FURNITURE — the striped canopy, the lamps, the bunting.
 *
 * All of it survives the move to the gallery architecture, but flat: the
 * drop-shadows and glows are gone, because in this system depth comes from
 * the hard cut between a light room and a dark one and from nothing else.
 * What is left is flat colour, hairlines, and light that is genuinely light —
 * the lamps, which are allowed to glow because a lamp is a light source and
 * not a shadow pretending to be depth.
 */

/* ---------------------------------------------------------------------------
   CANOPY — the striped, scalloped awning. Sits along the top edge of the
   invitation and the ticket booth, and runs full-bleed as a section divider.
   ------------------------------------------------------------------------ */
export const Canopy: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`pointer-events-none absolute inset-x-0 top-0 ${className}`} aria-hidden="true">
    <div className="canopy h-[30px] w-full sm:h-[38px]" />
    {/* The bead course the carousel wears under its own hem. */}
    <div
      className="h-[7px] w-full"
      style={{
        backgroundImage: 'radial-gradient(circle, #C08A12 0 2.1px, transparent 2.8px)',
        backgroundSize: '26px 7px',
        backgroundRepeat: 'repeat-x'
      }}
    />
  </div>
);

/* A full-bleed run of the same awning, used where two rooms meet and the cut
   wants announcing rather than merely making. */
export const CanopyBand: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`pointer-events-none w-full ${className}`} aria-hidden="true">
    <div className="canopy h-[22px] w-full sm:h-[28px]" />
  </div>
);

/* ---------------------------------------------------------------------------
   MARQUEE FRAME — two rings of lamps half a pitch apart, breathing in
   antiphase, so the light appears to run round the frame. Two places on the
   page only: the invitation and the ticket booth.
   ------------------------------------------------------------------------ */
export const MarqueeFrame: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
    <div className="bulb-ring" />
    <div className="bulb-ring bulb-ring-b" />
  </div>
);

/* ---------------------------------------------------------------------------
   STRING LIGHTS — a swag of cable with lamps hanging off it, drawn as one
   path so the droop is a real catenary rather than a row of dots.

   These are the only light source the architecture allows, so where a room
   needs warmth at the top they are asked to carry it: the `warm` tone burns
   the glass at filament and hangs a soft halo behind every lamp, which is a
   lamp doing what a lamp does rather than a shadow faking depth.
   ------------------------------------------------------------------------ */
export const StringLights: React.FC<{
  className?: string;
  swags?: number;
  /** 'ink' for a dark room, 'putty' for a light one, 'warm' for a lit one. */
  tone?: 'ink' | 'putty' | 'warm';
  /** How far the cable droops, in viewBox units. */
  drop?: number;
  /** Lamp radius, in viewBox units. */
  lamp?: number;
  /** Lamps per swag. */
  perSwag?: number;
  /** Shifts the whole run sideways, so two passes never sit in register. */
  phase?: number;
}> = ({
  className = '',
  swags = 4,
  tone = 'putty',
  drop = 34,
  lamp = 3.4,
  perSwag = 3,
  phase = 0
}) => {
  // The lamps twinkle via SMIL, which the stylesheet's reduced-motion rule
  // cannot reach — so ask directly and hold them steady instead.
  const stillLamps = useReducedMotion();
  const glowId = React.useId().replace(/:/g, '');
  const width = 1200;
  const span = width / swags;

  const wire =
    tone === 'ink'
      ? 'rgba(226,184,72,0.45)'
      : tone === 'warm'
        ? 'rgba(192,138,18,0.75)'
        : 'rgba(192,138,18,0.5)';
  const glassA = tone === 'putty' ? '#C08A12' : '#FFF3C4';
  const glassB = tone === 'putty' ? '#7A5606' : '#E2B848';
  const glassC = tone === 'warm' ? '#F0DDA8' : glassA;
  const lit = tone !== 'putty';

  const path = Array.from({ length: swags + 1 })
    .map(
      (_, i) =>
        `M ${i * span - phase} 4 Q ${i * span + span / 2 - phase} ${drop + 6} ${
          (i + 1) * span - phase
        } 4`
    )
    .join(' ');

  // Lamps hung at the low points of each curve.
  const stops = Array.from({ length: perSwag }).map((_, k) => (k + 1) / (perSwag + 1));
  const lamps = Array.from({ length: swags + 1 }).flatMap((_, i) =>
    stops.map((t) => {
      const x = i * span + span * t - phase;
      // Point on the quadratic at t.
      const y = 4 * (1 - t) ** 2 + (drop + 6) * 2 * (1 - t) * t + 4 * t ** 2;
      return { x, y, key: `${i}-${t}` };
    })
  );

  return (
    <svg
      className={`pointer-events-none w-full ${className}`}
      viewBox={`0 0 ${width} ${drop + lamp * 4 + 18}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {lit && (
        <defs>
          <filter id={`lampGlow-${glowId}`} x="-160%" y="-160%" width="420%" height="420%">
            <feGaussianBlur stdDeviation={lamp * 1.5} />
          </filter>
        </defs>
      )}

      <path d={path} fill="none" stroke={wire} strokeWidth={tone === 'warm' ? 2 : 1.5} />

      {lamps.map(({ x, y, key }, i) => {
        const glass = i % 3 === 0 ? glassA : i % 3 === 1 ? glassB : glassC;
        return (
          <g key={key}>
            <line x1={x} y1={y} x2={x} y2={y + lamp * 2} stroke={wire} strokeWidth="1.25" />
            {/* The halo, drawn first so the glass sits inside its own light. */}
            {lit && (
              <circle
                cx={x}
                cy={y + lamp * 3.5}
                r={lamp * 2.4}
                fill={glass}
                opacity={tone === 'warm' ? 0.4 : 0.26}
                filter={`url(#lampGlow-${glowId})`}
              />
            )}
            <circle cx={x} cy={y + lamp * 3.5} r={lamp} fill={glass}>
              {!stillLamps && (
                <animate
                  attributeName="opacity"
                  values="1;0.45;1"
                  dur="3.4s"
                  begin={`${(i % 5) * 0.42}s`}
                  repeatCount="indefinite"
                />
              )}
            </circle>
          </g>
        );
      })}
    </svg>
  );
};

/* ---------------------------------------------------------------------------
   BUNTING — triangular pennants on a line, alternating cherry and gold, each
   stirring a beat after the one before it. Flat: no shadow under the cloth.
   ------------------------------------------------------------------------ */
export const Bunting: React.FC<{ count?: number; className?: string }> = ({
  count = 45,
  className = ''
}) => (
  <div
    className={`pointer-events-none flex w-full items-start justify-center overflow-hidden ${className}`}
    aria-hidden="true"
  >
    {Array.from({ length: count }).map((_, i) => (
      <span
        key={i}
        className="block h-8 w-7 shrink-0 origin-top sm:h-10 sm:w-9"
        style={{
          /* The deeper gold, not the bright one: on the wheat ground #E2B848
             is barely a shade off the canvas, and half the bunting vanished. */
          backgroundColor: i % 2 === 0 ? '#C1122E' : '#C08A12',
          clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
          animation: `pennantStir 3.6s ease-in-out ${i * 0.18}s infinite`
        }}
      />
    ))}
  </div>
);

/* ---------------------------------------------------------------------------
   TICKET MARK — kept at its old name for the call sites that use it; the
   drawing now comes from the motif set so there is one stub on the page.
   ------------------------------------------------------------------------ */
export const TicketMark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <TicketStub className={className} weight={1.4} />
);
