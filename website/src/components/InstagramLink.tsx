import { useInstagram } from '../lib/instagram';

// "@handle ↗" link to the Instagram DM; renders nothing (or `fallback`) until a handle is set.
export default function InstagramLink({ className, fallback }: { className?: string; fallback?: string }) {
  const { handle, dm } = useInstagram();
  if (!handle) return fallback ? <span className={className}>{fallback}</span> : null;
  return <a className={className} href={dm} target="_blank" rel="noreferrer">@{handle} ↗</a>;
}
