export function checkAuth(): boolean {
  if (typeof document === "undefined") return false; // SSR guard
    return document.cookie.split("; ").some(c => c.startsWith("token="));
}