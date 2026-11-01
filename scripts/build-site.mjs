import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { cpSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'

const galleryScriptPath = /\/scripts\/gallery\.js(?:\?[^"']*)?/g
const textFile = /\.(?:html|css|js|xml|txt)$/

/** Build the single Cloudflare publication directly from source. */
export function buildSite() {
  const output = 'cloudflare-dist'
  const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build'], {
    stdio: 'inherit',
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

  const gallery = readFileSync('dist/scripts/gallery.js')
  const name = `gallery.${createHash('sha256').update(gallery).digest('hex').slice(0, 12)}.js`
  writeFileSync(join('dist/scripts', name), gallery)
  walk('dist', (content, filename) => filename.endsWith('.html')
    ? `${content.replace(galleryScriptPath, `/scripts/${name}`).trimEnd()}\n`
    : content)

  rmSync(output, { recursive: true, force: true })
  cpSync('dist', output, { recursive: true })
  console.log(`Cloudflare publication prepared in ${output}/`)
}
