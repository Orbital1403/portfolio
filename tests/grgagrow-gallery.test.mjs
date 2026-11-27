import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import sharp from 'sharp'

const root = new URL('../', import.meta.url)
test('grgaGrow places the caption and photograph in separate rows on laptop and phone', async () => {
  const css = await readFile(new URL('src/styles/refinement.css', root), 'utf8')
  const scope = 'body:has(#lawn-hardware) .gg-lightbox'
  const layouts = css.split(scope).slice(1).map(block => block.match(/grid-template:\s*([^;]+)/)?.[1] ?? '')
  assert.equal(layouts.length, 2)
  for (const [index, layout] of layouts.entries()) {
    const rows = [...layout.matchAll(/"([^"]+)"/g)].map(match => match[1].split(/\s+/))
    assert.ok(rows[0].every(cell => cell === 'heading'))
    assert.ok(rows[1].includes('photo'))
    assert.ok(rows.at(-1).every(cell => cell === 'footer'))
    if (index === 1)
      assert.ok(rows[1].every(cell => cell === 'photo'))
  }
  const project = await readFile(new URL('src/pages/projects/grgagrow.astro', root), 'utf8')
  assert.match(project, /id="lawn-hardware"/)
})
test('the downloadable board screenshot contains an opaque address field', async () => {
  const asset = new URL('public/images/projects/smart-lawn/bench/service-board-window-2026-11-27.webp', root)
  const img = sharp(await readFile(asset))
  const meta = await img.metadata()
  assert.deepEqual([meta.width, meta.height], [2268, 1328])
  const block = await img.extract({ left: 2019, top: 94, width: 192, height: 40 }).ensureAlpha().raw().toBuffer()
  assert.ok(block.every(byte => byte === 255))
})
