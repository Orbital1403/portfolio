import assert from 'node:assert/strict'
import test from 'node:test'
import { initMilaVideo, pauseOtherVideos } from '../src/lib/mila-video.ts'

test('starting another player stops earlier audio without pausing the new player', () => {
  const player = () => ({ paused: false, pauses: 0, pause() {
    this.paused = true
    this.pauses++
  } })
  const first = player()
  const second = player()
  const third = player()
  pauseOtherVideos(second, [first, second, third])
  assert.equal(first.paused, true)
  assert.equal(third.paused, true)
  assert.equal(second.paused, false)
  assert.equal(second.pauses, 0)
  pauseOtherVideos(first, [first, second, third])
  assert.equal(second.paused, true)
  assert.equal(first.pauses, 1)
})

test('only opted-in players pause offscreen or in a hidden tab and keep their playback position', (t) => {
  const element = (properties = {}) => Object.assign(new EventTarget(), properties)
  const makePlayer = pauseWhenHidden => {
    const video = element({
      currentTime: 12,
      duration: 31,
      paused: true,
      pause() { this.paused = true },
    })
    const returnButton = element()
    const stage = element({
      dataset: pauseWhenHidden ? { pauseWhenHidden: 'true' } : {},
      querySelector: selector => ({
        video,
        '.mila-video-play': element(),
        '.mila-video-return': returnButton,
      })[selector],
    })
    return { video, stage, returnButton }
  }
  const garden = makePlayer(true)
  const other = makePlayer(false)
  const observers = new Map()
  const document = element({
    hidden: false,
    fullscreenElement: null,
    querySelectorAll: selector => selector === '.mila-video-stage'
      ? [garden.stage, other.stage]
      : [garden.video, other.video],
  })
  const window = element({ setTimeout: () => 1, clearTimeout() {} })
  const IntersectionObserver = class {
    constructor(callback) { this.callback = callback }
    observe(video) { observers.set(video, this.callback) }
  }
  for (const [key, value] of Object.entries({ document, window, IntersectionObserver })) {
    const previous = Object.getOwnPropertyDescriptor(globalThis, key)
    Object.defineProperty(globalThis, key, { configurable: true, value })
    t.after(() => {
      if (previous)
        Object.defineProperty(globalThis, key, previous)
      else
        delete globalThis[key]
    })
  }
  initMilaVideo()

  garden.video.paused = false
  observers.get(garden.video)([{ isIntersecting: false }])
  assert.equal(garden.video.paused, true)
  observers.get(garden.video)([{ isIntersecting: true }])
  assert.equal(garden.video.paused, true)
  assert.equal(garden.video.currentTime, 12)
  assert.equal(garden.returnButton.hidden, true)

  garden.video.paused = false
  document.fullscreenElement = garden.stage
  observers.get(garden.video)([{ isIntersecting: false }])
  assert.equal(garden.video.paused, false)
  document.fullscreenElement = null
  document.dispatchEvent(new Event('fullscreenchange'))
  assert.equal(garden.video.paused, true)

  observers.get(garden.video)([{ isIntersecting: true }])
  garden.video.paused = false
  other.video.paused = false
  document.hidden = true
  document.dispatchEvent(new Event('visibilitychange'))
  document.hidden = false
  document.dispatchEvent(new Event('visibilitychange'))
  assert.equal(garden.video.paused, true)
  assert.equal(garden.video.currentTime, 12)
  assert.equal(other.video.paused, false)
  observers.get(other.video)([{ isIntersecting: false }])
  assert.equal(other.returnButton.hidden, false)
})

test('the enclosure film leaves the final frame clear and replays from the bottom control', () => {
  const element = (properties = {}) => Object.assign(new EventTarget(), properties)
  const makePlayer = (replayBelow) => {
    const center = element({ hidden: true })
    const playIcon = { hidden: false }
    const playLabel = { textContent: 'Play video' }
    const replayLabel = { textContent: 'Replay video', hidden: true }
    const button = element({
      querySelector: key => ({
        '.mila-control-play': playIcon,
        '.mila-control-replay': replayBelow ? replayLabel : null,
        '.mila-label-play': playLabel,
      })[key],
      setAttribute(key, value) { this[key] = value },
    })
    const video = element({
      ended: false, paused: true, currentTime: 0, duration: 31,
      play() {
        this.ended = false
        this.paused = false
        this.currentTime = 0
        this.dispatchEvent(new Event('play'))
        return Promise.resolve()
      },
      pause() { this.paused = true },
    })
    const stage = element({
      dataset: replayBelow ? { replayBelow: 'true' } : {},
      querySelector: key => ({
        video,
        '.mila-video-play': center,
        '.mila-video-toggle': button,
        '.mila-video-return': element(),
      })[key],
    })
    return { stage, video, center, button, replayLabel, playIcon }
  }
  const enclosure = makePlayer(true)
  const other = makePlayer(false)
  const document = element({
    querySelectorAll: selector => selector === '.mila-video-stage'
      ? [enclosure.stage, other.stage]
      : [enclosure.video, other.video],
  })
  const window = element({ setTimeout: () => 1, clearTimeout() {} })
  const properties = { document, window, IntersectionObserver: class { observe() {} } }
  const before = Object.fromEntries(Object.keys(properties).map(k => [k, Object.getOwnPropertyDescriptor(globalThis, k)]))
  try {
    for (const [key, value] of Object.entries(properties))
      Object.defineProperty(globalThis, key, { configurable: true, value })
    initMilaVideo()
    assert.equal(enclosure.center.hidden, false)
    for (const player of [enclosure, other]) {
      Object.assign(player.video, { ended: true, paused: true, currentTime: 31 })
      player.video.dispatchEvent(new Event('ended'))
    }
    assert.equal(enclosure.center.hidden, true)
    assert.equal(enclosure.button['aria-label'], 'Replay video')
    assert.equal(enclosure.replayLabel.hidden, false)
    assert.equal(enclosure.stage.dataset.replayReady, 'true')
    assert.equal(other.center.hidden, false)
    enclosure.button.dispatchEvent(new Event('click'))
    assert.equal(enclosure.video.currentTime, 0)
    assert.equal(enclosure.video.paused, false)
    assert.equal(enclosure.replayLabel.hidden, true)
    assert.equal(enclosure.stage.dataset.replayReady, undefined)
  }
  finally {
    for (const [key, descriptor] of Object.entries(before)) {
      if (descriptor)
        Object.defineProperty(globalThis, key, descriptor)
      else
        delete globalThis[key]
    }
  }
})
