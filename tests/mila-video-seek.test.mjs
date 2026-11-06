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
