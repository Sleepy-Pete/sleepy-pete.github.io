import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/ytlite.inline"

// Renders nothing itself; ships the script that swaps YouTube iframes for
// click-to-load posters. Styles live in styles/custom.scss under .yt-lite.
const LiteYouTube: QuartzComponent = () => null

LiteYouTube.afterDOMLoaded = script

export default (() => LiteYouTube) satisfies QuartzComponentConstructor
