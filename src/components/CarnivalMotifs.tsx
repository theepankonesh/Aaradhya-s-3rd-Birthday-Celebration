import React from 'react';

/**
 * THE MOTIF SET — every decorative mark on the page, drawn here.
 *
 * Structured's icon rule is "thin stroke, minimal monoline treatment", so
 * these are all one weight of line on a 48-unit grid, no fills but the few
 * that carry cherry or gold, and they take their colour from `currentColor`
 * so a motif on putty and the same motif on ink are one drawing.
 *
 * Everything here is something actually at the fair: the ride, the tent, the
 * wheel, the stub you hand over at the gate, the candy, the cake, the rosette
 * pinned on the winner. Nothing generic, and nothing left as a placeholder.
 */

type MotifProps = {
  className?: string;
  /** Stroke weight on the 48-unit grid. 1.5 is the page default. */
  weight?: number;
  title?: string;
};

const frame = (weight: number) => ({
  viewBox: '0 0 48 48',
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: weight,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const
});

/* ---------------------------------------------------------------------------
   HEXAGON — Structured's pagination and nav indicator. Drawn pointy-top at
   ~12px so a row of them reads as a row of marks, not of dots.
   ------------------------------------------------------------------------ */
export const Hexagon: React.FC<MotifProps & { filled?: boolean }> = ({
  className = '',
  weight = 1.5,
  filled = false
}) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth={weight}
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 2.5 20.4 7.25 20.4 16.75 12 21.5 3.6 16.75 3.6 7.25Z" />
  </svg>
);

/* A row of them, one marked. Used under the gallery vignettes. */
export const HexRow: React.FC<{ count: number; active: number; className?: string }> = ({
  count,
  active,
  className = ''
}) => (
  <span className={`inline-flex items-center gap-1.5 ${className}`} aria-hidden="true">
    {Array.from({ length: count }).map((_, i) => (
      <Hexagon key={i} className="h-3.5 w-3.5" filled={i === active} weight={1.15} />
    ))}
  </span>
);

/* ---------------------------------------------------------------------------
   MONOGRAM — the circled 'A'. Structured's logo mark is a circled letter in a
   thin monoline stroke; this is that, with the fair's own serif spur.
   ------------------------------------------------------------------------ */
export const Monogram: React.FC<MotifProps> = ({ className = '', weight = 1.5 }) => (
  <svg
    viewBox="0 0 32 32"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={weight}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="16" cy="16" r="14.25" />
    <path d="M10 23 16 9l6 14" />
    <path d="M12.4 18.6h7.2" />
  </svg>
);

/* ---------------------------------------------------------------------------
   CAROUSEL — the ride the whole palette came from: scalloped canopy, finial
   pennant, three barley-twist poles, the platform.
   ------------------------------------------------------------------------ */
export const Carousel: React.FC<MotifProps> = ({ className = '', weight = 1.5 }) => (
  <svg {...frame(weight)} className={className} aria-hidden="true">
    {/* Finial and pennant */}
    <path d="M24 4.5v5" />
    <path d="M24 4.5c2.4.5 4 1.1 5.4 1.9-1.4.8-3 1.4-5.4 1.9" />
    {/* Canopy dome */}
    <path d="M7 21.5C7 13.4 14.6 9.5 24 9.5s17 3.9 17 12" />
    {/* Scalloped hem */}
    <path d="M7 21.5a2.83 2.83 0 0 0 5.66 0 2.83 2.83 0 0 0 5.67 0 2.83 2.83 0 0 0 5.67 0 2.83 2.83 0 0 0 5.67 0 2.83 2.83 0 0 0 5.66 0 2.83 2.83 0 0 0 5.67 0" />
    {/* Poles */}
    <path d="M13.5 25v13M24 25v13M34.5 25v13" />
    {/* Seats on the poles */}
    <path d="M11.5 30h4M22 30h4M32.5 30h4" />
    {/* Platform */}
    <path d="M8 38h32" />
    <path d="M10.5 42h27" />
  </svg>
);

/* ---------------------------------------------------------------------------
   BIG TOP — the tent, with its swagged entrance.
   ------------------------------------------------------------------------ */
