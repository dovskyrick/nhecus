// The little speech bubble that keeps turning up in the drawings ("·.II") — used as the logo mark.
export default function Bubble({ className = '' }: { className?: string }) {
  return (
    <svg className={`bubble ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      <path d="M14 10h72a10 10 0 0 1 10 10v42a10 10 0 0 1-10 10H44L24 92l4-20H14A10 10 0 0 1 4 62V20a10 10 0 0 1 10-10z"
        fill="none" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" />
      <circle cx="30" cy="41" r="6" className="bubble-dot" />
      <rect x="48" y="29" width="7" height="24" fill="currentColor" />
      <rect x="63" y="29" width="7" height="24" fill="currentColor" />
    </svg>
  );
}
