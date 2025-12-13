export function normalize(text: string) {
  return text.trim().toLowerCase();
}

export function matchesQuery(input: string, query: string) {
  if (!query) return true;
  return normalize(input).includes(query);
}

