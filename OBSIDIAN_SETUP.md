# Obsidian Setup Complete! 🎉

Your Quartz site is now fully configured for Obsidian editing.

## Quick Start

### 1. Open in Obsidian

1. Launch Obsidian
2. Click **"Open folder as vault"**
3. Navigate to and select:
   ```
   /Users/Peter/Documents/GitHub/sleepy-pete.github.io/content
   ```
4. Click **"Open"**

### 2. Start Editing!

You now have:

✅ **Pre-configured settings** for optimal Quartz compatibility
✅ **3 ready-to-use templates**:
   - Project Template
   - Video Project Template  
   - Blog Post Template
✅ **Automatic link handling** with wiki-style `[[links]]`
✅ **Image management** - drag & drop images directly into notes

## Creating a New Project Page

### Using Templates (Recommended)

1. In Obsidian, press `Cmd+P` (Command Palette)
2. Type "Templates: Insert template"
3. Select "Project Template"
4. Fill in the placeholders
5. Save (auto-saves)

### Example Workflow

```
1. Create new note: "My New Project.md"
2. Insert Project Template
3. Replace {{title}} with "My New Project"
4. Add your content
5. Add images to /quartz/static/images/my-new-project/
6. Reference images: ![Alt](/static/images/my-new-project/image.jpg)
7. Save
```

## Publishing Your Changes

### Option A: Terminal (Quick)

```bash
cd /Users/Peter/Documents/GitHub/sleepy-pete.github.io
npx quartz build
git add .
git commit -m "Add new project page"
git push
```

### Option B: Obsidian Git Plugin (Easiest)

1. In Obsidian, go to Settings → Community Plugins
2. Turn off "Restricted Mode"
3. Click "Browse" and search for "Obsidian Git"
4. Install and enable it
5. After editing, press `Cmd+P` → "Obsidian Git: Commit and push"
6. Done! Your site updates automatically

## What's Configured

### Settings Applied

- ✅ Live preview mode enabled
- ✅ Auto-update links when files move
- ✅ Attachments folder set to `attachments/`
- ✅ Wiki-style links enabled
- ✅ Templates folder configured
- ✅ Useful keyboard shortcuts

### Files Created

```
content/
├── .obsidian/
│   ├── app.json              # App settings
│   ├── appearance.json       # Theme settings
│   ├── core-plugins.json     # Enabled plugins
│   ├── hotkeys.json          # Keyboard shortcuts
│   └── templates.json        # Template settings
├── templates/
│   ├── Project Template.md
│   ├── Video Project Template.md
│   └── Blog Post Template.md
└── README - Using Obsidian.md  # Full guide
```

## Useful Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+P` | Command Palette |
| `Cmd+O` | Quick file switcher |
| `Cmd+E` | Toggle edit/preview |
| `Cmd+B` | Bold text |
| `Cmd+I` | Italic text |
| `Cmd+K` | Insert link |
| `Cmd+Shift+F` | Search all files |

## Tips for Success

1. **Preview locally first**: Run `npx quartz build` and check `localhost:8080` before pushing
2. **Use templates**: They ensure consistent formatting across pages
3. **Organize images**: Create a subfolder for each project in `/quartz/static/images/`
4. **Link between pages**: Use `[[Page Name]]` to create connections
5. **Tag your content**: Add relevant tags in the front matter

## Next Steps

1. Open the `content` folder in Obsidian
2. Read `README - Using Obsidian.md` for detailed instructions
3. Try creating a test page using a template
4. Install the Obsidian Git plugin for easy publishing

## Need Help?

- Check `content/README - Using Obsidian.md` for detailed instructions
- [Obsidian Help](https://help.obsidian.md/)
- [Quartz Documentation](https://quartz.jzhao.xyz/)

---

**Your site is ready to edit with Obsidian!** 🚀

