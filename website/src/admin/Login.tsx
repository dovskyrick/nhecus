import { useState, type FormEvent } from 'react';
import { login, resetPassword } from './services';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null); setInfo(null);
    try { await login(email.trim(), password); }
    catch { setError('Wrong email or password.'); setBusy(false); }
  }

  async function reset() {
    setError(null); setInfo(null);
    if (!email.trim()) { setError('Type your email first, then click “Set / forgot password”.'); return; }
    try { await resetPassword(email.trim()); setInfo('If that email has an account, a link to set a new password is on its way.'); }
    catch { setError('Could not send the email. Check the address.'); }
  }

  return (
    <div className="center">
      <form className="card login" onSubmit={submit}>
        <h1>nhecus</h1>
        <p className="muted">Back-office</p>
        <label>Email<input type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} required /></label>
        <label>Password<input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required /></label>
        <button type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <button type="button" className="link-btn" onClick={reset}>Set / forgot password</button>
        {error && <p className="error">{error}</p>}
        {info && <p className="notice">{info}</p>}
      </form>
    </div>
  );
}
