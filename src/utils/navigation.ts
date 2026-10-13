const trailingSlashes = /\/+$/

/** Compare site paths consistently before and after client-side navigation. */
export function normalizePath(path: string, base = '/') {
  const prefix = base.replace(trailingSlashes, '')
  const relative = prefix && (path === prefix || path.startsWith(`${prefix}/`))
    ? path.slice(prefix.length)
    : path
  return relative.replace(trailingSlashes, '') || '/'
}

export function isActivePath(path: string, target: string) {
  return path === target || (target !== '/' && path.startsWith(`${target}/`))
}
