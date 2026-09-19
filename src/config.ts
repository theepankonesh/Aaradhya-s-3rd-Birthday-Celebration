/**
 * Deployment-time settings. Everything in here is meant to be edited by hand
 * when the event moves, the sheet is re-created, or the script is redeployed —
 * so it lives in one file rather than buried in a component.
 */

/**
 * The Google Apps Script Web App backing the RSVP sheet.
 *
 * Redeploying the script mints a new /exec URL — paste the new one here and
 * nothing else needs to change. Deploy it as "Execute as: Me" with
 * "Who has access: Anyone", or the browser gets a login page instead of a
 * write.
 */
export const RSVP_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbygiNPQXTPrA8xUzx1NLMDzvZCagLCJdgX2X4-JgbqqajtsoEN7Wus6jCk2Jubv_tXN/exec';

/**
 * The literal strings written into the sheet's "attending" column. They are
 * constants rather than inline literals because the sheet is read by people,
 * not code: if these drift, past and future rows stop matching each other.
 */
export const ATTENDING_LABELS = {
  yes: "We'll be there",
  no: "We can't make it"
} as const;
