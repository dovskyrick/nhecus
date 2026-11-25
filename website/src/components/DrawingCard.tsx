import { thumbOf, type Drawing } from '../lib/types';

// A drawing on its paper mat, caption underneath. Keeps the drawing's own proportions.
export default function DrawingCard({ d, index, collection, onOpen }: {
  d: Drawing; index: number; collection?: string; onOpen: () => void;
}) {
  return (
    <button className="card" onClick={onOpen} aria-label={`${d.title} — view`}>
      <span className="card-mat">
        <img src={thumbOf(d)} alt={d.title} loading="lazy" style={d.aspect ? { aspectRatio: String(d.aspect) } : undefined} />
      </span>
      <span className="card-cap">
        <span className="card-num mono">{String(index + 1).padStart(2, '0')}</span>
        <span className="card-text">
          <span className="card-title">{d.title}</span>
          <span className="card-meta mono">{[collection, d.year || ''].filter(Boolean).join(' · ')}</span>
          <Availability d={d} compact />
        </span>
      </span>
    </button>
  );
}

export function Availability({ d, compact }: { d: Drawing; compact?: boolean }) {
  const marks = [
    d.original === 'available' && 'Original',
    d.prints && 'Prints',
  ].filter(Boolean) as string[];
  if (!marks.length) return compact ? null : <span className="avail mono">Not for sale</span>;
  return (
    <span className="avail mono" title={`Available: ${marks.join(' & ').toLowerCase()}`}>
      <i className="seal-dot" aria-hidden="true" />{compact ? marks.join(' + ') : `Available — ${marks.join(' & ').toLowerCase()}`}
    </span>
  );
}
