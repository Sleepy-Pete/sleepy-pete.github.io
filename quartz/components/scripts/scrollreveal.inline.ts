document.addEventListener("nav", () => {
  // Add reveal class to content sections
  const selectors = [
    "article > h2",
    "article > h3",
    "article > p",
    "article > ul",
    "article > ol",
    "article > blockquote",
    "article > .table-container",
    "article > figure",
    "article > pre",
    "article div[style*='display: grid']",
    ".featured-carousel-section",
    ".backlinks",
    ".graph",
    ".toc",
  ]

  const elements = document.querySelectorAll(selectors.join(", "))

  elements.forEach((el) => {
    if (!el.classList.contains("reveal")) {
      el.classList.add("reveal")
    }
  })

  // Add stagger class to grids
  const grids = document.querySelectorAll("article div[style*='display: grid']")
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
