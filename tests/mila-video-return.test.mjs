import assert from 'node:assert/strict'
import test from 'node:test'
import { shouldShowVideoReturn } from '../src/lib/mila-video.ts'

const playingOutside = { paused: false, ended: false, visible: false, pageHidden: false, fullscreen: false }
test('video return appears only for ongoing playback outside the viewport', () => {
  assert.equal(shouldShowVideoReturn(playingOutside), true)
  for (const change of [{ paused: true }, { ended: true }, { visible: true }, { pageHidden: true }, { fullscreen: true }]) {
    assert.equal(shouldShowVideoReturn({ ...playingOutside, ...change }), false)
  }
})
