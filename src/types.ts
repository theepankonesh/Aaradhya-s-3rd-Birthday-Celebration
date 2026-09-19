export interface TimelineItem {
  id: string;
  time: string;
  title: string;
  description: string;
  icon?: string;
  /* One run of the description lifted into the wood type — a name being
     pointed at rather than read. Matched literally against `description`;
     if it isn't found the line simply renders as ordinary copy. */
  highlight?: string;
}

export interface GalleryPhoto {
  id: string;
  src: string;
  title: string;
  caption: string;
  alt: string;
  /* Where the subject actually sits in the frame, as a CSS object-position.
     The gallery crops to a circle and to a 21:9 plate, so a picture with the
     child off to one side needs to say so or the crop cuts her in half.
     Omitted means centre, which is right for anything already centred. */
  focus?: string;
}

export interface EventData {
  childName: string;
  age: number;
  parents: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  googleMapsUrl: string;
  invitationQuote: string;
  tagline: string;
  welcomeNote: string;
  timeline: TimelineItem[];
  photos: GalleryPhoto[];
}

export interface RSVPFormData {
  guestName: string;
  adultsCount: number;
  childrenCount: number;
  attending: 'yes' | 'no';
  dietaryRestrictions: string;
  message: string;
}

export interface RSVPRecord extends RSVPFormData {
  id: string;
  submittedAt: string;
}
