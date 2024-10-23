import fallbackRelease from '../data/alphafloorefb-release.json';
import { renderMarkdown } from './markdown';

export interface ReleaseInfo {
  version: string;
  name: string;
  publishedAt: string;
  publishedAtIso: string;
  downloadUrl: string;
  assetName: string;
  assetSizeFormatted: string;
  bodyMarkdown: string;
  bodyHtml: string;
  releasePageUrl: string;
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return isoString;
  }
}

/**
 * Fetches the latest release from GitHub API with graceful fallback to local data.
 * Filters by product prefix (e.g. 'alphafloorefb-') so multiple products on the same
 * repository do not conflict. Safe for build-time execution in SSG.
 */
export async function getLatestRelease(productPrefix = 'alphafloorefb-'): Promise<ReleaseInfo> {
  const repoCandidates = [
    'CyberPatate/cyberpatate.github.io',
    'CyberPatate/AlphaFloorEFB',
  ];

  const token = typeof process !== 'undefined' ? process.env.GITHUB_TOKEN : undefined;
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'cyberpatate-website-builder',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  for (const repo of repoCandidates) {
    try {
      const url = `https://api.github.com/repos/${repo}/releases?per_page=30`;
      const res = await fetch(url, { headers, signal: AbortSignal.timeout(3000) });

      if (res.ok) {
        const releases = await res.json();
        if (Array.isArray(releases) && releases.length > 0) {
          // Find the latest release matching productPrefix (e.g. "alphafloorefb-")
          // If querying AlphaFloorEFB directly (standalone repo), it might not have prefix, so fallback to first non-draft
          const targetRelease = releases.find((r: any) =>
            typeof r.tag_name === 'string' && r.tag_name.startsWith(productPrefix)
          ) || releases.find((r: any) => !r.prerelease && !r.draft) || releases[0];

          if (targetRelease) {
            const rawTag = targetRelease.tag_name || fallbackRelease.tag_name;
            const version = rawTag.startsWith(productPrefix)
              ? rawTag.slice(productPrefix.length)
              : rawTag;

            const zipAsset = targetRelease.assets?.find((a: any) =>
              typeof a.name === 'string' && a.name.endsWith('.zip')
            );

            const assetName = zipAsset?.name || fallbackRelease.asset_name;
            const downloadUrl = zipAsset?.browser_download_url || fallbackRelease.download_url;
            const assetSize = zipAsset?.size || fallbackRelease.asset_size;
            const publishedAtIso = targetRelease.published_at || fallbackRelease.published_at;
            const bodyMarkdown = targetRelease.body || fallbackRelease.body;

            return {
              version,
              name: targetRelease.name || `AlphaFloor EFB ${version}`,
              publishedAt: formatDate(publishedAtIso),
              publishedAtIso,
              downloadUrl,
              assetName,
              assetSizeFormatted: formatBytes(assetSize),
              bodyMarkdown,
              bodyHtml: renderMarkdown(bodyMarkdown),
              releasePageUrl: targetRelease.html_url || fallbackRelease.html_url,
            };
          }
        }
      }
    } catch {
      // Ignore network / timeout errors and try candidate or fallback
    }
  }

  // Fallback to local checked-in release metadata
  const fallbackRawTag = fallbackRelease.tag_name;
  const fallbackVersion = fallbackRawTag.startsWith(productPrefix)
    ? fallbackRawTag.slice(productPrefix.length)
    : fallbackRawTag;

  return {
    version: fallbackVersion,
    name: fallbackRelease.name,
    publishedAt: formatDate(fallbackRelease.published_at),
    publishedAtIso: fallbackRelease.published_at,
    downloadUrl: fallbackRelease.download_url,
    assetName: fallbackRelease.asset_name,
    assetSizeFormatted: formatBytes(fallbackRelease.asset_size),
    bodyMarkdown: fallbackRelease.body,
    bodyHtml: renderMarkdown(fallbackRelease.body),
    releasePageUrl: fallbackRelease.html_url,
  };
}
