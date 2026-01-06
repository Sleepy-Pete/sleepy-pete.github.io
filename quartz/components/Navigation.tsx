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
            <a
              href={href}
              class="nav-link"
              data-folderpath={link.folderPath || ""}
            >
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
    gap: 2rem;
    padding: 1rem 0;
    flex-wrap: wrap;
  }

  .navigation .nav-link {
    color: var(--darkgray);
    font-weight: 500;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    transition: all 0.2s ease;
    position: relative;
    cursor: pointer;
  }

  .navigation .nav-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: var(--secondary);
    transition: width 0.3s ease;
  }

  .navigation .nav-link:hover {
    color: var(--secondary);
  }

  .navigation .nav-link:hover::after {
    width: 80%;
  }

  @media (max-width: 800px) {
    .navigation {
      gap: 1rem;
    }

    .navigation .nav-link {
      padding: 0.4rem 0.8rem;
      font-size: 0.9rem;
    }
  }
  `

  Navigation.afterDOMLoaded = script

  return Navigation
}) satisfies QuartzComponentConstructor

