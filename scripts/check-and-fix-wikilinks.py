#!/usr/bin/env python3
"""
Quartz Wikilink Checker and Fixer
Automatically detects and fixes broken wikilinks in markdown files.
Generates a detailed log of all changes made.
"""

import re
import sys
from pathlib import Path
from datetime import datetime
from typing import List, Tuple, Dict

class WikilinkChecker:
    def __init__(self, content_dir: str = "content", log_dir: str = "logs"):
        self.content_dir = Path(content_dir)
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(exist_ok=True)
        self.changes: Dict[str, List[str]] = {}
        self.errors: List[str] = []
        self.timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.log_file = self.log_dir / f"wikilink_check_{self.timestamp}.log"
        
    def log(self, message: str):
        """Write message to log file and console"""
        print(message)
        with open(self.log_file, "a") as f:
            f.write(message + "\n")
    
    def find_broken_wikilinks(self) -> List[Tuple[Path, str, str]]:
        """Find all broken wikilinks in markdown files"""
        broken = []
        
        for md_file in self.content_dir.rglob("*.md"):
            # Skip templates and README files
            if "template" in md_file.name.lower() or "readme" in md_file.name.lower():
                continue
                
            with open(md_file, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            wikilinks = re.findall(r'\[\[([^\]]+)\]\]', content)
            
            for wikilink in wikilinks:
                path = wikilink.split('|')[0].strip()
                
                # Skip anchors
                if path.startswith('#'):
                    continue
                
                # Check if file exists
                target = self.content_dir / path
                if not target.with_suffix('.md').exists() and not target.exists():
                    broken.append((md_file, wikilink, str(target)))
        
        return broken
    
    def fix_wikilinks(self, broken_links: List[Tuple[Path, str, str]]) -> int:
        """Attempt to fix broken wikilinks"""
        fixed_count = 0
        
        for md_file, wikilink, target in broken_links:
            path = wikilink.split('|')[0].strip()
            display = wikilink.split('|')[1].strip() if '|' in wikilink else path
            
            # Try to find the correct path
            correct_path = self._find_correct_path(path)
            
            if correct_path:
                with open(md_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                old_link = f"[[{wikilink}]]"
                new_link = f"[[{correct_path}|{display}]]"
                
                if old_link in content:
                    new_content = content.replace(old_link, new_link)
                    with open(md_file, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    
                    fixed_count += 1
                    if str(md_file) not in self.changes:
                        self.changes[str(md_file)] = []
                    self.changes[str(md_file)].append(f"  {old_link} → {new_link}")
        
        return fixed_count
    
    def _find_correct_path(self, broken_path: str) -> str:
        """Attempt to find the correct path for a broken link"""
        # Remove URL encoding
        clean_path = broken_path.replace('%20', ' ')
        
        # Try direct match
        if (self.content_dir / clean_path).with_suffix('.md').exists():
            return clean_path
        
        # Try with Productions prefix
        if not clean_path.startswith('Productions/'):
            productions_path = f"Productions/{clean_path}"
            if (self.content_dir / productions_path).with_suffix('.md').exists():
                return productions_path
        
        return None
    
    def generate_report(self):
        """Generate final report"""
        self.log("\n" + "="*60)
        self.log("WIKILINK CHECK REPORT")
        self.log("="*60)
        self.log(f"Timestamp: {datetime.now().isoformat()}")
        self.log(f"Content Directory: {self.content_dir}")
        self.log(f"Log File: {self.log_file}")
        
        if self.changes:
            self.log(f"\n✓ Fixed {len(self.changes)} files:")
            for file, changes in self.changes.items():
                self.log(f"\n  {file}")
                for change in changes:
                    self.log(change)
        else:
            self.log("\n✓ No broken wikilinks found!")
        
        if self.errors:
            self.log(f"\n⚠ Errors encountered: {len(self.errors)}")
            for error in self.errors:
                self.log(f"  - {error}")
        
        self.log("\n" + "="*60)
    
    def run(self):
        """Run the checker and fixer"""
        self.log(f"Starting wikilink check at {datetime.now().isoformat()}")
        self.log(f"Scanning {self.content_dir} for broken wikilinks...\n")
        
        broken = self.find_broken_wikilinks()
        
        if broken:
            self.log(f"Found {len(broken)} broken wikilinks. Attempting fixes...\n")
            fixed = self.fix_wikilinks(broken)
            self.log(f"\nFixed {fixed} wikilinks.\n")
        else:
            self.log("No broken wikilinks found.\n")
        
        self.generate_report()
        return len(self.changes) == 0  # Return True if no issues

if __name__ == "__main__":
    checker = WikilinkChecker()
    success = checker.run()
    sys.exit(0 if success else 1)

