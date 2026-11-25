// Hash routing — works on GitHub Pages without server rewrites.
//   #show            The Show (default)
//   #library         list of collections
//   #library/<id>    one collection
//   #about
import { useEffect, useState } from 'react';

export type Route =
  | { tab: 'show' }
  | { tab: 'library'; collection?: string }
  | { tab: 'about' };

export function parse(hash = window.location.hash): Route {
  const [head, sub] = hash.replace(/^#\/?/, '').split('/');
  if (head === 'library') return { tab: 'library', collection: sub ? decodeURIComponent(sub) : undefined };
  if (head === 'about') return { tab: 'about' };
  return { tab: 'show' };
}

export const href = {
  show: '#show',
  library: '#library',
  collection: (id: string) => `#library/${encodeURIComponent(id)}`,
  about: '#about',
};

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parse());
  useEffect(() => {
    const onHash = () => { setRoute(parse()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return route;
}
