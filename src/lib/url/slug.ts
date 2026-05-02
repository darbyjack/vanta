export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function idSlug(id: number, title: string) {
  const slug = slugify(title);
  return slug ? `${id}-${slug}` : String(id);
}

export function parseLeadingId(slug: string) {
  const match = slug.match(/^(\d+)/);
  if (!match) return null;
  return Number(match[1]);
}

export function normalizeQuery(value: string) {
  return value.trim().replace(/\s+/g, " ").slice(0, 100);
}
