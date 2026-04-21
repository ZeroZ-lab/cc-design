# Typography Anti-Patterns

**Purpose:** Identify typography mistakes that signal poor design judgment, not provide "correct" type systems.

**Principle:** Typography is about readability, hierarchy, and rhythm. These anti-patterns break readability or create visual chaos.

---

## 1. Too Many Font Weights

**Problem:** Using 5+ weights from the same font family (Thin, Light, Regular, Medium, Semibold, Bold, Black).

**Why it fails:**
- Subtle weight differences are invisible to users
- Creates false hierarchy — users can't tell Medium from Semibold
- Signals overthinking without purpose

**Real failure case:** Landing page using 7 weights of Inter. Headlines were Black (900), subheads were Bold (700), body was Medium (500), captions were Light (300). Users couldn't distinguish hierarchy.

**Boundary:** 2-3 weights maximum. Regular for body, Bold for emphasis, optionally Medium for UI elements. More weights = more confusion.

---

## 2. Tiny Body Text

**Problem:** Body text smaller than 14px on web, or 16px on mobile.

**Why it fails:**
- Unreadable for users over 40
- Mobile browsers auto-zoom text under 16px, breaking layout
- Signals prioritizing "clean look" over usability

**Boundary:** 16px minimum for web body text, 18px for elderly-friendly. Mobile body text must be 16px to avoid auto-zoom.

---

## 3. All-Caps Body Text

**Problem:** Paragraphs or long text blocks set in ALL CAPS.

**Why it fails:**
- Destroys reading rhythm — humans recognize word shapes, not individual letters
- Feels like shouting
- Slower to read (proven in readability studies)

**Real failure case:** Product description (200 words) set in all-caps. Users skipped reading it entirely.

**Boundary:** All-caps is for short labels (buttons, badges, section headers). Never for body text longer than 5 words.

---

## 4. Justified Text on Web

**Problem:** Text-align: justify for body copy on web.

**Why it fails:**
- Creates uneven word spacing (rivers of whitespace)
- CSS doesn't hyphenate well — leads to awkward gaps
- Only works in print with professional typesetting

**Boundary:** Left-align body text on web. Justified text is for print only, and even then requires careful hyphenation.

---

## 5. Line Length Extremes

**Problem:** Body text with line length under 40 characters or over 90 characters.

**Why it fails:**
- Too short: choppy reading, eye jumps too often
- Too long: eye loses track of next line
- Optimal range is 60-75 characters per line

**Real failure case:** Blog with 120-character lines. Readers lost their place mid-paragraph and gave up.

**Boundary:** 45-75 characters per line for body text. Use `max-width: 65ch` on text containers.

---

## 6. Insufficient Line Height

**Problem:** Line-height under 1.4 for body text.

**Why it fails:**
- Lines feel cramped, hard to track
- Descenders (g, y, p) collide with ascenders (h, k, l) on next line
- Signals inexperience — default browser line-height is 1.2, which is too tight

**Boundary:** 1.5-1.7 for body text. 1.2-1.3 for headlines. CJK text needs 1.7-1.8.

---

## 7. Mixing Too Many Fonts

**Problem:** 3+ font families in one design (e.g., serif headlines, sans body, mono code, script accents).

**Why it fails:**
- Visual chaos — no coherent voice
- Signals lack of restraint
- Each font carries cultural/emotional weight — mixing them creates dissonance

**Real failure case:** Landing page with 4 fonts: Playfair Display (headlines), Inter (body), Fira Code (code blocks), Pacifico (tagline). Looked like a ransom note.

**Boundary:** 1-2 font families maximum. Serif + sans is a classic pairing. Mono is acceptable for code. Script/display fonts are rarely necessary.

---

## 8. Faux Bold and Faux Italic

**Problem:** Using `font-weight: bold` or `font-style: italic` when the font file doesn't include those weights/styles, causing the browser to synthesize them.

**Why it fails:**
- Synthesized bold is just stretched — looks clunky
- Synthesized italic is just slanted — not true italic letterforms
- Signals technical sloppiness

**Boundary:** Always load the actual font files for weights and styles you use. Check browser DevTools to verify fonts are loading correctly.

---

## 9. Centered Multi-Line Text

**Problem:** Paragraphs or lists centered on the page.

**Why it fails:**
- Eye has to search for the start of each line
- Destroys reading rhythm
- Only works for short headlines or poetry

**Boundary:** Center-align headlines, hero text, or single-line statements. Never for body copy longer than 2 lines.

---

## 10. Orphans and Widows Ignored

**Problem:** Single words on the last line of a paragraph (widows) or single lines at the top of a column (orphans).

**Why it fails:**
- Looks unfinished
- Wastes space
- Signals lack of typographic polish

**Boundary:** Use `text-wrap: balance` for headlines, `text-wrap: pretty` for body text (modern CSS). Manually adjust if needed.

---

## 11. Inconsistent Hierarchy

**Problem:** H1 is 48px, H2 is 32px, H3 is 36px, H4 is 28px — no logical scale.

**Why it fails:**
- Confuses users about content structure
- Signals lack of system thinking

**Boundary:** Use a type scale (e.g., 1.25 ratio: 16, 20, 25, 31, 39, 49). Stick to it. Deviations should be rare and intentional.

---

## 12. Overusing Display Fonts

**Problem:** Using decorative/display fonts for body text or UI labels.

**Why it fails:**
- Display fonts are designed for large sizes — unreadable at small sizes
- Destroys usability
- Signals prioritizing style over function

**Real failure case:** App using a decorative script font for button labels. Users couldn't read "Submit" vs "Cancel".

**Boundary:** Display fonts are for headlines only. Body text and UI need readable sans-serif or serif fonts.

---

## Quick Checklist

Before finalizing typography, ask:

- **Is body text at least 16px?** If not, increase it.
- **Are lines 45-75 characters wide?** If not, adjust max-width.
- **Is line-height at least 1.5?** If not, increase it.
- **Are you using more than 2 font families?** If yes, consolidate.
- **Is any body text centered or justified?** If yes, left-align it.
- **Is hierarchy consistent?** Check that H1 > H2 > H3 in size.

**Remember:** Typography anti-patterns are about what NOT to do. Within these boundaries, you have infinite creative freedom.
