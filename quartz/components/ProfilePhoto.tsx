import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

function ProfilePhoto({ displayClass, fileData }: QuartzComponentProps) {
  // Only show on the index page
  if (fileData.slug !== "index") {
    return null
  }

  return (
    <div class={classNames(displayClass, "profile-photo")}>
      <img src="/static/images/optimized/ProfilePhoto_Peter.jpg" alt="Peter Ariet" />
    </div>
  )
}

ProfilePhoto.css = `
.profile-photo {
  text-align: center;
  margin-bottom: 2rem;
}

.profile-photo img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  border: 1px solid var(--lightgray);
}
`

export default (() => ProfilePhoto) satisfies QuartzComponentConstructor
