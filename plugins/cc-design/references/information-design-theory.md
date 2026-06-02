# Information Design Theory: Cognitive Load & Information Architecture

> **Load when:** Information architecture design, content organization, complex data display, information overload problems
> **Skip when:** Simple visual adjustments, clear information structure already exists, pure visual optimization tasks
> **Why it matters:** Provides cognitive science foundation for information organization, solves information overload and cognitive load issues
> **Typical failure it prevents:** Information dumping, users can't find key points, cognitive overload, chaotic reading paths

Information design theory is the theoretical foundation for cc-design Layer 2 (Information Layer). It explains "why organize information this way", based on cognitive psychology, reading research, and information architecture theory.

---

## Why Information Design Theory Matters

### Common Problems

**Information Overload:**
- Display all information → users can't find the key point
- 20 features laid out flat → no priority
- Dense text → unreadable

**Cognitive Load Too High:**
- Display 10+ information blocks simultaneously → brain can't process
- No grouping → can't build mental model
- No hierarchy → don't know where to start

**Chaotic Reading Path:**
- Visual focus unclear → eyes don't know where to look
- Information jumps → reading not coherent
- Lack of guidance → users get lost

### Value of Information Design Theory

1. **Cognitive science foundation**: Based on how the brain processes information
2. **Predictability**: Users can quickly find needed information
3. **Scalability**: System doesn't collapse when information increases
4. **Measurability**: Clear evaluation criteria

---

## Core Theory 1: Cognitive Load Theory

### Theory Source

**John Sweller (1988)** - Cognitive Load Theory

**Core Idea:**
- Working memory capacity is limited (7±2 information chunks)
- Cognitive load has 3 types: intrinsic load, extraneous load, germane load
- Design goal: reduce extraneous load, optimize germane load

### Three Types of Cognitive Load

#### 1. Intrinsic Load

**Definition:** Complexity of the task itself, cannot be changed.

**Examples:**
- Learning calculus > learning addition (higher intrinsic complexity)
- Understanding quantum mechanics > understanding Newtonian mechanics

**Design Insight:** Cannot reduce intrinsic load, but can reduce instantaneous load through step-by-step presentation.

---

#### 2. Extraneous Load

**Definition:** Extra load added by poor design, can be eliminated.

**Examples:**
- Scattered information → users need to search
- Inconsistent terminology → users need to translate
- Visual clutter → users need to filter

**Design Insight:** This is the main battlefield of design, eliminate all unnecessary cognitive consumption.

**How to Reduce Extraneous Load:**
1. **Clear visual hierarchy** → users don't need to guess importance
2. **Consistent patterns** → users don't need to relearn
3. **Grouping and labels** → users don't need to categorize themselves
4. **Progressive disclosure** → users don't need to process all information at once

---

#### 3. Germane Load

**Definition:** Beneficial load that helps users build mental models.

**Examples:**
- Provide examples → help understand abstract concepts
- Show relationships → help build connections
- Use metaphors → help map known knowledge

**Design Insight:** Moderately increase germane load to help users learn and remember.

---

### Application to Design

**Principle:** Total cognitive load = Intrinsic load + Extraneous load + Germane load

**Goal:** 
- Intrinsic load: Cannot change, but can be stepped
- Extraneous load: Reduce to minimum
- Germane load: Moderately increase

**Practice:**
```
❌ High extraneous load:
- 20 features laid flat
- No grouping
- No priority
- Inconsistent terminology

✅ Low extraneous load:
- 3-5 main features
- Clear grouping (by task)
- Clear priority (visual hierarchy)
- Consistent terminology
```

---

## Core Theory 2: Miller's Law (The Magical Number 7±2)

### Theory Source

**George Miller (1956)** - "The Magical Number Seven, Plus or Minus Two"

**Core Idea:**
- Human working memory can only process 7±2 information chunks simultaneously
- Beyond this number, the brain starts losing information or getting confused
- Through "chunking" capacity can be expanded

### Working Memory Limitations

**Experimental Evidence:**
- Remember numbers: 7±2
- Remember words: 7±2
- Track objects simultaneously: 7±2

