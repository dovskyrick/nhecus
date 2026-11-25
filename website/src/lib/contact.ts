// How people reach the artist: an email address (shown as copyable text — never a mailto: link)
// and an Instagram handle (DM link). Both are set in the back-office (About & contact → site/about).
// The VITE_INSTAGRAM_HANDLE / VITE_CONTACT_EMAIL build variables are only fallbacks.
import { useAbout } from './content';

const ENV_HANDLE = import.meta.env.VITE_INSTAGRAM_HANDLE as string | undefined;
const ENV_EMAIL = import.meta.env.VITE_CONTACT_EMAIL as string | undefined;

// Accepts "nhecus", "@nhecus" or "https://instagram.com/nhecus/" → "nhecus".
export function cleanHandle(raw?: string): string {
  const h = (raw ?? '').trim().replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/^@/, '').split(/[/?#]/)[0];
  return /^[A-Za-z0-9._]{1,30}$/.test(h) ? h : '';
}

export function cleanEmail(raw?: string): string {
  const e = (raw ?? '').trim().replace(/^mailto:/i, '');
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) ? e : '';
}

export function useContact() {
  const about = useAbout();
  const handle = cleanHandle(about.instagram) || cleanHandle(ENV_HANDLE);
  const email = cleanEmail(about.email) || cleanEmail(ENV_EMAIL);
  return {
    email,
    handle,
    dm: handle ? `https://ig.me/m/${handle}` : '',
    any: Boolean(email || handle),
  };
}
