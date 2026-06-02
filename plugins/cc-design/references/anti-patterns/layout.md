# Layout Anti-Patterns

**Purpose:** Identify layout mistakes that signal poor design judgment, not provide "correct" layouts.

**Principle:** Layout is about information hierarchy and visual flow. These anti-patterns break hierarchy or create visual chaos.

---

## 1. Everything-is-a-card Disease

**Problem:** Every piece of content wrapped in a rounded rectangle with shadow/border.

**Why it fails:**
- Cards are for grouping related information. When everything is a card, nothing is grouped.
- Creates visual noise — too many containers competing for attention
- Wastes space — padding inside padding inside padding

**Real failure case:** Dashboard with 12 cards on one screen, each containing 1-2 lines of text. The cards added zero organizational value.

**Boundary:** Use cards when you need to visually separate distinct objects (e.g., product listings, user profiles). Don't use cards for every text block.

---

## 2. Center-Aligned Body Text

**Problem:** Paragraphs of text centered on the page.

**Why it fails:**
- Destroys reading rhythm — eye has to search for the start of each line
- Only works for short headlines or poetry
- Signals "I don't know where to put this text"

**Boundary:** Center alignment is for headlines, hero text, or single-line statements. Never for body copy longer than 2 lines.

---

## 3. Symmetry Addiction

**Problem:** Everything perfectly mirrored down the center axis.

**Why it fails:**
- Real content is rarely symmetric — forcing symmetry creates awkward gaps or stretched content
- Symmetry feels formal and static — appropriate for luxury brands, wrong for most products
- Limits compositional options — asymmetry creates visual interest

**Real failure case:** Product page with left-aligned image and right-aligned text, both exactly 50% width. When the text was short, it looked empty. When the text was long, it overflowed.

**Boundary:** Symmetry works for hero sections, modals, or formal presentations. Don't force it on content-heavy layouts.

---

## 4. Grid Rigidity

**Problem:** Every element locked to a strict 12-column grid, no exceptions.

**Why it fails:**
- Content has natural sizes — forcing everything into grid columns creates awkward widths
- Grids are tools, not laws — breaking the grid intentionally creates emphasis
- Real designers break grids all the time for visual interest

**Boundary:** Use grids for structure, break them for emphasis. A full-bleed image or an off-grid callout can be more effective than perfect alignment.

---

## 5. Bento Grid Overuse

**Problem:** Every layout is a bento grid (asymmetric card grid with varying sizes).

**Why it fails:**
- Bento grids are trendy, which means they're already overused
- Only works when content naturally has different importance levels
- Requires careful balancing — bad bento grids look chaotic

**Real failure case:** Landing page with 6 bento cards, all containing similar-length text. The size variation implied hierarchy that didn't exist in the content.

**Boundary:** Use bento when content genuinely has different weights (e.g., one hero feature + four supporting features). Don't use it just because it looks modern.

---

## 6. Floating Elements with No Anchor

**Problem:** Elements positioned with `position: absolute` or `float` with no clear relationship to surrounding content.

**Why it fails:**
- Breaks visual flow — eye doesn't know where to go next
- Responsive nightmare — floating elements overlap on smaller screens
- Signals "I couldn't figure out the layout, so I just positioned it manually"

**Boundary:** Absolute positioning is for overlays, tooltips, or decorative elements. Not for primary content.

---

## 7. Inconsistent Spacing

**Problem:** Random gaps between elements — 12px here, 24px there, 18px somewhere else.

**Why it fails:**
- Destroys visual rhythm
- Makes the design feel unfinished
- Signals lack of system thinking

**Real failure case:** Form with 16px gap between first two fields, 24px before the third field, 12px before the button. No reason for the variation.

**Boundary:** Use a spacing scale (e.g., 4, 8, 16, 24, 32, 48, 64). Deviations should be intentional and rare.

---

## 8. Z-Pattern / F-Pattern Worship

**Problem:** Forcing content into Z or F reading patterns because "that's how users scan."

**Why it fails:**
- These patterns describe how users read, not how you should design
- Real content doesn't fit neat patterns
- Leads to awkward layouts that prioritize pattern over content

**Boundary:** Understand reading patterns, but design for your content. If your content naturally forms a Z, great. If not, don't force it.

---

## 9. Whitespace Phobia

**Problem:** Filling every gap with content, borders, or decorative elements.

**Why it fails:**
- Whitespace is not wasted space — it's breathing room
- Dense layouts are exhausting to read
- Signals insecurity — "if I leave space, they'll think I didn't do enough"

**Real failure case:** Landing page with 8 sections stacked with 16px gaps. No visual breaks, no rhythm, just relentless content.

**Boundary:** Generous whitespace (48px+ between sections) creates rhythm and emphasis. Tight spacing (8-16px) is for related elements within a group.

---

## 10. Sidebar Overload

**Problem:** Left sidebar, right sidebar, top nav, bottom footer — content squeezed into a narrow column in the middle.

**Why it fails:**
- Content is the priority — UI chrome should be minimal
- Multiple sidebars create visual clutter
- Responsive disaster — sidebars collapse into hamburger menus, hiding navigation

**Real failure case:** Dashboard with left nav (200px), right sidebar (300px), content area (500px). On a 1024px screen, content was unreadable.

**Boundary:** One sidebar maximum. If you need more navigation, use tabs, dropdowns, or a command palette.

---

## Quick Checklist

Before finalizing a layout, ask:

- **Is every card necessary?** If not, remove containers.
- **Is body text left-aligned?** If not, fix it.
- **Is symmetry serving the content?** If not, break it.
- **Are spacing values from a scale?** If not, standardize them.
- **Is there breathing room?** If not, add whitespace.
- **Can I remove a sidebar?** If yes, do it.

**Remember:** Layout anti-patterns are about what NOT to do. Within these boundaries, you have infinite creative freedom.
