import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { localizeBuild } from '../scripts/localize.mjs'

test('project iframe and standalone demo link follow EN/HR without changing other demos', async () => {
  const root = await mkdtemp(join(tmpdir(), 'praonica-language-'))
  try {
    await mkdir(join(root, 'scripts'))
    await writeFile(join(root, 'scripts/gallery.js'), '')
    await writeFile(join(root, 'index.html'), '<html lang="en"><head><title>Our laundry</title></head><body><h1>Our laundry</h1><div class="site-tools"></div><iframe src="/demos/praonica/" title="Simulated mobile laundry prototype"></iframe><a class="open-demo" href="/demos/praonica/">Open the mobile prototype ↗</a><iframe src="/demos/my-garden/"></iframe></body></html>')
    await localizeBuild(root)
    const en = await readFile(join(root, 'index.html'), 'utf8')
    const hr = await readFile(join(root, 'hr/index.html'), 'utf8')
    assert.match(en, /<h1>Our laundry<\/h1>/)
    assert.match(hr, /<h1>Naša praonica<\/h1>/)
    assert.match(en, /<iframe src="\/demos\/praonica\/"/)
    assert.match(en, /class="open-demo" href="\/demos\/praonica\/"/)
    assert.match(hr, /<iframe src="\/demos\/praonica\/hr\/"/)
    assert.match(hr, /class="open-demo" href="\/demos\/praonica\/hr\/"/)
    assert.match(hr, /<iframe src="\/demos\/my-garden\/"/)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
