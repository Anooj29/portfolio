/** AJ monogram — two strokes that read as an "A" and a "J", drawn like a linkage. */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden fill="none">
      <path d="M4 26 12.5 5 21 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.6 18h9.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M27 5v15.5a5.5 5.5 0 0 1-9.6 3.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="27" cy="5" r="1.6" fill="var(--color-signal-400)" />
    </svg>
  );
}
