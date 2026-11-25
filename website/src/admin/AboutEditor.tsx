import { useEffect, useState } from 'react';
import { fetchAbout } from '../lib/content';
import { about as defaultAbout } from '../data/defaults';
import type { AboutContent } from '../lib/types';
import { cleanHandle } from '../lib/instagram';
import { errMsg, removeImage, saveAbout, uploadAboutImage } from './services';

export default function AboutEditor() {
  const [about, setAbout] = useState<AboutContent>(defaultAbout);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => { fetchAbout().then(a => a && setAbout(a)).catch(() => {}); }, []);

  async function save() {
    setBusy(true); setMsg(null);
    try {
      const instagram = cleanHandle(about.instagram);
      if (about.instagram?.trim() && !instagram) { setMsg('That Instagram handle looks wrong — use just the name, e.g. nhecus.ink'); setBusy(false); return; }
      let next: AboutContent = { story: about.story, imageUrl: about.imageUrl, instagram, ...(about.imagePath ? { imagePath: about.imagePath } : {}) };
      if (file) {
        const old = about.imagePath;
        next = { ...next, ...(await uploadAboutImage(file)) };
        await removeImage(old);
      }
      await saveAbout(next);
      setAbout(next); setFile(null); setMsg('Saved ✓');
    } catch (e) { console.error(e); setMsg(errMsg(e, 'Save')); }
    finally { setBusy(false); }
  }

  const preview = file ? URL.createObjectURL(file) : about.imageUrl;

  return (
    <section>
      <div className="row-between">
        <h2>About &amp; contact</h2>
        <button onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save about'}</button>
      </div>
      {msg && <p className="notice">{msg}</p>}
      <div className="card editor-grid">
        <div className="photo-pick">
          <img src={preview} alt="" />
          <label className="file-btn">Change photo
            <input type="file" accept="image/*" hidden onChange={e => setFile(e.target.files?.[0] ?? null)} />
          </label>
        </div>
        <div className="fields">
          <label>Instagram handle — every “Ask on Instagram” button opens a DM to it
            <input value={about.instagram ?? ''} placeholder="e.g. nhecus.ink (no @)" onChange={e => setAbout({ ...about, instagram: e.target.value })} />
          </label>
          <label>Story (leave an empty line between paragraphs; the last one is the closing line)
            <textarea rows={20} value={about.story} onChange={e => setAbout({ ...about, story: e.target.value })} />
          </label>
        </div>
      </div>
    </section>
  );
}
