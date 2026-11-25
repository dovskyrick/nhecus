import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { fetchCollections, fetchDrawings } from '../lib/content';
import { collections as defaultCollections } from '../data/defaults';
import { ORIGINAL_LABEL, price, size, thumbOf, type Collection, type Drawing, type OriginalStatus } from '../lib/types';
import { createDrawing, deleteDrawing, errMsg, removeImage, updateDrawing, uploadDrawingImages, type DrawingData } from './services';

type Draft = {
  id?: string; title: string; year: string; medium: string; width: string; height: string; description: string;
  collectionId: string; featured: boolean; original: OriginalStatus; prints: boolean; price: string;
  imageUrl: string; thumbnailUrl?: string; imagePath?: string; thumbPath?: string; aspect?: number;
};

const empty = (collectionId = ''): Draft => ({
  title: '', year: String(new Date().getFullYear()), medium: 'Ink pen on paper', width: '', height: '', description: '',
  collectionId, featured: false, original: 'available', prints: false, price: '', imageUrl: '',
});

const toDraft = (d: Drawing): Draft => ({
  id: d.id, title: d.title, year: d.year ? String(d.year) : '', medium: d.medium, width: d.width ? String(d.width) : '',
  height: d.height ? String(d.height) : '', description: d.description, collectionId: d.collectionId, featured: d.featured,
  original: d.original, prints: d.prints, price: d.price ? String(d.price) : '', imageUrl: d.imageUrl,
  thumbnailUrl: d.thumbnailUrl, imagePath: d.imagePath, thumbPath: d.thumbPath, aspect: d.aspect,
});

// Filter values: 'all' | 'show' | 'unsorted' | <collection id>
type Filter = string;

