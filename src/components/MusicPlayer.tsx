import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, Disc } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { invitationAssets } from '../data/eventData';

interface MusicPlayerProps {
  autoPlayTriggered?: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ autoPlayTriggered = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const [currentTime, setCurrentTime] = useState(0);
  /* 0 until the file reports its own length — a hardcoded guess here shows the
     guest a wrong running time for the second before metadata lands. */
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize and handle auto-play after envelope open user interaction
  useEffect(() => {
    const audio = new Audio(invitationAssets.music);
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      // Loop
      audio.currentTime = 0;
      audio.play().catch(() => {});
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, []);

  // When autoPlayTriggered fires after envelope tap
  useEffect(() => {
    if (autoPlayTriggered && audioRef.current && !isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Autoplay blocked by browser policy — the pill's play button is the
            // guest's way in, so this is an expected outcome, not an error.
            setIsPlaying(false);
          });
      }
    }
  }, [autoPlayTriggered]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Playback error:', err);
      });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioRef.current.muted = nextMuted;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      if (newVol === 0) {
        setIsMuted(true);
        audioRef.current.muted = true;
      } else if (isMuted) {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none">
      {/* Expanded Control Box */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id="music-player-panel"
            className="tier-ink mb-3 w-72 rounded-[9px] border border-gold/35 bg-ink p-5 text-chalk"
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            {/* Header info */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 text-gold-bright ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }}>
                <Disc className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="overflow-hidden">
                <h4 className="label truncate text-gold-pale">
                  Under the Sea
                </h4>
                <p className="copy-sm mt-1 text-chalk/55">
                  Music box version
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <input
                type="range"
                min={0}
                max={duration || 15}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                className="h-1 w-full cursor-pointer appearance-none rounded-full bg-chalk/20 accent-gold-bright"
                aria-label="Audio progress bar"
              />
              <div className="label mt-2 flex justify-between text-chalk/45">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-gold-bright text-ink transition-colors hover:bg-gold-pale"
                  aria-label={isPlaying ? "Pause music" : "Play music"}
                >
                  {isPlaying ? <Pause className="h-4 w-4 fill-current" aria-hidden="true" /> : <Play className="ml-0.5 h-4 w-4 fill-current" aria-hidden="true" />}
                </button>

                <button
                  onClick={toggleMute}
                  className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-chalk transition-colors hover:text-gold-bright"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="h-4 w-4 text-cherry" aria-hidden="true" /> : <Volume2 className="h-4 w-4" aria-hidden="true" />}
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-1.5 w-24">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="h-1 w-full cursor-pointer appearance-none rounded-full bg-chalk/20 accent-gold-bright"
                  aria-label="Volume slider"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Mini Pill. The expand toggle and the play toggle are siblings
          inside the pill, not nested buttons — a button inside a button is
          invalid, and browsers resolve it by breaking the outer one. */}
      <div
        className={`flex items-center gap-1 rounded-full border py-1 pr-1 pl-3.5 transition-colors ${
          isPlaying
            ? 'border-gold-bright bg-ink text-gold-pale'
            : 'border-gold/45 bg-ink text-gold-bright'
        }`}
      >
        <button
          id="floating-music-toggle"
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex min-h-[44px] cursor-pointer items-center gap-2 pr-1 transition-opacity hover:opacity-80"
          aria-label={isExpanded ? 'Collapse music player' : 'Expand music player'}
          aria-expanded={isExpanded}
          aria-controls="music-player-panel"
        >
          {/* Animated Equalizer Waveform bars */}
          {isPlaying ? (
            <span className="mr-0.5 inline-flex h-3.5 w-4 items-end gap-0.5" aria-hidden="true">
              <span className="w-1 animate-[pulse_0.6s_ease-in-out_infinite] rounded-full bg-gold-bright" style={{ height: '70%' }} />
              <span className="w-1 animate-[pulse_0.9s_ease-in-out_infinite] rounded-full bg-gold-pale" style={{ height: '100%' }} />
              <span className="w-1 animate-[pulse_0.7s_ease-in-out_infinite] rounded-full bg-gold-bright" style={{ height: '50%' }} />
            </span>
          ) : (
            <Music className="h-3.5 w-3.5 text-gold-bright" aria-hidden="true" />
          )}

          <span className="label block leading-none">
            {isPlaying ? 'PLAYING' : 'MUSIC'}
          </span>
        </button>

        <button
          type="button"
          onClick={togglePlay}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-chalk transition-colors hover:text-gold-bright"
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? (
            <Pause className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
          ) : (
            <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
};
