import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { invitationAssets } from '../data/eventData';

interface EnvelopeOpeningProps {
  /** Fires as the hand-off begins, so the invitation can rise underneath. */
  onReveal: () => void;
  /** Fires once this screen has finished dissolving and can be unmounted. */
  onDismissed: () => void;
  childName: string;
}

/**
 * The clip runs 10.24s — one continuous opening. Measured frame to frame, the
 * motion starts around 0.5s, builds through the seal breaking near 2s, peaks
 * while the flap climbs between 5s and 8.5s, then eases out from 9s to the end.
 * The card never comes out — the hand-off takes over first.
 *
 * We do not wait for any of that. HANDOFF_AT cuts at 4s, a little past the seal
 * breaking and into the flap's climb: the envelope has visibly opened, the light
 * is spilling, and the eye follows the bloom out of the screen. Because the cut
 * lands mid-clip the video never runs out, so nothing freezes behind the fade —
 * it is still moving as the screen goes.
 *
 * The hand-off is driven by requestAnimationFrame rather than the `timeupdate`
 * event. `timeupdate` only fires about every 267ms, and its phase shifts from
 * load to load depending on how long the first frames take to decode — so the
 * tick nearest 1.42s landed at 1.40 on one load and 1.67 on the next. When it
 * landed late the clip reached its final frame first and the flap sat frozen
 * until the dissolve caught up, and the still below crossfaded in after the
 * video had already stopped. Polling per frame keeps the hand-off inside ~16ms
 * of the mark on every load.
 */
const HANDOFF_AT = 4.0;
/** Safety net if the video never reports progress at all. Must clear the time
 *  the clip needs to reach HANDOFF_AT, or it fires early and cuts the opening
 *  short — 4s of clip, plus slack for a slow first decode. */
const WATCHDOG_MS = 6000;

type Stage = 'sealed' | 'opening' | 'handoff';

/* The stage keeps the 1588:1170 shape the held PNG and the hand-off still were
   both cut to — it is the envelope's box, not any one clip's frame, so changing
   the clip does not move it.

   The clip is squared up at 720x720 and frames the envelope large. Measured on
   the sealed frame, its envelope body sits at 633x475 centred at 50.21% /
   49.65%; that body is what has to land on the stage, so the clip is scaled
   until those 633px fill the stage width and offset until that centre is the
   stage's centre. Width is what gets matched — the body's own 1.333 is a shade
   flatter than the stage's 1.357, so it overfills the height by about 2%, split
   top and bottom. Same tolerance the held PNG already runs at.

   These four numbers all derive from that one measurement — changing the clip
   means re-measuring them together. Keep the element box on the clip's own
   aspect (113.7 / 154.3 x 1.357 = 1.000, square, as the clip is) so the
   `object-contain` on the element is a no-op and never letterboxes. */
const CONTENT_ASPECT = '1588 / 1170';
/** Clip width as a share of the stage: 720 / 633. */
const CLIP_SCALE_X = '113.7%';
/** Clip height as a share of the stage: (720/633) x 1.357, keeping it square. */
const CLIP_SCALE_Y = '154.3%';
/** Offsets that bring the envelope's centre onto the stage's centre. */
const CLIP_OFFSET_X = '-7.1%';
const CLIP_OFFSET_Y = '-26.6%';

/* The held state is a true-alpha PNG rather than a frame lifted off the clip:
   it carries no matte to screen away, so it keeps the envelope's own cream and
   crimson instead of the lifted blacks screening produces. Its envelope sits at
   578x431 inside a 703x768 canvas — aspect 1.341 against the stage's 1.357,
   close enough that matching the widths lands the shape within a percent. Same
   idea as the clip numbers above: scale until the envelope box fills the stage,
   then offset the transparent padding back off it. */
const HELD_SCALE_X = '121.6%';
const HELD_SCALE_Y = '180.3%';
const HELD_OFFSET_X = '-12.1%';
const HELD_OFFSET_Y = '-39.0%';

/** Width of the envelope stage; height follows the envelope's own 1588:1170 box. */
const STAGE_WIDTH = 'min(88vw, 68vh * 1.357, 620px)';

