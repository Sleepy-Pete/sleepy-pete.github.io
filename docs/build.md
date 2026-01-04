---
title: "Building your Quartz"
---

Once you've [[index#🪴 Get Started|initialized]] Quartz, let's see what it looks like locally:

```bash
npx quartz build --serve
```

This will start a local web server to run your Quartz on your computer. Open a web browser and visit `http://localhost:8080/` to view it.

> [!hint] Flags and options
> For full help options, you can run `npx quartz build --help`.
>
> Most of these have sensible defaults but you can override them if you have a custom setup:
>
> - `-d` or `--directory`: the content folder. This is normally just `content`
> - `-v` or `--verbose`: print out extra logging information
> - `-o` or `--output`: the output folder. This is normally just `public`
> - `--serve`: run a local hot-reloading server to preview your Quartz
> - `--port`: what port to run the local preview server on
> - `--concurrency`: how many threads to use to parse notes

> [!warning] Not to be used for production
> Serve mode is intended for local previews only.
> For production workloads, see the page on [[hosting]].

## Validating Links

Before building for production, it's recommended to validate all wikilinks in your content:

```bash
./scripts/validate-site.sh
```

This script will:
1. Check all markdown files for broken wikilinks
2. Automatically fix common issues (URL encoding, missing paths, etc.)
3. Build the Quartz site
4. Generate detailed logs in the `logs/` directory

For more information, see [[LINK-VALIDATION|Link Validation & Wikilink Checking]].
