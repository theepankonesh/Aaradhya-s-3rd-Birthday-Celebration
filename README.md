# Aaradhya's 3rd Birthday Celebration

A single-page invitation site — a sealed envelope that opens onto a carnival
bill: the programme, the gallery, and an RSVP booth that writes to a sheet.

## Run locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   `npm install`
2. Start the dev server:
   `npm run dev`

The site runs at http://localhost:3000.

## Build

`npm run build` writes a static site to `dist/`. There is no server and no
environment configuration — everything needed is in the bundle and in
`public/`.

`npm run lint` typechecks without emitting.

## Where things live

| Path | What |
|---|---|
| `src/data/eventData.ts` | All event content — times, programme, photos, copy |
| `src/config.ts` | The RSVP endpoint and the sheet's attending labels |
| `src/index.css` | The palette, the type scale, and the house type rules |
| `public/assets/` | Photographs, the envelope clip, the carousel, the music |
