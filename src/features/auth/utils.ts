/**
 * Sanitizes the 'next' redirect parameter to prevent open redirects.
 * Only relative paths starting with a single '/' and not containing '//' or '\' are allowed.
 */
export function sanitizeNextUrl(next: string | null): string {
  if (!next) return "/home";
  if (next.startsWith("/") && !next.startsWith("//") && !next.includes("\\")) {
    return next;
  }
  return "/home";
}
