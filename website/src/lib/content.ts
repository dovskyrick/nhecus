// Read-side data for the public site (and the back-office's initial loads).
// drawings: Firestore `drawings`. Collections + About: `site/collections`, `site/about`,
// falling back to src/data/defaults.ts until they exist. No Firebase config => demo content.
import { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { getDb } from './firebase';
import type { AboutContent, Collection, Drawing, OriginalStatus } from './types';
import { about as defaultAbout, collections as defaultCollections, demoDrawings } from '../data/defaults';

const ms = (v: unknown) => (v && typeof (v as { toMillis?: () => number }).toMillis === 'function'
  ? (v as { toMillis: () => number }).toMillis() : 0);
const STATUSES: OriginalStatus[] = ['available', 'sold', 'kept'];

export async function fetchDrawings(): Promise<Drawing[]> {
  const db = getDb();
  if (!db) return demoDrawings;
  const snap = await getDocs(collection(db, 'drawings'));
  return snap.docs
    .map(d => {
      const x = d.data();
      return {
        ...(x as Omit<Drawing, 'id'>),
        id: d.id,
        title: x.title ?? '',
        year: Number(x.year) || 0,
        width: Number(x.width) || 0,
        height: Number(x.height) || 0,
        price: Number(x.price) || 0,
        aspect: Number(x.aspect) || undefined,
        description: x.description ?? '',
        medium: x.medium ?? '',
        collectionId: x.collectionId ?? '',
        featured: x.featured === true,
        original: STATUSES.includes(x.original) ? x.original : 'kept',
        prints: x.prints === true,
        createdAt: ms(x.createdAt),
      } satisfies Drawing;
    })
    .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
}

export async function fetchCollections(): Promise<Collection[] | null> {
  const db = getDb();
  if (!db) return null;
  const snap = await getDoc(doc(db, 'site', 'collections'));
  return snap.exists() ? (snap.data().items as Collection[]) : null;
}

export async function fetchAbout(): Promise<AboutContent | null> {
  const db = getDb();
  if (!db) return null;
  const snap = await getDoc(doc(db, 'site', 'about'));
  return snap.exists() ? (snap.data() as AboutContent) : null;
}

// Loaded once per page view and shared by every tab.
let drawingsPromise: Promise<Drawing[]> | null = null;
const loadDrawings = () => (drawingsPromise ??= fetchDrawings());

export function useDrawings() {
  const [data, setData] = useState<Drawing[]>(getDb() ? [] : demoDrawings);
  const [loading, setLoading] = useState(Boolean(getDb()));
  const [demo, setDemo] = useState(!getDb());
  useEffect(() => {
    if (!getDb()) return;
    let alive = true;
    loadDrawings()
      .then(d => { if (alive) setData(d); })
      .catch(err => {
        console.warn('[drawings] showing demo drawings:', err);
        drawingsPromise = null;
        if (alive) { setData(demoDrawings); setDemo(true); }
      })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);
  return { data, loading, demo };
}

// Static defaults render instantly; Firestore content replaces them when it arrives.
function useSiteDoc<T>(fallback: T, loader: () => Promise<T | null>) {
  const [data, setData] = useState<T>(fallback);
  useEffect(() => {
    let alive = true;
    loader().then(v => { if (alive && v) setData(v); }).catch(() => { /* keep defaults */ });
    return () => { alive = false; };
  }, []);
  return data;
}
export const useCollections = () => useSiteDoc<Collection[]>(defaultCollections, fetchCollections);
export const useAbout = () => useSiteDoc<AboutContent>(defaultAbout, fetchAbout);
