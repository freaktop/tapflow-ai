export function isValidActionUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return ["http:", "https:", "tel:", "mailto:"].includes(u.protocol);
  } catch {
    return false;
  }
}