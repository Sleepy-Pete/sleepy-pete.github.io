document.addEventListener("nav", () => {
  const carouselSection = document.querySelector(".featured-carousel-section")
  if (!carouselSection) return

  const track = document.getElementById("carousel-track")
  const cards = Array.from(track?.querySelectorAll(".carousel-card") || []) as HTMLElement[]
  const indicators = Array.from(
    carouselSection.querySelectorAll(".indicator-dot") || [],
  ) as HTMLElement[]
  const prevBtn = carouselSection.querySelector(".carousel-nav-prev") as HTMLElement
  const nextBtn = carouselSection.querySelector(".carousel-nav-next") as HTMLElement
  const container = carouselSection.querySelector(".carousel-container") as HTMLElement

  if (!track || cards.length === 0) return

  const totalCards = cards.length
  const autoRotateDelay = parseInt(container.dataset.autoRotateDelay || "5000")
  const autoRotateInterval = parseInt(container.dataset.autoRotateInterval || "4000")

  // Start at middle index so cards appear on both sides
  const startIndex = Math.floor(totalCards / 2)

  // State
  let currentIndex = startIndex
  let rotation = startIndex
  let targetRotation = startIndex
  let velocity = 0
  let isDragging = false
  let startX = 0
  let lastX = 0
  let lastTime = Date.now()
  let autoRotateTimer: number | null = null

  // Constants
  const FRICTION = 0.88
  const SNAP_THRESHOLD = 0.15
  const LERP_FACTOR = 0.08

  // Responsive values based on screen size
  function getResponsiveValues() {
    const width = window.innerWidth
    if (width <= 480) {
      return { spacing: 130, sideZ: -200, rotation: 35 }
    } else if (width <= 768) {
      return { spacing: 160, sideZ: -250, rotation: 40 }
    } else {
      return { spacing: 200, sideZ: -300, rotation: 45 }
    }
  }

  function updateCardPositions() {
    const responsive = getResponsiveValues()

    // Smooth interpolation - continuous movement
    rotation += (targetRotation - rotation) * LERP_FACTOR

    // Apply momentum when not dragging
    if (!isDragging && Math.abs(velocity) > 0.01) {
      targetRotation += velocity
      velocity *= FRICTION

      // Snap to nearest card only when velocity is very low
      if (Math.abs(velocity) < SNAP_THRESHOLD) {
        targetRotation = Math.round(targetRotation)
        velocity = 0
        currentIndex = ((Math.round(targetRotation) % totalCards) + totalCards) % totalCards
        updateIndicators()
      }
    }

    // Infinite scroll: wrap rotation to keep it in reasonable bounds
    if (rotation > totalCards) {
      rotation -= totalCards
      targetRotation -= totalCards
    } else if (rotation < -totalCards) {
      rotation += totalCards
      targetRotation += totalCards
    }

    cards.forEach((card, index) => {
      // Calculate CONTINUOUS position - cards slide smoothly with decimal positions
      let position = index - rotation

      // Normalize position to be within -totalCards/2 to +totalCards/2
      while (position > totalCards / 2) position -= totalCards
      while (position < -totalCards / 2) position += totalCards

      // Coverflow-style positioning
      const absPosition = Math.abs(position)

      // Show up to 3 cards: center + one on each side
      const isVisible = absPosition <= 1.5
      card.style.opacity = isVisible ? "1" : "0"
      card.style.pointerEvents = isVisible ? "all" : "none"

      if (!isVisible) return

      // Smoothly move from center to side
      const RADIUS = 0.5
      const t = Math.min(absPosition / RADIUS, 1)
      const ease = t * t * (3 - 2 * t) // smoothstep

      const translateX = position * responsive.spacing
      const scale = 1 - (ease * 0.15) // Side cards are slightly smaller
      const rotateY = -position * responsive.rotation * ease
      const zIndex = Math.round(100 - absPosition * 100)

      // Apply zIndex to the card
      card.style.zIndex = zIndex.toString()

      // Apply transform to the image wrapper - use scale instead of translateZ for compatibility
      const imageWrapper = card.querySelector(".card-image-wrapper") as HTMLElement
      if (imageWrapper) {
        imageWrapper.style.transform = `translateX(${translateX}px) rotateY(${rotateY}deg) scale(${scale})`
      }

      // Keep text flat - only translate horizontally
      // Only show text for the center card (position close to 0)
      const cardContent = card.querySelector(".card-content") as HTMLElement
      if (cardContent) {
        const isCenterCard = Math.abs(position) < 0.3
        cardContent.style.transform = `translateX(${translateX}px)`
        cardContent.style.opacity = isCenterCard ? "1" : "0"
      }
    })

    requestAnimationFrame(updateCardPositions)
  }

  function updateIndicators() {
    indicators.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add("active")
      } else {
        dot.classList.remove("active")
      }
    })
  }

  function goToIndex(index: number) {
    // For manual clicks, snap to specific index
    const wrappedIndex = ((index % totalCards) + totalCards) % totalCards
    targetRotation = Math.round(targetRotation) - currentIndex + wrappedIndex
    currentIndex = wrappedIndex
    velocity = 0
    updateIndicators()
    resetAutoRotate()
  }

  function nextCard() {
    targetRotation += 1
    currentIndex = (currentIndex + 1) % totalCards
    velocity = 0
    updateIndicators()
    resetAutoRotate()
  }

  function prevCard() {
    targetRotation -= 1
    currentIndex = (currentIndex - 1 + totalCards) % totalCards
    velocity = 0
    updateIndicators()
    resetAutoRotate()
  }

  function resetAutoRotate() {
    if (autoRotateTimer) {
      clearTimeout(autoRotateTimer)
    }
    autoRotateTimer = window.setTimeout(() => {
      startAutoRotate()
    }, autoRotateDelay)
  }

  function startAutoRotate() {
    if (autoRotateTimer) {
      clearTimeout(autoRotateTimer)
    }
    autoRotateTimer = window.setTimeout(() => {
      nextCard()
      startAutoRotate()
    }, autoRotateInterval)
  }

  // Track which card was clicked (if any)
  let clickedCardIndex: number | null = null
  let totalDragDistance = 0

  // Mouse drag handlers
  track.addEventListener("mousedown", (e) => {
    // Check if click is on a card
    const clickedCard = (e.target as HTMLElement).closest(".carousel-card") as HTMLElement
    if (clickedCard) {
      clickedCardIndex = parseInt(clickedCard.dataset.index || "0")
    } else {
      clickedCardIndex = null
    }

    isDragging = true
    startX = e.clientX
    lastX = e.clientX
    totalDragDistance = 0
    lastTime = Date.now()
    velocity = 0
    track.classList.add("dragging")
    resetAutoRotate()
  })

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return
    e.preventDefault()

    const currentTime = Date.now()
    const deltaTime = currentTime - lastTime
    const deltaX = e.clientX - lastX

    // Track total drag distance
    totalDragDistance += Math.abs(deltaX)

    if (deltaTime > 0) {
      velocity = -(deltaX / deltaTime) * 16 * 0.01
    }

    const dragAmount = -(e.clientX - startX) * 0.0025 // Continuous sliding
    targetRotation = currentIndex + dragAmount

    lastX = e.clientX
    lastTime = currentTime
  })

  document.addEventListener("mouseup", () => {
    if (!isDragging) return
    isDragging = false
    track.classList.remove("dragging")

    // If total drag distance is small (< 10px), treat it as a click
    if (totalDragDistance < 10 && clickedCardIndex !== null) {
      goToIndex(clickedCardIndex)
    }

    clickedCardIndex = null
    totalDragDistance = 0
  })

  // Touch handlers for mobile
  let touchStartX = 0
  let touchStartY = 0
  let touchLastX = 0
  let touchDragDistance = 0
  let touchedCardIndex: number | null = null

  track.addEventListener("touchstart", (e) => {
    // Check if touch is on a card
    const touchedCard = (e.target as HTMLElement).closest(".carousel-card") as HTMLElement
    if (touchedCard) {
      touchedCardIndex = parseInt(touchedCard.dataset.index || "0")
    } else {
      touchedCardIndex = null
    }

    isDragging = true
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
    touchLastX = e.touches[0].clientX
    touchDragDistance = 0
    lastTime = Date.now()
    velocity = 0
    resetAutoRotate()
  }, { passive: true })

  track.addEventListener("touchmove", (e) => {
    if (!isDragging) return

    // Check if this is a horizontal swipe (not vertical scroll)
    const deltaX = Math.abs(e.touches[0].clientX - touchStartX)
    const deltaY = Math.abs(e.touches[0].clientY - touchStartY)

    // Only prevent default if horizontal swipe is dominant
    if (deltaX > deltaY && deltaX > 10) {
      e.preventDefault()
    } else if (deltaY > deltaX) {
      // User is trying to scroll vertically, cancel carousel drag
      isDragging = false
      touchedCardIndex = null
      return
    }

    const currentTime = Date.now()
    const deltaTime = currentTime - lastTime
    const touchDeltaX = e.touches[0].clientX - touchLastX

    // Track total touch drag distance
    touchDragDistance += Math.abs(touchDeltaX)

    if (deltaTime > 0) {
      velocity = -(touchDeltaX / deltaTime) * 16 * 0.01
    }

    const dragAmount = -(e.touches[0].clientX - touchStartX) * 0.0025 // Continuous sliding
    targetRotation = currentIndex + dragAmount

    touchLastX = e.touches[0].clientX
    lastTime = currentTime
  }, { passive: false })

  track.addEventListener("touchend", () => {
    if (!isDragging) return
    isDragging = false

    // If total drag distance is small (< 10px), treat it as a tap
    if (touchDragDistance < 10 && touchedCardIndex !== null) {
      goToIndex(touchedCardIndex)
    }

    touchedCardIndex = null
    touchDragDistance = 0
  }, { passive: true })

  // Navigation buttons
  prevBtn?.addEventListener("click", () => {
    prevCard()
  })

  nextBtn?.addEventListener("click", () => {
    nextCard()
  })

  // Indicator dots
  indicators.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goToIndex(index)
    })
  })

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!carouselSection) return
    const rect = carouselSection.getBoundingClientRect()
    const isInView = rect.top < window.innerHeight && rect.bottom > 0

    if (isInView) {
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        prevCard()
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        nextCard()
      }
    }
  })



  // Handle window resize
  let resizeTimeout: number | undefined
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = window.setTimeout(() => {
      // Force re-render with new responsive values
      updateCardPositions()
    }, 100)
  })

  // Initial animation - start from startIndex+1 and animate to startIndex
  rotation = startIndex + 1
  targetRotation = startIndex
  setTimeout(() => {
    resetAutoRotate()
  }, 1500)

  // Initialize
  updateIndicators()
  updateCardPositions()
})

