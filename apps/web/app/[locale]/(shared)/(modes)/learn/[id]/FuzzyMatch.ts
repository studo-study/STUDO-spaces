"use client";
// Levenshtein distance, O(min(n,m)) ruimte
function levenshtein(a: string, b: string): number {
  a = a.toLowerCase().trim();
  b = b.toLowerCase().trim();

  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  // altijd de kortste string als "kolom" nemen voor minder geheugen
  if (a.length > b.length) [a, b] = [b, a];

  let prevRow = Array.from({ length: a.length + 1 }, (_, i) => i);

  for (let j = 1; j <= b.length; j++) {
    const currRow = [j];
    for (let i = 1; i <= a.length; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      currRow[i] = Math.min(
        prevRow[i] + 1, // deletion
        currRow[i - 1] + 1, // insertion
        prevRow[i - 1] + cost, // substitution
      );
    }
    prevRow = currRow;
  }

  return prevRow[a.length];
}

// normaliseer naar een similarity score tussen 0 en 1
function similarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(a, b) / maxLen;
}

export function CardCorrector(
  input: string,
  corrector: string,
  threshold: number = 0.7,
): boolean {
  const hasParens = corrector.includes("(") && corrector.includes(")");
  const inputHasParens = input.includes("(") && input.includes(")");

  const target =
    hasParens && !inputHasParens
      ? corrector
          .replace(/\(.*?\)/g, "")
          .replace(/\s+/g, " ")
          .trim()
      : corrector;

  return similarity(input, target) >= threshold;
}