export const BigTop: React.FC<MotifProps> = ({ className = '', weight = 1.5 }) => (
  <svg {...frame(weight)} className={className} aria-hidden="true">
    <path d="M24 4v4" />
    <path d="M24 4c2.3.5 3.9 1.1 5.2 1.8-1.3.8-2.9 1.4-5.2 1.8" />
    <path d="M5 40c0-13.5 7.5-24 19-32 11.5 8 19 18.5 19 32" />
    <path d="M5 40h38" />
    {/* Swagged entrance */}
    <path d="M17.5 40V29c0-4.6 2.9-7.5 6.5-7.5s6.5 2.9 6.5 7.5v11" />
    {/* The two panels pulled back */}
    <path d="M24 8c-2.6 8.5-4 16.7-4.2 21.5M24 8c2.6 8.5 4 16.7 4.2 21.5" />
  </svg>
);

/* ---------------------------------------------------------------------------
   FERRIS WHEEL — hub, eight spokes, four gondolas, an A-frame.
   ------------------------------------------------------------------------ */
export const FerrisWheel: React.FC<MotifProps & { spinning?: boolean }> = ({
  className = '',
  weight = 1.5,
  spinning = false
}) => (
  <svg {...frame(weight)} className={className} aria-hidden="true">
    {/* Everything that actually turns, in one group about the hub. The frame
        below it stands still, which is the whole point of a ferris wheel. */}
    <g className={spinning ? 'motif-wheel' : undefined}>
      <circle cx="24" cy="21" r="15" />
      <circle cx="24" cy="21" r="2.75" />
      <path d="M24 6v30M9 21h30M13.4 10.4l21.2 21.2M34.6 10.4 13.4 31.6" />
      {/* Gondolas at the cardinal rim points */}
      <path d="M21.6 6h4.8M21.6 36h4.8M9 18.6v4.8M39 18.6v4.8" />
    </g>
    {/* Frame */}
    <path d="M24 21 16 43M24 21l8 22M17.5 43h13" />
  </svg>
);

/* ---------------------------------------------------------------------------
   TICKET STUB — notched sides, perforation, the punched hole.
   ------------------------------------------------------------------------ */
export const TicketStub: React.FC<MotifProps> = ({ className = '', weight = 1.5 }) => (
  <svg {...frame(weight)} className={className} aria-hidden="true">
    <path d="M5 14h38v6.5a3.5 3.5 0 0 0 0 7V34H5v-6.5a3.5 3.5 0 0 0 0-7V14Z" />
    <path d="M18 16v3M18 22.5v3M18 29v3" />
    <circle cx="11.5" cy="24" r="2.5" />
    <path d="M25 21h11M25 27h7" />
  </svg>
);

/* ---------------------------------------------------------------------------
   COTTON CANDY — three clouds on a paper cone.
   ------------------------------------------------------------------------ */
export const CottonCandy: React.FC<MotifProps> = ({ className = '', weight = 1.5 }) => (
  <svg {...frame(weight)} className={className} aria-hidden="true">
    <path d="M24 7c3.6 0 6.4 2.4 6.9 5.6 2.9.6 5.1 3.1 5.1 6.2 0 3.5-2.9 6.4-6.5 6.4h-11c-3.6 0-6.5-2.9-6.5-6.4 0-3.1 2.2-5.6 5.1-6.2C17.6 9.4 20.4 7 24 7Z" />
    <path d="M20 25.2 22 42M28 25.2 26 42M22 42h4" />
    <path d="M19.5 16.5c1.6-1.2 3.4-1.6 5-1.1M27 14.5c1.3.2 2.4.8 3.2 1.7" />
  </svg>
);

/* ---------------------------------------------------------------------------
   CAKE — one tier, scalloped icing, a single lit candle.
   ------------------------------------------------------------------------ */
export const Cake: React.FC<MotifProps> = ({ className = '', weight = 1.5 }) => (
  <svg {...frame(weight)} className={className} aria-hidden="true">
    {/* Flame */}
    <path d="M24 5c1.9 1.9 2.8 3.4 2.8 4.6A2.8 2.8 0 0 1 24 12.4a2.8 2.8 0 0 1-2.8-2.8C21.2 8.4 22.1 6.9 24 5Z" />
    <path d="M24 12.6v5" />
    {/* Cake body */}
    <path d="M9 24.5c0-1.7 1.4-3 3-3h24c1.7 0 3 1.3 3 3V38H9V24.5Z" />
    {/* Scalloped icing */}
    <path d="M9 26.8a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" />
    {/* Plate */}
    <path d="M6 38h36M10 42h28" />
  </svg>
);

