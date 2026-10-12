/** The 800 px copy written next to each hobby photograph by scripts/optimize-images.mjs. */
export function thumbnail(path: string) {
  return path.replace(/(\.jpe?g)$/i, '-800$1')
}
