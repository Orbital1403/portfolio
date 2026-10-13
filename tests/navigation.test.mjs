import assert from 'node:assert/strict'
import { test } from 'node:test'
import { isActivePath, normalizePath } from '../src/utils/navigation.ts'

const links = ['/', '/about/', '/projects/', '/skills/', '/hobbies/', '/contact/']

for (const base of ['/', '/portfolio/']) {
  test(`only the matching navigation item is active at ${base}`, () => {
    for (const route of links) {
      const path = normalizePath(`${base}${route.slice(1)}`, base)
      assert.deepEqual(links.filter(link => isActivePath(path, normalizePath(link))), [route])
    }
  })
  test(`nested hobbies select HOBBIES, never HOME at ${base}`, () => {
    const path = normalizePath(`${base}hobbies/pc-wall/`, base)
    assert.deepEqual(links.filter(link => isActivePath(path, normalizePath(link))), ['/hobbies/'])
  })
}

test('normalization preserves unrelated paths and segment boundaries', () => {
  assert.equal(normalizePath('/portfolio-old/projects/', '/portfolio/'), '/portfolio-old/projects')
  assert.equal(isActivePath('/projects-old', '/projects'), false)
  assert.equal(normalizePath('/portfolio', '/portfolio/'), '/')
  assert.equal(normalizePath('/projects///'), '/projects')
})
