export function safeJson(text: string) {
  const trimmed = text.trim();
  const unfenced = trimmed
    .replace(/^```[a-zA-Z]*\s*\n?/, '')
    .replace(/\n?```$/, '')
    .trim();
  return JSON.parse(unfenced);
}