/* ---------------------------------------------------------------------------
   FEAST — the crossed setting, for dinner on the running order.
   ------------------------------------------------------------------------ */
export const Feast: React.FC<MotifProps> = ({ className = '', weight = 1.5 }) => (
  <svg {...frame(weight)} className={className} aria-hidden="true">
    {/* Fork */}
    <path d="M14 6v9a4 4 0 0 0 4 4v23" />
    <path d="M18 6v9M22 6v9a4 4 0 0 1-4 4" />
    {/* Knife */}
    <path d="M34 42V25M34 25c3.4 0 5-3.6 5-8.5S37.4 6 34 6v19Z" />
  </svg>
);

/* ---------------------------------------------------------------------------
   BALLOONS — two on their strings, for the goodbyes.
   ------------------------------------------------------------------------ */
export const Balloons: React.FC<MotifProps> = ({ className = '', weight = 1.5 }) => (
  <svg {...frame(weight)} className={className} aria-hidden="true">
    <path d="M18 6c4.4 0 8 3.9 8 8.7s-3.6 8.7-8 8.7-8-3.9-8-8.7S13.6 6 18 6Z" />
    <path d="M33 15c3.3 0 6 3 6 6.7s-2.7 6.7-6 6.7-6-3-6-6.7 2.7-6.7 6-6.7Z" />
    <path d="m16.7 23.4 1.3 2.2 1.3-2.2M32 28.4l1 1.7 1-1.7" />
    <path d="M18 25.6c0 6.5-4 8.9-4 16.4M33 30.1c0 4.9 2.6 7 2.6 11.9" />
  </svg>
);

/* ---------------------------------------------------------------------------
   POPCORN — the striped box.
   ------------------------------------------------------------------------ */
export const Popcorn: React.FC<MotifProps> = ({ className = '', weight = 1.5 }) => (
  <svg {...frame(weight)} className={className} aria-hidden="true">
    <path d="M12 22h24l-2.5 20h-19L12 22Z" />
    <path d="M20 22.5 19 42M28 22.5l1 19.5" />
    <path d="M16 22c-2.2 0-4-1.8-4-4a4 4 0 0 1 2.6-3.7A4.2 4.2 0 0 1 19 9.4a4.6 4.6 0 0 1 4.7-3.3 4.6 4.6 0 0 1 4.5 3.3 4.2 4.2 0 0 1 4.6 4.6A4 4 0 0 1 36 18c0 2.2-1.8 4-4 4" />
  </svg>
);

/* ---------------------------------------------------------------------------
   ROSETTE — the prize cockade, pinned at the foot of the page.
   ------------------------------------------------------------------------ */
export const Rosette: React.FC<MotifProps> = ({ className = '', weight = 1.5 }) => (
  <svg {...frame(weight)} className={className} aria-hidden="true">
    {/* Petals — twelve scallops round the medal */}
    <path d="M24 5.5a3.6 3.6 0 0 1 3.3 2.2 3.6 3.6 0 0 1 4.5 1.2 3.6 3.6 0 0 1 3.9 2.4 3.6 3.6 0 0 1 2.5 3.9 3.6 3.6 0 0 1 1.2 4.4 3.6 3.6 0 0 1 0 4.6 3.6 3.6 0 0 1-1.2 4.4 3.6 3.6 0 0 1-2.5 3.9 3.6 3.6 0 0 1-3.9 2.4 3.6 3.6 0 0 1-4.5 1.2 3.6 3.6 0 0 1-6.6 0 3.6 3.6 0 0 1-4.5-1.2 3.6 3.6 0 0 1-3.9-2.4 3.6 3.6 0 0 1-2.5-3.9 3.6 3.6 0 0 1-1.2-4.4 3.6 3.6 0 0 1 0-4.6 3.6 3.6 0 0 1 1.2-4.4 3.6 3.6 0 0 1 2.5-3.9 3.6 3.6 0 0 1 3.9-2.4 3.6 3.6 0 0 1 4.5-1.2A3.6 3.6 0 0 1 24 5.5Z" />
    <circle cx="24" cy="21.5" r="6.5" />
    {/* Ribbon tails */}
    <path d="m18.5 33 -1.5 11 5-3.2 4 3.2L28.5 33" />
  </svg>
);

