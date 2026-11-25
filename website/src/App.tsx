import NavBar from './components/NavBar';
import Ticker from './components/Ticker';
import Show from './pages/Show';
import Library from './pages/Library';
import About from './pages/About';
import InstagramLink from './components/InstagramLink';
import { useTheme } from './theme/useTheme';
import { useRoute } from './lib/route';

export default function App() {
  useTheme(); // Paper — the only theme (others are in src/theme/archive/)
  const route = useRoute();
  const key = route.tab === 'library' ? `library/${route.collection ?? ''}` : route.tab;

  return (
    <div className="app">
      <NavBar tab={route.tab} />
      <Ticker />
      <main className="main" key={key}>
        {route.tab === 'show' && <Show />}
        {route.tab === 'library' && <Library collectionId={route.collection} />}
        {route.tab === 'about' && <About />}
      </main>
      <footer className="footer">
        <span className="mono">nhecus © {new Date().getFullYear()}</span>
        <InstagramLink className="mono" />
        <span className="mono">ink pen on paper · all drawings all rights reserved</span>
      </footer>
    </div>
  );
}
