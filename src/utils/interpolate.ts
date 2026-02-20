import React from 'react';

type Primitive = string | number | boolean | null | undefined;
type Interpolatable = React.ReactNode | Primitive;

/**
 * Interpolates `{key}` placeholders into a renderable ReactNode array.
 *
 * Example:
 *   interpolate("Hello {name}!", { name: <strong>JC</strong> })
 *   -> ["Hello ", <strong>JC</strong>, "!"]
 */
export function interpolate<const TValues extends Record<string, Interpolatable>>(
  template: string,
  values: TValues
): React.ReactNode[] {
  const out: React.ReactNode[] = [];

  const re = /\{([^}]+)\}/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(template)) !== null) {
    const [raw, key] = match;
    const start = match.index;

    if (start > lastIndex) {
      out.push(template.slice(lastIndex, start));
    }

    // Push value (or keep placeholder if missing)
    // We intentionally keep "{key}" if not provided to make issues visible.
    const value = values[key as keyof TValues];
    out.push(value ?? raw);

    lastIndex = start + raw.length;
  }

  // Push remaining literal text
  if (lastIndex < template.length) {
    out.push(template.slice(lastIndex));
  }

  return out;
}

export function interpolateText<const T extends string>(
  template: T,
  values: Record<string, Primitive>
): string {
  const re = /\{([a-zA-Z0-9_.-]+)\}/g;
  return template.replaceAll(re, (_, key: string) => {
    const v = values[key];
    return v == null ? '' : String(v);
  });
}