/* ---------------------------------------------------------------------------
   STARBURST — the printer's asterisk between blocks of type.
   ------------------------------------------------------------------------ */
export const Starburst: React.FC<MotifProps> = ({ className = '', weight = 1.5 }) => (
  <svg {...frame(weight)} className={className} aria-hidden="true">
    <path d="M24 6v36M6 24h36M11.3 11.3l25.4 25.4M36.7 11.3 11.3 36.7" />
    <path d="M24 17.5 26.4 24 24 30.5 21.6 24Z" />
  </svg>
);

/* ---------------------------------------------------------------------------
   SPARKLE — a four-point star, for the glints hung round the edge of the
   room. Deliberately not the Starburst: that one is a printer's asterisk set
   between blocks of type, and this one is a light.
   ------------------------------------------------------------------------ */
export const Sparkle: React.FC<MotifProps> = ({ className = '', weight = 1.5 }) => (
  <svg {...frame(weight)} className={className} aria-hidden="true">
    <path d="M24 4c1.4 11.2 8.4 18.6 20 20-11.6 1.4-18.6 8.8-20 20-1.4-11.2-8.4-18.6-20-20 11.6-1.4 18.6-8.8 20-20Z" />
  </svg>
);

/* ---------------------------------------------------------------------------
   CAROUSEL HORSE — the one on the outside row, prancing, with its pole
   through the saddle. Drawn as one closed outline with the legs, tail and
   mane hung off it, because at this size a horse made of separate strokes
   reads as a scribble and a horse made of one silhouette reads as a horse.
   ------------------------------------------------------------------------ */
export const CarouselHorse: React.FC<MotifProps> = ({ className = '', weight = 1.5 }) => (
  <svg {...frame(weight)} className={className} aria-hidden="true">
    {/* The pole, through the saddle and out both ends */}
    <path d="M20 2v44" />
    <path d="M20 7c2 1.2 2 2.8 0 4s-2 2.8 0 4M20 33c2 1.2 2 2.8 0 4s-2 2.8 0 4" />

    {/* Croup, back, crest, ear, head, jaw, throat, chest, belly — one line
        round. The muzzle is turned rather than cornered: a boxed one reads as
        a goat at this size. */}
    <path d="M9.5 21.5C10 19 14 17.5 19.5 17.5c2.1 0 3.8.3 4.9 1C25.4 15.1 27.3 11.9 29.8 9.7L31.6 6.2 33.4 10.2c2.2 1 4 2.6 4.8 4.8.6 1.6 0 3.2-1.6 3.8-1.8.6-3.8.4-5.2-.4-1.2 2.2-2 4.4-2.3 6.8-.1 1.3-.2 2.2-.3 2.8-3 1.8-7.4 2.6-11.4 2.3-3.9-.3-6.7-1.6-7.4-3.2-.6-1.4-.6-3.1-.1-5.6Z" />

    {/* The eye, and the nostril at the end of the muzzle */}
    <path d="M33.9 13.1h.01M36.9 16.4h.01" />

    {/* Mane, falling down the crest */}
    <path d="M30.8 9.8c-1.7 1.8-3 4-3.7 6.4M28.4 12.6c-1.5 1.6-2.5 3.4-2.9 5.4" />

    {/* The saddle blanket, draped over the back the pole comes through */}
    <path d="M15 18.2c-.8 3.3-.6 6.3.4 9M22.6 18.3c.8 3 .6 6-.2 8.7" />
    <path d="M15.4 27.2c2.4.8 4.8.8 7 -.2" />

    {/* Front pair, one reaching, one folded under */}
    <path d="M28.5 26.5c2.6 1.6 4 4 3.4 6.6l-.6 2.4 2.2.8M25 28.6c1.2 2.8 1 5.6-.6 8.4l-1.2 2 2.2 1" />

    {/* Hind pair, driving back */}
    <path d="M10.8 27.4c-1.6 2.4-2.2 5.2-1.6 8l.6 2.6-2.2.6M15.4 29.4c0 3-.6 5.8-2 8.4l-1 1.8 2 1.2" />

    {/* Tail */}
    <path d="M9.6 21.6c-3-1.6-5.6.4-5.8 3.8-.2 3 1.2 5.4 3.4 6.2" />
  </svg>
);

