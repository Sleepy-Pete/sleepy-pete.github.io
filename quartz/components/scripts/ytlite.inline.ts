// Replace YouTube iframes with a light poster (thumbnail + play button) and
// only load the real player when the visitor clicks. This keeps YouTube's
// header bar (channel avatar, title, share) off the poster and saves the
// 3 to 6 MB of player script per embed on pages that are never played.

const YT_ID = /youtube(?:-nocookie)?\.com\/embed\/([A-Za-z0-9_-]{6,})/

function buildPoster(frame: HTMLIFrameElement) {
  const match = frame.src.match(YT_ID)
  if (!match) return
  const id = match[1]
  const title = frame.title || "Video"

  const wrap = document.createElement("div")
  wrap.className = "yt-lite"

  const button = document.createElement("button")
  button.type = "button"
  button.className = "yt-lite-play"
  button.setAttribute("aria-label", `Play ${title}`)

  const poster = document.createElement("img")
  poster.alt = ""
  poster.loading = "lazy"
  poster.decoding = "async"
  const fallback = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
  const custom = frame.dataset.poster
  poster.src = custom ?? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
  const useFallback = () => {
    if (poster.src !== fallback) poster.src = fallback
  }
  // Not every video has a 1280px poster. YouTube answers with a 404 or a
  // 120px grey placeholder; either way drop to the 480px one, which exists
  // for every public video.
  poster.addEventListener("error", useFallback)
  poster.addEventListener("load", () => {
    if (!custom && poster.naturalWidth <= 120) useFallback()
  })

  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  icon.setAttribute("viewBox", "0 0 68 48")
  icon.setAttribute("aria-hidden", "true")
  icon.innerHTML =
    '<path d="M66.5 7.7c-.8-2.9-3-5.2-5.9-6C55.4.3 34 0 34 0S12.6.3 7.4 1.7c-2.9.8-5.1 3.1-5.9 6C.1 13 0 24 0 24s.1 11 1.5 16.3c.8 2.9 3 5.2 5.9 6C12.6 47.7 34 48 34 48s21.4-.3 26.6-1.7c2.9-.8 5.1-3.1 5.9-6C67.9 35 68 24 68 24s-.1-11-1.5-16.3z" fill="#f00"/><path d="M45 24 27 14v20l18-10z" fill="#fff"/>'

  const label = document.createElement("span")
  label.className = "yt-lite-title"
  label.textContent = title

  button.append(poster, icon, label)
  wrap.append(button)

  button.addEventListener("click", () => {
    const player = document.createElement("iframe")
    player.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
    player.title = title
    player.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    player.allowFullscreen = true
    wrap.replaceChildren(player)
    player.focus()
  })

  frame.replaceWith(wrap)
}

function upgradeYouTubeEmbeds() {
  document
    .querySelectorAll<HTMLIFrameElement>('article iframe[src*="youtube"]')
    .forEach(buildPoster)
}

document.addEventListener("nav", upgradeYouTubeEmbeds)
