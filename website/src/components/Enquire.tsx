import { useEffect, useRef } from 'react';
import { useContact } from '../lib/contact';
import type { Drawing } from '../lib/types';
import CopyText from './CopyText';

const forSale = (d: Drawing) => d.original === 'available' || d.prints;

// The button under a drawing. Opening the modal is controlled by the Lightbox
// (so Esc closes the modal first, then the lightbox).
export function EnquireButton({ d, onOpen }: { d: Drawing; onOpen: () => void }) {
  return (
    <div className="enquire">
      <button className={`btn${forSale(d) ? '' : ' ghost'}`} onClick={onOpen}>
        {forSale(d) ? 'Enquire about this piece' : 'Ask about something similar'}
      </button>
    </div>
  );
}

// Candid, personal note: email (copyable, no mailto) + Instagram DMs welcome.
export function EnquireModal({ d, onClose }: { d: Drawing; onClose: () => void }) {
  const { email, handle, dm, any } = useContact();
  const card = useRef<HTMLDivElement>(null);
  useEffect(() => { card.current?.focus(); }, []);

  const what = d.original === 'available' && d.prints ? 'the original or a print'
    : d.original === 'available' ? 'the original'
    : d.prints ? 'a print'
    : 'something in the same spirit';

  return (
    <div className="enq-backdrop" onClick={onClose}>
      <div className="enq-card" role="dialog" aria-modal="true" aria-labelledby="enq-title" tabIndex={-1} ref={card} onClick={e => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose} aria-label="Close">✕</button>
        <p className="mono enq-kicker">Enquiry · {d.title}</p>
        <h3 id="enq-title">Let’s talk about it.</h3>
        <p className="enq-lede">
          I answer every request myself — whether it’s {what}, a question about the piece, or just a hello.
        </p>

        {!any && <p className="enq-lede">Contact details are on their way — please check back soon.</p>}

        {email && (
          <div className="enq-block">
            <span className="mono enq-label">By email</span>
            <p className="enq-text">Requests by email are very welcome:</p>
            <CopyText text={email} className="enq-email" />
            <p className="mono enq-hint">Mention “{d.title}” so I know which one caught your eye.</p>
          </div>
        )}

        {handle && (
          <div className="enq-block">
            <span className="mono enq-label">{email ? 'Or a message' : 'By message'}</span>
            <p className="enq-text">
              I’m also happy to reply on Instagram — <a href={dm} target="_blank" rel="noreferrer">send me a DM @{handle} ↗</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
