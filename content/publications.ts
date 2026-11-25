
// NDESC publications for /publications/. Educational resources are NOT kept here: they stay in
// `resources` (content/club.ts), which /resources/ also reads, so a file added there shows on both.
// Add a DURBIN issue or an article only when the club supplies the real file; the page shows a quiet
// empty state until then.

export type DurbinIssue = {
  title: string;
  year: string;
  description?: string;
  /** Cover in public/publications/, e.g. "/publications/durbin-2025.webp". */
  cover?: string;
  /** PDF in public/publications/, e.g. "/publications/durbin-2025.pdf". */
  pdf?: string;
  /** e.g. "PDF, 12 MB, 64 pages". */
  fileInfo?: string;
  editors?: string;
};

export type Article = {
  title: string;
  date: string;
  author?: string;
  summary: string;
  url: string;
};

export const durbin = {
  name: "DURBIN",
  about: "DURBIN is NDESC's own annual magazine." as string,
  issues: [] as DurbinIssue[],
};

export const articles: Article[] = [];
