import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const Header: QuartzComponent = ({ children }: QuartzComponentProps) => {
  return children.length > 0 ? <header>{children}</header> : null
}

Header.css = `
header {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0.375rem 1.5rem;
  margin: 0;
  gap: 1.5rem;
  border-bottom: 1px solid rgba(128, 128, 128, 0.15);
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(var(--light-rgb, 250, 248, 248), 0.72);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
}

:root[saved-theme="dark"] header {
  background: rgba(22, 22, 24, 0.72);
}

@media (max-width: 800px) {
  header {
    padding: 0.25rem 0.75rem;
  }
}

header h1 {
  margin: 0;
  flex: auto;
}
`

export default (() => Header) satisfies QuartzComponentConstructor
