import { EventData } from '../types';

export const initialEventData: EventData = {
  childName: "Aaradhya",
  age: 3,
  parents: "Dilaixsana & Partheeban",
  date: "October 11, 2026",
  time: "6:00 PM – 12:00 AM",
  venue: "Markham Convention Centre",
  address: "30 Ironside Crescent, Scarborough, ON M1X 0B7",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Markham+Convention+Centre+30+Ironside+Crescent+Scarborough+ON+M1X+0B7",
  invitationQuote: "A little spark of gold,\na little just three years old.",
  tagline: "3rd Birthday Celebration",
  welcomeNote:
    "The carousel is polished, the piñata is hung, and there is more cotton candy than is strictly sensible. Bring the little ones.",
  timeline: [
    {
      id: "t1",
      time: "6:00 PM",
      title: "Guest Arrival",
      description: "Welcome drinks & sweets",
      icon: "Ticket"
    },
    {
      id: "t2",
      time: "6:30 PM",
      title: "Pallu Kozhukattai",
      description:
        "Teething ceremony for Aadhanyan (Mama with Marumagan — traditional setup & blessings)",
      highlight: "Aadhanyan",
      icon: "Lamp"
    },
    {
      id: "t3",
      time: "7:30 PM",
      title: "Family Entry",
      description: "Birthday girl's grand entrance",
      icon: "Entrance"
    },
    {
      id: "t4",
      time: "8:00 PM",
      title: "Cake Cutting",
      description: "Birthday song & cake cutting",
      icon: "Cake"
    },
    {
      id: "t5",
      time: "8:30 PM",
      title: "Dance & Games",
      description: "Carnival fun for all",
      icon: "Drum"
    },
    {
      id: "t6",
      time: "9:00 PM",
      title: "Dinner (Virundhu)",
      description: "A full Sri Lankan and South Indian feast",
      icon: "Feast"
    },
    {
      id: "t7",
      time: "10:00 PM",
      title: "Dance Floor Open",
      description: "DJ Night",
      icon: "MirrorBall"
    }
  ],
  /* The carnival set — eight photographs edited onto the fair's own palette:
     cherry curtains, gold bokeh, lanterns and string lights. The gallery crops
     every one of them to the same 4:5 card, so each says where the subject
     actually sits with `focus`; without it a centre crop cuts the wide shots
     in half. Order runs the fair: curtain-up, the ride, the falls, the fields. */
  photos: [
    {
      id: "p1",
      src: "/assets/photos/carnival-1.jpg",
      title: "Before the Curtain",
      caption: "The littlest star, waiting in the wings",
      alt: "Baby Aaradhya in a white star-print outfit and sun hat on a white blanket, red velvet curtain and gold bokeh behind her",
      focus: "46% 40%"
    },
    {
      id: "p2",
      src: "/assets/photos/carnival-2.jpg",
      title: "Queen of the Midway",
      caption: "Ruffles, fairy lights, and a twirl waiting to happen",
      alt: "Aaradhya standing in a magenta tulle party dress under strings of fairground lights and red lanterns",
      focus: "center 60%"
    },
    {
      id: "p3",
      src: "/assets/photos/carnival-3.jpg",
      title: "The Big Top Bloom",
      caption: "A whole carousel of ruffles, spread out in gold light",
      alt: "Overhead portrait of Aaradhya seated with her magenta tulle skirt fanned out like a flower against warm gold bokeh",
      focus: "center 45%"
    },
    {
      id: "p4",
      src: "/assets/photos/carnival-4.jpg",
      title: "Golden Hour Falls",
      caption: "Gold on the water and a look that means mischief",
      alt: "Aaradhya in a tan ruffled jacket on a stone ledge, waterfall and golden sparkles behind her",
      focus: "center 48%"
    },
    {
      id: "p5",
      src: "/assets/photos/carnival-5.jpg",
      title: "Wishes on the Water",
      caption: "Perched by the falls while the lamps come on",
      alt: "Aaradhya seated on a stone wall in a tan jacket and checked skirt, glowing waterfall behind her",
      focus: "center 52%"
    },
    {
      id: "p6",
      src: "/assets/photos/carnival-6.jpg",
      title: "Lantern Light",
      caption: "That smile, with the whole fair glowing behind her",
      alt: "Aaradhya smiling in a tan ruffled jacket, red lanterns and a sunlit waterfall blurred behind her",
      focus: "78% center"
    },
    {
      id: "p7",
      src: "/assets/photos/carnival-7.jpg",
      title: "Fairground Gold",
      caption: "Silk and lamplight in the long grass",
      alt: "Aaradhya in a gold pattu pavadai standing in tall grass beneath strings of carnival lights",
      focus: "center 45%"
    },
    {
      id: "p8",
      src: "/assets/photos/carnival-8.jpg",
      title: "Marigold Wishes",
      caption: "Petals in her hands and lanterns overhead",
      alt: "Aaradhya in an orange and gold pattu pavadai holding a flower, marigolds and glowing lanterns around her",
      focus: "center 45%"
    }
  ]
};

export const invitationAssets = {
  envelopeVideo: "/assets/luxury_envelope_opening_1.mp4",
  /* The held envelope is a true-alpha PNG — no matte, so it composites over the
     stage with its own colour rather than being screened out of a black frame. */
  envelopeSealed: "/assets/envelope-closed.png",
  /* Cut from the clip at HANDOFF_AT (4.0s), cropped to the same envelope box the
     stage crops to, so the hand-off still matches the frame it replaces. */
  envelopeHalfOpen: "/assets/envelope-open-luxury.jpg",
  /* The ride. This cut sits on a warm tan ground that samples rgb(181,156,118)
     right out to the frame edge — NOT black — so it is integrated by bringing
     the page down to that tone under the clip rather than by keying a ground
     out. See `.ride-pool`. (Renamed from "New Carosuel.mp4": a space in a
     filename becomes %20 in the URL and is a liability in a served path.) */
  carousel: "/assets/new-carousel.mp4",
  /* One frame of the clip, for the moment before it has decoded. */
  carouselPoster: "/assets/carousel-poster.jpg",
  crown: "/assets/crown.webp",
  /* "Unakku Thaan" — the party's playlist, 3:36, looped by the player.
     (Renamed from "Unakku-Thaan-MassTamilan.dev.mp3": the download site's
     watermark does not belong in a path guests can see.) */
  music: "/assets/unakku-thaan.mp3"
};
