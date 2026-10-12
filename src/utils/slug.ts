// src/utils/slug.ts
/** Pretvori Astro Content id ("folder/pc-wall.md[x]") u slug sa zaštitom od kolizija */
export function toSlug(id: string): string {
  const parts = id.split('/')
  const base = parts.pop() ?? id // ime fajla
  const dir = parts.pop() ?? '' // zadnji folder (ako postoji)
  const name = base.replace(/\.(md|mdx)$/i, '')
  return [dir, name].filter(Boolean).join('-')
}
