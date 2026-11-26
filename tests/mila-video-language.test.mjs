import assert from 'node:assert/strict'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { localizeBuild } from '../scripts/localize.mjs'

test('video follows the page language while shared media keeps its URL', async () => {
  const root = await mkdtemp(join(tmpdir(), 'mila-video-language-'))
  try {
    await mkdir(join(root, 'scripts'))
    await writeFile(join(root, 'scripts/gallery.js'), '')
    await writeFile(join(root, 'index.html'), '<html lang="en"><head></head><body><video><source src="/videos/mila-guide-en.mp4" data-hr-src="/videos/mila-guide-hr.mp4" type="video/mp4"></video><video><source src="/videos/shared.mp4" type="video/mp4"></video></body></html>')
    await localizeBuild(root)
    const en = await readFile(join(root, 'index.html'), 'utf8')
    const hr = await readFile(join(root, 'hr/index.html'), 'utf8')
    assert.ok(en.includes('<source src="/videos/mila-guide-en.mp4"'))
    assert.ok(hr.includes('<source src="/videos/mila-guide-hr.mp4"'))
    assert.ok(hr.includes('<source src="/videos/shared.mp4"'))
  }
  finally {
    await rm(root, { recursive: true, force: true })
  }
})
