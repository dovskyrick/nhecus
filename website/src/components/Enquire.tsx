import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useContact } from '../lib/contact';

// "Ask about it" — same inquiry channel and wording as dovsky.com: a Formspree form
// (same inbox) + an Instagram DM link. The Formspree form ID comes from the build-time
// env var VITE_FORMSPREE_ID (GitHub repo variable), never from the repo.
const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID as string | undefined;

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function Inquire({ title, onBack }: { title: string; onBack: () => void }) {
  const { handle, dm } = useContact();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(`Hello, I'm interested in "${title}".`);
  const [status, setStatus] = useState<Status>('idle');
  const first = useRef<HTMLInputElement>(null);

  useEffect(() => { if (window.innerWidth >= 768) first.current?.focus(); }, []);

  async function send(e: FormEvent) {
    e.preventDefault();
    if (!FORMSPREE_ID) { setStatus('error'); return; }
    setStatus('sending');
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        // `site` tells the two sites apart in the shared Formspree inbox.
        body: JSON.stringify({ name, email, message, drawing: title, site: 'nhecus' }),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch { setStatus('error'); }
  }

  const insta = handle && (
    <p className="inquire-alt mono">
      or message on <a href={dm} target="_blank" rel="noreferrer">Instagram ↗</a>
    </p>
  );

  if (status === 'sent') {
    return (
      <div className="inquire">
        <p className="inquire-done">Thank you — your message is on its way. I'll be in touch soon.</p>
        <div><button className="btn ghost" onClick={onBack}>← Back to the drawing</button></div>
      </div>
    );
  }

  return (
    <form className="inquire" onSubmit={send}>
      <label>Name<input ref={first} value={name} onChange={e => setName(e.target.value)} required autoComplete="name" /></label>
      <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" /></label>
      <label>Message<textarea rows={4} value={message} onChange={e => setMessage(e.target.value)} required /></label>
      {status === 'error' && (
        <p className="inquire-error">
          {FORMSPREE_ID ? 'Something went wrong — please try again.' : 'The contact form isn’t set up yet.'}
          {handle && ' You can also reach out on Instagram.'}
        </p>
      )}
      <div className="inquire-actions">
        <button className="btn" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send'}</button>
        <button className="btn ghost" type="button" onClick={onBack}>Cancel</button>
      </div>
      {insta}
    </form>
  );
}
