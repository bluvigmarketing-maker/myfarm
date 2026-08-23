const ALLOWED_VIDEO_HOSTS = [
  "facebook.com",
  "fb.watch",
  "youtube.com",
  "youtu.be",
  "tiktok.com",
];

export function isValidIntroVideoLink(rawUrl: string): boolean {
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "https:") return false;
    const host = url.hostname.replace(/^www\./, "");
    return ALLOWED_VIDEO_HOSTS.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
  } catch {
    return false;
  }
}

// Only YouTube supports a no-API-key iframe embed via a plain URL pattern.
// Facebook/TikTok links are shown as an "open in app" link instead.
export function toYouTubeEmbedSrc(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = url.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === "youtube.com" || host.endsWith(".youtube.com")) {
      const id = url.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    return null;
  } catch {
    return null;
  }
}
