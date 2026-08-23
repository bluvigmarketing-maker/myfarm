export const FARM_MEDIA_BUCKET = "farm-media";

export function storagePathFromPublicUrl(publicUrl: string): string | null {
  const marker = `/${FARM_MEDIA_BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return publicUrl.slice(idx + marker.length);
}
