import assert from 'node:assert/strict'
import test from 'node:test'
import { pauseOtherVideos } from '../src/lib/mila-video.ts'

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
