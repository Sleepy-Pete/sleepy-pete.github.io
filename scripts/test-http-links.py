#!/usr/bin/env python3
"""
HTTP Link Tester for Quartz Sites
Tests all links on the site by crawling pages and checking HTTP responses
"""

import os
import sys
import re
import time
import requests
from pathlib import Path
from urllib.parse import urljoin, urlparse
from collections import defaultdict
from datetime import datetime

BASE_URL = "http://localhost:8080"
TIMEOUT = 5
MAX_RETRIES = 3

class HTTPLinkTester:
    def __init__(self, log_file=None):
        self.log_file = log_file
        self.visited_urls = set()
        self.broken_links = defaultdict(list)
        self.working_links = set()
        self.errors = []
        self.link_sources = defaultdict(list)  # Track which page each link came from
        
    def log(self, message):
        """Log message to file and stdout"""
        timestamp = datetime.now().isoformat()
        log_msg = f"[{timestamp}] {message}"
        print(log_msg)
        if self.log_file:
            with open(self.log_file, 'a') as f:
                f.write(log_msg + '\n')
    
    def test_url(self, url):
        """Test if a URL returns 200 OK"""
        if url in self.visited_urls:
            return url in self.working_links
        
        self.visited_urls.add(url)
        
        for attempt in range(MAX_RETRIES):
            try:
                response = requests.head(url, timeout=TIMEOUT, allow_redirects=True)
                if response.status_code == 200:
                    self.working_links.add(url)
                    return True
                else:
                    self.broken_links[url].append(response.status_code)
                    return False
            except requests.exceptions.Timeout:
                if attempt < MAX_RETRIES - 1:
                    time.sleep(1)
                    continue
                self.errors.append(f"{url}: Timeout")
                return False
            except requests.exceptions.ConnectionError:
                self.errors.append(f"{url}: Connection error")
                return False
            except Exception as e:
                self.errors.append(f"{url}: {str(e)}")
                return False
        
        return False
    
    def extract_links_from_html(self, html, page_url):
        """Extract all links from HTML"""
        links = set()
        
        # Find all href attributes
        href_pattern = r'href=["\']([^"\']+)["\']'
        for match in re.finditer(href_pattern, html):
            href = match.group(1)
            
            # Skip anchors, javascript, and external links
            if href.startswith('#') or href.startswith('javascript:') or href.startswith('http'):
                continue
            
            # Convert relative URLs to absolute
            absolute_url = urljoin(page_url, href)
            
            # Only test URLs on our domain
            if absolute_url.startswith(BASE_URL):
                links.add(absolute_url)
        
        return links
    
    def crawl_page(self, url, depth=0, max_depth=3):
        """Crawl a page and test all links"""
        if depth > max_depth or url in self.visited_urls:
            return
        
        self.visited_urls.add(url)
        self.log(f"Testing: {url}")
        
        try:
            response = requests.get(url, timeout=TIMEOUT)
            
            if response.status_code != 200:
                self.broken_links[url].append(response.status_code)
                self.log(f"  ✗ {response.status_code}")
                return
            
            self.working_links.add(url)
            self.log(f"  ✓ 200 OK")
            
            # Extract and test links from this page
            links = self.extract_links_from_html(response.text, url)
            for link in links:
                self.link_sources[link].append(url)  # Track source
                if link not in self.visited_urls:
                    self.crawl_page(link, depth + 1, max_depth)
        
        except Exception as e:
            self.errors.append(f"{url}: {str(e)}")
            self.log(f"  ✗ Error: {str(e)}")
    
    def run(self):
        """Run the HTTP link tests"""
        self.log("=" * 60)
        self.log("HTTP LINK TEST REPORT")
        self.log("=" * 60)
        self.log(f"Base URL: {BASE_URL}")
        self.log(f"Start time: {datetime.now().isoformat()}")
        self.log("")
        
        # Start crawling from home page
        self.log("Starting crawl from home page...")
        self.crawl_page(BASE_URL)
        
        # Generate report
        self.log("")
        self.log("=" * 60)
        self.log("RESULTS")
        self.log("=" * 60)
        self.log(f"Pages tested: {len(self.working_links)}")
        self.log(f"Broken links: {len(self.broken_links)}")
        self.log(f"Errors: {len(self.errors)}")
        
        if self.broken_links:
            self.log("")
            self.log("BROKEN LINKS:")
            for url, codes in self.broken_links.items():
                sources = self.link_sources.get(url, ["unknown"])
                self.log(f"  {url}: {codes}")
                for source in sources[:2]:  # Show first 2 sources
                    self.log(f"    Found on: {source}")
        
        if self.errors:
            self.log("")
            self.log("ERRORS:")
            for error in self.errors:
                self.log(f"  {error}")
        
        self.log("")
        if not self.broken_links and not self.errors:
            self.log("✓ All links working!")
            return 0
        else:
            self.log("✗ Issues found")
            return 1

if __name__ == "__main__":
    log_file = sys.argv[1] if len(sys.argv) > 1 else None
    
    # Wait a bit for server to be ready
    time.sleep(2)
    
    tester = HTTPLinkTester(log_file)
    exit_code = tester.run()
    sys.exit(exit_code)

