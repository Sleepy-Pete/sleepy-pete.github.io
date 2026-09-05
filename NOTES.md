# peterariet.com - working notes

Last updated: 2026-09-04

## What the site is

A Quartz 4.5.2 site deployed to GitHub Pages from `master` (about one minute per deploy). Two layers:

- **Homepage one-pager** (`content/index.md`): the recruiter view. Hero, four stat tiles, selected work, Studio Syro and Wevr experience side by side, recognition, skills, links into the rest.
- **The notebook** (everything else under `content/`): case studies per title, recognitions, publications, About. The Obsidian-style side panels (explorer, graph, backlinks) are hidden until hover or the reader-mode toggle. That is intentional; do not remove them.

## Voice and facts

Site copy follows the positioning settled in the job-search project (`~/Documents/GitHub/BOJ/jobsearch-dashboard`, see `PROJECT_BRIEF.md` section 4 and `data/profile.json`):

- Headline: Producer and Technical Program Manager. Lead with interactive software and real-time 3D, not VR.
- Studio Syro: Lead Producer, 2019 to present, "commissioned interactive production for Meta". No founder, co-founder, or studio-head language anywhere on the site.
- Wevr: Line Producer, location-based VR, 2024 to 2025, HTC VIVE Arts named on that line.
- Eight years of experience. Never round.
- Scope facts: 5 million+ views for Tales From Soda Island; four products for Meta; Terracotta Warriors is 40 minutes, three stages, 16 delivery zones, up to 150 guests per session; Spatial Mailbox launched May 2026; River Rush live April 2026.
- No superlatives (pioneering, groundbreaking, revolutionary, cutting-edge, stunning, world-class). No em dashes. Plain words on the homepage.
- Résumé on the site is `quartz/static/Ariet_Peter_Producer_Resume_2026.pdf`, a copy of the BOJ master. Refresh it when the master changes and keep the `Ariet_Peter_<Role>_Resume_<Year>.pdf` name.

## Layout and styling

- Custom styles live in `quartz/styles/custom.scss`. Shared blocks: `.card-grid` + `a.project-card`, `.gallery`, `.at-a-glance`, `.contact-bar`. Homepage-only rules are scoped under `body[data-slug="index"]`.
- Between 800 and 1200 px, with reader mode on, the grid collapses to one centered column and the explorer panel floats over the left edge on hover.
- Head metadata (`quartz/components/Head.tsx`): "Page - Peter Ariet" titles, canonical links, Person and WebSite JSON-LD on the homepage. `content/robots.txt` lands at the site root.
- Light-mode gray is `#6e6e73` for contrast. Dark mode is handled by the theme colors in `quartz.config.ts`.

## Assets and repo hygiene

- Only referenced images live in `quartz/static/images/` (about 9 MB). Unreferenced originals are in `source-images/` (tracked, not deployed).
- `assets/` (1.8 GB legacy template incl. studio videos) is gitignored and untracked; the files stay on disk. `quartz/static/studiosyro/` likewise.
- `_archive/` holds the pre-Quartz template code and old session notes.
- Git history is still about 1 GB because of the old assets. Purging needs a history rewrite and force push; only on explicit request.

## Verify before pushing

```
npm run check
npx quartz build --serve --port 8080
```

Then screenshot desktop, tablet (830 to 1150 px), and mobile in light and dark, crawl `public/` for broken internal links, and grep `content/` for founder words, superlatives, and em dashes.

## Changelog

- **2026-09-04**: Tablet-width centering, hero photo centered, text links on one baseline. npm audit taken from 14 findings to 0 (lockfile rebuilt, sharp 0.35, toml 5, xmldom override to 0.9.12).
- **2026-09-03**: Recruiter one-pager homepage. Copy aligned to the BOJ positioning across all pages. About page rewritten. Spatial Mailbox updated to launch. SIGGRAPH 2023 VR Theater (Nyssa) added. Fixed duplicate titles and H1s, placeholder dates, four dead links, og:image type, empty 404 rail, contrast, Productions grid, galleries. SEO: JSON-LD, canonical, descriptions, robots.txt. Deploy artifact 108 MB to 16 MB.
- **2026-07-13**: Studio Syro static payload cut from deploys. Mobile nav and type scale fixes.

## Open items

- Studio Syro Wikipedia article as a side project: gather independent coverage, create Wikidata items, submit through Articles for Creation with a conflict-of-interest disclosure. Founding year needs reconciling (2019 on the résumé, 2020 in the VIEW article).
- The 2025 résumé PDF is still deployed but unlinked; remove when old links no longer matter.
- Decide the public email (gmail on the site, studiosyro.com in correspondence).