export const EnvelopeOpening: React.FC<EnvelopeOpeningProps> = ({ onReveal, onDismissed, childName }) => {
  const [stage, setStage] = useState<Stage>('sealed');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [videoUsable, setVideoUsable] = useState(true);

  /** How much clip is left when the hand-off fires; the still waits that long.
      Cutting at 4s leaves ~6.2s of clip, far longer than the dissolve, so the
      still simply never has to appear — the video is still running underneath.
      The small default only covers the degraded paths, where there is no clip
      to measure and the still is all there is. */
  const [stillDelay, setStillDelay] = useState(0.2);

  const videoRef = useRef<HTMLVideoElement>(null);
  const handedOffRef = useRef(false);
  const timers = useRef<number[]>([]);
  const frameRef = useRef(0);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  useEffect(
    () => () => {
      timers.current.forEach(window.clearTimeout);
      cancelAnimationFrame(frameRef.current);
    },
    []
  );

  /* A reload can hand back a media element that another page life left part-way
     through — a non-zero currentTime, or one already ended. Either would start
     the clip mid-flight on the first tap. Wind it back before it is ever seen. */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const rewind = () => {
      if (handedOffRef.current) return;
      try {
        if (video.currentTime > 0) video.currentTime = 0;
      } catch {
        /* Seeking before metadata lands throws in some browsers; the
           loadedmetadata listener below runs the same reset once it is safe. */
      }
    };
    rewind();
    video.addEventListener('loadedmetadata', rewind);
    window.addEventListener('pageshow', rewind);
    return () => {
      video.removeEventListener('loadedmetadata', rewind);
      window.removeEventListener('pageshow', rewind);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Idempotent — the frame poll, `ended` and the watchdog all race for this.
  const handOff = useCallback(() => {
    if (handedOffRef.current) return;
    handedOffRef.current = true;
    cancelAnimationFrame(frameRef.current);

    /* Hold the still back by however much clip is actually left, so it takes
       over exactly as the video runs out instead of on a fixed guess. */
    const video = videoRef.current;
    if (video && Number.isFinite(video.duration)) {
      setStillDelay(Math.max(0, video.duration - video.currentTime));
    }

    setStage('handoff');
    onReveal();
    later(onDismissed, 620);
  }, [onReveal, onDismissed]);

  /** Watch the clip a frame at a time and hand off the instant it passes the mark. */
  const watchClip = useCallback(() => {
    const tick = () => {
      const video = videoRef.current;
      if (!video || handedOffRef.current) return;
      if (video.currentTime >= HANDOFF_AT || video.ended) {
        handOff();
        return;
      }
      frameRef.current = requestAnimationFrame(tick);
    };
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(tick);
  }, [handOff]);

  const handleOpen = () => {
    if (stage !== 'sealed') return;
    setStage('opening');

    if (reducedMotion || !videoUsable) {
      later(handOff, 600);
      return;
    }

    const video = videoRef.current;
    if (!video) {
      later(handOff, 600);
      return;
    }

    // Always start from the first frame, whatever state the element came back in.
    try {
      video.currentTime = 0;
    } catch {
      /* Metadata not in yet — playback starts at 0 anyway. */
    }

    const played = video.play();
    if (played) {
      played.catch(() => {
        // Autoplay refused or the codec is unsupported: fall back to the stills.
        setVideoUsable(false);
        later(handOff, 600);
      });
    }
    watchClip();
    later(handOff, WATCHDOG_MS);
  };

  const showStills = reducedMotion || !videoUsable;
  const lit = stage !== 'sealed';

  /* No blend mode here: the PNG carries its own alpha, so it composites
     straight over the stage. Screening it would lift its shadows the way it is
     meant to lift a black matte away. */
  const heldPlacement: React.CSSProperties = {
    width: HELD_SCALE_X,
    height: HELD_SCALE_Y,
    left: HELD_OFFSET_X,
    top: HELD_OFFSET_Y,
    maxWidth: 'none'
  };

  return (
    <motion.div
      id="envelope-opening-screen"
      role="region"
      aria-label={`Sealed invitation to ${childName}’s third birthday`}
      className="tier-ink fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-ink px-5 py-8 select-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: stage === 'handoff' ? 0 : 1 }}
      transition={{
        duration: 0.45,
        ease: [0.65, 0, 0.35, 1],
        // Just enough of a beat for the bloom to register before the screen goes.
        delay: stage === 'handoff' ? 0.08 : 0
      }}
    >
      {/* The dark stage the clip's black matte disappears into. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(58% 44% at 50% 47%, #0B0205 0%, #2A040C 38%, rgba(210, 30, 60, 0.28) 78%, rgba(74, 7, 19, 0) 100%)'
        }}
      />

      {/* Light spilling from the envelope as the flap lifts. This carries the eye
          through the hand-off, so the clip never reads as stopping. */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: stage === 'handoff' ? 1 : 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{
          background:
            'radial-gradient(46% 34% at 50% 44%, rgba(255, 246, 208, 0.94) 0%, rgba(239, 201, 96, 0.55) 26%, rgba(210, 30, 60, 0.20) 52%, rgba(74, 7, 19, 0) 76%)'
        }}
      />

      {/* Addressed like the front of a real envelope. It sits in the clear band
          the flap swings up into, so the words are displaced by the opening. */}
      <motion.header
        className="pointer-events-none relative z-10 text-center"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: lit ? 0 : 1, y: lit ? -10 : 0 }}
        transition={{ duration: lit ? 0.45 : 1.2, delay: lit ? 0 : 0.3 }}
      >
        <p className="label text-gold-bright/85">One admission to</p>
        <h1 className="display-title mt-5 text-gold-pale">{childName}</h1>
        <p className="label mt-5 text-chalk/55">Third Birthday · The Carnival</p>
      </motion.header>

      {/* The envelope is the tap target. No z-index and no transform on this
          wrapper: either would open a stacking context and cut the clip off from
          the backdrop it blends with. The scale lives on the media itself. */}
      <div
        role="button"
        tabIndex={stage === 'sealed' ? 0 : -1}
        aria-label="Break the wax seal and open the invitation"
        onClick={handleOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpen();
          }
        }}
        className={`relative flex shrink-0 items-center justify-center rounded-3xl ${
          stage === 'sealed' ? 'cursor-pointer' : 'cursor-default'
        }`}
        style={{
          width: STAGE_WIDTH,
          aspectRatio: CONTENT_ASPECT,
          touchAction: 'manipulation',
          // The blown-up clip overhangs the stage on every side; keep it clipped
          // to the envelope box so no neighbouring frame content shows.
          overflow: 'hidden',
          /* The old pull-up was sized for a tall portrait stage, where the
             envelope sat well inside the box. This stage is cropped to the
             envelope itself, so its top edge is the envelope's top edge — pulling
             up now drives it straight through the address above. */
          marginTop: `calc(${STAGE_WIDTH} * 0.02)`
        }}
      >
        {showStills ? (
          stage === 'sealed' ? (
            <motion.img
              src={invitationAssets.envelopeSealed}
              alt="Cream and gold envelope closed with a crimson wax seal monogrammed A"
              className="absolute"
              style={heldPlacement}
              transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
              loading="eager"
            />
          ) : (
            <motion.img
              src={invitationAssets.envelopeHalfOpen}
              alt="The envelope with its flap lifted, the wax seal riding on it and the gold lining just showing"
              className="h-full w-full object-contain"
              style={{ mixBlendMode: 'screen' }}
              animate={{ scale: stage === 'handoff' ? 1.1 : 1 }}
              transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
              loading="eager"
            />
          )
        ) : (
          <>
            {/* The held envelope, carried by the alpha PNG rather than the clip's
                first frame, so the shot waiting under the tap is the clean one.
                It hands over as the clip starts: a beat of overlap keeps the two
                renders from cutting against each other. */}
            <motion.img
              src={invitationAssets.envelopeSealed}
              alt="Cream and gold envelope closed with a crimson wax seal monogrammed A"
              className="pointer-events-none absolute z-10"
              style={heldPlacement}
              animate={{ opacity: stage === 'sealed' ? 1 : 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              loading="eager"
            />
            {/* Screened over the dark stage, the clip's black matte drops out and
                the envelope keeps the warmth of the room behind it. */}
            <motion.video
              ref={videoRef}
              className="absolute object-contain"
              style={{
                mixBlendMode: 'screen',
                width: CLIP_SCALE_X,
                height: CLIP_SCALE_Y,
                left: CLIP_OFFSET_X,
                top: CLIP_OFFSET_Y,
                maxWidth: 'none'
              }}
              src={invitationAssets.envelopeVideo}
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
              /* The frame poll owns the timing; `ended` is only the backstop for
                 a clip that somehow runs past the mark without being seen. */
              onEnded={handOff}
              onError={() => setVideoUsable(false)}
              // The camera keeps pushing in after the clip's own motion ends, so
              // its last frame is never seen as a freeze.
              animate={{ scale: stage === 'handoff' ? 1.12 : 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* Standby for the degraded paths: the frame at the cut, held ready in
                case there is no clip running to carry the dissolve. */}
            <motion.img
              src={invitationAssets.envelopeHalfOpen}
              alt="The envelope with its flap lifted, the wax seal riding on it and the gold lining just showing"
              aria-hidden={stage !== 'handoff'}
              className="pointer-events-none absolute inset-0 h-full w-full object-contain"
              style={{ mixBlendMode: 'screen' }}
              animate={{
                opacity: stage === 'handoff' ? 1 : 0,
                scale: stage === 'handoff' ? 1.12 : 1
              }}
              transition={{
                opacity: { duration: 0.25, delay: stillDelay },
                scale: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
              }}
            />
          </>
        )}
      </div>

      <motion.div
        className="relative z-10 mt-6 flex flex-col items-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: lit ? 0 : 1, y: lit ? 8 : 0 }}
        transition={{ duration: lit ? 0.4 : 0.9, delay: lit ? 0 : 0.55 }}
      >
        <button
          id="tap-to-open-button"
          type="button"
          onClick={handleOpen}
          disabled={stage !== 'sealed'}
          tabIndex={-1}
          aria-hidden="true"
          className="btn btn-outline"
        >
          Break the seal
        </button>
      </motion.div>
    </motion.div>
  );
};