/* ---------------------------------------------------------------------------
   BUNTING — a swag of pennants on a line, drawn rather than filled, so it
   belongs to the motif set instead of to the solid bunting at the foot of the
   page. Its own wide box, because a square one would make a very short swag.
   ------------------------------------------------------------------------ */
export const BuntingSwag: React.FC<MotifProps & { flags?: number }> = ({
  className = '',
  weight = 1.5,
  flags = 7
}) => {
  const W = 120;
  const dip = 30;
  // Where the line hangs: a quadratic from one peg to the other.
  const at = (t: number) => ({
    x: (1 - t) ** 2 * 3 + 2 * (1 - t) * t * (W / 2) + t ** 2 * (W - 3),
    y: (1 - t) ** 2 * 5 + 2 * (1 - t) * t * dip + t ** 2 * 5
  });

  return (
    <svg
      viewBox={`0 0 ${W} 46`}
      fill="none"
      stroke="currentColor"
      strokeWidth={weight}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={`M3 5 Q${W / 2} ${dip} ${W - 3} 5`} />
      {Array.from({ length: flags }).map((_, i) => {
        const { x, y } = at((i + 1) / (flags + 1));
        return <path key={i} d={`M${x - 4.6} ${y} L${x + 4.6} ${y} L${x} ${y + 12} Z`} />;
      })}
    </svg>
  );
};

/* ---------------------------------------------------------------------------
   THE SIDESHOW SET — drawn for the carousel band, and used nowhere else on
   the page. Everything in the set above had already been hung in the hero,
   the dark room or the running order; a section decorated in the same seven
   marks as its neighbours reads as wallpaper rather than as its own room.
   ------------------------------------------------------------------------ */

/* TOP HAT — the magician's, with its band. */
export const TopHat: React.FC<MotifProps> = ({ className = '', weight = 1.5 }) => (
  <svg {...frame(weight)} className={className} aria-hidden="true">
    <ellipse cx="24" cy="11" rx="8.5" ry="2.6" />
    <path d="M15.5 11v16.5M32.5 11v16.5" />
    <ellipse cx="24" cy="29.5" rx="16" ry="4.4" />
    {/* The band, following the crown's curve rather than ruled across it. */}
    <path d="M15.5 22.5c2.6 1.4 5.4 2 8.5 2s5.9-.6 8.5-2" />
    <path d="M15.5 26c2.6 1.4 5.4 2 8.5 2s5.9-.6 8.5-2" />
  </svg>
);

/* CIRCUS DRUM — the big one, on its side, laced with chevrons. */
export const CircusDrum: React.FC<MotifProps> = ({ className = '', weight = 1.5 }) => (
  <svg {...frame(weight)} className={className} aria-hidden="true">
    <ellipse cx="24" cy="15" rx="15" ry="4.6" />
    <path d="M9 15v18M39 15v18" />
    <path d="M9 33c0 2.5 6.7 4.6 15 4.6s15-2.1 15-4.6" />
    {/* The lacing, zig-zagged between the two hoops. */}
    <path d="M11 19.5 17 30.5 23 19.5 29 30.5 35 19.5 38.6 27" />
    {/* Sticks, crossed over the head. */}
    <path d="m16 11 13-6M19 5l13 6" />
  </svg>
);

/* CANDY CANE — hooked, and striped along its length. */
export const CandyCane: React.FC<MotifProps> = ({ className = '', weight = 1.5 }) => (
  <svg {...frame(weight)} className={className} aria-hidden="true">
    <path d="M15 43V19a9 9 0 0 1 18 0v4.5" />
    <path d="M21 43V19a3 3 0 0 1 6 0v4.5" />
    <path d="M15 43h6" />
    <path d="M33 23.5h-6" />
    {/* The stripes. */}
    <path d="m15 38 6-3.4M15 31l6-3.4M15 24l6-3.4M16.6 17.4l5-3.4M21.6 12.6l4.6-2.6" />
  </svg>
);

