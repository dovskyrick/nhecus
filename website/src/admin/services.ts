// Write-side Firebase access for the back-office only (keeps auth/storage out of the public bundle).
import {
  getAuth, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, type User,
} from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { getApp, getDb } from '../lib/firebase';
import type { AboutContent, Collection, Drawing } from '../lib/types';

const auth = () => getAuth(getApp()!);
const db = () => getDb()!;
const storage = () => getStorage(getApp()!);

export const watchUser = (cb: (u: User | null) => void) => onAuthStateChanged(auth(), cb);
export const login = (email: string, password: string) => signInWithEmailAndPassword(auth(), email, password);
export const resetPassword = (email: string) => sendPasswordResetEmail(auth(), email);
export const logout = () => signOut(auth());

// Shrinks phone photos to a max side length as JPEG before upload, in ≤2× steps with
// high-quality smoothing (one big jump makes jagged ink lines). Also returns the aspect ratio.
async function compress(file: File, maxSide: number, quality: number): Promise<{ blob: Blob; aspect: number }> {
  const bmp = await createImageBitmap(file);
  const aspect = bmp.width / bmp.height;
  const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
  const W = Math.round(bmp.width * scale), H = Math.round(bmp.height * scale);
  let src: CanvasImageSource = bmp, w = bmp.width, h = bmp.height;
  while (w / 2 >= W && h / 2 >= H) {
    w = Math.round(w / 2); h = Math.round(h / 2);
    src = draw(src, w, h);
  }
  const out = draw(src, W, H);
  const blob = await new Promise<Blob>((res, rej) => out.toBlob(b => (b ? res(b) : rej(new Error('compress failed'))), 'image/jpeg', quality));
  return { blob, aspect };
}

function draw(src: CanvasImageSource, w: number, h: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(src, 0, 0, w, h);
  return c;
}

async function put(path: string, blob: Blob) {
  const r = ref(storage(), path);
  await uploadBytes(r, blob, { contentType: 'image/jpeg' }); // re-encoding also strips EXIF/GPS
  return getDownloadURL(r);
}

const stamp = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export async function uploadDrawingImages(file: File) {
  const base = `drawings/${stamp()}`;
  const [full, thumb] = await Promise.all([compress(file, 2400, 0.9), compress(file, 1200, 0.86)]);
  const [imageUrl, thumbnailUrl] = await Promise.all([put(`${base}.jpg`, full.blob), put(`${base}-thumb.jpg`, thumb.blob)]);
  return { imageUrl, thumbnailUrl, imagePath: `${base}.jpg`, thumbPath: `${base}-thumb.jpg`, aspect: Math.round(full.aspect * 1000) / 1000 };
}

export async function uploadAboutImage(file: File) {
  const path = `site/about-${stamp()}.jpg`;
  return { imageUrl: await put(path, (await compress(file, 1600, 0.86)).blob), imagePath: path };
}

export async function removeImage(path?: string) {
  if (!path) return;
  try { await deleteObject(ref(storage(), path)); } catch (e) { console.warn('image delete skipped', e); }
}

export type DrawingData = Omit<Drawing, 'id' | 'createdAt'>;
const clean = <T extends object>(o: T) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as T;

export async function createDrawing(data: DrawingData) {
  await addDoc(collection(db(), 'drawings'), { ...clean(data), createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}
export async function updateDrawing(id: string, data: Partial<DrawingData>) {
  await updateDoc(doc(db(), 'drawings', id), { ...clean(data), updatedAt: serverTimestamp() });
}
export async function deleteDrawing(d: Drawing) {
  await deleteDoc(doc(db(), 'drawings', d.id));
  await removeImage(d.imagePath);
  await removeImage(d.thumbPath);
}

export const saveCollections = (items: Collection[]) => setDoc(doc(db(), 'site', 'collections'), { items: items.map(clean) });
export const saveAbout = (about: AboutContent) => setDoc(doc(db(), 'site', 'about'), clean(about));

// Firestore "permission-denied" → explain instead of a vague failure.
export function errMsg(e: unknown, what: string) {
  const code = (e as { code?: string })?.code ?? '';
  if (code.includes('permission-denied') || code.includes('unauthorized'))
    return `${what} failed: this account isn't allowed to edit yet. Its UID (${auth().currentUser?.uid ?? '?'}) must be added to the admin list in website/firestore.rules and website/storage.rules, then the rules published.`;
  return `${what} failed — check your connection and try again.`;
}
