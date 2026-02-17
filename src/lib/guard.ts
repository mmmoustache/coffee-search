const INJECTION_PATTERNS = [
  /ignore (all|previous) instructions/i,
  /system prompt/i,
  /developer message/i,
  /you are now/i,
  /act as/i,
  /jailbreak/i,
  /bypass/i,
];

const OFFTOPIC_PATTERNS = [/cake recipe/i, /write a poem/i, /relationship advice/i];

const ILLEGAL_PATTERNS = [/how to make/i, /buy/i, /forge/i, /credit card/i, /steal/i];

export function guardUserInput(query: string) {
  const q = query.trim();

  if (INJECTION_PATTERNS.some((r) => r.test(q))) return { ok: false, reason: 'injection' as const };
  if (ILLEGAL_PATTERNS.some((r) => r.test(q))) return { ok: false, reason: 'illegal' as const };
  if (OFFTOPIC_PATTERNS.some((r) => r.test(q))) return { ok: false, reason: 'offtopic' as const };

  return { ok: true };
}