**Why 7±2:**
- Not a magic number, it's a physiological limit
- Working memory neural capacity is limited
- Exceeding capacity → information loss or errors

### Chunking Strategy

**Definition:** Combine multiple small pieces of information into one large information chunk.

**Example:**

**Unchunked:**
```
1 9 4 5 0 5 1 2 → 8 independent digits (near limit)
```

**Chunked:**
```
1945-05-12 → 1 date (year-month-day)
```

**Design Application:**
```
❌ Unchunked (10 independent items):
- Home
- Products
- Pricing
- Blog
- About
- Contact
- Login
- Register
- Help
- FAQ

✅ Chunked (3 groups):
- Navigation (Home, Products, Pricing, Blog)
- Company (About, Contact)
- Account (Login, Register, Help)
```

### Application to Design

**Rule 1: No more than 7 items at the same level**
```
✅ Navigation bar: 5 main menu items
❌ Navigation bar: 12 main menu items
```

**Rule 2: Use grouping to reduce cognitive load**
```
✅ Dashboard:
- Overview (3 metrics)
- Activity (recent 5 items)
- Quick actions (4 buttons)

❌ Dashboard:
- 15 metrics laid flat
```

**Rule 3: Progressive disclosure**
```
✅ Settings page:
- 6 main categories
- Click to expand detailed options

❌ Settings page:
- 50 options laid flat
```

---

## Core Theory 3: Chunking Theory

### Theory Source

**Herbert Simon (1974)** - Extended Miller's work

**Core Idea:**
- Chunking is the fundamental method of organizing information
- Good chunking = meaningful combination
- Chunking can be recursive (chunks within chunks)

### Principles of Chunking

#### 1. Relevance

**Principle:** Information within the same chunk should be related.

**Example:**
```
✅ User information chunk:
- Name
- Email
- Phone

❌ Chaotic chunk:
- Name
- Product price
- Email
```

---

#### 2. Completeness

**Principle:** A chunk should be a complete task or concept.

**Example:**
```
✅ Payment information chunk:
- Card number
- Expiration date
- CVV
- Billing address

❌ Incomplete chunk:
- Card number
- Expiration date
(CVV is somewhere else)
```

---

#### 3. Independence

**Principle:** Chunks should be relatively independent of each other.

**Example:**
```
✅ Independent chunks:
- Personal info (name, email)
- Shipping info (address, phone)
- Payment info (card number, CVV)

❌ Coupled chunks:
- Chunk A: name, address
- Chunk B: email, card number
(Logic is confused)
```

---

### Application to Design

**Card Design:**
```html
<!-- ✅ Good chunking -->
<div class="card">
  <h3>Project A</h3>
  <p>Description</p>
  <div class="meta">
    <span>Status</span>
    <span>Date</span>
  </div>
  <button>View Details</button>
</div>

<!-- ❌ Poor chunking -->
<div>
  <h3>Project A</h3>
  <p>Description</p>
</div>
<div>
  <span>Status</span>
  <button>View Details</button>
</div>
(Information scattered, high cognitive load)
```

---

## Core Theory 4: Reading Path Theory

### Theory Source

**Eye-tracking Research (Nielsen Norman Group, 2006-2020)**

**Core Idea:**
- Users don't read word by word, they scan
- Eyes follow predictable patterns
- Design should guide the gaze

### F-Pattern

**Discovery:** User reading pattern on text-heavy pages.

**Path:**
1. Horizontal scan at top (first horizontal)
2. Move down
3. Horizontal scan in middle (second horizontal, shorter)
4. Scan down left side (vertical line)

**Example:**
```
████████████████  ← First horizontal (title)
█
█
████████          ← Second horizontal (subtitle)
█
█                 ← Vertical (scan left side)
█
```

**Design Insight:**
- Place important information on F-pattern path
- Titles and subtitles are key
- Left-aligned text is easier to scan

---

### Z-Pattern

**Discovery:** User reading pattern on visual pages.

**Path:**
1. Top left corner (starting point)
2. Horizontal scan to top right corner
3. Diagonal to bottom left corner
4. Horizontal scan to bottom right corner

