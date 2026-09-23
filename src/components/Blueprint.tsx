import type { ProjectKind } from "@/content/site";

/**
 * Technical line-drawing for each project type. Stand-in art until real
 * photos/renders are added — swap for <Image> once you have them.
 */
export default function Blueprint({ kind, className = "" }: { kind: ProjectKind; className?: string }) {
  return (
    <svg viewBox="0 0 400 250" className={className} role="img" aria-label={`Schematic illustration: ${labels[kind]}`}>
      <defs>
        <pattern id={`g-${kind}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="rgb(108 180 255 / 0.07)" strokeWidth="1" />
        </pattern>
        <radialGradient id={`v-${kind}`} cx="50%" cy="55%" r="60%">
          <stop offset="0" stopColor="rgb(61 155 255 / 0.18)" />
          <stop offset="1" stopColor="rgb(61 155 255 / 0)" />
        </radialGradient>
      </defs>
      <rect width="400" height="250" fill={`url(#g-${kind})`} />
      <rect width="400" height="250" fill={`url(#v-${kind})`} />
      <g fill="none" stroke="#8cc2ff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        {drawings[kind]}
      </g>
      <text x="14" y="236" fill="rgb(140 194 255 / 0.55)" fontFamily="var(--font-mono)" fontSize="8" letterSpacing="1.5">
        {`DWG · ${labels[kind].toUpperCase()} · SCALE 1:10`}
      </text>
    </svg>
  );
}

const labels: Record<ProjectKind, string> = {
  quadruped: "Quadruped",
  manipulator: "Manipulator",
  rover: "Mobile robot",
  vehicle: "EV platform",
};

const dim = "rgb(255 180 84 / 0.8)";
const faint = "rgb(140 194 255 / 0.35)";

const Joint = ({ x, y, r = 6 }: { x: number; y: number; r?: number }) => (
  <>
    <circle cx={x} cy={y} r={r} />
    <circle cx={x} cy={y} r={1.5} fill="#8cc2ff" />
  </>
);

const drawings: Record<ProjectKind, React.ReactNode> = {
  quadruped: (
    <>
      <rect x="120" y="84" width="170" height="40" rx="8" />
      <rect x="290" y="92" width="26" height="22" rx="4" />
      <circle cx="310" cy="103" r="4" />
      {[
        [140, 1],
        [180, -1],
        [240, 1],
        [275, -1],
      ].map(([x, s], i) => (
        <g key={i} opacity={i % 2 ? 0.55 : 1}>
          <Joint x={x} y={124} />
          <path d={`M${x} 124 L${x + 22 * s} 160`} />
          <Joint x={x + 22 * s} y={160} r={5} />
          <path d={`M${x + 22 * s} 160 L${x} 198`} />
          <circle cx={x} cy={200} r={3.5} />
        </g>
      ))}
      <path d="M90 204H340" stroke={faint} strokeDasharray="4 5" />
      <path d="M120 66V76M290 66V76M120 71H290" stroke={dim} strokeWidth="1" />
      <text x="190" y="62" fill={dim} stroke="none" fontSize="9" fontFamily="var(--font-mono)">L · — mm</text>
    </>
  ),
  manipulator: (
    <>
      <path d="M150 206h80l-10-22h-60z" />
      <path d="M130 206h120" />
      <Joint x={190} y={176} r={9} />
      <path d="M186 172 170 108M194 172 178 108" />
      <Joint x={174} y={104} r={8} />
      <path d="M178 100 262 78M176 108 264 86" />
      <Joint x={264} y={82} r={6} />
      <path d="M270 82h16M286 72v20M286 72h14M286 92h14" />
      <path d="M190 176m-118 0a118 118 0 0 1 236 0" stroke={faint} strokeDasharray="3 5" />
      <text x="300" y="170" fill={faint} stroke="none" fontSize="8" fontFamily="var(--font-mono)">REACH ENVELOPE</text>
      <path d="M200 176 A40 40 0 0 0 178 140" stroke={dim} strokeWidth="1" />
      <text x="206" y="150" fill={dim} stroke="none" fontSize="9" fontFamily="var(--font-mono)">θ₂</text>
    </>
  ),
  rover: (
    <>
      <rect x="130" y="130" width="140" height="40" rx="6" />
      <path d="M150 130v-14h100v14" />
      <path d="M200 116V84" />
      <rect x="186" y="70" width="28" height="14" rx="3" />
      {[1, 2, 3].map((k) => (
        <path key={k} d={`M${200 - 22 * k} 77 A${22 * k} ${22 * k} 0 0 1 ${200 + 22 * k} 77`} stroke={faint} strokeDasharray="2 4" />
      ))}
      {[152, 248].map((x) => (
        <g key={x}>
          <circle cx={x} cy={180} r={20} />
          <circle cx={x} cy={180} r={7} />
        </g>
      ))}
      <path d="M60 212 C120 200 150 222 210 214 S320 196 350 206" stroke={dim} strokeDasharray="5 5" />
      <circle cx="350" cy="206" r="4" stroke={dim} />
      <text x="300" y="228" fill={dim} stroke="none" fontSize="8" fontFamily="var(--font-mono)">GOAL</text>
    </>
  ),
  vehicle: (
    <>
      {[120, 290].map((x) => (
        <g key={x}>
          <circle cx={x} cy={176} r={32} />
          <circle cx={x} cy={176} r={20} stroke={faint} />
          <circle cx={x} cy={176} r={4} />
        </g>
      ))}
      <path d="M120 176 170 120h80l40 56M170 120l30 56h50M200 176l-30-56M150 150h110" />
      <path d="M180 120l-10-34h30" />
      <path d="M260 120l20-28" />
      <path d="M272 92h22" />
      <rect x="185" y="150" width="50" height="18" rx="2" stroke={dim} />
      <text x="193" y="162" fill={dim} stroke="none" fontSize="8" fontFamily="var(--font-mono)">BATT</text>
      <path d="M120 222v-10M290 222v-10M120 217h170" stroke={faint} strokeWidth="1" />
      <text x="180" y="230" fill={faint} stroke="none" fontSize="8" fontFamily="var(--font-mono)">WHEELBASE</text>
    </>
  ),
};
