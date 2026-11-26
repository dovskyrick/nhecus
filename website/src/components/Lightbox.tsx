import { useEffect, useState, type CSSProperties } from 'react';
import { ORIGINAL_LABEL, price, size, thumbOf, type Collection, type Drawing } from '../lib/types';
import { href } from '../lib/route';
import { Availability } from './DrawingCard';
import Inquire from './Enquire';

// Large view of one drawing, ← / → to walk through the current wall, Esc to close.
export default function Lightbox({ list, index, collections, onIndex, onClose }: {
  list: Drawing[]; index: number; collections?: Collection[]; onIndex: (i: number) => void; onClose: () => void;
}) {
  const d = list[index];
  const col = collections?.find(c => c.id === d.collectionId);
  const [asking, setAsking] = useState(false);
  const go = (step: number) => { setAsking(false); onIndex((index + step + list.length) % list.length); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { if (asking) setAsking(false); else onClose(); }
      if (asking) return;
      if ((e.target as HTMLElement)?.closest?.('input, textarea')) return;
      if (e.key === 'ArrowRight' && list.length > 1) go(1);
      if (e.key === 'ArrowLeft' && list.length > 1) go(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const forSale = d.original === 'available' || d.prints;
  const originalLine = d.original === 'available'
    ? `${ORIGINAL_LABEL.available}${price(d) ? ` — ${price(d)}` : ' — price on request'}`
    : ORIGINAL_LABEL[d.original];

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={d.title} onClick={onClose}>
      <div className="lightbox-inner" onClick={e => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose} aria-label="Close">✕</button>
        <figure className="lightbox-img">
          <img key={d.id} src={d.imageUrl} alt={d.title}
            style={{ backgroundImage: `url("${thumbOf(d)}")`, ...(d.aspect ? { '--ar': d.aspect, aspectRatio: String(d.aspect) } : {}) } as CSSProperties} />
        </figure>
        <div className="lightbox-info">
          <div className="caption-row">
            <span className="mono">{col ? <a href={href.collection(col.id)} onClick={onClose}>{col.title}</a> : 'Loose sheet'}</span>
            <span className="mono">{list.length > 1 ? `${index + 1} / ${list.length}` : ''}</span>
          </div>
          <h2>{d.title}</h2>
          <p className="mono lightbox-meta">{[d.medium, size(d), d.year || ''].filter(Boolean).join(' · ')}</p>
          {asking ? <Inquire key={d.id} title={d.title} onBack={() => setAsking(false)} /> : (
            <>
              {d.description && <p className="lightbox-desc">{d.description}</p>}
              <ul className="sale-lines mono">
                <li className={d.original === 'available' ? 'yes' : ''}>{originalLine}</li>
                <li className={d.prints ? 'yes' : ''}>{d.prints ? 'Prints available on request' : 'No prints'}</li>
              </ul>
              {forSale ? (
                <div className="lightbox-actions">
                  <button className="btn" onClick={() => setAsking(true)}>Ask about it</button>
                </div>
              ) : <Availability d={d} />}
            </>
          )}
          {list.length > 1 && (
            <div className="lightbox-nav">
              <button className="btn ghost" onClick={() => go(-1)} aria-label="Previous drawing">←</button>
              <button className="btn ghost" onClick={() => go(1)} aria-label="Next drawing">→</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
