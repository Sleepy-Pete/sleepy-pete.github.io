document.addEventListener("nav", () => {
  const container = document.querySelector(".coverflow-container")
  if (!container) return

  const stage = container.querySelector(".coverflow-stage") as HTMLElement
  const items = Array.from(container.querySelectorAll(".coverflow-item")) as HTMLElement[]
  const prevBtn = container.querySelector(".coverflow-prev") as HTMLButtonElement
  const nextBtn = container.querySelector(".coverflow-next") as HTMLButtonElement
  const dots = Array.from(container.querySelectorAll(".coverflow-dot")) as HTMLButtonElement[]
  const titleEl = container.querySelector(".coverflow-project-title") as HTMLElement
  const descEl = container.querySelector(".coverflow-project-description") as HTMLElement

  if (!stage || items.length === 0) return

  let currentIndex = 0
  const totalItems = items.length

  // Project data (extracted from DOM)
  const projects = items.map(item => ({
    title: item.querySelector("img")?.alt || "",
    description: "",
    link: item.dataset.link || "#"
  }))

  // Extract descriptions from the default options in the component
  const descriptions = [
    "VR Animation Studio",
    "VR Animated Series",
    "Mixed Reality Platformer",
    "VR Music Experience",
    "VR/AR Messaging App",
    "Location-Based VR Experience"
  ]

  function updateCoverFlow(index: number, animate = true) {
    currentIndex = index

    items.forEach((item, i) => {
      const offset = i - currentIndex
      const absOffset = Math.abs(offset)
      
      // Calculate position and transforms
      let translateX = 0
      let translateZ = 0
      let rotateY = 0
      let scale = 1
      let opacity = 1
      let zIndex = 0

      if (offset === 0) {
        // Center item
        translateX = 0
        translateZ = 100
        rotateY = 0
        scale = 1.2
        opacity = 1
        zIndex = 100
      } else if (absOffset === 1) {
        // Adjacent items
        translateX = offset * 280
        translateZ = -50
        rotateY = offset * -55
        scale = 0.85
        opacity = 0.9
        zIndex = 50
      } else if (absOffset === 2) {
        // Second-level items
        translateX = offset * 400
        translateZ = -150
        rotateY = offset * -65
        scale = 0.7
        opacity = 0.6
        zIndex = 25
      } else {
        // Hidden items
        translateX = offset * 500
        translateZ = -200
        rotateY = offset * -70
        scale = 0.5
        opacity = 0.3
        zIndex = 0
      }

      const transform = `
        translateX(${translateX}px) 
        translateZ(${translateZ}px) 
        rotateY(${rotateY}deg) 
        scale(${scale})
      `

      item.style.transform = transform
      item.style.opacity = opacity.toString()
      item.style.zIndex = zIndex.toString()
      item.style.transition = animate ? "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)" : "none"

      // Update active state
      if (offset === 0) {
        item.classList.add("active")
      } else {
        item.classList.remove("active")
      }
    })

    // Update info
    if (titleEl && descEl) {
      titleEl.textContent = projects[currentIndex].title
      descEl.textContent = descriptions[currentIndex] || projects[currentIndex].description
    }

    // Update dots
    dots.forEach((dot, i) => {
      if (i === currentIndex) {
        dot.classList.add("active")
      } else {
        dot.classList.remove("active")
      }
    })
  }

  function goToNext() {
    const nextIndex = (currentIndex + 1) % totalItems
    updateCoverFlow(nextIndex)
  }

  function goToPrev() {
    const nextIndex = (currentIndex - 1 + totalItems) % totalItems
    updateCoverFlow(nextIndex)
  }

  function goToIndex(index: number) {
    if (index >= 0 && index < totalItems) {
      updateCoverFlow(index)
    }
  }

  // Event listeners
  prevBtn?.addEventListener("click", goToPrev)
  nextBtn?.addEventListener("click", goToNext)

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => goToIndex(index))
  })

  // Click on items to navigate
  items.forEach((item, index) => {
    item.addEventListener("click", () => {
      if (index === currentIndex) {
        // Navigate to project page
        const link = item.dataset.link
        if (link && link !== "#") {
          window.location.href = link
        }
      } else {
        // Navigate to this item
        goToIndex(index)
      }
    })
  })

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!container.matches(":hover") && document.activeElement?.closest(".coverflow-container") !== container) {
      return
    }
    
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      goToPrev()
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      goToNext()
    } else if (e.key === "Enter" && document.activeElement?.classList.contains("coverflow-item")) {
      const link = (document.activeElement as HTMLElement).dataset.link
      if (link && link !== "#") {
        window.location.href = link
      }
    }
  })

  // Initialize
  updateCoverFlow(0, false)

  // Cleanup
  window.addCleanup(() => {
    prevBtn?.removeEventListener("click", goToPrev)
    nextBtn?.removeEventListener("click", goToNext)
  })
})

