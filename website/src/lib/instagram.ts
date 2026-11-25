// Everything about buying or requesting goes through an Instagram DM.
// The handle is set in the back-office (About → Instagram handle). The build-time
// VITE_INSTAGRAM_HANDLE repository variable is only a fallback.
import { useAbout } from './content';

const ENV_HANDLE = import.meta.env.VITE_INSTAGRAM_HANDLE as string | undefined;

// Accepts "nhecus", "@nhecus" or "https://instagram.com/nhecus/" → "nhecus".
export function cleanHandle(raw?: string): string {
  const h = (raw ?? '').trim().replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/^@/, '').split(/[/?#]/)[0];
  return /^[A-Za-z0-9._]{1,30}$/.test(h) ? h : '';
}

export function useInstagram() {
  const handle = cleanHandle(useAbout().instagram) || cleanHandle(ENV_HANDLE);
  return {
    handle,
    dm: handle ? `https://ig.me/m/${handle}` : '',
    profile: handle ? `https://instagram.com/${handle}` : '',
  };
}
