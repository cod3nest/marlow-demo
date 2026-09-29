const UNIT_MS = {
  ms: 1,
  s: 1_000,
  m: 60_000,
  h: 3_600_000,
} as const;

type Unit = keyof typeof UNIT_MS;

export function parseDuration(input: string): number {
  const match = /^(\d+)(ms|s|m|h)$/.exec(input.trim());
  if (!match) {
    throw new Error(`Invalid duration: "${input}"`);
  }
  const [, amount, unit] = match;
  return Number(amount) * UNIT_MS[unit as Unit];
}

export function formatDuration(ms: number): string {
  if (ms < 1_000) return `${ms}ms`;
  if (ms < 60_000) return `${Math.floor(ms / 1_000)}s`;
  if (ms < 3_600_000) return `${Math.floor(ms / 60_000)}m`;
  return `${Math.floor(ms / 3_600_000)}h`;
}
