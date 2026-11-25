// Placeholder content: what the site shows in demo mode (no Firebase config yet) and
// the starting point the back-office offers before anything is saved.
import type { AboutContent, Collection, Drawing } from '../lib/types';

const img = (name: string) => `${import.meta.env.BASE_URL}images/${name}`;

// Scrolling strip under the nav (only visible in themes that turn it on, e.g. Zine).
export const TICKER = ['NHECUS', 'INK PEN ON PAPER', 'ORIGINALS & PRINTS', 'BY DIRECT MESSAGE', '·.II', 'ONE LINE AT A TIME'];

// Order = Library order. One drawing belongs to exactly one of these.
export const collections: Collection[] = [
  { id: 'marker-heads', title: 'Marker heads', blurb: 'Big faces, bigger noses — thick marker on A3', period: '2025' },
  { id: 'woodgrain', title: 'Woodgrain stickers', blurb: 'Tiny scenes drawn on leftover wood-print sticker paper', period: '2025' },
  { id: 'watercolour', title: 'Watercolour play-arounds', blurb: 'Ink first, then a wash to see what happens', period: '2024' },
  { id: 'inktober-2024', title: 'Inktober 2024', blurb: 'Thirty-one prompts, thirty-one nights', period: 'Oct 2024' },
  { id: 'japan', title: 'Trip to Japan', blurb: 'Sketchbook from trains, temples and convenience stores', period: '' },
  { id: 'realism', title: 'Realism studies', blurb: 'Hands, folds and faces, drawn slowly', period: '' },
  { id: 'teenage-years', title: 'Teenage years', blurb: 'The early stuff — margins of school notebooks', period: '' },
];

const t0 = Date.UTC(2025, 10, 1);
export const demoDrawings: Drawing[] = [
  { id: 'demo-1', title: 'The Long-Nosed Gentleman', year: 2025, medium: 'Marker on paper', width: 42, height: 29.7, description: 'He has an opinion and a dart, and he is not afraid to use either.', collectionId: 'marker-heads', featured: true, original: 'available', prints: true, aspect: 1230 / 820, imageUrl: img('show-long-nose.jpg'), createdAt: t0 - 1 },
  { id: 'demo-2', title: 'Four Creatures, One Opinion', year: 2024, medium: 'Ink & watercolour', width: 12, height: 12, description: 'Drawn as a CD cover. Two grey, two green, one speech bubble between them.', collectionId: 'watercolour', featured: true, original: 'kept', prints: true, aspect: 1600 / 1509, imageUrl: img('show-creatures.jpg'), createdAt: t0 - 2 },
  { id: 'demo-3', title: 'Trumpet, Interrupted', year: 2025, medium: 'Ink pen on sticker paper', width: 9, height: 9, description: 'A small sticker of a large sound.', collectionId: 'woodgrain', featured: true, original: 'available', prints: false, price: 60, aspect: 910 / 885, imageUrl: img('show-trumpet.jpg'), createdAt: t0 - 3 },
  { id: 'demo-4', title: 'A Toast Before Speaking', year: 2025, medium: 'Marker on paper', width: 29.7, height: 42, description: 'Profile, pipe smoke, and something important about to be said.', collectionId: 'marker-heads', featured: true, original: 'sold', prints: true, aspect: 985 / 1580, imageUrl: img('show-toast.jpg'), createdAt: t0 - 4 },
  { id: 'demo-5', title: 'The Rebuttal', year: 2025, medium: 'Ink pen on sticker paper', width: 9, height: 10, description: 'Two hands, one phone, a brush — and no one is listening.', collectionId: 'woodgrain', featured: false, original: 'available', prints: false, aspect: 768 / 935, imageUrl: img('show-rebuttal.jpg'), createdAt: t0 - 5 },
];

export const about: AboutContent = {
  imageUrl: img('show-long-nose.jpg'),
  story: `nhecus is where the ink drawings live. The oil paintings have their own house next door, at dovsky.com — the two get along, but they don't share a wall.

Most of these start without a plan: a pen, whatever paper is nearest, and a face that turns up halfway through the first line. Some become long noses, some become creatures, and most of them end up saying something in a little speech bubble that nobody can quite read.

The Show is the short list — the ones I'd hang. The Library keeps everything else, sorted into collections: trips, months of daily drawing, studies, and a few things from a long time ago.

Originals and prints are sold the simple way: send a message, we talk, we arrange it.

Every line here was drawn once, in ink, with no undo.`,
};
