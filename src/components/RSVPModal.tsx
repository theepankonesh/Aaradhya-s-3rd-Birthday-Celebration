import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { RSVPFormData, RSVPRecord } from '../types';
import { X, Sparkles, Ticket, Send } from 'lucide-react';
import { useModalA11y } from '../hooks/useModalA11y';
import { Canopy, TicketMark } from './CarnivalOrnaments';
import { submitRSVP, isTimeoutError } from '../lib/rsvp';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  childName: string;
  onRSVPSubmitted?: (data: RSVPRecord) => void;
}

const EMPTY_FORM: RSVPFormData = {
  guestName: '',
  adultsCount: 2,
  childrenCount: 0,
  attending: 'yes',
  dietaryRestrictions: '',
  message: ''
};

export const RSVPModal: React.FC<RSVPModalProps> = ({
  isOpen,
  onClose,
  childName,
  onRSVPSubmitted
}) => {
  const [formData, setFormData] = useState<RSVPFormData>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<RSVPRecord | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [attendingError, setAttendingError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);
  const attendingRef = useRef<HTMLFieldSetElement>(null);
  const dialogRef = useModalA11y<HTMLDivElement>(isOpen, onClose);

  // The confirmation replaces the form in place, so move focus to it — otherwise
  // a screen-reader guest is left on a submit button that no longer exists.
  useEffect(() => {
    if (isSubmitted) confirmationRef.current?.focus({ preventScroll: true });
  }, [isSubmitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Both required answers are checked before anything leaves the browser, so
    // a half-filled reply never reaches the sheet.
    if (!formData.guestName.trim()) {
      setNameError('Please tell us who is replying.');
      nameInputRef.current?.focus();
      return;
    }
    if (formData.attending !== 'yes' && formData.attending !== 'no') {
      setAttendingError('Please let us know if you can come.');
      attendingRef.current?.focus();
      return;
    }
    setNameError(null);
    setAttendingError(null);
    setSubmitError(null);
    setIsSubmitting(true);

    const record: RSVPRecord = {
      ...formData,
      id: 'rsvp_' + Date.now(),
      submittedAt: new Date().toISOString()
    };

    try {
      await submitRSVP(formData);
    } catch (err) {
      console.error('RSVP submission failed:', err);
      setIsSubmitting(false);
      setSubmitError(
        isTimeoutError(err)
          ? 'The ticket office is taking too long to answer. Please try again in a moment.'
          : 'Something went wrong reaching the ticket office. Please check your connection and try again.'
      );
      return;
    }

    // A second copy on this device, kept only as a crumb trail — the sheet is
    // the record that matters, so a blocked localStorage must not cost the
    // guest a reply that already went through.
    try {
      const existing = JSON.parse(localStorage.getItem('aaradhya_birthday_rsvps') || '[]');
      existing.push(record);
      localStorage.setItem('aaradhya_birthday_rsvps', JSON.stringify(existing));
    } catch (err) {
      console.error('Local storage error:', err);
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
    setSubmittedRecord(record);
    // Cleared behind the confirmation, so closing and reopening the booth
    // offers a blank form rather than the last guest's answers.
    setFormData(EMPTY_FORM);
    onRSVPSubmitted?.(record);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSubmittedRecord(null);
    setNameError(null);
    setAttendingError(null);
    setSubmitError(null);
    setFormData(EMPTY_FORM);
    onClose();
  };

  if (!isOpen) return null;

  const attendingYes = formData.attending === 'yes';

  return (
    // The overlay is the scroller, not the card, so a tall form on a short
    // screen scrolls as one sheet. `data-lenis-prevent` matters: Lenis is
    // stopped while a modal is open, and a stopped Lenis cancels every touch
    // and wheel event on the page unless it lands inside a marked element.
    // The card centres with `m-auto` rather than `items-center`, which would
    // push the top of an over-tall card above the viewport, out of reach.
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
        aria-labelledby="rsvp-modal-title"
        id="rsvp-modal-container"
        className="relative m-auto w-full max-w-xl overflow-hidden rounded-[9px] border border-vellum bg-bone px-6 pt-16 pb-9 text-ink sm:px-10 sm:pt-20 sm:pb-11"
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-14 right-3 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-vellum text-cherry-deep transition-colors hover:border-cherry hover:text-cherry sm:top-16 sm:right-5"
          aria-label="Close RSVP form"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <Canopy />

        {!isSubmitted ? (
          <div>
            {/* Modal Header */}
            <div className="mb-9 text-center">
              <TicketMark className="mx-auto mb-5 h-10 w-10 text-cherry" />
              <p className="label text-gold-ink">Ticket office</p>
              <h2 id="rsvp-modal-title" className="display-sm mt-4 text-cherry-deep">
                Claim your place at {childName}’s carnival
              </h2>
              <p className="copy mt-4 text-graphite">
                Tell us who is coming and we will have tickets waiting.
              </p>
              <div className="perforation mx-auto mt-7 w-2/3" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Who is replying? */}
              <div>
                <label
                  htmlFor="guestName"
                  className="field-label"
                >
                  Who is replying? *
                </label>
                <input
                  id="guestName"
                  ref={nameInputRef}
                  type="text"
                  autoComplete="name"
                  required
                  aria-required="true"
                  aria-invalid={nameError ? true : undefined}
                  aria-describedby={nameError ? 'guestName-error' : undefined}
                  value={formData.guestName}
                  onChange={(e) => {
                    setFormData({ ...formData, guestName: e.target.value });
                    if (nameError) setNameError(null);
                  }}
                  placeholder="e.g., Ananya & Rahul Sharma"
                  className={`field ${nameError ? '!border-cherry' : ''}`}
                />
                {/* Inline, next to the field it belongs to. */}
                {nameError && (
                  <p id="guestName-error" role="alert" className="copy-sm mt-2 text-cherry">
                    {nameError}
                  </p>
                )}
              </div>

              {/* Will you be attending? — a real radio group, so the choice is
                  announced and arrow keys work. */}
              <fieldset
                ref={attendingRef}
                tabIndex={-1}
                aria-describedby={attendingError ? 'attending-error' : undefined}
                className="outline-none"
              >
                <legend className="field-label">
                  Will you be there? *
                </legend>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {(
                    [
                      { value: 'yes', label: 'We’ll be there', icon: true },
                      { value: 'no', label: 'We can’t make it', icon: false }
                    ] as const
                  ).map((option) => {
                    const selected = formData.attending === option.value;
                    return (
                      <label
                        key={option.value}
                        className={`label flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-[9px] border px-4 py-2.5 text-center transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-cherry ${
                          selected
                            ? 'border-cherry bg-cherry text-paper'
                            : 'border-vellum bg-paper text-cherry-deep hover:border-cherry'
                        }`}
                      >
                        <input
                          type="radio"
                          name="attending"
                          value={option.value}
                          checked={selected}
                          onChange={() => {
                            setFormData({ ...formData, attending: option.value });
                            if (attendingError) setAttendingError(null);
                          }}
                          className="sr-only"
                        />
                        {option.icon && <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
                        <span>{option.label}</span>
                      </label>
                    );
                  })}
                </div>
                {attendingError && (
                  <p id="attending-error" role="alert" className="copy-sm mt-2 text-cherry">
                    {attendingError}
                  </p>
                )}
              </fieldset>

              {/* Number of Guests */}
              {attendingYes && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {(
                    [
                      { key: 'adultsCount', label: 'Adults', min: 1 },
                      { key: 'childrenCount', label: 'Children', min: 0 }
                    ] as const
                  ).map(({ key, label, min }) => {
                    const count = formData[key];
                    return (
                      <div key={key} role="group" aria-labelledby={`${key}-label`}>
                        <span
                          id={`${key}-label`}
                          className="field-label"
                        >
                          {label}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="stepper"
                            disabled={count <= min}
                            aria-label={`One fewer ${label.toLowerCase()}`}
                            onClick={() => setFormData((f) => ({ ...f, [key]: Math.max(min, f[key] - 1) }))}
                          >
                            &minus;
                          </button>
                          {/* Announced on change, so the count is not visual-only. */}
                          <span
                            aria-live="polite"
                            className="font-poster w-10 text-center text-base text-cherry-deep"
                          >
                            {count}
                            <span className="sr-only"> {label.toLowerCase()}</span>
                          </span>
                          <button
                            type="button"
                            className="stepper"
                            disabled={count >= 10}
                            aria-label={`One more ${label.toLowerCase()}`}
                            onClick={() => setFormData((f) => ({ ...f, [key]: Math.min(10, f[key] + 1) }))}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Dietary Restrictions */}
              {attendingYes && (
                <div>
                  <label
                    htmlFor="dietaryRestrictions"
                    className="field-label"
                  >
                    Allergies or anything we should avoid
                  </label>
                  <input
                    id="dietaryRestrictions"
                    type="text"
                    value={formData.dietaryRestrictions}
                    onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                    placeholder="Vegetarian, nut allergy, halal — or none"
                    className="field"
                  />
                </div>
              )}

              {/* Message for Aaradhya */}
              <div>
                <label
                  htmlFor="message"
                  className="field-label"
                >
                  A wish for the birthday girl
                </label>
                <textarea
                  id="message"
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={`Something for ${childName} to read when she’s older`}
                  className="field resize-none"
                />
              </div>

              <p className="copy-sm text-center text-graphite">
                Thank you for celebrating with us.
              </p>

              {/* A reply that never reached the sheet — said plainly, with the
                  button left ready for another go. */}
              {submitError && (
                <p role="alert" className="copy-sm text-center text-cherry">
                  {submitError}
                </p>
              )}

              {/* Submit — locked for the round trip, and announcing its own progress. */}
              <button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className="btn btn-cherry w-full disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="h-4 w-4 animate-spin rounded-full border-2 border-paper/30 border-t-paper"
                    />
                    <span>Sending…</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" aria-hidden="true" />
                    <span>Send our reply</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Confirmation Screen */
          <motion.div
            ref={confirmationRef}
            tabIndex={-1}
            role="status"
            aria-live="polite"
            className="py-6 text-center outline-none"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold">
              <Ticket className="h-7 w-7 text-cherry" aria-hidden="true" />
            </div>

            <p className="label text-gold-ink">Ticket issued</p>

            <h2 className="display-sm mt-3 mb-4 text-cherry-deep">
              Thank you, {submittedRecord?.guestName}
            </h2>

            <p className="copy mx-auto mb-8 max-w-sm text-graphite">
              {submittedRecord?.attending === 'yes'
                ? 'Your place at the carousel is held. See you on the day.'
                : `Thank you for telling us. You will be missed on ${childName}’s day.`}
            </p>

            {/* Summary Card */}
            {submittedRecord?.attending === 'yes' && (
              <dl
                className="ticket mx-auto mb-8 max-w-sm space-y-3 p-5 text-left"
                style={{ ['--notch' as string]: '9px' }}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="label text-gold-ink">Admits</dt>
                  <dd className="font-poster text-sm text-cherry-deep">
                    {submittedRecord.adultsCount} adults · {submittedRecord.childrenCount} children
                  </dd>
                </div>
                {submittedRecord.dietaryRestrictions && (
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="label shrink-0 text-gold-ink">Kitchen</dt>
                    <dd className="copy-sm text-right text-cherry-deep">
                      {submittedRecord.dietaryRestrictions}
                    </dd>
                  </div>
                )}
              </dl>
            )}

            <button
              type="button"
              onClick={handleReset}
              className="btn btn-outline-ink"
            >
              Done
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
