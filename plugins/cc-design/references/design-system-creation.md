# Design System Creation

> **Load when:** User asks to create a design system, CSS variable system, token structure, or wants to establish visual consistency across multiple artifacts
> **Skip when:** Project already has a design system (DESIGN.md, tokens, CSS variables) unless the user explicitly wants to update it
> **Why it matters:** Creating a design system from scratch requires structure. Without guidance, AI produces inconsistent token names, incomplete categories, and unusable variable systems.
> **Typical failure it prevents:** Token names that don't follow a convention, missing categories (spacing but no shadows), variables that aren't actually used in the design

## Token Structure

## Existing Contract Update Rule

If the project already has `DESIGN.md` or another explicit design-system contract:

1. Read the existing file first
2. Ask the user which update mode they want:
   - **Append** — add a bounded extension without rewriting the original contract
   - **Merge** — integrate the new direction into the existing contract, preserving compatible rules and updating conflicts
   - **Overwrite** — replace the current contract entirely
3. Recommend **Merge** by default
4. Do not silently replace the file

Use cases:
- **Append:** new subsystem, campaign page, temporary addendum, new feature module
- **Merge:** evolving the design system while preserving identity
- **Overwrite:** full rebrand, hard reset, prior contract is obsolete

A minimal design system has 5 token categories. Each uses CSS custom properties.

### Color tokens

```css
:root {
  /* Identity — the brand palette */
  --color-primary:       oklch(0.55 0.18 55);   /* Main accent */
  --color-primary-light: oklch(0.85 0.08 55);   /* Hover, badges */
  --color-primary-dark:  oklch(0.35 0.20 55);   /* Active states */

  /* Neutral — the structural palette */
  --color-bg:    oklch(0.98 0.01 55);   /* Page background */
  --color-surface: oklch(0.95 0.02 55); /* Card background */
  --color-border:  oklch(0.80 0.02 55); /* Lines, dividers */
  --color-text:    oklch(0.15 0.02 55); /* Primary text */
  --color-muted:   oklch(0.60 0.04 55); /* Secondary text */

  /* Semantic — purpose-specific */
  --color-success: oklch(0.55 0.15 150);
  --color-warning: oklch(0.70 0.15 85);
  --color-error:   oklch(0.55 0.20 25);
}
```

### Spacing tokens

See `frontend-design.md` for the full 8px grid system. Short version:

```css
:root {
  --space-1: 4px;   --space-2: 8px;   --space-3: 16px;
  --space-4: 24px;  --space-5: 32px;  --space-6: 48px;
  --space-7: 64px;
}
```

### Typography tokens

```css
:root {
  --font-primary: 'DM Sans', sans-serif;
  --font-secondary: 'Source Serif 4', serif;

  --text-xs:   12px;  --text-sm:  14px;  --text-base: 16px;
  --text-lg:   20px;  --text-xl:  24px;  --text-2xl: 32px;
  --text-3xl:  40px;  --text-4xl: 56px;

  --weight-normal: 400; --weight-medium: 500; --weight-bold: 700;
  --leading-tight: 1.2; --leading-normal: 1.5; --leading-relaxed: 1.8;
}
```

### Shadow tokens

```css
:root {
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  --shadow-lg: 0 8px 30px rgba(0,0,0,0.12);
}
```

### Border radius tokens

```css
:root {
  --radius-sm: 4px;  --radius-md: 8px;  --radius-lg: 12px;
  --radius-xl: 20px; --radius-full: 9999px;
}
```

## Component Library

After defining tokens, build these base components. Each should use only tokens, not hardcoded values.

| Component | Required variants | Key tokens used |
|-----------|-------------------|-----------------|
| Button | primary, secondary, ghost | `--color-primary`, `--radius-md`, `--space-2` |
| Card | default, elevated | `--shadow-md`, `--radius-lg`, `--space-3` |
| Input | default, focused, error | `--border`, `--radius-sm`, `--color-error` |
| Badge | neutral, success, warning, error | `--radius-full`, semantic colors |
| Heading | h1-h4 | `--text-4xl` to `--text-xl`, `--weight-bold` |
| Body text | base, small, large | `--text-base`, `--text-sm`, `--text-lg` |

### Button example (token-only)

```css
.btn-primary {
  background: var(--color-primary);
  color: var(--color-bg);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-family: var(--font-primary);
  font-weight: var(--weight-medium);
  border: none;
  cursor: pointer;
}
.btn-primary:hover { background: var(--color-primary-light); }
.btn-primary:active { background: var(--color-primary-dark); }
```

## Reverse Extraction

When the user has existing HTML but no design system:

1. Read the HTML file
2. Identify repeated values (colors, sizes, fonts)
3. Group into token categories
4. Replace hardcoded values with `var(--token-name)` references
5. Verify the design looks identical after extraction

### Extraction regex patterns

```bash
# Find repeated colors
grep -oP '#[0-9a-fA-F]{3,8}' page.html | sort | uniq -c | sort -rn
# Find repeated font-size values
grep -oP 'font-size:\s*\d+px' page.html | sort | uniq -c | sort -rn
# Find repeated spacing values
grep -oP '(padding|margin|gap):\s*\d+px' page.html | sort | uniq -c | sort -rn
```

## Naming Convention

Use this pattern for all tokens:

```
--{category}-{property}-{variant}
```

Examples: `--color-primary-dark`, `--text-xl`, `--shadow-lg`, `--radius-md`.

Avoid: `--blue`, `--big-text`, `--shadow1` (semantic-free names break when values change).
