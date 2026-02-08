export function toInt(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const n = Number(String(value).trim());
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

export function toFloat(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const n = Number(String(value).trim());
  return Number.isFinite(n) ? n : null;
}

export function splitMultiline(value: unknown): string[] {
  if (typeof value !== 'string') return [];
  return value
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseWeightG(value: unknown): number | null {
  if (typeof value !== 'string') return null;
  const m = value.trim().match(/^(\d+)\s*g$/i);
  if (!m) return null;
  return Number(m[1]);
}

export function normalizeSku(v: unknown): string {
  return String(v ?? '')
    .trim()
    .replace(/\.0$/, '');
}
