# Quick Reference: Site Maintenance

## Common Commands

### Validate and Build
```bash
./scripts/validate-site.sh
```
Checks links, fixes issues, and builds the site.

### Check Links Only
```bash
python3 scripts/check-and-fix-wikilinks.py
```
Scans for broken wikilinks without building.

### Build Only
```bash
npx quartz build
```
Builds the site without validation.

### Preview Locally
```bash
npx quartz build --serve
```
Builds and serves on `http://localhost:8080/`

## Wikilink Format

### ✓ Correct Format
```markdown
[[Productions/Studio Syro|Studio Syro]]
[[Productions/Studio Syro/Quill|Learn more about Quill →]]
[[Productions/Studio Syro/Animated Experiences/Tales From Soda Island|Tales From Soda Island]]
```

### ✗ Incorrect Format
```markdown
[[Quill]]                          # Missing path prefix
[[Animated Experiences/...]]       # Incomplete path
[[Productions/Studio%20Syro|...]]  # URL-encoded spaces
```

## File Structure

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
│   │   │       └── ... (Ch 2-7)
│   │   └── Interactive Experiences/
│   │       ├── index.md
│   │       ├── PondQuest.md
│   │       └── Dear Metaverse.md
│   └── Wevr/
│       ├── Wevr.md
│       ├── Location-Based Experiences.md
│       └── Location-Based Experiences/
│           └── Terracotta Warriors.md
```

## Logs

Logs are saved in `logs/` with timestamps:

```bash
# View latest wikilink check
cat logs/wikilink_check_*.log

# View latest build log
cat logs/build_*.log

# Follow logs in real-time
tail -f logs/wikilink_check_*.log
```

## Workflow

1. **Make changes** to markdown files
2. **Run validation**: `./scripts/validate-site.sh`
3. **Check logs** for any issues
4. **Commit changes**: `git add . && git commit -m "..."`
5. **Deploy**: `git push`

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Scripts not executable | `chmod +x scripts/*.sh scripts/*.py` |
| Python not found | Install Python 3.7+ |
| Build fails | Check `logs/build_*.log` |
| Broken links not fixed | Check `logs/wikilink_check_*.log` for details |
| npx not found | Install Node.js |

## Documentation

- **Full guide**: [`docs/LINK-VALIDATION.md`](LINK-VALIDATION.md)
- **Scripts info**: [`scripts/README.md`](../scripts/README.md)
- **Building**: [`docs/build.md`](build.md)

