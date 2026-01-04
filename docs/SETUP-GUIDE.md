# Automated Link Validation Setup Guide

This guide explains the automated link validation system that was set up for your Quartz site.

## What Was Set Up

A complete automated link validation system that:
- ✅ Detects broken wikilinks in markdown files
- ✅ Automatically fixes common issues
- ✅ Generates detailed logs
- ✅ Integrates with Quartz build process

## Files Created

### Scripts
- **`scripts/check-and-fix-wikilinks.py`** - Python script that checks and fixes broken links
- **`scripts/validate-site.sh`** - Bash wrapper that runs validation and builds the site
- **`scripts/README.md`** - Documentation for the scripts

### Documentation
- **`docs/LINK-VALIDATION.md`** - Comprehensive guide to link validation
- **`docs/QUICK-REFERENCE.md`** - Quick reference for common commands
- **`docs/SETUP-GUIDE.md`** - This file
- **`docs/build.md`** - Updated with link validation information

### Logs
- **`logs/`** - Directory where validation logs are stored (auto-created)

## Quick Start

### Run Full Validation
```bash
./scripts/validate-site.sh
```

This will:
1. Check all markdown files for broken wikilinks
2. Automatically fix common issues
3. Build the Quartz site
4. Generate logs in `logs/` directory

### Check Links Only
```bash
python3 scripts/check-and-fix-wikilinks.py
```

## What Gets Fixed

The scripts automatically fix:

| Issue | Example | Fixed To |
|-------|---------|----------|
| URL-encoded spaces | `[[Productions/Studio%20Syro\|...]]` | `[[Productions/Studio Syro\|...]]` |
| Missing path prefix | `[[Quill]]` | `[[Productions/Studio Syro/Quill]]` |
| Relative paths | `[[Animated Experiences/...]]` | `[[Productions/Studio Syro/Animated Experiences/...]]` |
| Incorrect references | `[[Tales From Soda Island]]` | `[[Productions/Studio Syro/Animated Experiences/Tales From Soda Island]]` |

## Logs

All operations create timestamped logs in `logs/`:

```
logs/
├── wikilink_check_20260103_225954.log
└── build_20260103_230000.log
```

Each log contains:
- Timestamp of operation
- Files scanned
- Issues found
- Fixes applied
- Summary report

## Integration with Your Workflow

### Before Committing
```bash
./scripts/validate-site.sh
git add .
git commit -m "Update content"
```

### Before Deploying
```bash
./scripts/validate-site.sh
# Check logs for any issues
cat logs/wikilink_check_*.log
git push
```

### In CI/CD Pipeline
```bash
#!/bin/bash
./scripts/validate-site.sh || exit 1
# Deploy if validation passes
```

## Wikilink Best Practices

### ✓ Always Use Full Paths
```markdown
[[Productions/Studio Syro|Studio Syro]]
[[Productions/Studio Syro/Quill|Learn more about Quill →]]
[[Productions/Studio Syro/Animated Experiences/Tales From Soda Island|Tales From Soda Island]]
```

### ✗ Avoid These Patterns
```markdown
[[Quill]]                          # Missing path
[[Animated Experiences/...]]       # Incomplete path
[[Productions/Studio%20Syro|...]]  # URL-encoded spaces
[[../Tales From Soda Island]]      # Relative paths
```

## Troubleshooting

### Scripts not executable
```bash
chmod +x scripts/check-and-fix-wikilinks.py
chmod +x scripts/validate-site.sh
```

### Python not found
```bash
python3 --version  # Should be 3.7+
```

### Build fails
Check the build log:
```bash
cat logs/build_*.log
```

### Links still broken after running script
Check the wikilink check log:
```bash
cat logs/wikilink_check_*.log
```

## Documentation

- **Full guide**: [`docs/LINK-VALIDATION.md`](LINK-VALIDATION.md)
- **Quick reference**: [`docs/QUICK-REFERENCE.md`](QUICK-REFERENCE.md)
- **Scripts info**: [`scripts/README.md`](../scripts/README.md)
- **Building**: [`docs/build.md`](build.md)

## Support

If you encounter issues:

1. Check the relevant log file in `logs/`
2. Review the documentation above
3. Ensure Python 3.7+ and Node.js are installed
4. Make sure scripts are executable: `chmod +x scripts/*.sh scripts/*.py`

## Next Steps

1. ✅ Review the documentation
2. ✅ Run the validation script: `./scripts/validate-site.sh`
3. ✅ Check the logs: `cat logs/wikilink_check_*.log`
4. ✅ Add to your workflow
5. ✅ (Optional) Integrate with CI/CD

You're all set! 🎉