**Example:**
```
█ ————————————→ █  ← First horizontal
  ↘
    ↘
      ↘
        █ ——————→ █  ← Second horizontal
```

**Design Insight:**
- Logo in top left corner
- CTA in top right or bottom right corner
- Visual focus distributed along Z-pattern

---

### Visual Hierarchy Guidance

**Principle:** Use visual hierarchy to guide reading order.

**Tools:**
1. **Size contrast** → larger seen first
2. **Color contrast** → high contrast seen first
3. **Whitespace** → isolated elements seen first
4. **Position** → top and left seen first

**Example:**
```
✅ Clear reading path:
1. Large title (48px, bold)
2. Subtitle (20px, normal)
3. Body text (16px, normal)
4. CTA button (high contrast color)

❌ Chaotic reading path:
- All text same size
- No contrast
- Users don't know where to start
```

---

## Core Theory 5: Gestalt Psychology

### Theory Source

**Max Wertheimer, Kurt Koffka, Wolfgang Köhler (1912-1920s)**

**Core Idea:**
- The brain tends to organize visual elements into wholes
- "The whole is greater than the sum of its parts"
- 6 basic principles

### 1. Proximity

**Principle:** Elements close together are perceived as a group.

**Example:**
```
█ █ █    █ █ █
█ █ █    █ █ █

Users see: two groups, not 12 independent elements
```

**Design Application:**
```css
/* ✅ Use proximity for grouping */
.form-group {
  margin-bottom: 24px; /* Large distance between groups */
}

.form-group label,
.form-group input {
  margin-bottom: 4px; /* Small distance within group */
}
```

---

### 2. Similarity

**Principle:** Similar elements are perceived as a group.

**Example:**
```
● ● ●  ■ ■ ■
● ● ●  ■ ■ ■

Users see: circle group + square group
```

**Design Application:**
```
✅ Use similarity:
- All primary buttons: blue, rounded, bold
- All secondary buttons: gray, rounded, normal weight
```

---

### 3. Continuity

**Principle:** Eyes tend to move along continuous paths.

**Example:**
```
● — — — ● — — — ●

Users see: one line, not 3 independent points
```

**Design Application:**
- Use lines to guide gaze
- Align elements to create invisible lines
- Avoid interrupting visual flow

---

### 4. Closure

**Principle:** The brain automatically completes incomplete shapes.

**Example:**
```
  ●   ●
●       ●
  ●   ●

Users see: circle, even though incomplete
```

**Design Application:**
- Logos can use negative space
- Don't need complete borders
- Users will mentally complete missing parts

---

### 5. Figure-Ground

**Principle:** The brain distinguishes foreground (figure) and background (ground).

**Example:**
- Black text on white background → text is figure, white is ground
- White text on black background → text is figure, black is ground

**Design Application:**
```
✅ Clear figure-ground relationship:
- Card (white) on background (gray)
- Button (blue) on page (white)

❌ Ambiguous figure-ground relationship:
- Gray card on gray background
- Users can't distinguish foreground and background
```

---

### 6. Common Fate

**Principle:** Elements moving together are perceived as a group.

**Example:**
- Elements scrolling together → same group
- Elements animating together → same group

**Design Application:**
```javascript
// ✅ Use common fate
// All elements in card change together on hover
.card:hover .title,
.card:hover .description,
.card:hover .button {
  transform: translateY(-2px);
}
```

---

## Application to cc-design

### Information Filtering

**Question:** What information must be displayed?

**Method:**
1. **User task analysis** → What information is needed to complete the task?
2. **Priority ranking** → P0 (must), P1 (important), P2 (secondary)
3. **Progressive disclosure** → P0 displayed by default, P1/P2 on demand

**Example:**
```
✅ Product card (filtered):
- P0: Product name, price, image
- P1: Rating, stock (show on hover)
- P2: Detailed specs (click to view)

❌ Product card (unfiltered):
- All 20 fields displayed
- Information overload
```

---

### Information Grouping

**Question:** How to organize information?

**Method:**
1. **Group by task** → Steps to complete user task
2. **Group by type** → Similar information together
3. **Group by frequency** → Frequently used in front

