import type { ReactNode } from 'react';

// Mono caption row + big display title.
export default function SectionHead({ label, right, title, children }: {
  label: string; right?: string; title: ReactNode; children?: ReactNode;
}) {
  return (
    <div className="section-head">
      <div className="caption-row">
        <span className="mono">{label}</span>
        {right && <span className="mono">{right}</span>}
      </div>
      <h1>{title}</h1>
      {children && <div className="section-lede">{children}</div>}
    </div>
  );
}
