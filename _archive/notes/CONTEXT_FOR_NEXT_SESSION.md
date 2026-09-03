# Context for Next Session

## Current Project Status

**Portfolio Site:** Peter Ariet's personal portfolio built with Quartz (static site generator)
**Repository:** https://github.com/Sleepy-Pete/sleepy-pete.github.io
**Local Server:** Running at http://localhost:8080 (use `npx quartz build --serve`)

## Recent Work Completed

### 1. Updated About Page
- Replaced with comprehensive bio, experience, and skills
- Added link to new Recognitions section
- File: `content/about.md`

### 2. Created Recognitions Section
- Main index: `content/Recognitions/index.md`
- 9 individual award pages with verified external links:
  - SIGGRAPH Spatial Storytelling 2025
  - SXSW 2025 (The Art of Change)
  - 81st Venice International Film Festival 2024
  - Mediterranean International Film Festival 2024
  - Webby Awards 2024
  - 80th Venice International Film Festival 2023
  - 79th Venice International Film Festival 2022
  - SIGGRAPH 2021
  - Published Paper 2018 (Springer)

### 3. Created Workspace Guidelines
- File: `.augment/rules/portfolio-guidelines.md`
- Type: "always" (auto-included in all Augment sessions)
- Documents project structure, conventions, and best practices

### 4. Fixed GitHub Pages Build
- Added `.nojekyll` file to disable Jekyll build
- Quartz generates static HTML in `public/` folder
- GitHub Pages now serves pre-built static files

## Latest Commits
- `42a6cc8` - Add .nojekyll to disable Jekyll build
- `6c28d1b` - Add Recognitions section with individual award pages and workspace guidelines

## Key Technical Details

**Build Command:** `npx quartz build --serve`
**Content Format:** Markdown with YAML frontmatter
**Navigation:** Wikilinks syntax `[[path|text]]`
**Directory Structure:**
```
content/
├── about.md
├── index.md
├── Recognitions/ (new)
├── Productions/
├── publications/
└── templates/
```

## Next Steps / Known Issues

1. **Verify GitHub Pages Deployment** - Check if site builds successfully after .nojekyll addition
2. **GitHub Pages Settings** - Ensure deployment source is set to `public/` folder (or root if using docs/)
3. **Consider:** May need to configure GitHub Pages to build from `public/` branch or use GitHub Actions

## Important Notes

- Site uses Quartz v4.5.2
- All recognition pages have verified external links
- Workspace guidelines help maintain consistency
- Local development server auto-rebuilds on file changes

