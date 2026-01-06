import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

// @ts-ignore
import script from "./scripts/coverflow.inline"
import styles from "./styles/coverflow.scss"

interface Project {
  title: string
  description: string
  image: string
  link: string
}

interface CoverFlowOptions {
  projects: Project[]
}

const defaultOptions: CoverFlowOptions = {
  projects: [
    {
      title: "Studio Syro",
      description: "VR Animation Studio",
      image: "/static/images/branding/social-logo-large.png",
      link: "/Productions/Studio-Syro"
    },
    {
      title: "Tales From Soda Island",
      description: "VR Animated Series",
      image: "/static/images/work/bakery.jpg",
      link: "/Productions/Studio-Syro/Animated-Experiences/Tales-From-Soda-Island"
    },
    {
      title: "PondQuest",
      description: "Mixed Reality Platformer",
      image: "/static/images/work/PondQuest_Thumbnail.png",
      link: "/Productions/Studio-Syro/Interactive-Experiences/PondQuest"
    },
    {
      title: "The Art of Change",
      description: "VR Music Experience",
      image: "/static/images/artofchange/promoposter.png",
      link: "/Productions/Studio-Syro/Animated-Experiences/The-Art-of-Change"
    },
    {
      title: "Dear Metaverse",
      description: "VR/AR Messaging App",
      image: "/static/images/work/DearMetaverse_Thumbnail_Landscape.png",
      link: "/Productions/Studio-Syro/Interactive-Experiences/Dear-Metaverse"
    },
    {
      title: "Terracotta Warriors",
      description: "Location-Based VR Experience",
      image: "/static/images/wevr/slide_image_2.png",
      link: "/Productions/Wevr"
    }
  ]
}

export default ((userOpts?: Partial<CoverFlowOptions>) => {
  const opts = { ...defaultOptions, ...userOpts }

  const CoverFlow: QuartzComponent = ({ displayClass, fileData }: QuartzComponentProps) => {
    // Only show on the index page
    if (fileData.slug !== "index") {
      return null
    }

    return (
      <div class={classNames(displayClass, "coverflow-container")}>
        <h2 class="coverflow-title">Featured Projects</h2>
        <div class="coverflow-wrapper">
          <div class="coverflow-stage">
            {opts.projects.map((project, index) => (
              <div 
                class="coverflow-item" 
                data-index={index}
                data-link={project.link}
              >
                <div class="coverflow-item-inner">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    loading="lazy"
                  />
                  <div class="coverflow-reflection"></div>
                </div>
              </div>
            ))}
          </div>
          <div class="coverflow-info">
            <h3 class="coverflow-project-title">{opts.projects[0].title}</h3>
            <p class="coverflow-project-description">{opts.projects[0].description}</p>
          </div>
        </div>
        <div class="coverflow-controls">
          <button class="coverflow-btn coverflow-prev" aria-label="Previous project">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button class="coverflow-btn coverflow-next" aria-label="Next project">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
        <div class="coverflow-dots">
          {opts.projects.map((_, index) => (
            <button 
              class={`coverflow-dot ${index === 0 ? 'active' : ''}`}
              data-index={index}
              aria-label={`Go to project ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    )
  }

  CoverFlow.css = styles
  CoverFlow.afterDOMLoaded = script

  return CoverFlow
}) satisfies QuartzComponentConstructor

