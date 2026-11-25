import { useEffect, useState } from 'react';
import { fetchCollections, fetchDrawings } from '../lib/content';
import { collections as defaults } from '../data/defaults';
import type { Collection, Drawing } from '../lib/types';
import { errMsg, saveCollections } from './services';

// URL-friendly id from the title, made unique. The id is fixed once saved (it's in links).
const slug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'collection';

type Row = Collection & { fresh?: boolean };

export default function CollectionsEditor() {
  const [cols, setCols] = useState<Row[]>(defaults);
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchCollections().then(c => c && setCols(c)).catch(() => {});
    fetchDrawings().then(setDrawings).catch(() => {});
  }, []);

  const count = (id: string) => drawings.filter(d => d.collectionId === id).length;
  const set = (i: number, patch: Partial<Row>) => setCols(cs => cs.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  const move = (i: number, d: -1 | 1) => setCols(cs => {
    const j = i + d; if (j < 0 || j >= cs.length) return cs;
    const c = [...cs]; [c[i], c[j]] = [c[j], c[i]]; return c;
  });
  const add = () => setCols(cs => [...cs, { id: `new-${Date.now()}`, title: 'New collection', blurb: '', period: '', visible: true, fresh: true }]);
  function remove(i: number) {
    const n = count(cols[i].id);
    const warn = n ? `\n\n${n} drawing${n === 1 ? '' : 's'} in it will move to "Loose sheets" until you pick a new collection for them.` : '';
    if (confirm(`Remove the collection "${cols[i].title}"?${warn}`)) setCols(cs => cs.filter((_, j) => j !== i));
  }

  async function save() {
    setBusy(true); setMsg(null);
    try {
      const taken = new Set(cols.filter(c => !c.fresh).map(c => c.id));
      const out: Collection[] = cols.map(({ fresh, ...c }) => {
        if (!fresh) return c;
        let id = slug(c.title), n = 2;
        while (taken.has(id)) id = `${slug(c.title)}-${n++}`;
        taken.add(id);
        return { ...c, id };
      });
      await saveCollections(out);
      setCols(out);
      setMsg('Saved ✓');
    } catch (e) { console.error(e); setMsg(errMsg(e, 'Save')); }
    finally { setBusy(false); }
  }

  return (
    <section>
      <div className="row-between">
        <h2>Collections</h2>
        <button onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save collections'}</button>
      </div>
      <p className="muted">Order here = order in the Library. Every drawing sits in exactly one collection (pick it when editing the drawing). Untick “show” to hide a collection while you fill it.</p>
      {msg && <p className="notice">{msg}</p>}
      <ul className="link-rows">
        {cols.map((c, i) => (
          <li key={c.id} className="card">
            <div className="link-row-head">
              <input className="title-input" value={c.title} onChange={e => set(i, { title: e.target.value })} aria-label="Title" />
              <span className="muted count">{count(c.id)} drawings</span>
              <label className="check"><input type="checkbox" checked={c.visible !== false} onChange={e => set(i, { visible: e.target.checked })} /> show</label>
              <span className="arrows">
                <button className="ghost" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
                <button className="ghost" onClick={() => move(i, 1)} disabled={i === cols.length - 1} aria-label="Move down">↓</button>
                <button className="danger" onClick={() => remove(i)} aria-label="Remove">✕</button>
              </span>
            </div>
            <div className="cols wide-first">
              <input value={c.blurb} placeholder="One-line description" onChange={e => set(i, { blurb: e.target.value })} />
              <input value={c.period ?? ''} placeholder="When (e.g. Oct 2024)" onChange={e => set(i, { period: e.target.value })} />
            </div>
            {!c.fresh && <span className="muted small">link: #library/{c.id}</span>}
          </li>
        ))}
      </ul>
      <button className="ghost" onClick={add}>+ Add collection</button>
    </section>
  );
}
