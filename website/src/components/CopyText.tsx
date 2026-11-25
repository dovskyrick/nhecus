import { useState } from 'react';

// Text the visitor can select or copy with one click — used for the email address
// instead of a mailto: link (which would pop open a mail program).
export default function CopyText({ text, className = '' }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* no clipboard (old browser / http): the text is still selectable */ }
  }
  return (
    <span className={`copy-text ${className}`}>
      <span className="copy-value">{text}</span>
      <button type="button" className="copy-btn mono" onClick={copy} aria-label={`Copy ${text}`}>
        {copied ? 'Copied ✓' : 'Copy'}
      </button>
    </span>
  );
}
