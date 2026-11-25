import NavBar from './components/NavBar';
import Ticker from './components/Ticker';
import Show from './pages/Show';
import Library from './pages/Library';
import About from './pages/About';
import ThemeMenu from './theme/ThemeMenu';
import { useTheme } from './theme/useTheme';
import { useRoute } from './lib/route';

// Temporary theme picker (bottom-right) while choosing a look. Set to false to hide it.
const SHOW_THEME_MENU = true;

export default function App() {
  useTheme();
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
        <span className="mono">ink pen on paper · all drawings all rights reserved</span>
      </footer>
      {SHOW_THEME_MENU && <ThemeMenu />}
    </div>
  );
}
