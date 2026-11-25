import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { isFirebaseConfigured } from '../lib/firebase';
import { useTheme } from '../theme/useTheme';
import { logout, watchUser } from './services';
import Login from './Login';
import DrawingsEditor from './DrawingsEditor';
import CollectionsEditor from './CollectionsEditor';
import AboutEditor from './AboutEditor';

type Section = 'drawings' | 'collections' | 'about';
const LABEL: Record<Section, string> = { drawings: 'Drawings', collections: 'Collections', about: 'About & contact' };

export default function AdminApp() {
  useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(!isFirebaseConfigured);
  const [section, setSection] = useState<Section>('drawings');

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return watchUser(u => { setUser(u); setReady(true); });
  }, []);

  if (!isFirebaseConfigured) {
    return (
      <div className="center">
        <div className="card">
          <h1>Back-office</h1>
          <p>Firebase isn't connected yet. Paste the web config into <code>website/src/lib/firebase-config.ts</code> (see <code>docs/HIL-setup.md</code>).</p>
          <p><a href={import.meta.env.BASE_URL}>← Back to the site</a></p>
        </div>
      </div>
    );
  }
  if (!ready) return <div className="center"><p>Loading…</p></div>;
  if (!user) return <Login />;

  return (
    <div className="admin">
      <header className="admin-nav">
        <strong>nhecus · back-office</strong>
        <nav>
          {(Object.keys(LABEL) as Section[]).map(s => (
            <button key={s} className={section === s ? 'active' : ''} onClick={() => setSection(s)}>{LABEL[s]}</button>
          ))}
        </nav>
        <div className="admin-user">
          <span className="muted uid" title="Your account ID (UID) — must be listed in the Firebase rules to save">
            UID <code>{user.uid}</code>
          </span>
          <a href={import.meta.env.BASE_URL} target="_blank" rel="noreferrer">View site ↗</a>
          <button className="ghost" onClick={() => logout()}>Log out</button>
        </div>
      </header>
      <main className="admin-main">
        {section === 'drawings' && <DrawingsEditor />}
        {section === 'collections' && <CollectionsEditor />}
        {section === 'about' && <AboutEditor />}
      </main>
    </div>
  );
}
