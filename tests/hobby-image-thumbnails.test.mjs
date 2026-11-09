import assert from 'node:assert/strict'
import { stat } from 'node:fs/promises'
import test from 'node:test'
import { thumbnail } from '../src/utils/images.ts'

const extension = /(\.[^.]+)$/

test('hobby thumbnails preserve JPEG support and resolve optimized WebP copies', async () => {
  for (const image of [
    '/images/hobbies/garden-makeover/final-look/cover-page-v2.jpeg',
    '/images/hobbies/hifi/system.webp',
    '/images/hobbies/pc_on_wall/final-look/cover-page-v2.webp',
  ]) {
    const expected = image.replace(extension, '-800$1')
    assert.equal(thumbnail(image), expected)
    assert.ok((await stat(new URL(`../public${thumbnail(image)}`, import.meta.url))).size > 0)
  }
  assert.equal(thumbnail('/images/diagram.png'), '/images/diagram.png')
})
