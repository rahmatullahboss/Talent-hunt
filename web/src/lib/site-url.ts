const FALLBACK_SITE_URL = "https://talenthuntbd.vercel.app";

export function getNormalizedSiteUrl(): string {
  const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const siteUrl = envSiteUrl && envSiteUrl.length > 0 ? envSiteUrl : FALLBACK_SITE_URL;
  return siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
}
