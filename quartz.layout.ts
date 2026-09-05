import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { FileTrieNode } from "./quartz/util/fileTrie"

// Explorer order: Productions first, then the remaining folders alphabetically,
// then files alphabetically.
const explorerSortFn = (a: FileTrieNode, b: FileTrieNode) => {
  const folderOrder = ["productions"]

  if (a.isFolder && b.isFolder) {
    const aIndex = folderOrder.indexOf(a.slugSegment.toLowerCase())
    const bIndex = folderOrder.indexOf(b.slugSegment.toLowerCase())

    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex
    }
    if (aIndex !== -1) return -1
    if (bIndex !== -1) return 1
  }

  if ((!a.isFolder && !b.isFolder) || (a.isFolder && b.isFolder)) {
    return a.displayName.localeCompare(b.displayName, undefined, {
      numeric: true,
      sensitivity: "base",
    })
  }

  return !a.isFolder && b.isFolder ? 1 : -1
}

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [Component.Navigation()],
  afterBody: [Component.LiteYouTube()],
  footer: Component.Footer({
    links: {
      Résumé: "/static/Ariet_Peter_Producer_Resume_2026.pdf",
      LinkedIn: "https://www.linkedin.com/in/peter-ariet/",
      X: "https://x.com/peterariet",
      Instagram: "https://www.instagram.com/peterariet/",
      Email: "mailto:pjpariet@gmail.com",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    // The homepage carries its own hero (name, role, photo) in content/index.md,
    // so the generic breadcrumbs and article title are skipped there.
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.ArticleTitle(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ContentMeta({ showReadingTime: false }),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      folderDefaultState: "open",
      useSavedState: false,
      sortFn: explorerSortFn,
    }),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      folderDefaultState: "open",
      useSavedState: false,
      sortFn: explorerSortFn,
    }),
  ],
  right: [Component.Graph(), Component.Backlinks()],
}
