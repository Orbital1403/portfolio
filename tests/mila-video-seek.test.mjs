import assert from 'node:assert/strict'
import test from 'node:test'
import { getVideoSeekOffset, getVideoSeekTarget, isVideoDoubleTap } from '../src/lib/mila-video.ts'

test('five-second navigation clamps at both ends without wrapping', () => {
  assert.equal(getVideoSeekTarget(30, 117, 5), 35)
  assert.equal(getVideoSeekTarget(30, 117, -5), 25)
  assert.equal(getVideoSeekTarget(2, 117, -5), 0)
  assert.equal(getVideoSeekTarget(115, 117, 5), 117)
})
test('seeking waits for finite media metadata', () => {
  assert.equal(getVideoSeekTarget(0, Number.NaN, 5), null)
  assert.equal(getVideoSeekTarget(0, Number.POSITIVE_INFINITY, 5), null)
  assert.equal(getVideoSeekTarget(0, 0, 5), null)
  assert.equal(getVideoSeekTarget(Number.NaN, 117, 5), null)
})
test('touch navigation requires two quick taps on the same side', () => {
  assert.equal(isVideoDoubleTap({ time: 100, side: 'left' }, { time: 400, side: 'left' }), true)
  assert.equal(isVideoDoubleTap({ time: 100, side: 'right' }, { time: 450, side: 'right' }), true)
  assert.equal(isVideoDoubleTap({ time: 100, side: 'left' }, { time: 300, side: 'right' }), false)
  assert.equal(isVideoDoubleTap({ time: 100, side: 'left' }, { time: 451, side: 'left' }), false)
  assert.equal(isVideoDoubleTap(null, { time: 300, side: 'left' }), false)
})

test('mouse and touchpad double-clicks select a five-second skip by half of the video', () => {
  assert.equal(getVideoSeekOffset(0, 800), -5)
  assert.equal(getVideoSeekOffset(399, 800), -5)
  assert.equal(getVideoSeekOffset(400, 800), 5)
  assert.equal(getVideoSeekOffset(800, 800), 5)
  assert.equal(getVideoSeekOffset(-1, 800), null)
  assert.equal(getVideoSeekOffset(900, 800), null)
  assert.equal(getVideoSeekOffset(0, 0), null)
})

test('single click toggles playback, while double click only seeks', async (t) => {
  const { initMilaVideo } = await import('../src/lib/mila-video.ts')
  const listeners = new Map()
  const timers = new Map()
  let nextTimer = 0
  const video = {
    paused: true,
    ended: false,
    controls: true,
    currentTime: 30,
    duration: 117,
    addEventListener(name, handler) {
      const handlers = listeners.get(name) || []
      handlers.push(handler)
      listeners.set(name, handlers)
    },
    play() {
      this.paused = false
      return Promise.resolve()
    },
    pause() { this.paused = true },
    getBoundingClientRect() { return { left: 0, width: 800, bottom: 600 } },
  }
  const element = () => ({ hidden: true, addEventListener() {} })
  const play = element()
  const back = element()
  const timeline = element()
  const controls = element()
  const stage = {
    dataset: {},
    addEventListener() {},
    querySelector(selector) {
      return { 'video': video, '.mila-video-play': play, '.mila-video-return': back, '.mila-video-controls': controls, '.mila-video-timeline': timeline }[selector] || null
    },
  }
  const old = Object.fromEntries(['document', 'window', 'IntersectionObserver'].map(key => [key, globalThis[key]]))
  t.after(() => {
    for (const [key, value] of Object.entries(old)) {
      if (value === undefined)
        delete globalThis[key]
      else globalThis[key] = value
    }
  })
  globalThis.document = { querySelectorAll: () => [stage], addEventListener() {}, hidden: false }
  globalThis.window = {
    setTimeout(fn) {
      timers.set(++nextTimer, fn)
      return nextTimer
    },
    clearTimeout(id) { timers.delete(id) },
    addEventListener() {},
  }
  globalThis.IntersectionObserver = class { observe() {} }
  initMilaVideo()
  assert.equal(video.controls, false)
  assert.equal(controls.hidden, false)
  const dispatch = (name, detail = 1) => {
    const event = { detail, clientX: 600, clientY: 200, preventDefault() {}, stopPropagation() {} }
    for (const handler of listeners.get(name) || []) handler(event)
  }
  const flush = () => {
    const pending = [...timers.values()]
    timers.clear()
    pending.forEach(fn => fn())
  }
  dispatch('click')
  flush()
  assert.equal(video.paused, false)
  dispatch('click')
  flush()
  assert.equal(video.paused, true)
  dispatch('click')
  dispatch('click', 2)
  dispatch('dblclick', 2)
  flush()
  assert.equal(video.currentTime, 35)
  assert.equal(video.paused, true)
})

test('opening fullscreen uses the stage and falls back to native video', async () => {
  const { openMilaVideoFullscreen } = await import('../src/lib/mila-video.ts')
  const calls = []
  const stage = {
    async requestFullscreen() {
      calls.push('stage')
    },
  }
  const native = {
    webkitEnterFullscreen() {
      calls.push('native')
    },
  }
  const blocked = {
    async requestFullscreen() {
      throw new Error('blocked')
    },
  }
  assert.equal(await openMilaVideoFullscreen(stage, native), true)
  assert.deepEqual(calls, ['stage'])
  calls.length = 0
  assert.equal(await openMilaVideoFullscreen(blocked, native), true)
  assert.deepEqual(calls, ['native'])
  assert.equal(await openMilaVideoFullscreen({}, {}), false)
  const blockedNative = {
    webkitEnterFullscreen() {
      throw new Error('blocked')
    },
  }
  assert.equal(await openMilaVideoFullscreen({}, blockedNative), false)
})
