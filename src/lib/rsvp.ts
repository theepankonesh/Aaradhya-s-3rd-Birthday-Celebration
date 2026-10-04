import { RSVP_ENDPOINT, ATTENDING_LABELS } from '../config';
import { RSVPFormData } from '../types';

/**
 * The row the Apps Script writes. Keys are the sheet's column headers, so they
 * are spelled the way a person reading the spreadsheet expects rather than the
 * way the form's state is shaped.
 */
export interface RSVPPayload {
  name: string;
  attending: string;
  adults: number;
  children: number;
  allergies: string;
  wish: string;
}

export const toRSVPPayload = (form: RSVPFormData): RSVPPayload => {
  const coming = form.attending === 'yes';

  return {
    name: form.guestName.trim(),
    attending: ATTENDING_LABELS[form.attending],
    // A regret carries no head count and no kitchen note — the steppers are
    // hidden in that branch of the form, so their leftover defaults would
    // otherwise write "2 adults" into the sheet for someone who isn't coming.
    adults: coming ? form.adultsCount : 0,
    children: coming ? form.childrenCount : 0,
    allergies: coming ? form.dietaryRestrictions.trim() : '',
    wish: form.message.trim()
  };
};

/**
 * Post one reply to the Google Sheet.
 *
 * Apps Script Web Apps answer without CORS headers, so the request goes out
 * `no-cors`: the browser sends it and hands back an opaque response we are not
 * allowed to read — no status, no body. That is the normal, working case. It
 * also means the request has to stay a CORS-simple one, which is why the body
 * is JSON sent under `text/plain` (the script does `JSON.parse(e.postData.contents)`);
 * an `application/json` header would trigger a preflight the script cannot answer.
 *
 * Resolving therefore means "the browser completed the request", not "the sheet
 * has the row". Only a genuine network failure throws, and that is the one
 * signal worth showing the guest.
 *
 * A stalled connection (patchy mobile data, in-app browsers) would otherwise
 * leave the promise pending forever, so the request is aborted after
 * RSVP_TIMEOUT_MS and rejects with an `AbortError`. The timer is a plain
 * AbortController + setTimeout rather than `AbortSignal.timeout`, which older
 * iOS Safari and some in-app webviews lack.
 */
export const RSVP_TIMEOUT_MS = 15000;

export const submitRSVP = async (form: RSVPFormData): Promise<void> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), RSVP_TIMEOUT_MS);

  try {
    await fetch(RSVP_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(toRSVPPayload(form)),
      signal: controller.signal
    });
  } finally {
    clearTimeout(timer);
  }
};

export const isTimeoutError = (err: unknown): boolean =>
  err instanceof Error && err.name === 'AbortError';
