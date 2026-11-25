import { useEffect, useRef, useState, type FormEvent } from 'react';

// Selling is by direct message: a Formspree form and/or an Instagram DM link.
// Both IDs come from build-time env vars (GitHub repository variables) — never the repo (it's public).
const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID as string | undefined;
const INSTAGRAM = import.meta.env.VITE_INSTAGRAM_HANDLE as string | undefined;

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function Inquire({ title, onBack }: { title: string; onBack: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(`Hello, I'm interested in "${title}" — the original / a print (delete as appropriate).`);
  const [status, setStatus] = useState<Status>('idle');
  const first = useRef<HTMLInputElement>(null);

  useEffect(() => { if (window.innerWidth >= 768) first.current?.focus(); }, []);

  const insta = INSTAGRAM && (
    <p className="inquire-alt mono">
      or message on <a href={`https://ig.me/m/${INSTAGRAM}`} target="_blank" rel="noreferrer">Instagram ↗</a>
    </p>
  );

  if (!FORMSPREE_ID) {
    return (
      <div className="inquire">
        <p>Originals and prints are arranged by direct message.</p>
        {INSTAGRAM
          ? <a className="btn" href={`https://ig.me/m/${INSTAGRAM}`} target="_blank" rel="noreferrer">Message on Instagram ↗</a>
          : <p className="inquire-error">The contact channel isn’t set up yet — check back soon.</p>}
        <button className="btn ghost" onClick={onBack}>← Back</button>
      </div>
    );
  }

  async function send(e: FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, message, drawing: title }),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch { setStatus('error'); }
  }

  if (status === 'sent') {
    return (
      <div className="inquire">
        <p className="inquire-done">Thank you — your message is on its way. I'll get back to you soon.</p>
        <button className="btn ghost" onClick={onBack}>← Back to the drawing</button>
      </div>
    );
  }

  return (
    <form className="inquire" onSubmit={send}>
      <label>Name<input ref={first} value={name} onChange={e => setName(e.target.value)} required autoComplete="name" /></label>
      <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" /></label>
      <label>Message<textarea rows={4} value={message} onChange={e => setMessage(e.target.value)} required /></label>
      {status === 'error' && <p className="inquire-error">Something went wrong — please try again.{INSTAGRAM && ' You can also reach out on Instagram.'}</p>}
      <div className="lightbox-actions">
        <button className="btn" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send'}</button>
        <button className="btn ghost" type="button" onClick={onBack}>Cancel</button>
      </div>
      {insta}
    </form>
  );
}
