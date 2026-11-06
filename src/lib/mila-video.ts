export function shouldShowVideoReturn(state: {
  paused: boolean
  ended: boolean
  visible: boolean
  pageHidden: boolean
  fullscreen: boolean
}) {
  return !state.paused && !state.ended && !state.visible && !state.pageHidden && !state.fullscreen
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
    const bars = Array.from(returnButton.querySelectorAll<HTMLElement>('i'))
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = true
    let frame = 0
    let context: AudioContext | undefined
    let analyser: AnalyserNode | undefined
    let bins: Uint8Array<ArrayBuffer> | undefined

    const animate = () => {
      frame = 0
      if (returnButton.hidden || reducedMotion.matches || !analyser || !bins)
        return
      analyser.getByteFrequencyData(bins)
      // Low/mid speech bands; compression keeps quiet narration legible.
      for (let i = 0; i < bars.length; i++) {
        let sum = 0
        for (let k = 0; k < 4; k++) sum += bins[2 + i * 4 + k] ?? 0
        const height = 4 + 21 * Math.sqrt(sum / (4 * 255))
        bars[i].style.height = `${height.toFixed(1)}px`
      }
      frame = requestAnimationFrame(animate)
    }
    const update = () => {
      returnButton.hidden = !shouldShowVideoReturn({
        paused: video.paused,
        ended: video.ended,
        visible,
        pageHidden: document.hidden,
        fullscreen: Boolean(document.fullscreenElement),
      })
      if (returnButton.hidden) {
        cancelAnimationFrame(frame)
        frame = 0
      }
      else if (!frame) {
        animate()
      }
    }
    const connectAudio = () => {
      try {
        if (!context) {
          context = new AudioContext()
          analyser = context.createAnalyser()
          analyser.fftSize = 256
          analyser.smoothingTimeConstant = 0.8
          const source = context.createMediaElementSource(video)
          source.connect(analyser)
          analyser.connect(context.destination)
          bins = new Uint8Array(analyser.frequencyBinCount)
          returnButton.classList.add('has-audio-meter')
        }
        void context.resume().catch(() => {
          // Restore ordinary media playback if the browser blocks Web Audio.
          returnButton.classList.remove('has-audio-meter')
        })
      }
      catch { returnButton.classList.remove('has-audio-meter') }
    }
    play.addEventListener('click', async () => {
      connectAudio()
      try {
        await video.play()
      }
      catch {
        play.hidden = true
        video.focus()
      }
    })
    video.addEventListener('play', () => {
      play.hidden = true
      update()
    })
    video.addEventListener('pause', update)
    video.addEventListener('ended', () => {
      play.hidden = false
      update()
    })
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
      cancelAnimationFrame(frame)
      document.removeEventListener('visibilitychange', update)
      document.removeEventListener('fullscreenchange', update)
      video.pause()
      returnButton.hidden = true
      void context?.close()
    }
    document.addEventListener('astro:before-swap', cleanup, { once: true })
    window.addEventListener('pagehide', () => {
      video.pause()
      update()
    })
  })
}
