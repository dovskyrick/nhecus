import Bubble from './Bubble';
import { href, type Route } from '../lib/route';

const ITEMS: { id: Route['tab']; label: string; href: string }[] = [
  { id: 'show', label: 'The Show', href: href.show },
  { id: 'library', label: 'Library', href: href.library },
  { id: 'about', label: 'About', href: href.about },
];

export default function NavBar({ tab }: { tab: Route['tab'] }) {
  return (
    <header className="nav">
      <a href={href.show} className="nav-logo" aria-label="nhecus — home">
        <Bubble /> <span>nhecus</span>
      </a>
      <nav className="nav-links">
        {ITEMS.map(i => (
          <a key={i.id} href={i.href} className={tab === i.id ? 'active' : ''} aria-current={tab === i.id ? 'page' : undefined}>{i.label}</a>
        ))}
      </nav>
    </header>
  );
}
