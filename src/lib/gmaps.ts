const ALLOWED_HOSTS = new Set([
  'maps.app.goo.gl',
  'goo.gl',
  'www.google.com',
  'google.com',
  'maps.google.com',
])

export function isValidGoogleMapsLink(rawUrl: string): boolean {
  try {
    const url = new URL(rawUrl)
    return url.protocol === 'https:' && ALLOWED_HOSTS.has(url.hostname)
  } catch {
    return false
  }
}

// Best-effort lat/lng extraction from common Google Maps URL shapes:
//   https://www.google.com/maps/@14.5995,120.9842,15z
//   https://www.google.com/maps/place/.../@14.5995,120.9842,17z/...
//   https://www.google.com/maps?q=14.5995,120.9842
// Shortened links (maps.app.goo.gl, goo.gl) can't be parsed client-side since
// they require following a redirect — store the raw link and show it as a
// plain "Open in Google Maps" button instead of a coordinate-based embed.
export function parseLatLngFromGoogleMapsLink(
  rawUrl: string
): { lat: number; lng: number } | null {
  if (!isValidGoogleMapsLink(rawUrl)) return null

  const atMatch = rawUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (atMatch) {
    return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) }
  }

  try {
    const url = new URL(rawUrl)
    const q = url.searchParams.get('q')
    const qMatch = q?.match(/^(-?\d+\.\d+),(-?\d+\.\d+)$/)
    if (qMatch) {
      return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) }
    }
  } catch {
    // ignore, fall through to null
  }

  return null
}

// Zero-API-key embeddable preview URL for an <iframe>.
export function toEmbedSrc(rawUrl: string): string | null {
  const coords = parseLatLngFromGoogleMapsLink(rawUrl)
  if (!coords) return null
  return `https://www.google.com/maps?q=${coords.lat},${coords.lng}&output=embed`
}
