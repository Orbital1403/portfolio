const thumbnailExtension = /(\.(?:jpe?g|webp))$/i

/** The 800 px JPEG or WebP copy stored next to each hobby photograph. */
export function thumbnail(path: string) {
  return path.replace(thumbnailExtension, '-800$1')
}
