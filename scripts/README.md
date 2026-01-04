# Quartz Site Scripts

Utility scripts for maintaining and validating your Quartz site.

## Scripts

### `validate-site.sh`

**Purpose:** Complete site validation and build

**Usage:**
```bash
./scripts/validate-site.sh
```

**What it does:**
1. Checks all markdown files for broken wikilinks
2. Automatically fixes common link issues
3. Builds the Quartz site
4. Generates detailed logs

**Output:**
- Console output with color-coded status messages
- Log files in `logs/` directory

### `check-and-fix-wikilinks.py`

**Purpose:** Detect and fix broken wikilinks

**Usage:**
```bash
python3 scripts/check-and-fix-wikilinks.py
```

**What it does:**
1. Scans all markdown files in `content/` directory
2. Finds broken wikilinks
3. Attempts to fix common issues:
   - Removes URL-encoded spaces (`%20`)
   - Adds missing path prefixes
   - Corrects relative paths to absolute paths
4. Generates detailed log file

**Output:**
- Console output with summary
- Detailed log in `logs/wikilink_check_TIMESTAMP.log`

## Requirements

- Python 3.7+
- Node.js (for Quartz build)
- Bash shell

## Installation

Scripts are already executable. If you need to make them executable:

```bash
chmod +x scripts/validate-site.sh
chmod +x scripts/check-and-fix-wikilinks.py
```

## Logs

All scripts generate logs in the `logs/` directory:

```
logs/
├── wikilink_check_20260103_225954.log
└── build_20260103_225954.log
```

Each log is timestamped for easy tracking of changes over time.

## Common Workflows

### Before committing changes
```bash
./scripts/validate-site.sh
```

### Quick wikilink check
```bash
python3 scripts/check-and-fix-wikilinks.py
```

### Check recent logs
```bash
tail -f logs/wikilink_check_*.log
```

## Documentation

For detailed information about link validation, see:
- [`docs/LINK-VALIDATION.md`](../docs/LINK-VALIDATION.md)

## Troubleshooting

**Scripts not running?**
```bash
chmod +x scripts/*.sh scripts/*.py
```

**Python not found?**
```bash
python3 --version  # Should be 3.7+
```

**Build fails?**
Check the build log:
```bash
cat logs/build_*.log
```