**Example:**
```
✅ Settings page (grouped by task):
- Account settings (personal info, password)
- Notification settings (email, push)
- Privacy settings (data, permissions)

❌ Settings page (ungrouped):
- 50 options sorted alphabetically
```

---

### Information Ordering

**Question:** What is the order of information?

**Method:**
1. **Importance ordering** → Most important first
2. **Time ordering** → Most recent first
3. **Task flow ordering** → By step sequence

**Example:**
```
✅ Dashboard (importance ordering):
1. Key metrics (large cards)
2. Trend charts (medium cards)
3. Detailed data (small cards)

❌ Dashboard (random ordering):
- Information chaotic
- Users can't find key points
```

---

### Information Hierarchy

**Question:** How to establish visual hierarchy?

**Method:**
1. **Size contrast** → Title > body > caption
2. **Weight contrast** → Bold > Semibold > Normal
3. **Color contrast** → High contrast > medium contrast > low contrast
4. **Whitespace contrast** → Isolated > tight

**Example:**
```css
/* ✅ Clear hierarchy */
h1 { font-size: 48px; font-weight: 700; }
h2 { font-size: 32px; font-weight: 600; }
p  { font-size: 16px; font-weight: 400; }

/* ❌ No hierarchy */
h1, h2, p { font-size: 16px; font-weight: 400; }
```

---

## Verification Checklist

After design is complete, use this checklist to verify information design:

### Cognitive Load Check
- [ ] No more than 7 items at the same level
- [ ] Information has clear grouping
- [ ] No unnecessary visual noise
- [ ] Consistent terminology

### Chunking Check
- [ ] Information within each chunk is related
- [ ] Each chunk is a complete task/concept
- [ ] Chunks are relatively independent
- [ ] Chunk size is reasonable (not too large, not too small)

### Reading Path Check
- [ ] Clear visual starting point
- [ ] Reading order is clear
- [ ] Important information on visual path
- [ ] No visual dead zones

### Gestalt Check
- [ ] Use proximity for grouping
- [ ] Use similarity to establish consistency
- [ ] Visual flow is continuous
- [ ] Figure-ground relationship is clear

---

## Relationship to Other Documents

- **design-thinking-framework.md**: Information design is Layer 2
- **design-excellence.md**: Theoretical foundation for Hierarchy section
- **content-guidelines.md**: Cognitive foundation for content rules
- **anti-patterns/layout.md**: Information architecture issues in layout anti-patterns
- **typography-design-system.md**: Font hierarchy serves information hierarchy

---

## References

### Core Theory
1. **Sweller, J.** (1988). "Cognitive load during problem solving: Effects on learning"
2. **Miller, G. A.** (1956). "The Magical Number Seven, Plus or Minus Two: Some Limits on Our Capacity for Processing Information"
3. **Simon, H. A.** (1974). "How Big Is a Chunk?"
4. **Wertheimer, M.** (1923). "Laws of Organization in Perceptual Forms"

### Reading Research
5. **Nielsen, J.** (2006). "F-Shaped Pattern For Reading Web Content"
6. **Pernice, K.** (2017). "F-Shaped Pattern of Reading on the Web: Misunderstood, But Still Relevant"
7. **Rayner, K.** (1998). "Eye movements in reading and information processing: 20 years of research"

### Information Architecture
8. **Rosenfeld, L., Morville, P., & Arango, J.** (2015). "Information Architecture: For the Web and Beyond" (4th ed.)
9. **Krug, S.** (2014). "Don't Make Me Think, Revisited" (3rd ed.)
10. **Lidwell, W., Holden, K., & Butler, J.** (2010). "Universal Principles of Design" (2nd ed.)

---

## Remember

1. **Cognitive Load Theory**: Reduce extraneous load, optimize germane load
2. **Miller's Law**: No more than 7±2 items at the same level
3. **Chunking Theory**: Relevance, completeness, independence
4. **Reading Path**: F-Pattern (text), Z-Pattern (visual)
5. **Gestalt Principles**: Proximity, similarity, continuity, closure, figure-ground, common fate

**Information design is not about dumping information, it's about organizing cognition.**
