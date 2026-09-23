/** Planetary set — ring fixed, sun input, carrier output. Kept three-free so the UI can import it without pulling WebGL code. */
export const ZS = 12; // sun teeth
export const ZP = 18; // planet teeth
export const ZR = ZS + 2 * ZP; // ring teeth (48) — coaxial condition
export const RATIO = 1 + ZR / ZS; // 5:1 reduction
