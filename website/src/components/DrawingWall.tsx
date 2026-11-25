import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import DrawingCard from './DrawingCard';
import Lightbox from './Lightbox';
import type { Collection, Drawing } from '../lib/types';

// Balanced columns ("masonry") that keep reading order roughly left→right:
// each drawing goes into the currently shortest column, using its aspect ratio.
const MIN_COL = 340; // px per column → 3 columns on a laptop, 1 on a phone

function useColumnCount() {
  const ref = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(3);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setCols(Math.max(1, Math.min(3, Math.floor(el.clientWidth / MIN_COL))));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, cols };
}

export default function DrawingWall({ drawings, collections, showCollection = true }: {
  drawings: Drawing[]; collections?: Collection[]; showCollection?: boolean;
}) {
  const { ref, cols } = useColumnCount();
  const [open, setOpen] = useState<number | null>(null);
  const name = (d: Drawing) => (showCollection ? collections?.find(c => c.id === d.collectionId)?.title : undefined);

  const columns = useMemo(() => {
    const out: { d: Drawing; i: number }[][] = Array.from({ length: cols }, () => []);
    const h = new Array(cols).fill(0);
    drawings.forEach((d, i) => {
      const c = h.indexOf(Math.min(...h));
      out[c].push({ d, i });
      h[c] += 1 / (d.aspect || 1) + 0.25; // + caption height
    });
    return out;
  }, [drawings, cols]);

  return (
    <>
      <div className="wall" ref={ref} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {columns.map((col, ci) => (
          <div className="wall-col" key={ci}>
            {col.map(({ d, i }) => <DrawingCard key={d.id} d={d} index={i} collection={name(d)} onOpen={() => setOpen(i)} />)}
          </div>
        ))}
      </div>
      {open !== null && drawings[open] && (
        <Lightbox list={drawings} index={open} collections={collections} onIndex={setOpen} onClose={() => setOpen(null)} />
      )}
    </>
  );
}
