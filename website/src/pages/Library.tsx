import DrawingWall from '../components/DrawingWall';
import SectionHead from '../components/SectionHead';
import { useCollections, useDrawings } from '../lib/content';
import { href } from '../lib/route';
import { LOOSE, LOOSE_ID, thumbOf, type Collection, type Drawing } from '../lib/types';

// #library → the shelf of collections; #library/<id> → that collection's drawings.
export default function Library({ collectionId }: { collectionId?: string }) {
  const { data, loading, demo } = useDrawings();
  const all = useCollections();
  const visible = all.filter(c => c.visible !== false);
  const known = new Set(visible.map(c => c.id));
  const inCol = (id: string) => data.filter(d => (id === LOOSE_ID ? !known.has(d.collectionId) : d.collectionId === id));
  const loose = inCol(LOOSE_ID);
  const shelf: Collection[] = loose.length ? [...visible, LOOSE] : visible;

  if (collectionId) {
    const col = shelf.find(c => c.id === collectionId);
    if (!col) return (
      <div className="library">
        <p className="state mono">That collection isn't here (any more). <a href={href.library}>Back to the library</a></p>
      </div>
    );
    const items = inCol(col.id);
    const i = shelf.indexOf(col);
    const prev = shelf[i - 1], next = shelf[i + 1];
    return (
      <div className="library">
        <a className="back-link mono" href={href.library}>← Library</a>
        <SectionHead label={`Collection ${String(i + 1).padStart(2, '0')}${col.period ? ` · ${col.period}` : ''}`} right={`${items.length} drawing${items.length === 1 ? '' : 's'}`} title={col.title}>
          {col.blurb}
        </SectionHead>
        {loading ? <p className="state mono">Unrolling the sheets…</p>
          : items.length ? <DrawingWall drawings={items} collections={all} showCollection={false} />
          : <p className="state mono">Nothing hung here yet — these are still in the drawer.</p>}
        <nav className="col-pager">
          {prev ? <a href={href.collection(prev.id)}><span className="mono">← previous</span>{prev.title}</a> : <span />}
          {next ? <a href={href.collection(next.id)} className="right"><span className="mono">next →</span>{next.title}</a> : <span />}
        </nav>
      </div>
    );
  }

  return (
    <div className="library">
      <SectionHead label="Everything, sorted" right={`${shelf.length} collections · ${data.length} drawings`} title="Library">
        Every drawing lives in one collection — by theme, by trip, by month, by age.
      </SectionHead>
      {demo && <span className="mono demo-badge">mock-up · demo drawings</span>}
      <ol className="shelf">
        {shelf.map((c, i) => <ShelfRow key={c.id} c={c} i={i} items={inCol(c.id)} />)}
      </ol>
    </div>
  );
}

function ShelfRow({ c, i, items }: { c: Collection; i: number; items: Drawing[] }) {
  return (
    <li>
      <a className={`shelf-row${items.length ? '' : ' empty'}`} href={href.collection(c.id)}>
        <span className="shelf-num mono">{String(i + 1).padStart(2, '0')}</span>
        <span className="shelf-text">
          <span className="shelf-title">{c.title}</span>
          <span className="shelf-blurb">{c.blurb}</span>
          <span className="shelf-meta mono">{[c.period, items.length ? `${items.length} drawing${items.length === 1 ? '' : 's'}` : 'coming soon'].filter(Boolean).join(' · ')}</span>
        </span>
        <span className="shelf-thumbs" aria-hidden="true">
          {items.slice(0, 3).map(d => <img key={d.id} src={thumbOf(d)} alt="" loading="lazy" />)}
        </span>
        <span className="shelf-arrow" aria-hidden="true">→</span>
      </a>
    </li>
  );
}
