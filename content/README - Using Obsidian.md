# Using Obsidian with Your Quartz Site

This folder is configured as an Obsidian vault for easy editing of your website.

## Getting Started

1. **Open in Obsidian**
   - Open Obsidian
   - Click "Open folder as vault"
   - Select this `content` folder

2. **You're ready to edit!**
   - All `.md` files are pages on your site
   - Changes save automatically
   - Use templates for new pages

## Creating New Pages

### Method 1: Using Templates
1. Press `Cmd+P` (Command Palette)
2. Type "Templates: Insert template"
3. Choose a template:
   - **Project Template** - For portfolio projects
   - **Video Project Template** - For video/media projects
   - **Blog Post Template** - For blog posts

### Method 2: From Scratch
1. Right-click in file explorer → "New note"
2. Add front matter at the top:
   ```yaml
   ---
   title: Page Title
   tags:
     - tag1
     - tag2
   ---
   ```

## Adding Images

### Option 1: Drag and Drop
1. Drag image into your note
2. Obsidian will save it to `attachments/` folder
3. The link will be created automatically

### Option 2: Manual
1. Copy images to `../quartz/static/images/your-project/`
2. Reference in markdown: `![Alt text](/static/images/your-project/image.jpg)`

## Linking Between Pages

Use wiki-style links: `[[Page Name]]`

Examples:
- `[[index]]` - Links to homepage
- `[[projects/Studio Syro]]` - Links to Studio Syro page
- `[[projects/Tales From Soda Island|TFSI]]` - Custom link text

## Publishing Changes

### Quick Method (Terminal)
```bash
cd /Users/Peter/Documents/GitHub/sleepy-pete.github.io
npx quartz build
git add .
git commit -m "Update content"
git push
```

### Using Obsidian Git Plugin (Recommended)
1. Install "Obsidian Git" plugin from Community Plugins
2. After editing, press `Cmd+P` → "Obsidian Git: Commit and push"
3. Your changes will be live in a few minutes!

## Useful Keyboard Shortcuts

- `Cmd+P` - Command Palette
- `Cmd+O` - Quick switcher (find files)
- `Cmd+E` - Toggle edit/preview mode
- `Cmd+B` - Bold text
- `Cmd+I` - Italic text
- `Cmd+K` - Insert link
- `Cmd+Shift+F` - Search across all files

## File Organization

```
content/
├── index.md              # Homepage
├── about.md              # About page
├── projects/             # Project pages
│   ├── Studio Syro.md
│   └── Tales From Soda Island.md
├── templates/            # Page templates
└── attachments/          # Images from Obsidian
```

## Tips

1. **Preview before publishing**: Run `npx quartz build` and check `localhost:8080`
2. **Use tags**: Add relevant tags to help organize content
3. **Link liberally**: Internal links help with navigation
4. **Keep images organized**: Create subfolders for each project
5. **Use templates**: They ensure consistent formatting

## Need Help?

- [Obsidian Documentation](https://help.obsidian.md/)
- [Quartz Documentation](https://quartz.jzhao.xyz/)
- [Markdown Guide](https://www.markdownguide.org/)

