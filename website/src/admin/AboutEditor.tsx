import { useEffect, useState } from 'react';
import { fetchAbout } from '../lib/content';
import { about as defaultAbout } from '../data/defaults';
import type { AboutContent } from '../lib/types';
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
      let next: AboutContent = { story: about.story, imageUrl: about.imageUrl, ...(about.imagePath ? { imagePath: about.imagePath } : {}) };
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
        <h2>About</h2>
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
        <label className="fields">Story (leave an empty line between paragraphs; the last one is the closing line)
          <textarea rows={22} value={about.story} onChange={e => setAbout({ ...about, story: e.target.value })} />
        </label>
      </div>
    </section>
  );
}
