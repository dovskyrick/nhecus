// Firestore `drawings/{id}`. A drawing lives in exactly ONE collection (collectionId)
// and may additionally be hand-picked for the front page (featured = "in the Show").
export type OriginalStatus = 'available' | 'sold' | 'kept';

export interface Drawing {
  id: string;
  title: string;
  year: number;
  medium: string;          // "Ink pen on paper", "Marker on paper", "Ink & watercolour"…
  width: number;           // cm (0 = unknown)
  height: number;          // cm
  description: string;
  collectionId: string;    // '' or unknown id => "Loose sheets"
  featured: boolean;       // shown on The Show
  original: OriginalStatus;
  prints: boolean;         // prints can be ordered (by message)
  price?: number;          // EUR, original; 0/empty => "price on request"
  aspect?: number;         // width / height of the image, avoids layout jumps
  imageUrl: string;
  thumbnailUrl?: string;
  imagePath?: string;      // Storage paths, so the back-office can delete images
  thumbPath?: string;
  createdAt?: number;      // ms, newest first
}

// Firestore `site/collections` = { items: Collection[] } — array order = Library order.
export interface Collection {
  id: string;              // also the URL: #library/<id>
  title: string;
  blurb: string;
  period?: string;         // "2024", "summer 2019", "2008–2013"…
  visible?: boolean;       // false => hidden from the public Library
}

export interface AboutContent {
  story: string;           // paragraphs separated by blank lines; last one is the closing line
  imageUrl: string;
  imagePath?: string;
  instagram?: string;      // handle for the "Ask on Instagram" DM buttons (set in the back-office)
}

export const LOOSE_ID = 'loose';
export const LOOSE: Collection = { id: LOOSE_ID, title: 'Loose sheets', blurb: 'Drawings that have not found their collection yet' };

export const ORIGINAL_LABEL: Record<OriginalStatus, string> = {
  available: 'Original available',
  sold: 'Original sold',
  kept: 'Original kept',
};

export function price(d: Drawing): string {
  if (!d.price) return '';
  try {
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(d.price);
  } catch { return `€${d.price}`; }
}

export const size = (d: Drawing) => (d.width && d.height ? `${d.width} × ${d.height} cm` : '');
export const num = (i: number) => String(i + 1).padStart(2, '0');
export const thumbOf = (d: Drawing) => d.thumbnailUrl || d.imageUrl;
export const forSale = (d: Drawing) => d.original === 'available' || d.prints;
