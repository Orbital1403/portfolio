const jpegExtension = /(\.jpe?g)$/i

/** The 800 px copy written next to each hobby photograph by scripts/optimize-images.mjs. */
export function thumbnail(path: string) {
  return path.replace(jpegExtension, '-800$1')
}
