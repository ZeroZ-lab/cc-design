# Asset Acquisition: Real Images First

**Default: proactively fetch real images to fill content, not placeholders.** Don't draw SVGs, don't use beige cards, don't wait for user requests.

## Common Channels

| Scenario | Primary Channel |
|----------|----------------|
| Art / Museum / Historical content | Wikimedia Commons (public domain), Met Museum Open Access, Art Institute of Chicago API |
| General life / Photography | Unsplash, Pexels (royalty-free) |
| User's local materials | `~/Downloads`, project `_archive/` or user-configured asset library |

## Wikimedia Commons API Usage

**Pitfall avoidance:** Local curl with proxy TLS will fail, Python urllib works directly.

```python
import urllib.request
import json

# Compliant User-Agent is mandatory, otherwise 429
UA = 'ProjectName/0.1 (https://github.com/you; you@example.com)'

# Use MediaWiki API to query real URL
api = 'https://commons.wikimedia.org/w/api.php'

# Example: Get image info
params = {
    'action': 'query',
    'titles': 'File:Example.jpg',
    'prop': 'imageinfo',
    'iiprop': 'url|size',
    'format': 'json'
}

url = api + '?' + urllib.parse.urlencode(params)
req = urllib.request.Request(url, headers={'User-Agent': UA})
with urllib.request.urlopen(req) as response:
    data = json.loads(response.read())
    # Extract image URL from data
```

**Batch fetching from categories:**
```python
# action=query&list=categorymembers for series
# prop=imageinfo&iiurlwidth=N for specific width thumbnail
```

## Unsplash / Pexels

**Direct download:**
- Unsplash: `https://unsplash.com/photos/[photo-id]/download?force=true`
- Pexels: Use their API or direct image URLs from search results

**Attribution:** Not required for most licenses, but good practice to note source in comments.

## Real Image Honesty Test (Critical)

Before fetching an image, ask yourself: **"If I remove this image, is information lost?"**

| Scenario | Judgment | Action |
|----------|----------|--------|
| Article/Essay list cover, Profile page landscape header, Settings page decorative banner | Decorative, no intrinsic connection to content | **Don't add**. Adding it is AI slop, equivalent to purple gradients |
| Museum/person content portrait, product detail physical item, map card location | Content itself, intrinsic connection | **Must add** |
| Graph/visualization background subtle texture | Atmosphere, serves content without stealing focus | Add, but opacity ≤ 0.08 |

**Anti-patterns:**
- Pairing text essays with Unsplash "inspiration images"
- Pairing note apps with stock photo models
- Both are AI slop. Permission to fetch real images ≠ permission to abuse real images.

## Fallback Strategy

**Only** when all channels fail / copyright unclear / user explicitly requests, fall back to honest placeholders (still don't draw bad SVGs).

**Placeholder hierarchy:**
1. Clean gray box with text label: `<div style="background: #f5f5f5; padding: 48px; text-align: center; color: #999;">Product image pending</div>`
2. Semantic icon (if truly necessary): Use system emoji or simple geometric shape
3. ❌ Never: Generic SVG illustrations of people/scenes/objects

## Local Asset Discovery

Before fetching from the internet, check if the user already has assets:

```bash
# Check common locations
ls ~/Downloads/*.{jpg,png,svg} 2>/dev/null | head -20
ls ./_archive/*.{jpg,png,svg} 2>/dev/null | head -20
ls ./assets/*.{jpg,png,svg} 2>/dev/null | head -20

# If user mentioned a brand, check for existing brand folders
ls ./assets/*-brand/ 2>/dev/null
```

If found, ask: "I see you have [X] in [location]. Should I use this?"

## Integration with Brand Asset Protocol

When working on brand projects, asset acquisition is **Step 2** of the Brand Asset Protocol (see `design-context.md`). The acquisition flow is:

1. Identify required assets (Step 1)
2. **Acquire assets** (this document)
3. Verify assets (Step 3)
4. Extract colors (Step 4)
5. Solidify as brand-spec.md (Step 5)

## Quick Reference

**Good:**
- Proactively fetch real images when they add information
- Use Wikimedia Commons for historical/art content
- Use Unsplash/Pexels for generic photography
- Check user's local assets first
- Use honest placeholders when all else fails

**Bad:**
- Drawing SVG illustrations to "fill space"
- Using stock photos as decoration
- Waiting for user to ask before fetching
- Fabricating CSS approximations of real products
- Adding images that don't serve the content
