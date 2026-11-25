import { useContact } from '../lib/contact';
import CopyText from './CopyText';

// Quiet contact block at the end of the About story.
export default function ContactLine() {
  const { email, handle, dm, any } = useContact();
  return (
    <div className="contact-line">
      <span className="mono enq-label">Originals, prints &amp; requests</span>
      {!any && <p className="mono enq-hint">Contact details coming soon.</p>}
      {email && <CopyText text={email} className="enq-email" />}
      {handle && <p className="enq-text">Instagram DMs are welcome too — <a href={dm} target="_blank" rel="noreferrer">@{handle} ↗</a></p>}
    </div>
  );
}
