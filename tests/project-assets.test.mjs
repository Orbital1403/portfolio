import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'
import test from 'node:test'

test('project card and laundry story image URLs resolve to real public assets', async () => {
  for (const path of ['src/pages/projects.astro', 'src/pages/projects/our-laundry.astro']) {
    const source = await readFile(new URL('../' + path, import.meta.url), 'utf8')
    const images = [...source.matchAll(/(?:image:\s*|src=)["'](\/(?:images|og)\/[^"']+)["']/g)].map(match => match[1])
    assert.ok(images.length > 0, 'No image references checked in ' + path)
    for (const image of images) {
      const asset = await stat(new URL('../public' + image, import.meta.url))
      assert.ok(asset.isFile() && asset.size > 0, path + ': missing image ' + image)
    }
  }
})
