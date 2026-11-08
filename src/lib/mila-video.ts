/** Keep a single active player so audio and floating return controls never overlap. */
export function pauseOtherVideos(current: { pause: () => void }, videos: Iterable<{ pause: () => void }>) {
  for (const video of videos) {
    if (video !== current)
      video.pause()
  }
}

export function shouldShowVideoReturn(state: {
  paused: boolean
  ended: boolean
  visible: boolean
  pageHidden: boolean
  fullscreen: boolean
}) {
  return !state.paused && !state.ended && !state.visible && !state.pageHidden && !state.fullscreen
}

export function getVideoSeekTarget(time: number, duration: number, offset: number) {
  if (!Number.isFinite(time) || !Number.isFinite(duration) || duration <= 0 || !Number.isFinite(offset))
    return null
  return Math.max(0, Math.min(duration, time + offset))
}

export function isVideoDoubleTap(previous: { time: number, side: string } | null, current: { time: number, side: string }) {
  return previous !== null && current.side === previous.side
    && current.time > previous.time && current.time - previous.time <= 350
}

export function getVideoSeekOffset(position: number, width: number) {
  if (!Number.isFinite(position) || !Number.isFinite(width) || width <= 0 || position < 0 || position > width)
    return null
  return position < width / 2 ? -5 : 5
}

export async function openMilaVideoFullscreen(
  stage: { requestFullscreen?: () => Promise<void> },
  video: { webkitEnterFullscreen?: () => void },
) {
  try {
    if (stage.requestFullscreen) {
      await stage.requestFullscreen()
      return true
    }
  }
  catch {
    // Some browsers only support native video fullscreen.
  }
  try {
    if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen()
      return true
    }
  }
  catch {
    // Keep inline playback available when fullscreen is blocked.
  }
  return false
}

