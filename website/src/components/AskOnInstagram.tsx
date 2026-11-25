import { useState } from 'react';
import { useInstagram } from '../lib/instagram';
import type { Drawing } from '../lib/types';

// The one way to buy or request: open an Instagram DM. ig.me links can't pre-fill text,
// so the click also copies a ready-made first message the visitor can paste.
export default function AskOnInstagram({ d }: { d: Drawing }) {
  const { handle, dm } = useInstagram();
  const [copied, setCopied] = useState(false);
  const forSale = d.original === 'available' || d.prints;

  if (!handle) return <p className="ask-hint mono">Requests by Instagram DM — link coming soon.</p>;

  const what = d.original === 'available' && d.prints ? 'the original or a print'
    : d.original === 'available' ? 'the original'
    : d.prints ? 'a print'
    : 'something similar';
  const text = `Hi! I saw "${d.title}" on nhecus.com and I'm interested in ${what}.`;

  function copy() {
    navigator.clipboard?.writeText(text).then(() => setCopied(true)).catch(() => { /* link still opens */ });
  }

  return (
    <div className="ask">
      <a className={`btn${forSale ? '' : ' ghost'}`} href={dm} target="_blank" rel="noreferrer" onClick={copy}>
        {forSale ? 'Ask on Instagram ↗' : 'Ask about something similar ↗'}
      </a>
      <p className="ask-hint mono">
        {copied ? 'Message copied — paste it in the chat.' : `Opens a DM to @${handle} · we arrange it there`}
      </p>
    </div>
  );
}
