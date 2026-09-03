import { i18n } from "../i18n"
import { FullSlug, getFileExtension, joinSegments, pathToRoot } from "../util/path"
import { CSSResourceToStyleElement, JSResourceToScriptElement } from "../util/resources"
import { googleFontHref, googleFontSubsetHref } from "../util/theme"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { unescapeHTML } from "../util/escape"
import { CustomOgImagesEmitterName } from "../plugins/emitters/ogImage"

// Structured data for the homepage so search engines and scrapers read the
// same facts a recruiter sees on the page.
const PERSON = {
  name: "Peter Ariet",
  jobTitle: "Producer and Technical Program Manager",
  email: "pjpariet@gmail.com",
  photo: "/static/images/optimized/ProfilePhoto_Peter.jpg",
  city: "San Diego",
  region: "CA",
  employer: { name: "Studio Syro", url: "https://studiosyro.com" },
  school: "University of Florida",
  profiles: [
    "https://www.linkedin.com/in/peter-ariet/",
    "https://www.instagram.com/peterariet/",
    "https://x.com/peterariet",
  ],
  topics: [
    "Production management",
    "Technical program management",
    "Virtual reality",
    "Mixed reality",
    "Real-time 3D",
    "Unity",
    "Unreal Engine",
    "Meta Quest",
    "Location-based entertainment",
  ],
}

export default (() => {
  const Head: QuartzComponent = ({
    cfg,
    fileData,
    externalResources,
    ctx,
  }: QuartzComponentProps) => {
    const pageTitle = fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title
    // Pages read "Page - Site". The homepage title already carries the name,
    // so it is used as-is instead of "Peter Ariet - Peter Ariet ...".
    const title =
      pageTitle === cfg.pageTitle || pageTitle.startsWith(`${cfg.pageTitle} -`)
        ? pageTitle
        : `${pageTitle} - ${cfg.pageTitle}`
    const description =
      fileData.frontmatter?.socialDescription ??
      fileData.frontmatter?.description ??
      unescapeHTML(fileData.description?.trim() ?? i18n(cfg.locale).propertyDefaults.description)

    const { css, js, additionalHead } = externalResources

    const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
    const path = url.pathname as FullSlug
    const baseDir = fileData.slug === "404" ? path : pathToRoot(fileData.slug!)
    const iconPath = joinSegments(baseDir, "static/icon.png")

    // Canonical url of the current page: folder indexes resolve to the folder,
    // the homepage to the site root.
    const isIndex = fileData.slug === "index"
    const cleanSlug = isIndex ? "" : (fileData.slug ?? "").replace(/\/index$/, "/")
    const canonicalUrl =
      fileData.slug === "404" || cleanSlug === ""
        ? url.toString()
        : joinSegments(url.toString(), cleanSlug)

    const usesCustomOgImage = ctx.cfg.plugins.emitters.some(
      (e) => e.name === CustomOgImagesEmitterName,
    )
    const ogImageDefaultPath = `https://${cfg.baseUrl}/static/og-image.png`
    const ogImageDefaultType = (getFileExtension(ogImageDefaultPath) ?? ".png").replace(".", "")

    const personSchema = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: PERSON.name,
      url: url.toString(),
      image: `${url.origin}${PERSON.photo}`,
      jobTitle: PERSON.jobTitle,
      description,
      email: `mailto:${PERSON.email}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: PERSON.city,
        addressRegion: PERSON.region,
        addressCountry: "US",
      },
      worksFor: { "@type": "Organization", ...PERSON.employer },
      alumniOf: { "@type": "CollegeOrUniversity", name: PERSON.school },
      sameAs: PERSON.profiles,
      knowsAbout: PERSON.topics,
    }
    const siteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: cfg.pageTitle,
      url: url.toString(),
    }

    return (
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        {cfg.theme.cdnCaching && cfg.theme.fontOrigin === "googleFonts" && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link rel="stylesheet" href={googleFontHref(cfg.theme)} />
            {cfg.theme.typography.title && (
              <link rel="stylesheet" href={googleFontSubsetHref(cfg.theme, cfg.pageTitle)} />
            )}
          </>
        )}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta property="og:site_name" content={cfg.pageTitle}></meta>
        <meta property="og:title" content={title} />
        <meta property="og:type" content={isIndex ? "profile" : "website"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:image:alt" content={description} />

        {!usesCustomOgImage && (
          <>
            <meta property="og:image" content={ogImageDefaultPath} />
            <meta property="og:image:url" content={ogImageDefaultPath} />
            <meta name="twitter:image" content={ogImageDefaultPath} />
            <meta property="og:image:type" content={`image/${ogImageDefaultType}`} />
          </>
        )}

        {cfg.baseUrl && (
          <>
            <meta property="twitter:domain" content={cfg.baseUrl}></meta>
            <meta property="og:url" content={canonicalUrl}></meta>
            <meta property="twitter:url" content={canonicalUrl}></meta>
            <link rel="canonical" href={canonicalUrl} />
          </>
        )}

        <link rel="icon" href={iconPath} />
        <meta name="description" content={description} />
        <meta name="author" content={PERSON.name} />
        <meta name="generator" content="Quartz" />

        {isIndex && (
          <>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
            />
          </>
        )}

        {css.map((resource) => CSSResourceToStyleElement(resource, true))}
        {js
          .filter((resource) => resource.loadTime === "beforeDOMReady")
          .map((res) => JSResourceToScriptElement(res, true))}
        {additionalHead.map((resource) => {
          if (typeof resource === "function") {
            return resource(fileData)
          } else {
            return resource
          }
        })}
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor
