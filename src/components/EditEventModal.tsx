import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { EventData } from '../types';
import { X, Check, RotateCcw } from 'lucide-react';
import { initialEventData } from '../data/eventData';
import { useModalA11y } from '../hooks/useModalA11y';

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventData: EventData;
  onSave: (updated: EventData) => void;
}

export const EditEventModal: React.FC<EditEventModalProps> = ({
  isOpen,
  onClose,
  eventData,
  onSave
}) => {
  const [formData, setFormData] = useState<EventData>(eventData);
  const dialogRef = useModalA11y<HTMLDivElement>(isOpen, onClose);

  // The dialog stays mounted between openings, so re-seed the fields from the
  // live event each time it opens rather than showing abandoned edits.
  useEffect(() => {
    if (isOpen) setFormData(eventData);
  }, [isOpen, eventData]);

  const handleChange = (field: keyof EventData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleReset = () => {
    setFormData(initialEventData);
    onSave(initialEventData);
  };

  if (!isOpen) return null;

  return (
    // Same scroll arrangement as the RSVP modal: the overlay scrolls, is
    // exempt from the stopped Lenis via `data-lenis-prevent`, and centres the
    // card with `m-auto` so an over-tall card is never pushed out of reach.
    <div
      data-lenis-prevent
      className="fixed inset-0 z-50 flex h-dvh overflow-x-hidden overflow-y-auto overscroll-contain bg-ink/75 px-4 py-12 [-webkit-overflow-scrolling:touch] sm:px-6 sm:py-14"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-event-title"
        className="relative m-auto w-full max-w-xl rounded-[9px] border border-vellum bg-bone p-6 text-ink sm:p-9"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
      >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-vellum text-cherry-deep transition-colors hover:border-cherry hover:text-cherry"
            aria-label="Close editor"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="mb-9 text-center">
            <p className="label text-gold-ink">Behind the booth</p>
            <h2 id="edit-event-title" className="display-sm mt-3 text-cherry-deep">
              Edit the billing
            </h2>
            <p className="copy mt-4 text-graphite">
              Change what the invitation says. Everything updates as you type.
            </p>
            <div className="perforation mx-auto mt-7 w-2/3" />
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="edit-childName" className="field-label">
                  Name
                </label>
                <input
                  id="edit-childName"
                  type="text"
                  value={formData.childName}
                  onChange={(e) => handleChange('childName', e.target.value)}
                  className="field"
                />
              </div>

              <div>
                <label htmlFor="edit-age" className="field-label">
                  Turning
                </label>
                <input
                  id="edit-age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleChange('age', parseInt(e.target.value) || 3)}
                  className="field"
                />
              </div>
            </div>

            <div>
              <label htmlFor="edit-parents" className="field-label">
                Hosted by
              </label>
              <input
                id="edit-parents"
                type="text"
                value={formData.parents}
                onChange={(e) => handleChange('parents', e.target.value)}
                className="field"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="edit-date" className="field-label">
                  Date
                </label>
                <input
                  id="edit-date"
                  type="text"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="field"
                />
              </div>

              <div>
                <label htmlFor="edit-time" className="field-label">
                  Time
                </label>
                <input
                  id="edit-time"
                  type="text"
                  value={formData.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  className="field"
                />
              </div>
            </div>

            <div>
              <label htmlFor="edit-venue" className="field-label">
                Venue
              </label>
              <input
                id="edit-venue"
                type="text"
                value={formData.venue}
                onChange={(e) => handleChange('venue', e.target.value)}
                className="field"
              />
            </div>

            <div>
              <label htmlFor="edit-address" className="field-label">
                Address
              </label>
              <input
                id="edit-address"
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="field"
              />
            </div>

            <div>
              <label htmlFor="edit-quote" className="field-label">
                The verse on the board
              </label>
              <textarea
                id="edit-quote"
                rows={2}
                value={formData.invitationQuote}
                onChange={(e) => handleChange('invitationQuote', e.target.value)}
                className="field resize-none"
              />
            </div>

            <div className="flex items-center justify-between border-t border-vellum pt-5">
              <button
                type="button"
                onClick={handleReset}
                className="link-ghost flex min-h-[44px] cursor-pointer items-center gap-2 text-graphite"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Reset</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="link-ghost min-h-[44px] cursor-pointer px-1 text-graphite"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-cherry !px-6"
                >
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Apply</span>
                </button>
              </div>
            </div>
          </form>
      </motion.div>
    </div>
  );
};