/* PRIZE BELL — the one at the top of the high striker. */
export const PrizeBell: React.FC<MotifProps> = ({ className = '', weight = 1.5 }) => (
  <svg {...frame(weight)} className={className} aria-hidden="true">
    <path d="M11 31c0-9 5.8-16 13-16s13 7 13 16" />
    <path d="M8 31h32" />
    <path d="M24 15v-3" />
    <circle cx="24" cy="9.5" r="2.6" />
    <path d="M24 31v4" />
    <circle cx="24" cy="37.5" r="2.6" />
    {/* Two rings of sound. */}
    <path d="M41 20a5 5 0 0 1 0 6M7 20a5 5 0 0 0 0 6" />
  </svg>
);

/* STRONGMAN'S BELL — the round-ended barbell from the strength act. */
export const StrongmanWeight: React.FC<MotifProps> = ({ className = '', weight = 1.5 }) => (
  <svg {...frame(weight)} className={className} aria-hidden="true">
    {/* Smaller spheres on a longer bar. Big discs on a short one read as a
        pair of spectacles, not as a weight. */}
    <circle cx="10" cy="24" r="6.4" />
    <circle cx="38" cy="24" r="6.4" />
    <path d="M16.4 24h15.2" />
    {/* Collars, where the bar meets each sphere. */}
    <path d="M19 21v6M29 21v6" />
  </svg>
);

/* JUGGLING CLUBS — two, crossed, the way they are set down between turns. */
export const JugglingClubs: React.FC<MotifProps> = ({ className = '', weight = 1.5 }) => {
  /* A club is a knob, a narrow neck, then a body that swells and rounds off.
     Drawn as one even oval it reads as a leaf, which is what the first pass
     did — the neck is the whole silhouette. */
  const club = (
    <>
      <circle cx="24" cy="7.6" r="2.2" />
      <path d="M22.4 9.8 21.6 19c-2.2 2.8-3.4 6.6-3.4 10.4 0 5.2 2.6 9.2 5.8 9.2s5.8-4 5.8-9.2c0-3.8-1.2-7.6-3.4-10.4l-.8-9.2Z" />
    </>
  );
  return (
    <svg {...frame(weight)} className={className} aria-hidden="true">
      <g transform="rotate(-25 24 30) translate(-5.5 -1)">{club}</g>
      <g transform="rotate(25 24 30) translate(5.5 -1)">{club}</g>
    </svg>
  );
};

/* STREAMERS — two lengths of curling paper ribbon. */
export const Streamers: React.FC<MotifProps> = ({ className = '', weight = 1.5 }) => (
  <svg {...frame(weight)} className={className} aria-hidden="true">
    <path d="M4 13c5-6 9 4 14-1s9 4 14-1 8 3 12-1" />
    <path d="M4 26c5-6 9 4 14-1s9 4 14-1 8 3 12-1" />
    <path d="M8 39c5-6 9 4 14-1s9 4 14-1" />
  </svg>
);

/* ---------------------------------------------------------------------------
   OIL LAMP — the kuthuvilakku, lit for the Paalu Kozhukattai. The one motif
   here that is not the fair's: the ceremony is the reason the evening starts,
   and a ticket stub or a rosette would have been a shrug in its place.
   ------------------------------------------------------------------------ */
export const OilLamp: React.FC<MotifProps> = ({ className = '', weight = 1.5 }) => (
  <svg {...frame(weight)} className={className} aria-hidden="true">
    {/* Flame, drawn to the same teardrop as the candle on the cake. */}
    <path d="M24 5c2.1 2.2 3.1 3.9 3.1 5.3A3.1 3.1 0 0 1 24 13.4a3.1 3.1 0 0 1-3.1-3.1C20.9 8.9 21.9 7.2 24 5Z" />
    <path d="M24 13.6v6.9" />
    {/* The bowl, tipped to a spout at either side. */}
    <path d="M10.5 20.5h27l-2.3 3.6c-1.4 2.2-3.8 3.5-6.4 3.5h-9.6c-2.6 0-5-1.3-6.4-3.5l-2.3-3.6Z" />
    {/* Stem and flared foot. */}
    <path d="M24 27.8v5.4" />
    <path d="M16.5 39.5c0-3.2 3.8-3.3 3.8-6.3h7.4c0 3 3.8 3.1 3.8 6.3h-15Z" />
    <path d="M13.5 42.5h21" />
  </svg>
);

