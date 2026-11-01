/** Static EN/HR publication from one shared design. No client-side translation. */
import { createHash } from 'node:crypto'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const origin = 'https://gordangrgic.com'
const dictionary = JSON.parse(await readFile(new URL('./hr.json', import.meta.url), 'utf8'))
const normalize = value => value.replace(/\s+/g, ' ').trim()
const decode = value => value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (_, entity) => {
  if (entity[0] === '#') return String.fromCodePoint(entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : Number(entity.slice(1)))
  return ({ amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: '\u00a0' })[entity.toLowerCase()]
})
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
const translatableAttributes = new Set(['alt', 'title', 'aria-label', 'placeholder', 'data-title', 'data-caption'])
const metaNames = new Set(['description', 'og:title', 'og:description', 'og:image:alt', 'twitter:title', 'twitter:description', 'twitter:image:alt'])
const tokenPattern = /<script\b[^>]*>[\s\S]*?<\/script\s*>|<style\b[^>]*>[\s\S]*?<\/style\s*>|<!--[\s\S]*?-->|<(?:[^"'<>]|"[^"]*"|'[^']*')*>|[^<]+/gi
const attributePattern = /([\w:-]+)(\s*=\s*)("[^"]*"|'[^']*')/g

function translate(value, missing) {
  const key = normalize(decode(value))
  if (!key) return value
  if (Object.hasOwn(dictionary, key)) {
    // Preserve separators around inline links/emphasis.
    return value.match(/^\s*/)[0] + escape(dictionary[key]) + value.match(/\s*$/)[0]
  }
  if (/[a-zA-Z]/.test(key) && !/^© \d{4}$/.test(key)) missing.add(key)
  return value
}

/** Change complete string literals, never identifiers, URLs or substrings of code. */
function translateScript(code) {
  return code.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`/g, literal => {
    let value
    try {
      value = literal[0] === '"' ? JSON.parse(literal) : literal.slice(1, -1).replace(/\\'/g, "'").replace(/\\\\/g, '\\')
    } catch { return literal }
    return Object.hasOwn(dictionary, value) ? JSON.stringify(dictionary[value]) : literal
  })
}

async function list(directory) {
  const result = []
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, item.name)
    if (item.isDirectory()) result.push(...await list(path))
    else result.push(path)
  }
  return result
}

export async function localizeBuild(directory) {
  const root = directory instanceof URL ? fileURLToPath(directory) : directory
  const all = await list(root)
  // Never duplicate the independently developed grgaGrow application or its assets.
  const files = all.filter(path => path.endsWith('.html') && !relative(root, path).startsWith('demos/') && !relative(root, path).startsWith('hr/'))
  const paths = new Set(files.map(path => '/' + relative(root, path).replace(/index\.html$/, '').replaceAll('\\', '/')))
  const missing = new Set()
  const hrAssets = new Map()
  const localUrl = value => {
    const url = new URL(decode(value), origin)
    return url.origin === origin && paths.has(url.pathname) ? url : null
  }
  const hrLink = value => {
    if (!value.startsWith('/') && !value.startsWith(origin)) return value
    const url = localUrl(value)
    if (!url) return value
    return (value.startsWith(origin) ? origin : '') + '/hr' + url.pathname + url.search + url.hash
  }

  // Localized script entries retain relative imports and share their dependencies.
  for (const path of all.filter(path => /\/_astro\/[^/]+\.js$/.test(path))) {
    const code = await readFile(path, 'utf8')
    const localized = translateScript(code)
    if (localized === code) continue
    const name = 'hr-' + createHash('sha256').update(localized).digest('hex').slice(0, 12) + '.js'
    await writeFile(join(dirname(path), name), localized)
    hrAssets.set('/' + relative(root, path), '/_astro/' + name)
  }
  const galleryPath = join(root, 'scripts/gallery.js')
  let gallery = await readFile(galleryPath, 'utf8')
  for (const key of ['Image gallery', 'PROJECT PHOTOGRAPHS', 'Previous image', 'Next image', 'Close image', 'Choose a photograph', '← → Browse · Click photo to zoom · Esc to close']) gallery = gallery.replaceAll(key, dictionary[key])
  gallery = gallery.replace('`Photo ${', '`Fotografija ${').replace('`Enlarge ${', '`Povećaj ${').replace("|| 'image'", "|| 'fotografiju'")
  const galleryName = '/scripts/gallery-hr.' + createHash('sha256').update(gallery).digest('hex').slice(0, 12) + '.js'
  await writeFile(join(root, galleryName.slice(1)), gallery)

  const switchStyle = '<style>.language-switch{display:flex;align-items:center;gap:6px;font:11px/1.5 var(--note-font,monospace);margin-left:auto;white-space:nowrap}.language-switch a{display:inline-flex;align-items:center;justify-content:center;min-width:28px;min-height:32px;color:inherit;text-decoration:none;border-bottom:1px solid transparent}.language-switch a[aria-current]{font-weight:700;border-color:currentColor}.language-switch a:focus-visible{outline:2px solid currentColor;outline-offset:3px}.language-switch span{opacity:.45}@media(min-width:1024px){.language-switch{justify-content:flex-start;margin:12px 0 0}}@media(max-width:380px){.site-header-bar{gap:6px}.site-tools{gap:2px}.site-tools .theme-toggle,.menu-toggle{width:36px}.language-switch{gap:2px}.language-switch a{min-width:26px}}</style>'
  const switcher = (path, hr) => `<nav class="language-switch" aria-label="${hr ? 'Odabir jezika' : 'Language selection'}"><a href="${path}" lang="en" hreflang="en" data-astro-reload${hr ? '' : ' aria-current="true"'} onclick="this.search=location.search;this.hash=location.hash">EN</a><span aria-hidden="true">/</span><a href="/hr${path}" lang="hr" hreflang="hr" data-astro-reload${hr ? ' aria-current="true"' : ''} onclick="this.search=location.search;this.hash=location.hash">HR</a></nav>`
  const alternates = path => `<link rel="alternate" hreflang="en" href="${origin}${path}"><link rel="alternate" hreflang="hr" href="${origin}/hr${path}"><link rel="alternate" hreflang="x-default" href="${origin}${path}">`

  const output = []
  for (const file of files) {
    const path = '/' + relative(root, file).replace(/index\.html$/, '')
    const english = await readFile(file, 'utf8')
    let croatian = english.replace(tokenPattern, token => {
      if (/^<style\b|^<!--/i.test(token)) return token
      if (/^<script\b/i.test(token)) {
        if (token.includes('application/ld+json')) {
          const start = token.indexOf('>') + 1, end = token.lastIndexOf('</script')
          const localizeJson = value => {
            if (typeof value === 'string') return dictionary[value] ?? value
            if (Array.isArray(value)) return value.map(localizeJson)
            if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k,v]) => [k, localizeJson(v)]))
            return value
          }
          return token.slice(0, start) + JSON.stringify(localizeJson(JSON.parse(token.slice(start, end)))) + token.slice(end)
        }
        return translateScript(token).replace(/(src=["'])([^"']+)/g, (_whole, prefix, src) => prefix + (hrAssets.get(src) ?? (/\/scripts\/gallery\.js/.test(src) ? galleryName : src)))
      }
      if (token.startsWith('<')) {
        const meta = /^<meta\b/i.test(token)
        const metaId = token.match(/(?:name|property)=["']([^"']+)/)?.[1]
        const canonical = /^<link\b/i.test(token) && /rel=["']canonical["']/.test(token)
        return token.replace(attributePattern, (_whole, name, eq, quoted) => {
          const value = quoted.slice(1, -1)
          let translated = value
          if (translatableAttributes.has(name) || (meta && name === 'content' && metaNames.has(metaId))) translated = translate(value, missing)
          if (name === 'href') translated = hrLink(value)
          if (name === 'lang') translated = 'hr'
          if (meta && name === 'content' && metaId === 'og:url') translated = hrLink(value)
          if (meta && name === 'content' && metaId === 'og:locale') translated = 'hr_HR'
          if (meta && name === 'content' && metaId === 'refresh') translated = value.replace(/url=(.*)/i, (_, url) => 'url=' + hrLink(url))
          if (canonical && name === 'href') translated = origin + '/hr' + path
          return name + eq + '"' + translated + '"'
        })
      }
      return translate(token, missing)
    })
    const decorate = (html, hr) => html.replace('<div class="site-tools"', switcher(path, hr) + '<div class="site-tools"').replace('</head>', switchStyle + alternates(path) + '</head>')
    croatian = decorate(croatian, true)
    output.push([join(root, 'hr', relative(root, file)), croatian], [file, decorate(english, false)])
  }
  if (missing.size) throw new Error('Missing Croatian translations:\n' + [...missing].join('\n'))
  for (const [path, html] of output) {
    await mkdir(dirname(path), {recursive:true})
    await writeFile(path, html)
  }
  // The sitemap integration ran before this hook. Add the corresponding HR URLs.
  for (const file of all.filter(file => /sitemap-\d+\.xml$/.test(file))) {
    let xml = await readFile(file, 'utf8')
    const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(match => match[0].replace(/<loc>([^<]+)<\/loc>/, (_, loc) => `<loc>${hrLink(loc)}</loc>`))
    xml = xml.replace('</urlset>', entries.join('') + '</urlset>')
    await writeFile(file, xml)
  }
  console.log(`EN/HR: ${files.length} matching pages, all text translations verified.`)
}

export default function bilingualPortfolio() {
  return { name: 'portfolio-en-hr', hooks: { 'astro:build:done': async ({dir}) => localizeBuild(dir) } }
}
