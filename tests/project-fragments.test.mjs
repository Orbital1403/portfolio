import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { runInNewContext } from 'node:vm'

const page = readFileSync(new URL('../src/pages/projects.astro', import.meta.url), 'utf8')
const script = page.match(/<script>([\s\S]*?)<\/script>/)[1]
const cardIds = ['mila-title', 'grgagrow-title', 'our-laundry-title', 'portfolio-project-title']

function visit(path, ids = ['main', ...cardIds]) {
  const location = new URL(path, 'https://portfolio.test')
  const listeners = {}
  let destination
  location.replace = (url) => {
    destination = new URL(url)
  }
  const document = { getElementById: id => ids.includes(id), addEventListener: () => {} }
  const window = {
    location,
    addEventListener(event, callback) {
      listeners[event] = callback
    },
  }
  runInNewContext(script, { URL, document, window })
  return {
    url: () => (destination ?? location).href,
    changeHash(hash) {
      location.hash = hash
      listeners.hashchange()
    },
  }
}

for (const prefix of ['', '/hr']) {
  const list = `${prefix}/projects/`
  const absolute = path => new URL(path, 'https://portfolio.test').href

  test(`list headings and unrecognised fragments stay on ${list}`, () => {
    for (const hash of ['', '#main', ...cardIds.map(id => `#${id}`), '#unrecognised-fragment']) {
      assert.equal(visit(list + hash).url(), absolute(list + hash))
    }
    assert.equal(visit(`${list}#grgagrow`, ['grgagrow']).url(), absolute(`${list}#grgagrow`))
  })

  test(`legacy fragments open their own project and retain the language and query on ${list}`, () => {
    for (const [fragment, expected] of [
      ['grgagrow', 'grgagrow/'],
      ['lawn-site', 'grgagrow/#lawn-site'],
      ['praonica', 'our-laundry/'],
      ['signal-guide', 'our-laundry/#signal-guide'],
      ['hardware--foundation', 'mila/#hardware--foundation'],
      ['02--this-portfolio', 'portfolio/#portfolio-project'],
      ['03--coursework--continued-learning', 'portfolio/#coursework--continued-learning'],
    ]) {
      const target = new URL(list + expected, 'https://portfolio.test')
      target.search = '?ref=example'
      assert.equal(visit(`${list}?ref=example#${fragment}`).url(), target.href)
    }
    const index = visit(list)
    index.changeHash('#our-laundry')
    assert.equal(index.url(), absolute(`${list}our-laundry/`))
    const detail = `${list}grgagrow/#hardware--foundation`
    assert.equal(visit(detail).url(), absolute(detail))
  })
}
