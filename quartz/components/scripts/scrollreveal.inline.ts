document.addEventListener("nav", () => {
  // Reveal only large blocks (section headings, card grids, the carousel).
  // Body text stays visible at all times.
  const selectors = [
    "article > h2",
    "article div[style*='display: grid']",
    "article .productions-grid",
    ".featured-carousel-section",
  ]

  const elements = document.querySelectorAll(selectors.join(", "))

  elements.forEach((el) => {
    if (!el.classList.contains("reveal")) {
      el.classList.add("reveal")
    }
  })

  // Add stagger class to grids
  const grids = document.querySelectorAll(
    "article div[style*='display: grid'], article .productions-grid",
  )
  grids.forEach((grid) => {
    grid.classList.add("reveal-stagger")
  })

  // IntersectionObserver for scroll reveals
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px",
    },
  )

  document.querySelectorAll(".reveal, .reveal-stagger").forEach((el) => {
    observer.observe(el)
  })

  // Cleanup
  window.addCleanup(() => observer.disconnect())
})
