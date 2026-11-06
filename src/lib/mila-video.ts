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
    let visible = true
    const update = () => {
      returnButton.hidden = !shouldShowVideoReturn({
        paused: video.paused,
        ended: video.ended,
        visible,
        pageHidden: document.hidden,
        fullscreen: Boolean(document.fullscreenElement),
      })
    }
    play.addEventListener('click', async () => {
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
  })
}