export default function DrawingsEditor() {
  const [items, setItems] = useState<Drawing[]>([]);
  const [cols, setCols] = useState<Collection[]>(defaultCollections);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const reload = () => fetchDrawings().then(setItems).finally(() => setLoading(false));
  useEffect(() => {
    reload();
    fetchCollections().then(c => c && setCols(c)).catch(() => {});
  }, []);

  const known = useMemo(() => new Set(cols.map(c => c.id)), [cols]);
  const colName = (id: string) => cols.find(c => c.id === id)?.title ?? 'Unsorted';
  const shown = items.filter(d =>
    filter === 'all' ? true
      : filter === 'show' ? d.featured
      : filter === 'unsorted' ? !known.has(d.collectionId)
      : d.collectionId === filter);

  function open(d?: Drawing) {
    const start = filter !== 'all' && filter !== 'show' && filter !== 'unsorted' ? filter : (cols[0]?.id ?? '');
    setDraft(d ? toDraft(d) : { ...empty(start), featured: filter === 'show' });
    setFile(null); setMsg(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  const set = (patch: Partial<Draft>) => setDraft(d => (d ? { ...d, ...patch } : d));

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!draft) return;
    if (!draft.imageUrl && !file) { setMsg('Please choose a photo of the drawing.'); return; }
    setBusy(true); setMsg(null);
    try {
      let images = { imageUrl: draft.imageUrl, thumbnailUrl: draft.thumbnailUrl, imagePath: draft.imagePath, thumbPath: draft.thumbPath, aspect: draft.aspect };
      if (file) {
        images = await uploadDrawingImages(file);
        if (draft.id) { await removeImage(draft.imagePath); await removeImage(draft.thumbPath); }
      }
      const data: DrawingData = {
        title: draft.title.trim(),
        year: Number(draft.year) || 0,
        medium: draft.medium.trim(),
        width: Number(draft.width) || 0,
        height: Number(draft.height) || 0,
        description: draft.description.trim(),
        collectionId: draft.collectionId,
        featured: draft.featured,
        original: draft.original,
        prints: draft.prints,
        price: Number(draft.price) || 0,
        ...images,
      };
      if (draft.id) await updateDrawing(draft.id, data);
      else await createDrawing(data);
      setDraft(null);
      await reload();
      setMsg('Saved ✓');
    } catch (err) {
      console.error(err); setMsg(errMsg(err, 'Save'));
    } finally { setBusy(false); }
  }

  // ★ toggle straight from the list — no need to open the drawing.
  async function toggleShow(d: Drawing) {
    setItems(xs => xs.map(x => (x.id === d.id ? { ...x, featured: !d.featured } : x)));
    try { await updateDrawing(d.id, { featured: !d.featured }); }
    catch (err) {
      console.error(err); setMsg(errMsg(err, 'Update'));
      setItems(xs => xs.map(x => (x.id === d.id ? { ...x, featured: d.featured } : x)));
    }
  }

  async function remove(d: Drawing) {
    if (!confirm(`Delete "${d.title}"? It disappears from the site. This can't be undone.`)) return;
    setBusy(true);
    try { await deleteDrawing(d); await reload(); setMsg('Deleted.'); }
    catch (err) { console.error(err); setMsg(errMsg(err, 'Delete')); }
    finally { setBusy(false); }
  }

  const preview = file ? URL.createObjectURL(file) : draft?.imageUrl;
  const unsorted = items.filter(d => !known.has(d.collectionId)).length;

  return (
    <section>
      <div className="row-between">
        <h2>Drawings</h2>
        <button onClick={() => open()} disabled={busy}>+ Add drawing</button>
      </div>
      <p className="muted">Every drawing is in the Library, inside one collection. Tick <b>★ In the Show</b> to also hang it on the front page — or use the ★ button in the list.</p>
      {msg && <p className="notice">{msg}</p>}

      {draft && (
        <form className="card editor" onSubmit={save}>
          <h3>{draft.id ? 'Edit drawing' : 'New drawing'}</h3>
          <div className="editor-grid">
            <div className="photo-pick">
              {preview ? <img src={preview} alt="" /> : <div className="photo-empty">No photo</div>}
              <label className="file-btn">
                {preview ? 'Change photo' : 'Choose photo'}
                <input type="file" accept="image/*" hidden onChange={e => setFile(e.target.files?.[0] ?? null)} />
              </label>
              <span className="muted small">Crop it to the paper first — what you upload is what's shown.</span>
            </div>
            <div className="fields">
              <label>Title<input value={draft.title} onChange={e => set({ title: e.target.value })} required /></label>
              <label>Collection
                <select value={known.has(draft.collectionId) ? draft.collectionId : ''} onChange={e => set({ collectionId: e.target.value })}>
                  <option value="">— Unsorted (Loose sheets) —</option>
                  {cols.map(c => <option key={c.id} value={c.id}>{c.title}{c.visible === false ? ' (hidden)' : ''}</option>)}
                </select>
              </label>
              <label className="check feature-check">
                <input type="checkbox" checked={draft.featured} onChange={e => set({ featured: e.target.checked })} /> ★ In the Show (front page)
              </label>
              <fieldset className="status-pick">
                <legend>Original</legend>
                {(['available', 'sold', 'kept'] as OriginalStatus[]).map(s => (
                  <label key={s} className="check">
                    <input type="radio" name="original" checked={draft.original === s} onChange={() => set({ original: s })} /> {ORIGINAL_LABEL[s].replace('Original ', '')}
                  </label>
                ))}
                <label className="check"><input type="checkbox" checked={draft.prints} onChange={e => set({ prints: e.target.checked })} /> Prints available</label>
              </fieldset>
              <div className="cols">
                <label>Price of original (€, optional)<input type="number" min="0" step="1" value={draft.price} onChange={e => set({ price: e.target.value })} placeholder="empty = on request" /></label>
                <label>Year<input type="number" min="1900" max="2100" value={draft.year} onChange={e => set({ year: e.target.value })} /></label>
              </div>
              <div className="cols">
                <label>Width (cm)<input type="number" min="0" step="0.1" value={draft.width} onChange={e => set({ width: e.target.value })} /></label>
                <label>Height (cm)<input type="number" min="0" step="0.1" value={draft.height} onChange={e => set({ height: e.target.value })} /></label>
              </div>
              <label>Medium<input list="mediums" value={draft.medium} onChange={e => set({ medium: e.target.value })} /></label>
              <datalist id="mediums">
                <option value="Ink pen on paper" /><option value="Marker on paper" /><option value="Ink & watercolour" />
                <option value="Ink pen on sticker paper" /><option value="Fineliner in sketchbook" />
              </datalist>
              <label>Description<textarea rows={3} value={draft.description} onChange={e => set({ description: e.target.value })} /></label>
            </div>
          </div>
          <div className="row-end">
            <button type="button" className="ghost" onClick={() => setDraft(null)} disabled={busy}>Cancel</button>
            <button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      )}

      <div className="filter-bar">
        <label>Show
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All drawings ({items.length})</option>
            <option value="show">★ In the Show ({items.filter(d => d.featured).length})</option>
            {cols.map(c => <option key={c.id} value={c.id}>{c.title} ({items.filter(d => d.collectionId === c.id).length})</option>)}
            {unsorted > 0 && <option value="unsorted">Unsorted ({unsorted})</option>}
          </select>
        </label>
      </div>

      {loading ? <p className="muted">Loading…</p> : (
        <ul className="item-list">
          {shown.length === 0 && <li className="muted empty-li">Nothing here yet.</li>}
          {shown.map(d => (
            <li key={d.id}>
              <img src={thumbOf(d)} alt="" />
              <div className="item-text">
                <strong>{d.title}</strong>
                <span className="muted">{[colName(d.collectionId), d.year || '', size(d), d.original === 'available' ? `original ${price(d) || 'for sale'}` : `original ${d.original}`, d.prints ? 'prints' : ''].filter(Boolean).join(' · ')}</span>
              </div>
              <button className={`star${d.featured ? ' on' : ''}`} onClick={() => toggleShow(d)} disabled={busy}
                title={d.featured ? 'In the Show — click to take it down' : 'Not in the Show — click to hang it'} aria-pressed={d.featured}>
                {d.featured ? '★ Show' : '☆ Show'}
              </button>
              <button className="ghost" onClick={() => open(d)} disabled={busy}>Edit</button>
              <button className="danger" onClick={() => remove(d)} disabled={busy}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
