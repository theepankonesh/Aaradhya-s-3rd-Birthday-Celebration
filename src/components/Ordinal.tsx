import React from 'react';

/**
 * THE ORDINAL — 3ʳᵈ, never 3RD.
 *
 * A printer sets an ordinal with the figure at full size and the suffix
 * raised and reduced beside it, and a fairground bill is the last place that
 * rule would be broken. Everything on this page that prints one goes through
 * here, so the nav's mark, the hero's tagline and anything the customiser is
 * given later all set it the same way.
 *
 * The suffix is a real `<sup>`, so it is still read as "third" aloud; the
 * size and lift come from `.ordinal` in the stylesheet, in `em`, so the mark
 * scales with whatever type it lands in.
 */

/** st / nd / rd / th, with the teens taken care of. */
export function ordinalSuffix(n: number): string {
  const teens = n % 100;
  if (teens > 10 && teens < 14) return 'th';
  return ['th', 'st', 'nd', 'rd'][Math.min(n % 10, 4) % 4];
}

export const Ordinal: React.FC<{ value: number; className?: string }> = ({
  value,
  className = ''
}) => (
  <span className={`ordinal ${className}`}>
    {value}
    <sup>{ordinalSuffix(value)}</sup>
  </span>
);

/* Matches "3rd", "1st", "22nd" anywhere in a line of copy. */
const ORDINAL_RE = /(\d+)(st|nd|rd|th)\b/gi;

/**
 * Rewrites every ordinal inside a plain string. The strings this page prints
 * come out of editable event data — "3rd Birthday Celebration" is a field a
 * parent can change — so the ordinal has to be found in the text rather than
 * hard-coded at the call site.
 */
export function withOrdinals(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const re = new RegExp(ORDINAL_RE.source, 'gi');
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(
      <span className="ordinal" key={`${match.index}-${match[0]}`}>
        {match[1]}
        <sup>{match[2]}</sup>
      </span>
    );
    last = match.index + match[0].length;
  }

  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

/** The same thing as an element, for dropping straight into JSX. */
export const OrdinalText: React.FC<{ children: string; className?: string }> = ({
  children,
  className = ''
}) => <span className={className}>{withOrdinals(children)}</span>;
