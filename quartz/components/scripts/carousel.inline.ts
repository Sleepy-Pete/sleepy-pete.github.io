document.addEventListener("nav", () => {
  const section = document.querySelector(".featured-carousel-section") as HTMLElement
  if (!section) return

  const track = section.querySelector(".carousel-track") as HTMLElement
  const cards = Array.from(track?.querySelectorAll(".carousel-card") || []) as HTMLElement[]
  const dots = Array.from(section.querySelectorAll(".carousel-dot") || []) as HTMLElement[]
  const prevBtn = section.querySelector(".carousel-prev") as HTMLElement
  const nextBtn = section.querySelector(".carousel-next") as HTMLElement

  if (!track || cards.length === 0) return

  const total = cards.length
  let current = 0
  let autoTimer: number | null = null
  const interval = parseInt(section.dataset.autoRotateInterval || "5000")

  // --- Core: go to slide ---
  function goTo(index: number) {
    current = ((index % total) + total) % total
    track.style.transform = `translateX(-${current * 100}%)`
    cards.forEach((c, i) => c.classList.toggle("active", i === current))
    dots.forEach((d, i) => d.classList.toggle("active", i === current))
  }

  function next() {
    goTo(current + 1)
    resetAuto()
  }
  function prev() {
    goTo(current - 1)
    resetAuto()
  }

  // --- Auto-rotate ---
  function startAuto() {
    stopAuto()
    autoTimer = window.setInterval(next, interval)
  }
  function stopAuto() {
    if (autoTimer !== null) {
      clearInterval(autoTimer)
      autoTimer = null
    }
  }
  function resetAuto() {
    stopAuto()
    startAuto()
  }

  // --- Navigation buttons ---
  const onPrev = () => prev()
  const onNext = () => next()
  prevBtn?.addEventListener("click", onPrev)
  nextBtn?.addEventListener("click", onNext)

  // --- Dot indicators ---
  dots.forEach((dot, i) => {
    const handler = () => {
      goTo(i)
      resetAuto()
    }
    dot.addEventListener("click", handler)
    window.addCleanup(() => dot.removeEventListener("click", handler))
  })

  // --- Keyboard navigation ---
  const onKey = (e: KeyboardEvent) => {
    const rect = section.getBoundingClientRect()
    if (rect.top >= window.innerHeight || rect.bottom <= 0) return
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      prev()
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      next()
    }
  }
  document.addEventListener("keydown", onKey)

  // --- Touch/swipe support ---
  let touchStartX = 0
  let touchStartY = 0
  let swiping = false

  const onTouchStart = (e: TouchEvent) => {
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
    swiping = true
    stopAuto()
  }

  const onTouchMove = (e: TouchEvent) => {
    if (!swiping) return
    const dx = Math.abs(e.touches[0].clientX - touchStartX)
    const dy = Math.abs(e.touches[0].clientY - touchStartY)
    // Cancel if vertical scroll
    if (dy > dx) {
      swiping = false
      return
    }
    if (dx > 10) e.preventDefault()
  }

  const onTouchEnd = (e: TouchEvent) => {
    if (!swiping) {
      resetAuto()
      return
    }
    swiping = false
    const dx = (e.changedTouches[0]?.clientX || 0) - touchStartX
    if (Math.abs(dx) > 50) {
      dx < 0 ? next() : prev()
    } else {
      resetAuto()
    }
  }

  track.addEventListener("touchstart", onTouchStart, { passive: true })
  track.addEventListener("touchmove", onTouchMove, { passive: false })
  track.addEventListener("touchend", onTouchEnd, { passive: true })

  // --- Pause on hover ---
  const onEnter = () => stopAuto()
  const onLeave = () => startAuto()
  section.addEventListener("mouseenter", onEnter)
  section.addEventListener("mouseleave", onLeave)

  // --- Initialize ---
  goTo(0)
  startAuto()

  // --- Cleanup on SPA navigation ---
  window.addCleanup(() => {
    stopAuto()
    prevBtn?.removeEventListener("click", onPrev)
    nextBtn?.removeEventListener("click", onNext)
    document.removeEventListener("keydown", onKey)
    track.removeEventListener("touchstart", onTouchStart)
    track.removeEventListener("touchmove", onTouchMove)
    track.removeEventListener("touchend", onTouchEnd)
    section.removeEventListener("mouseenter", onEnter)
    section.removeEventListener("mouseleave", onLeave)
  })
})

