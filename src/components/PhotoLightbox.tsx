import React, { useCallback } from 'react';
import { motion } from 'motion/react';
import { GalleryPhoto } from '../types';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useModalA11y } from '../hooks/useModalA11y';

interface PhotoLightboxProps {
  photos: GalleryPhoto[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
  photos,
  currentIndex,
  onClose,
  onNavigate
}) => {
  const isOpen = currentIndex !== null;
  const currentPhoto = currentIndex !== null ? photos[currentIndex] : null;

  // Escape, focus trap, scroll lock and focus restore.
  const dialogRef = useModalA11y<HTMLDivElement>(isOpen, onClose);

  const handleNext = useCallback(() => {
    if (currentIndex === null) return;
    onNavigate((currentIndex + 1) % photos.length);
  }, [currentIndex, onNavigate, photos.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex === null) return;
    onNavigate((currentIndex - 1 + photos.length) % photos.length);
  }, [currentIndex, onNavigate, photos.length]);

  // Arrow keys page through the set. Escape is handled by useModalA11y.
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev]);

  // Touch swipe support on mobile
  const [touchStart, setTouchStart] = React.useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;
    if (distance > 60) {
      handleNext();
    } else if (distance < -60) {
      handlePrev();
    }
    setTouchStart(null);
  };

  if (!isOpen || !currentPhoto) return null;

  return (
    <motion.div
      ref={dialogRef}
      id="photo-lightbox-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      className="tier-ink fixed inset-0 z-[60] flex items-center justify-center bg-ink/96 p-4 select-none sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      /* Clicking the dark surround closes, the way every photo viewer behaves. */
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Which photo of how many — announced, not just drawn. */}
      <div aria-live="polite" className="sr-only">
        Photo {currentIndex + 1} of {photos.length}: {currentPhoto.title}
      </div>

      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-50 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-gold/40 text-chalk transition-colors hover:border-gold-bright hover:text-gold-bright sm:top-6 sm:right-6"
        aria-label="Close photo viewer"
      >
        <X className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Counter Pill */}
      <div
        aria-hidden="true"
        className="label absolute top-6 left-5 z-50 text-gold-bright/80 sm:left-7"
      >
        {currentIndex + 1} / {photos.length}
      </div>

      {/* Left / Previous Control */}
      <button
        type="button"
        onClick={handlePrev}
        className="absolute top-1/2 left-2 z-50 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gold/40 text-chalk transition-colors hover:border-gold-bright hover:text-gold-bright sm:left-6"
        aria-label="Previous photo"
      >
        <ChevronLeft className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Right / Next Control */}
      <button
        type="button"
        onClick={handleNext}
        className="absolute top-1/2 right-2 z-50 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gold/40 text-chalk transition-colors hover:border-gold-bright hover:text-gold-bright sm:right-6"
        aria-label="Next photo"
      >
        <ChevronRight className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Main Image Container */}
      <figure className="relative flex max-h-[85vh] max-w-4xl flex-col items-center justify-center p-2">
        <motion.div
          key={currentPhoto.id}
          className="relative overflow-hidden rounded-[9px]"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          <img
            src={currentPhoto.src}
            alt={currentPhoto.alt}
            className="block max-h-[72vh] max-w-full object-contain"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Caption Box */}
        <figcaption className="mt-7 max-w-xl px-4 text-center">
          <h3 id="lightbox-title" className="display-sm text-gold-pale">
            {currentPhoto.title}
          </h3>
          <p className="copy-sm mt-3 text-chalk/65">{currentPhoto.caption}</p>
        </figcaption>
      </figure>
    </motion.div>
  );
};
