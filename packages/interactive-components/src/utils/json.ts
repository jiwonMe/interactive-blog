export type JsonParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

export function safeJsonParse<T>(input: string): JsonParseResult<T> {
  try {
    return { ok: true, value: JSON.parse(input) as T };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : 'JSON parse error',
    };
  }
}

export function asArray<T = unknown>(value: unknown): JsonParseResult<T[]> {
  if (Array.isArray(value)) return { ok: true, value: value as T[] };
  return { ok: false, error: 'Expected JSON array' };
}

export function parseJsonArray<T = unknown>(input: string): JsonParseResult<T[]> {
  const parsed = safeJsonParse<unknown>(input);
  if (!parsed.ok) return parsed as JsonParseResult<T[]>;
  return asArray<T>(parsed.value);
}

export function escapeForSingleQuotedAttr(value: string) {
  // MDX/JSX attribute: dataJson='...'
  // - backslash first
  // - then single quotes
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}




