import DrawingWall from '../components/DrawingWall';
import { useCollections, useDrawings } from '../lib/content';
import { href } from '../lib/route';

// Front page: the hand-picked wall (drawings with featured = true).
export default function Show() {
  const { data, loading, demo } = useDrawings();
  const collections = useCollections();
  const featured = data.filter(d => d.featured);
  const forSale = featured.filter(d => d.original === 'available' || d.prints).length;

  return (
    <div className="show">
      <header className="show-hero">
        <div className="caption-row">
          <span className="mono">Ink pen illustration</span>
          <span className="mono">{loading ? '…' : `${featured.length} on the wall · ${forSale} available`}</span>
        </div>
        <h1>Drawn once, <em>in ink</em>, no undo.</h1>
        <p className="lede">A short list of favourites. Originals and prints are arranged by direct message — open a drawing and ask.</p>
        {demo && <span className="mono demo-badge">mock-up · demo drawings</span>}
      </header>

      {loading ? <p className="state mono">Unrolling the sheets…</p>
        : featured.length ? <DrawingWall drawings={featured} collections={collections} />
        : <p className="state mono">The wall is being re-hung — have a look in the library.</p>}

      <a className="to-library" href={href.library}>
        <span className="mono">The rest of the drawings</span>
        <span className="to-library-title">Browse the library <span aria-hidden="true">→</span></span>
        <span className="mono">{collections.filter(c => c.visible !== false).length} collections · {data.length} drawings</span>
      </a>
    </div>
  );
}
