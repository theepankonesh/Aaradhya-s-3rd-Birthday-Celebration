/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { initialEventData } from './data/eventData';
import { initSmoothScroll, scrollToTarget } from './lib/smoothScroll';
import { EventData, RSVPRecord } from './types';
import { EnvelopeOpening } from './components/EnvelopeOpening';
import { FloatingNavigation } from './components/FloatingNavigation';
import { HeroInvitation } from './components/HeroInvitation';
import { CarouselBand } from './components/CarouselBand';
import { EventDetails } from './components/EventDetails';
import { BirthdayTimeline } from './components/BirthdayTimeline';
import { PhotoGallery } from './components/PhotoGallery';
import { RSVPSection } from './components/RSVPSection';
import { RSVPModal } from './components/RSVPModal';
import { MusicPlayer } from './components/MusicPlayer';
import { ConfettiEffect } from './components/ConfettiEffect';
import { Footer } from './components/Footer';
import { EditEventModal } from './components/EditEventModal';

export default function App() {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [envelopeMounted, setEnvelopeMounted] = useState(true);
  const [eventData, setEventData] = useState<EventData>(initialEventData);
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [musicTriggered, setMusicTriggered] = useState(false);

  // The card is out of the envelope: fade the invitation up underneath while the
  // envelope screen is still dissolving, then unmount the screen.
  const handleEnvelopeRevealed = () => {
    setEnvelopeOpened(true);
    setMusicTriggered(true);
  };

  const handleRSVPSubmitted = (record: RSVPRecord) => {
    if (record.attending === 'yes') {
      setShowConfetti(true);
    }
  };

  /* The page scrolls on Lenis once the card is out of the envelope — there is
     nothing to scroll before that, and starting the loop early would only run
     a rAF against a page one screen tall. It honours prefers-reduced-motion
     itself, tracking the wheel one to one when that is set. */
  useEffect(() => {
    if (!envelopeOpened) return;
    return initSmoothScroll();
  }, [envelopeOpened]);

  const handleScrollToDetails = () => scrollToTarget('#details');

  /* The page is a stack of full-bleed rooms that alternate between the light
     tier and the dark one with a hard cut at every join:

       hero      putty   the wordmark, cropped at the edges
       carousel  bone    the one full-bleed image, with a dark card on it
       details   ink     three admission tickets in a dark room
       timeline  putty   the running order
       gallery   ink     circular crops, the way the reference hangs pictures
       rsvp      putty   the ticket booth
       footer    chalk   the lightest tier closes the page

     Nothing sets a background but the rooms themselves, so no wrapper here
     carries colour or a max width. */

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-putty text-ink selection:bg-cherry selection:text-paper">
      {/* 1. Envelope Opening Screen (shown first until tapped) */}
      {envelopeMounted && (
        <EnvelopeOpening
          onReveal={handleEnvelopeRevealed}
          onDismissed={() => setEnvelopeMounted(false)}
          childName={eventData.childName}
        />
      )}

      {/* Layering, so the fixed pieces stop colliding:
          10 page · 30 drawer scrim · 40 nav + player · 50 modals ·
          60 lightbox · 70 confetti (it has to land in front of the modal it
          is celebrating) · 50 envelope, which owns the screen alone. */}

      <ConfettiEffect active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Main Experience (mounted and displayed once opened) */}
      {envelopeOpened && (
        <div className="relative z-10 animate-fade-in">
          <FloatingNavigation
            onOpenRSVP={() => setIsRSVPOpen(true)}
            onOpenEdit={() => setIsEditOpen(true)}
          />

          <HeroInvitation
            eventData={eventData}
            onOpenRSVP={() => setIsRSVPOpen(true)}
            onScrollToDetails={handleScrollToDetails}
          />

          <CarouselBand eventData={eventData} />

          <EventDetails eventData={eventData} />

          <BirthdayTimeline timeline={eventData.timeline} />

          <PhotoGallery photos={eventData.photos} childName={eventData.childName} />

          <RSVPSection
            childName={eventData.childName}
            onOpenRSVP={() => setIsRSVPOpen(true)}
          />

          <Footer childName={eventData.childName} />

          <MusicPlayer autoPlayTriggered={musicTriggered} />

          <RSVPModal
            isOpen={isRSVPOpen}
            onClose={() => setIsRSVPOpen(false)}
            childName={eventData.childName}
            onRSVPSubmitted={handleRSVPSubmitted}
          />

          <EditEventModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            eventData={eventData}
            onSave={(updated) => setEventData(updated)}
          />
        </div>
      )}
    </div>
  );
}
