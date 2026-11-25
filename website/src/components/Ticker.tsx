// Scrolling strip under the nav. Words live in src/data/defaults.ts. Remove by deleting <Ticker /> in App.tsx.
import { TICKER } from '../data/defaults';

export default function Ticker() {
  const line = TICKER.map(w => <span key={w}>{w}<i>·</i></span>);
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">{line}{line}{line}{line}</div>
    </div>
  );
}
