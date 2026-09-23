/**
 * Normalizes a problem URL according to PRD section 4.1:
 * 1. Trim leading/trailing whitespace.
 * 2. Remove query parameters (?utm_source, ?ref, etc.).
 * 3. Remove trailing slashes.
 */
export function normalizeUrl(rawUrl: string): string {
  if (!rawUrl) return "";

  let cleaned = rawUrl.trim();

  // Ensure protocol exists for proper URL parsing
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = `https://${cleaned}`;
  }

  try {
    const parsed = new URL(cleaned);
    // Strip hash and query parameters
    parsed.search = "";
    parsed.hash = "";

    let normalized = parsed.toString();

    // Strip trailing slashes
    while (normalized.endsWith("/")) {
      normalized = normalized.slice(0, -1);
    }

    return normalized;
  } catch {
    // Fallback if URL constructor fails
    const withoutQuery = cleaned.split("?")[0].split("#")[0];
    return withoutQuery.replace(/\/+$/, "");
  }
}
