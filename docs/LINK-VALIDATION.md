# Link Validation & Wikilink Checking

This document explains how to use the automated link validation scripts to maintain your Quartz site.

## Overview

The site includes two automated scripts that help maintain link integrity:

1. **`check-and-fix-wikilinks.py`** - Detects and fixes broken wikilinks in markdown files
2. **`validate-site.sh`** - Comprehensive validation that checks links and builds the site

## Quick Start

### Run Full Validation

```bash
./scripts/validate-site.sh
```

This will:
1. Check all markdown files for broken wikilinks
2. Automatically fix common issues
3. Build the Quartz site
4. Generate detailed logs

### Check Wikilinks Only

```bash
python3 scripts/check-and-fix-wikilinks.py
```

## What Gets Fixed

The scripts automatically fix these common issues:

- **Relative paths** → Full absolute paths
- **URL-encoded spaces** (`%20`) → Regular spaces
- **Missing path prefixes** → Adds `Productions/` prefix when needed
- **Incorrect file references** → Finds and corrects to actual file locations

## Log Files

All operations generate detailed logs in the `logs/` directory:

```
logs/
├── wikilink_check_20240103_225900.log    # Wikilink check results
└── build_20240103_225900.log             # Build output
```

### Log Contents

**Wikilink Check Log:**
- Timestamp of check
- Files scanned
- Broken links found
- Fixes applied
- Summary report

**Build Log:**
- Quartz build output
- File counts
- Build status

## Wikilink Format

Always use the full path format for wikilinks:

```markdown
# ✓ Correct
[[Productions/Studio Syro/Quill|Learn more about Quill →]]
[[Productions/Studio Syro/Animated Experiences/Tales From Soda Island|Tales From Soda Island]]

# ✗ Incorrect
[[Quill]]
[[Tales From Soda Island]]
[[Animated Experiences/...]]
```

## File Structure

Wikilinks should reference the full path from the `content/` directory:

```
content/
├── Productions/
│   ├── Studio Syro.md
│   ├── Studio Syro/
│   │   ├── Quill.md
│   │   ├── Mixed Reality.md
│   │   ├── Animated Experiences/
│   │   │   ├── index.md
│   │   │   ├── Tales From Soda Island.md
│   │   │   └── Tales From Soda Island/
│   │   │       ├── Ch 1 - The Multiverse Bakery.md
│   │   │       └── ...
```

## Excluded Files

The scripts automatically skip:
- Template files (`*template*.md`)
- README files (`*readme*.md`)

These are for internal reference and don't need to be published.

## Integration with CI/CD

To run validation automatically before deployment:

```bash
# In your CI/CD pipeline
./scripts/validate-site.sh || exit 1
```

## Troubleshooting

### Script not executable

```bash
chmod +x scripts/check-and-fix-wikilinks.py
chmod +x scripts/validate-site.sh
```

### Python not found

Ensure Python 3.7+ is installed:
```bash
python3 --version
```

### Build fails after fixes

Check the build log:
```bash
cat logs/build_*.log
```

## Manual Fixes

If the script can't auto-fix a link, you'll see it in the log. To fix manually:

1. Open the markdown file
2. Find the broken wikilink
3. Update to the correct path using the full path format
4. Run the validation script again

## Best Practices

1. **Always use full paths** in wikilinks
2. **Run validation** before committing changes
3. **Check logs** for any warnings or errors
4. **Keep file structure consistent** with the content directory
5. **Use descriptive display text** in wikilinks: `[[path|Display Text]]`

## Example Workflow

```bash
# 1. Make changes to markdown files
# 2. Run validation
./scripts/validate-site.sh

# 3. Check logs for any issues
cat logs/wikilink_check_*.log

# 4. If all good, commit changes
git add .
git commit -m "Update content with validated links"

# 5. Deploy
git push
```

