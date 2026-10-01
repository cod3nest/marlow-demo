const UNIT_MS = {
  ms: 1,
  s: 1_000,
  m: 60_000,
  h: 3_600_000,
} as const;

type Unit = keyof typeof UNIT_MS;

// Units ordered largest → smallest; used to enforce left-to-right ordering.
const UNIT_ORDER: Unit[] = ["h", "m", "s", "ms"];

export function parseDuration(input: string): number {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error(`Invalid duration: "${input}"`);
  }

  // Match a sequence of one or more <amount><unit> pairs that together consume
  // the entire string.
  const PAIR_RE = /(\d+)(ms|s|m|h)/g;
  let total = 0;
  let lastUnitIndex = -1;
  let consumed = 0;

  for (const match of trimmed.matchAll(PAIR_RE)) {
    const amount = Number(match[1]);
    const unit = match[2] as Unit;
    const unitIndex = UNIT_ORDER.indexOf(unit);

    // Units must appear in strictly decreasing order (no repeats, no out-of-order).
    if (unitIndex <= lastUnitIndex) {
      throw new Error(`Invalid duration: "${input}"`);
    }

    total += amount * UNIT_MS[unit];
    lastUnitIndex = unitIndex;
    consumed += match[0].length;
  }

  // Ensure we matched at least one pair and covered every character.
  if (consumed === 0 || consumed !== trimmed.length) {
    throw new Error(`Invalid duration: "${input}"`);
  }

  return total;
}

export function formatDuration(ms: number): string {
  if (ms < 1_000) return `${ms}ms`;
  if (ms < 60_000) return `${Math.floor(ms / 1_000)}s`;
  if (ms < 3_600_000) return `${Math.floor(ms / 60_000)}m`;
  return `${Math.floor(ms / 3_600_000)}h`;
}
