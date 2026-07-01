/**
 * Generates a unique payment reference with a given prefix.
 * e.g. genRef('REF') → 'REF1234567890'
 */
export function genRef(prefix: string): string {
  return prefix + Date.now().toString().slice(-10);
}
