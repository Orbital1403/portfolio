import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { cpSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'

const galleryScriptPath = /\/(?:portfolio\/)?scripts\/gallery\.js(?:\?[^"']*)?/g
const publicJsPath = /(["'`])\/(?=icons\.svg|scripts\/|images\/|fonts\/)/g
const rootCssPath = /(url\(["']?)\/(?!\/|portfolio\/)/g
const rootHtmlPath = /(\b(?:href|src|action)=["'])\/(?!\/|portfolio\/)/g
const textFile = /\.(?:html|css|js|xml|txt)$/

/** Build each host directly from source; only GitHub Pages needs asset prefixes. */
export function buildSite(target) {
  const pages = target === 'pages'
  const output = pages ? 'docs' : 'cloudflare-dist'
  const base = pages ? '/portfolio/' : '/'
  const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build'], {
    stdio: 'inherit',
    env: { ...process.env, PORTFOLIO_DEPLOY_TARGET: target },
  })
  if (result.status !== 0)
    process.exit(result.status ?? 1)

  function walk(directory, transform) {
    for (const name of readdirSync(directory)) {
      const path = join(directory, name)
      if (statSync(path).isDirectory()) {
        walk(path, transform)
      }
      else if (textFile.test(name)) {
        writeFileSync(path, transform(readFileSync(path, 'utf8'), name))
      }
    }
  }

  walk('dist', (content, name) => {
    if (pages) {
      // Public assets and Markdown links are root-relative in the source.
      if (name.endsWith('.html'))
        content = content.replace(rootHtmlPath, (_, start) => start + base)
      if (name.endsWith('.css'))
        content = content.replace(rootCssPath, (_, start) => start + base)
      if (name.endsWith('.js'))
        content = content.replace(publicJsPath, (_, quote) => quote + base)
      // Sitemap documents always advertise the primary domain's root paths.
      if (name.endsWith('.xml'))
        content = content.replaceAll('https://gordangrgic.com/portfolio/', 'https://gordangrgic.com/')
    }
    return content
  })

  const gallery = readFileSync('dist/scripts/gallery.js')
  const name = `gallery.${createHash('sha256').update(gallery).digest('hex').slice(0, 12)}.js`
  writeFileSync(join('dist/scripts', name), gallery)
  walk('dist', (content, filename) => filename.endsWith('.html')
    ? `${content.replace(galleryScriptPath, `${base}scripts/${name}`).trimEnd()}\n`
    : content)

  rmSync(output, { recursive: true, force: true })
  cpSync('dist', output, { recursive: true })
  if (pages)
    writeFileSync(join(output, '.nojekyll'), '')
  console.log(`${target} publication prepared in ${output}/`)
}
