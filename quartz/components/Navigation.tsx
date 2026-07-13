import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

// @ts-ignore
import script from "./scripts/navigation.inline"

interface NavigationLink {
  text: string
  link?: string
  folderPath?: string
}

interface NavigationOptions {
  links: NavigationLink[]
}

const defaultOptions: NavigationOptions = {
  links: [
    { text: "Home", link: "/" },
    { text: "Productions", link: "/Productions/", folderPath: "Productions" },
    { text: "Recognitions", link: "/Recognitions/", folderPath: "Recognitions" },
    { text: "Publications", link: "/publications/", folderPath: "publications" },
    { text: "About", link: "/about" },
  ],
}

export default ((userOpts?: Partial<NavigationOptions>) => {
  const opts = { ...defaultOptions, ...userOpts }

  const Navigation: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
    const baseDir = pathToRoot(fileData.slug!)

    return (
      <nav class={classNames(displayClass, "navigation")}>
        {opts.links.map((link) => {
          // Build href - if link starts with /, use it directly, otherwise use baseDir
          let href = "#"
          if (link.link) {
            href = link.link.startsWith("/") ? link.link : baseDir + link.link
          }

          return (
            <a href={href} class="nav-link" data-folderpath={link.folderPath || ""}>
              {link.text}
            </a>
          )
        })}
      </nav>
    )
  }

  Navigation.css = `
  .navigation {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.25rem;
    padding: 0.375rem 0;
    flex-wrap: wrap;
  }

  .navigation .nav-link {
    color: var(--darkgray);
    font-weight: 500;
    font-size: 0.9375rem;
    text-decoration: none;
    min-height: 40px;
    padding: 0.5rem 0.875rem;
    border-radius: 8px;
    transition: color 0.3s ease, background-color 0.3s ease;
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .navigation .nav-link::after {
    content: '';
    position: absolute;
    bottom: 0.3rem;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: var(--secondary);
    border-radius: 1px;
    transition: width 0.3s ease;
  }

  .navigation .nav-link:hover {
    color: var(--secondary);
  }

  .navigation .nav-link:hover::after {
    width: 60%;
  }

  .navigation .nav-link.active {
    color: var(--secondary);
    font-weight: 600;
  }

  .navigation .nav-link.active::after {
    width: 60%;
  }

  @media (max-width: 800px) {
    .navigation {
      gap: 0;
      padding: 0.25rem 0;
      flex-wrap: nowrap;
      justify-content: space-between;
      width: auto;
      flex: 1 1 auto;
      min-width: 0;
      max-width: 100%;
    }

    .navigation .nav-link {
      padding: 0.45rem 0.1rem;
      font-size: clamp(0.7rem, 3.3vw, 0.8125rem);
      min-height: 38px;
      white-space: nowrap;
    }
  }
  `

  Navigation.afterDOMLoaded = script

  return Navigation
}) satisfies QuartzComponentConstructor
