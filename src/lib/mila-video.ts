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
    const mediaControls = stage.querySelector<HTMLElement>('.mila-video-controls')
    const timeline = stage.querySelector<HTMLInputElement>('.mila-video-timeline')
    const timeLabel = stage.querySelector<HTMLOutputElement>('.mila-video-time')
    const toggle = stage.querySelector<HTMLButtonElement>('.mila-video-toggle')
    const fullscreen = stage.querySelector<HTMLButtonElement>('.mila-video-fullscreen')
    const playLabel = toggle?.querySelector<HTMLElement>('.mila-label-play')
    const pauseLabel = toggle?.querySelector<HTMLElement>('.mila-label-pause')
    const seekButtons = Array.from(stage.querySelectorAll<HTMLButtonElement>('[data-seek]'))
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
        timeLabel.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`
      if (playLabel)
        playLabel.hidden = !video.paused
      if (pauseLabel)
        pauseLabel.hidden = video.paused
      seekButtons.forEach((button) => {
        button.disabled = !ready
      })
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
    play.addEventListener('click', start)
    if (mediaControls && timeline && toggle && fullscreen) {
      // Native controls are the no-JavaScript and unsupported-browser fallback.
      mediaControls.hidden = false
      video.controls = false
      toggle.addEventListener('click', () => {
        if (video.paused)
          start()
        else
          video.pause()
      })
      timeline.addEventListener('pointerdown', () => {
        dragging = true
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
        sync()
      }
      timeline.addEventListener('change', finishDrag)
      timeline.addEventListener('pointerup', finishDrag)
      timeline.addEventListener('pointercancel', finishDrag)
      fullscreen.addEventListener('click', async () => {
        try {
          if (document.fullscreenElement) {
            await document.exitFullscreen()
          }
          else if (stage.requestFullscreen) {
            await stage.requestFullscreen()
          }
          else {
            const nativeVideo = video as HTMLVideoElement & { webkitEnterFullscreen?: () => void }
            video.controls = true
            nativeVideo.webkitEnterFullscreen?.()
          }
        }
        catch {
          video.controls = true
        }
      })
    }
    seekButtons.forEach((button) => {
      button.addEventListener('click', () => {
        seek(Number(button.dataset.seek))
      })
    })
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
      }
    })
    const suppressGestureClick = (event: MouseEvent) => {
      if (performance.now() < ignoreClickUntil) {
        event.preventDefault()
        event.stopImmediatePropagation()
      }
    }
    video.addEventListener('click', suppressGestureClick, { capture: true })
    video.addEventListener('dblclick', suppressGestureClick, { capture: true })
    video.addEventListener('play', () => {
      play.hidden = true
      update()
    })
    video.addEventListener('ended', () => {
      play.hidden = false
      update()
    })
    for (const event of ['timeupdate', 'loadedmetadata', 'durationchange', 'pause'])
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
