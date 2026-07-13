import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
// @ts-ignore
import script from "./scripts/carousel.inline"
import style from "./styles/featuredCarousel.scss"

interface Project {
  title: string
  description: string
  image: string
  link: string
}

interface CarouselOptions {
  autoRotateInterval?: number
  projects?: Project[]
}

const defaultProjects: Project[] = [
  {
    title: "Tales From Soda Island",
    description: "VR Animated Series - published by Meta",
    image: "/static/images/work/bakery.jpg",
    link: "/Productions/Studio-Syro/Animated-Experiences/Tales-From-Soda-Island",
  },
  {
    title: "The Art of Change",
    description: "VR Music Experience - 81st Venice Film Festival",
    image: "/static/images/optimized/artofchange/promoposter.jpg",
    link: "/Productions/Studio-Syro/Animated-Experiences/The-Art-of-Change",
  },
  {
    title: "PondQuest",
    description: "Mixed Reality Platformer",
    image: "/static/images/optimized/work/PondQuest_Thumbnail.jpg",
    link: "/Productions/Studio-Syro/Interactive-Experiences/PondQuest",
  },
  {
    title: "Terracotta Warriors",
    description: "Location-Based VR - with HTC VIVE Arts",
    image: "/static/images/wevr/slide_image_2.png",
    link: "/Productions/Wevr/Location-Based-Experiences/Terracotta-Warriors",
  },
  {
    title: "Spatial Mailbox",
    description: "VR/AR Messaging App",
    image: "/static/images/optimized/work/SpatialMailbox_Thumbnail.jpg",
    link: "/Productions/Studio-Syro/Interactive-Experiences/Spatial-Mailbox",
  },
  {
    title: "Studio Syro",
    description: "VR Animation Studio - Co-Founder",
    image: "/static/images/branding/Syro_logo_social.png",
    link: "/Productions/Studio-Syro",
  },
]

const defaultOptions: CarouselOptions = {
  autoRotateInterval: 5000,
  projects: defaultProjects,
}

export default ((userOpts?: Partial<CarouselOptions>) => {
  const FeaturedCarousel: QuartzComponent = ({ displayClass, fileData }: QuartzComponentProps) => {
    if (fileData.slug !== "index") {
      return null
    }

    const opts = { ...defaultOptions, ...userOpts }
    const projects = opts.projects || defaultProjects

    return (
      <section
        class={classNames(displayClass, "featured-carousel-section")}
        data-auto-rotate-interval={opts.autoRotateInterval}
      >
        <div class="carousel-header">
          <h2>Featured Projects</h2>
          <p class="carousel-subtitle">Explore my work in VR, AR, and immersive experiences</p>
        </div>

        <div class="carousel-viewport">
          <div class="carousel-track">
            {projects.map((project, index) => (
              <a
                href={project.link}
                class={`carousel-card${index === 0 ? " active" : ""}`}
                data-index={index}
                aria-label={`View ${project.title}`}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
                <div class="card-content">
                  <h3 class="card-title">{project.title}</h3>
                  <p class="card-description">{project.description}</p>
                </div>
              </a>
            ))}
          </div>

          <button class="carousel-nav carousel-prev" aria-label="Previous project">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <button class="carousel-nav carousel-next" aria-label="Next project">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        <div class="carousel-dots">
          {projects.map((_, index) => (
            <button
              class={`carousel-dot${index === 0 ? " active" : ""}`}
              data-index={index}
              aria-label={`Go to project ${index + 1}`}
            ></button>
          ))}
        </div>
      </section>
    )
  }

  FeaturedCarousel.css = style
  FeaturedCarousel.afterDOMLoaded = script

  return FeaturedCarousel
}) satisfies QuartzComponentConstructor