/* ---------------------------------------------------------------------------
   GRAND ENTRANCE — the fairground's lit archway, with the star over its
   crown, for the moment the birthday girl is walked in. Two arches and a
   sparkle: at this size a drawn curtain reads as a scribble, but an opening
   with something shining over it reads as a way in.
   ------------------------------------------------------------------------ */
export const GrandEntrance: React.FC<MotifProps> = ({ className = '', weight = 1.5 }) => (
  <svg {...frame(weight)} className={className} aria-hidden="true">
    {/* The star over the crown — the Sparkle's four points, cut down to clear
        the arch beneath it. */}
    <path d="M24 2c.4 3.1 2.4 5.1 5.5 5.5-3.1.4-5.1 2.4-5.5 5.5-.4-3.1-2.4-5.1-5.5-5.5 3.1-.4 5.1-2.4 5.5-5.5Z" />
    {/* Outer arch, standing on the ground line. */}
    <path d="M9.5 42.5V28.5a14.5 14.5 0 0 1 29 0v14" />
    {/* The opening itself. */}
    <path d="M16.5 42.5V28.5a7.5 7.5 0 0 1 15 0v14" />
    {/* Four lamps set on the arch itself, the way the gate is lit. Drawn as
        real circles rather than zero-length dashes, which depend on the
        renderer honouring round caps to show up at all. */}
    <circle cx="12.6" cy="19.5" r="1" />
    <circle cx="18" cy="15.3" r="1" />
    <circle cx="30" cy="15.3" r="1" />
    <circle cx="35.4" cy="19.5" r="1" />
    <path d="M6 42.5h36" />
  </svg>
);

/* ---------------------------------------------------------------------------
   MIRROR BALL — hung over the dance floor for the DJ's hours.
   ------------------------------------------------------------------------ */
export const MirrorBall: React.FC<MotifProps> = ({ className = '', weight = 1.5 }) => (
  <svg {...frame(weight)} className={className} aria-hidden="true">
    {/* The drop it hangs on. */}
    <path d="M24 4v8.4" />
    <circle cx="24" cy="24" r="11.6" />
    {/* Facets: three chords across, three meridians down. */}
    <path d="M13.4 19.3h21.2M12.4 24h23.2M13.4 28.7h21.2" />
    <path d="M24 12.4v23.2" />
    <path d="M24 12.4c-3.5 3.2-5.4 7.1-5.4 11.6s1.9 8.4 5.4 11.6" />
    <path d="M24 12.4c3.5 3.2 5.4 7.1 5.4 11.6s-1.9 8.4-5.4 11.6" />
    {/* Glints thrown off it. */}
    <path d="m6.5 15.5 3.2 1.8M41.5 15.5l-3.2 1.8M7 33l3-1.9M41 33l-3-1.9" />
  </svg>
);

/* ---------------------------------------------------------------------------
   The running order's icons, keyed by the names the event data already uses.
   A name with no drawing falls back to the ride itself.
   ------------------------------------------------------------------------ */
export const TIMELINE_MOTIFS: Record<string, React.FC<MotifProps>> = {
  /* Names that say what gets drawn. */
  Ticket: TicketStub,
  Lamp: OilLamp,
  Entrance: GrandEntrance,
  Carousel: Carousel,
  Drum: CircusDrum,
  Cake: Cake,
  Feast: Feast,
  MirrorBall: MirrorBall,
  Balloons: Balloons,
  TopHat: TopHat,
  CottonCandy: CottonCandy,
  Popcorn: Popcorn,
  BigTop: BigTop,
  Wheel: FerrisWheel,

  /* The lucide names the first draft of the running order was written in,
     kept so any older copy of the event data still draws something. */
  Sparkles: CottonCandy,
  FerrisWheel: Carousel,
  UtensilsCrossed: Feast,
  HeartHandshake: Balloons
};

export const TimelineMotif: React.FC<{ name?: string; className?: string }> = ({
  name,
  className = ''
}) => {
  const Motif = (name && TIMELINE_MOTIFS[name]) || Carousel;
  return <Motif className={className} weight={1.4} />;
};