export function initMilaVideo() {
  document.querySelectorAll<HTMLElement>('.mila-video-stage').forEach((stage) => {
    if (stage.dataset.ready)
      return
    const video = stage.querySelector('video')
    const play = stage.querySelector<HTMLButtonElement>('.mila-video-play')
    const returnButton = stage.querySelector<HTMLButtonElement>('.mila-video-return')
    if (!video || !play || !returnButton)
      return
    stage.dataset.ready = 'true'
    play.hidden = false
    let visible = true
    let dragging = false
    let controlsTimer: number | undefined
    const revealControls = (delay = 2500) => {
      stage.dataset.controlsVisible = 'true'
      window.clearTimeout(controlsTimer)
      controlsTimer = window.setTimeout(() => {
        if (dragging)
          revealControls()
        else
          delete stage.dataset.controlsVisible
      }, delay)
    }
    const mediaControls = stage.querySelector<HTMLElement>('.mila-video-controls')
    const timeline = stage.querySelector<HTMLInputElement>('.mila-video-timeline')
    const timeLabel = stage.querySelector<HTMLOutputElement>('.mila-video-time')
    const remainingLabel = stage.querySelector<HTMLOutputElement>('.mila-video-remaining')
    const toggle = stage.querySelector<HTMLButtonElement>('.mila-video-toggle')
    const playIcon = toggle?.querySelector<HTMLElement>('.mila-control-play')
    const pauseIcon = toggle?.querySelector<HTMLElement>('.mila-control-pause')
    const speed = stage.querySelector<HTMLSelectElement>('.mila-video-speed')
    const mute = stage.querySelector<HTMLButtonElement>('.mila-video-mute')
    const formatTime = (time: number) => Number.isFinite(time) ? `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, '0')}` : '--:--'
    const sync = () => {
      const ready = getVideoSeekTarget(video.currentTime, video.duration, 0) !== null
      if (timeline) {
        timeline.disabled = !ready
        if (ready) {
          timeline.max = String(video.duration)
          if (!dragging)
            timeline.value = String(video.currentTime)
        }
      }
      if (timeLabel)
        timeLabel.textContent = formatTime(video.currentTime)
      if (remainingLabel)
        remainingLabel.textContent = `−${formatTime(Math.max(0, video.duration - video.currentTime))}`
      if (mute) {
        mute.setAttribute('aria-label', mute.querySelector(video.muted ? '.mila-label-unmute' : '.mila-label-mute')?.textContent || '')
        const soundOn = mute.querySelector<HTMLElement>('.mila-sound-on')
        const soundOff = mute.querySelector<HTMLElement>('.mila-sound-off')
        if (soundOn)
          soundOn.hidden = video.muted
        if (soundOff)
          soundOff.hidden = !video.muted
      }
      stage.dataset.paused = String(video.paused)
      if (toggle)
        toggle.setAttribute('aria-label', toggle.querySelector(video.paused ? '.mila-label-play' : '.mila-label-pause')?.textContent || '')
      if (playIcon)
        playIcon.hidden = !video.paused
      if (pauseIcon)
        pauseIcon.hidden = video.paused
      if (speed)
        speed.value = String(video.playbackRate)
    }
    const seek = (offset: number) => {
      const target = getVideoSeekTarget(video.currentTime, video.duration, offset)
      if (target === null)
        return
      video.currentTime = target
      if (target < video.duration)
        play.hidden = true
      sync()
    }
    const start = () => {
      void video.play().catch(() => {
        video.controls = true
        play.hidden = true
      })
    }
    const update = () => {
      returnButton.hidden = !shouldShowVideoReturn({
        paused: video.paused,
        ended: video.ended,
        visible,
        pageHidden: document.hidden,
        fullscreen: Boolean(document.fullscreenElement),
      })
      sync()
    }
    play.addEventListener('click', () => {
      start()
      void openMilaVideoFullscreen(stage, video as HTMLVideoElement & { webkitEnterFullscreen?: () => void })
    })
    toggle?.addEventListener('click', () => {
      if (video.paused)
        start()
      else
        video.pause()
      revealControls()
      sync()
    })
    mute?.addEventListener('click', () => {
      video.muted = !video.muted
      revealControls()
      sync()
    })
    speed?.addEventListener('change', () => {
      const rate = Number(speed.value)
      if ([0.75, 1, 1.25, 1.5, 2].includes(rate))
        video.playbackRate = rate
      revealControls()
    })
    stage.addEventListener('pointerenter', () => revealControls())
    stage.addEventListener('pointermove', () => revealControls())
    stage.addEventListener('pointerdown', () => revealControls())
    stage.addEventListener('pointerleave', () => revealControls(600))
    if (mediaControls && timeline) {
      // Native controls are the no-JavaScript and unsupported-browser fallback.
      mediaControls.hidden = false
      video.controls = false
      timeline.addEventListener('pointerdown', () => {
        dragging = true
        revealControls()
      })
      timeline.addEventListener('input', () => {
        const target = getVideoSeekTarget(timeline.valueAsNumber, video.duration, 0)
        if (target !== null) {
          video.currentTime = target
          play.hidden = true
        }
      })
      const finishDrag = () => {
        dragging = false
        revealControls()
        sync()
      }
      timeline.addEventListener('change', finishDrag)
      timeline.addEventListener('pointerup', finishDrag)
      timeline.addEventListener('pointercancel', finishDrag)
    }
    stage.addEventListener('keydown', (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
        return
      const target = event.target as HTMLElement
      if (target.closest('input:not([type=range]), textarea, select, [contenteditable="true"]'))
        return
      if (event.key === ' ' && target === video) {
        event.preventDefault()
        if (video.paused)
          start()
        else
          video.pause()
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()
        event.stopPropagation()
        seek(event.key === 'ArrowLeft' ? -5 : 5)
      }
    }, { capture: true })
    let clickTimer: number | undefined
    let lastTap: { time: number, side: string, paused: boolean } | null = null
    let touchStart: { x: number, y: number, paused: boolean } | null = null
    let ignoreClickUntil = 0
    video.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'touch' && event.isPrimary)
        touchStart = { x: event.clientX, y: event.clientY, paused: video.paused }
    })
    video.addEventListener('pointercancel', () => {
      touchStart = null
      lastTap = null
    })
    video.addEventListener('pointerup', (event) => {
      if (event.pointerType !== 'touch' || !event.isPrimary || !touchStart)
        return
      const origin = touchStart
      touchStart = null
      const rect = video.getBoundingClientRect()
      if ((video.controls && event.clientY > rect.bottom - 60) || Math.hypot(event.clientX - origin.x, event.clientY - origin.y) > 20) {
        lastTap = null
        return
      }
      const tap = { time: performance.now(), side: event.clientX < rect.left + rect.width / 2 ? 'left' : 'right', paused: origin.paused }
      if (isVideoDoubleTap(lastTap, tap)) {
        window.clearTimeout(clickTimer)
        event.preventDefault()
        event.stopPropagation()
        ignoreClickUntil = performance.now() + 500
        const wasPaused = lastTap!.paused
        lastTap = null
        seek(tap.side === 'left' ? -5 : 5)
        if (wasPaused)
          video.pause()
        else
          start()
      }
      else {
        lastTap = tap
        revealControls()
      }
    })
    const suppressGestureClick = (event: MouseEvent) => {
      if (performance.now() < ignoreClickUntil) {
        event.preventDefault()
        event.stopImmediatePropagation()
      }
    }
    video.addEventListener('click', suppressGestureClick, { capture: true })
    video.addEventListener('click', (event) => {
      if (event.detail > 1)
        return
      window.clearTimeout(clickTimer)
      const nativeVideo = video as HTMLVideoElement & {
        webkitEnterFullscreen?: () => void
        webkitDisplayingFullscreen?: boolean
      }
      if (!document.fullscreenElement && !nativeVideo.webkitDisplayingFullscreen
        && (typeof stage.requestFullscreen === 'function' || typeof nativeVideo.webkitEnterFullscreen === 'function')) {
        // Request directly from this gesture: delayed callbacks lose activation.
        void openMilaVideoFullscreen(stage, nativeVideo)
        if (video.paused)
          start()
        return
      }
      clickTimer = window.setTimeout(() => {
        if (video.paused)
          start()
        else
          video.pause()
      }, 350)
    })
    video.addEventListener('dblclick', (event) => {
      window.clearTimeout(clickTimer)
      if (performance.now() < ignoreClickUntil) {
        suppressGestureClick(event)
        return
      }
      const rect = video.getBoundingClientRect()
      if (video.controls && event.clientY > rect.bottom - 60)
        return
      const offset = getVideoSeekOffset(event.clientX - rect.left, rect.width)
      if (offset !== null) {
        event.preventDefault()
        event.stopPropagation()
        seek(offset)
      }
    }, { capture: true })
    video.addEventListener('play', () => {
      pauseOtherVideos(video, Array.from(document.querySelectorAll<HTMLVideoElement>('.mila-video-stage video')))
      play.hidden = true
      stage.dataset.started = 'true'
      revealControls()
      update()
    })
    video.addEventListener('ended', () => {
      play.hidden = false
      update()
    })
    for (const event of ['timeupdate', 'loadedmetadata', 'durationchange', 'pause', 'ratechange', 'volumechange'])
      video.addEventListener(event, update)
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      update()
    }, { threshold: 0 })
    observer.observe(video)
    returnButton.addEventListener('click', () => {
      video.scrollIntoView({ behavior: 'instant', block: 'center' })
      video.focus({ preventScroll: true })
    })
    document.addEventListener('visibilitychange', update)
    document.addEventListener('fullscreenchange', update)
    const cleanup = () => {
      window.clearTimeout(controlsTimer)
      window.clearTimeout(clickTimer)
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
      document.removeEventListener('fullscreenchange', update)
      video.pause()
      returnButton.hidden = true
    }
    document.addEventListener('astro:before-swap', cleanup, { once: true })
    window.addEventListener('pagehide', () => {
      video.pause()
      update()
    })
    update()
  })
}
