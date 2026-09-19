import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryPhoto } from '../types';
import { PhotoLightbox } from './PhotoLightbox';
import { SectionHeading } from './SectionHeading';
import { SparkleEffect } from './SparkleEffect';
import { HexRow } from './CarnivalMotifs';
import { Reveal, RevealGroup, RevealItem } from './Reveal';

interface PhotoGalleryProps {
  photos: GalleryPhoto[];
  childName: string;
}

/**
 * THE PICTURE ROOM — the sideshow's photo wall.
 *
 * One set of cards, two behaviours, no duplicated markup: below 640px the row
 * is a scroll-snap rail you swipe with your thumb; from 640px up the same
 * children lay out as a grid, two across and then four. The rail is native
 * overflow scrolling rather than a carousel library — momentum, snapping and
 * keyboard scrolling all come free and correct, and the arrows and hex dots
 * only have to drive `scrollTo`.
 *
 * Every photograph is cropped to the same 4:5 card. The set mixes portrait and
 * landscape, so each one carries a `focus` (its object-position) that says
 * where the child actually is — a centre crop would cut the wide frames in
 * half. Frames are cherry with a gold hairline inside, per the fair's palette.
 */
export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, childName }) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [railIndex, setRailIndex] = useState(0);
  const railRef = useRef<HTMLElement>(null);
  const still = useReducedMotion();

  /* One card plus one gap — the distance the rail travels between photographs.
     Measured rather than assumed, because the card is sized in vw. */
  const strideOf = (rail: HTMLElement) => {
    const card = rail.firstElementChild as HTMLElement | null;
    if (!card) return 0;
    return card.offsetWidth + parseFloat(getComputedStyle(rail).columnGap || '0');
  };

  /* Which card the rail has settled on, read off scroll position rather than
     tracked in state — the user's thumb is the source of truth, not us. */
  const onRailScroll = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const stride = strideOf(rail);
    if (stride > 0) setRailIndex(Math.round(rail.scrollLeft / stride));
  }, []);

  /* Scroll by whole strides and let scroll-snap land the card exactly; driving
     it off `offsetLeft` instead would fight the rail's own scroll padding. */
  const scrollToCard = useCallback(
    (index: number) => {
      const rail = railRef.current;
      if (!rail) return;
      rail.scrollTo({ left: index * strideOf(rail), behavior: still ? 'auto' : 'smooth' });
    },
    [still]
  );

  /* The rail only exists below the sm breakpoint; past it the same list is a
     grid and any leftover scroll offset would show as a shifted first card. */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const mq = window.matchMedia('(min-width: 640px)');
    const reset = () => {
      if (mq.matches) {
        rail.scrollLeft = 0;
        setRailIndex(0);
      }
    };
    mq.addEventListener('change', reset);
    return () => mq.removeEventListener('change', reset);
  }, []);

  if (!photos || photos.length === 0) return null;

  return (
    <section id="gallery" className="tier-ink section">
      {/* Lamps somewhere off-frame. The only glow allowed in a flat system is
          an actual light source. */}
      <SparkleEffect density={9} theme="cherry-gold" />

      <div className="measure relative">
        <SectionHeading
          kicker="Sideshow"
          title="Three Years of Her"
          lede={`Glimpses of ${childName} — the laughing, the mischief, the sticky fingers.`}
        />
      </div>

      {/* ------------------------------------------------------------------
          The wall. `-mx` + `px` on the rail lets the cards run to the screen
          edge on a phone while still starting flush with the measure; the
          section's own `overflow: hidden` keeps the page from scrolling
          sideways. At sm the padding and negative margin both go away.
          ------------------------------------------------------------------ */}
      <div className="measure relative mt-14 sm:mt-16">
        <RevealGroup
          as="ul"
          ref={railRef}
          onScroll={onRailScroll}
          className="photo-rail -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2
                     sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-7 sm:gap-y-12 sm:overflow-visible sm:px-0
                     lg:grid-cols-4"
          beat={0.1}
          amount={0.1}
          role="region"
          aria-label={`Photographs of ${childName}`}
          aria-roledescription="carousel"
        >
          {photos.map((photo, idx) => (
            <RevealItem
              as="li"
              key={photo.id}
              className="w-[76vw] max-w-[320px] shrink-0 snap-center sm:w-auto sm:max-w-none"
              y={26}
              duration={0.85}
            >
              <button
                type="button"
                onClick={() => setActivePhotoIndex(idx)}
                className="photo-card group block w-full cursor-pointer text-left"
                aria-label={`Open ${photo.title} full size`}
              >
                <span className="photo-card-frame">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    style={{ objectPosition: photo.focus }}
                    loading="lazy"
                    decoding="async"
                    sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 76vw"
                  />
                </span>
              </button>

              <h3 className="display-sm mt-6 flex min-h-[2.4em] items-start text-gold-pale sm:justify-center sm:text-center">
                {photo.title}
              </h3>
              <p className="copy mt-2 text-chalk/60 sm:text-center">{photo.caption}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* --------------------------------------------------------------
            Rail controls — phone only. The grid needs none of this, so it
            never renders past sm.
            -------------------------------------------------------------- */}
        <Reveal className="mt-8 flex items-center justify-between sm:hidden" y={0} duration={0.6}>
          <button
            type="button"
            onClick={() => scrollToCard(Math.max(0, railIndex - 1))}
            disabled={railIndex === 0}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/45 text-gold-pale transition-opacity disabled:opacity-30"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>

          <HexRow count={photos.length} active={railIndex} className="text-gold-bright/55" />

          <button
            type="button"
            onClick={() => scrollToCard(Math.min(photos.length - 1, railIndex + 1))}
            disabled={railIndex === photos.length - 1}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/45 text-gold-pale transition-opacity disabled:opacity-30"
            aria-label="Next photo"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </Reveal>
      </div>

      <PhotoLightbox
        photos={photos}
        currentIndex={activePhotoIndex}
        onClose={() => setActivePhotoIndex(null)}
        onNavigate={(newIndex) => setActivePhotoIndex(newIndex)}
      />
    </section>
  );
};
