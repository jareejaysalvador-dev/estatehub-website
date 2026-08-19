/** A resolved, ready-to-use file (PDF/image sales collateral) - mirrors image.ts's ResolvedImage. */
export interface ResolvedFile {
  url: string;
  filename: string | null;
}

interface SanityFileWithUrl {
  url?: string | null;
  filename?: string | null;
}

export function resolveFile(raw: SanityFileWithUrl | null | undefined): ResolvedFile | null {
  if (!raw?.url) return null;
  return {
    url: raw.url,
    filename: raw.filename ?? null,
  };
}

// The HTML `download` attribute is ignored cross-origin (Sanity's CDN is a
// different origin than estatehub.ph), so this query param is the actual
// mechanism for a real download with the original filename, not decoration.
export function withDownloadFilename(file: ResolvedFile): string {
  return `${file.url}?dl=${encodeURIComponent(file.filename ?? "")}`;
}
