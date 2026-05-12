# Security Review: Explainer Extensions Plan (v0.2)

Reviewer: Security perspective | Date: 2026-05-11
Scope: `03-plan.md`, `01-spec.md`, `flow_explainer.jsx` (existing template), test HTML

---

## Blocking

### B-1: CTA href lacks sanitization -- open redirect / javascript: URI injection

**Task refs:** T4 (compare_explainer.jsx), T5 (decision_tree.jsx), also existing `flow_explainer.jsx`

**Issue:**
Both the existing template and the planned templates render CTA links as raw `<a href={cta.href}>` / `<a href={cta.target}>` without any URL sanitization. If AI-generated content produces `javascript:alert(1)` or `https://evil.com/phishing?ref=yoursite`, the `<a>` tag will faithfully execute it. This is the single point in the templates where a data field flows directly into an HTML attribute that has executable semantics.

The flow_explainer.jsx line 733 shows:
```js
href: props.cta ? props.cta.href : '#',
```

No validation or sanitization is applied before the href reaches the DOM.

**Recommendation:**
Add a URL sanitization utility (inline, per v0.1 copy pattern) that:
1. Rejects `javascript:`, `data:`, `vbscript:` URI schemes
2. Optionally validates that the URL starts with `https://` or `http://` or is a relative path (`/` or `#`)
3. Defaults to `#` on rejection

The utility should be applied in both T4 and T5 wherever `cta.href` or `cta.target` is rendered. The plan verification checklist for T4 and T5 should add an explicit item: "CTA href sanitized: javascript:/data: URIs rejected, defaults to # on invalid input".

---

### B-2: Schema field name inconsistency between definition and example data -- runtime bug risk

**Task refs:** T4 (compare_explainer.jsx), T5 (decision_tree.jsx), spec `01-spec.md`

**Issue:**
The spec schema definitions (lines 255 and 482) name the CTA link field `target`, while the spec example data (lines 386 and 577) and the existing `flow_explainer.jsx` (line 733) use `href`. If a developer implements T4/T5 following the schema definition and references `cta.target`, but AI-generated data (following the example data convention) provides `cta.href`, the CTA button will silently get `href="#"` as a fallback and the actual link will be lost. The reverse inconsistency is equally possible.

This is not purely a security issue, but it directly affects B-1: if two different field names coexist, the sanitization logic cannot be consistently applied, and one path may be overlooked.

**Recommendation:**
Standardize to `href` across all three schemas (compare, decision tree, and update flow schema comment to match). The existing code already uses `href`. Update `01-spec.md` schema definitions to use `href` instead of `target`. Add to T4/T5 verification: "Schema field names consistent with example data and existing flow_explainer.jsx (cta.href, not cta.target)".

---

## Important

### I-1: console.warning is not a standard API -- schema validation silently fails

**Task refs:** T4, T5, also existing `flow_explainer.jsx`

**Issue:**
The existing `flow_explainer.jsx` uses `console.warning()` (lines 170, 174, 178), which is not a standard browser API. `console.warn()` is the correct method. In most browsers, calling `console.warning()` throws a TypeError ("console.warning is not a function"), which means the schema validation function crashes before returning `false`, and the component silently falls through to render with invalid data instead of showing the fallback UI. The plan says both T4 and T5 should "follow v0.1 flow_explainer.jsx engineering pattern," which would propagate this bug to the new templates.

**Recommendation:**
1. Fix the existing `flow_explainer.jsx`: replace all 3 `console.warning` calls with `console.warn`
2. In T4 and T5, use `console.warn` explicitly (not copy from the buggy v0.1)
3. Add to T4/T5 verification: "Schema validation uses console.warn (not console.warning)"

---

### I-2: No task or verification for SRI integrity hashes on CDN scripts

**Task refs:** T0, T1 (spike HTML files), T4, T5 (implicit: each template needs a test HTML wrapper)

**Issue:**
The existing `flow_explainer_test.html` correctly includes SRI integrity hashes for React 18.3.1 and Babel 7.29.0. However, the plan has no task, verification step, or guidance for ensuring the new templates' test/spike HTML files also include correct and verified SRI hashes. Without SRI hashes, a CDN compromise or MITM attack could inject malicious JavaScript that runs with full page privileges.

The Babel standalone script is particularly high-risk: it processes all `<script type="text/babel">` blocks, effectively acting as a build step inside the browser. A compromised Babel CDN could inject arbitrary code into every JSX template rendered on the page.

**Recommendation:**
1. Add an explicit verification item to T0, T1, T4, T5: "CDN script tags include valid SRI integrity hashes (SHA-384) and crossorigin=anonymous"
2. Document the pinned CDN versions and hash computation method (e.g., `curl | openssl dgst -sha384 -binary | openssl base64 -A`) in a comment in the test HTML files or in a reference doc
3. Consider adding a small reference doc `references/cdn-security.md` that lists pinned versions, expected hashes, and instructions for updating them when bumping dependencies

---

### I-3: No Content Security Policy in test HTML files

**Task refs:** T0, T1, T4, T5

**Issue:**
The test HTML files load external CDN scripts and render AI-generated content. A CSP meta tag would add a defense-in-depth layer: even if SRI hashes are bypassed or a data injection succeeds, CSP can restrict script sources and prevent inline script execution from injected content.

The existing test HTML has no CSP. The plan does not mention CSP anywhere.

**Recommendation:**
Add a CSP meta tag to all test HTML files (spike + template test):
```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self' https://unpkg.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'none';">
```
This restricts scripts to self + unpkg CDN (with SRI), allows inline styles (necessary for the React inline style pattern), and blocks network connections. Add to T0/T1/T4/T5 verification: "CSP meta tag present, script-src restricted to self + unpkg CDN".

---

### I-4: SVG text labels rendered from data fields -- verify no injection path

**Task refs:** T4, T5

**Issue:**
In the existing `flow_explainer.jsx`, edge labels (`e.label`) are rendered as React SVG `<text>` children:
```js
React.createElement('text', { ... }, e.label)
```
React auto-escapes text content in `<text>` elements, preventing XSS. However, SVG has known XSS vectors via `<foreignObject>` and `<use>` elements with external references. The plan specifies SVG overlay with cubic bezier paths, labels, and label "bubbles" (white background with padding). If the implementation uses `<foreignObject>` to render HTML inside SVG for label bubbles, this could bypass React's escaping.

**Recommendation:**
1. In T4/T5, specify that all SVG text labels must use `<text>` elements directly (not `<foreignObject>`)
2. If label bubbles need HTML rendering, render them as HTML overlays positioned over the SVG (same pattern as HTML nodes), not inside SVG
3. Add to T4/T5 verification: "SVG overlay contains no <foreignObject> elements; all text labels use <text> with React auto-escaping"

---

## Suggestion

### S-1: Add a security note to the schema comment block

**Task refs:** T4, T5

The schema comment blocks at the top of each template are the primary reference for AI agents generating data. Adding a brief security note would ensure AI agents understand which fields have executable semantics and must be validated.

**Recommendation:**
Add to both schema comment blocks:
```
Security notes:
  - cta.href must be a valid URL (https://, http://, /relative, or #). javascript: and data: URIs are rejected.
  - All text fields (label, detail, body, headline, description, conclusion) are rendered via React.createElement and auto-escaped.
  - Do not include API keys, credentials, or internal URLs in any field.
```

---

### S-2: Add href sanitization to the existing flow_explainer.jsx

**Task refs:** None in plan (out-of-scope fix)

The existing `flow_explainer.jsx` has the same CTA href vulnerability as B-1. While the plan does not include a task to patch v0.1, the security issue exists in production code today.

**Recommendation:**
Consider a separate hotfix task (outside this plan) to add URL sanitization to `flow_explainer.jsx` and fix the `console.warning` bug (I-1). This could be done as a minor VERSION bump (e.g., 0.6.1) before the v0.2 work begins, or bundled into T9 if the team accepts the scope expansion.

---

### S-3: Document the React createElement safety guarantee in reference docs

**Task refs:** T2 (interaction patterns update)

The `explainer-interaction-patterns.md` reference doc is being updated in T2. Adding a brief note that all text content is rendered via `React.createElement` (which auto-escapes) would help future template authors understand the XSS safety boundary.

**Recommendation:**
In T2, add a section "Security boundary: React createElement auto-escaping" that explains:
- All text fields (label, description, detail, etc.) are safe by default because React.createElement escapes text content
- The only exception is `cta.href` which flows into an HTML attribute and must be sanitized
- SVG `<text>` elements also benefit from React auto-escaping
- `dangerouslySetInnerHTML` must never be used in explainer templates

---

### S-4: Verify pointer-events:none + aria-hidden implementation in new templates

**Task refs:** T0, T1, T4, T5

The plan correctly specifies `pointer-events:none` and `aria-hidden:true` for SVG overlays (matching the existing pattern in `flow_explainer.jsx` line 456-458). This is a sound pattern:
- `pointer-events:none` prevents SVG from blocking HTML interaction (correct and safe)
- `aria-hidden:true` prevents screen readers from reading decorative SVG paths (correct accessibility practice)

There are no security concerns with these attributes. This is listed as a suggestion only to ensure the verification checklists explicitly confirm their presence, since the plan already mentions them.

**Recommendation:**
Ensure T4/T5 verification includes: "SVG overlay has pointer-events:none style and aria-hidden=true attribute" (already implied by existing verification items, but worth making explicit).

---

### S-5: Consider sanitizing accentColor hex values

**Task refs:** T4 (compare_explainer.jsx)

The compare schema defines `accentColor: string` as a hex value (e.g., "#61DAFB"). While React's inline style system treats `background: bgColor` as a CSS property (not executable), an attacker could inject CSS-exotic values like `url(evil.png)` or `var(--injected-prop)` if the field is not validated. In practice, React does not execute CSS `url()` in inline styles on `<div>` elements, so this is a low-risk suggestion.

**Recommendation:**
Consider adding a simple hex validation: `/^#[0-9A-Fa-f]{6}$/` for `accentColor` values. If validation fails, fall back to a default color (e.g., `#3B82F6`). This can be done as a 5-line inline utility in T4.

---

## Summary

| ID | Severity | Issue | Affected Tasks | Status |
|----|----------|-------|----------------|--------|
| B-1 | Blocking | CTA href unsanitized -- javascript:/open redirect injection | T4, T5 | Must fix before merge |
| B-2 | Blocking | Schema `target` vs example `href` inconsistency | T4, T5, spec | Must fix before implementation starts |
| I-1 | Important | `console.warning` not standard API -- schema validation fails silently | T4, T5, existing v0.1 | Must fix, low effort |
| I-2 | Important | No SRI integrity hash verification task for CDN scripts | T0, T1, T4, T5 | Should add verification items |
| I-3 | Important | No CSP meta tag in test HTML files | T0, T1, T4, T5 | Should add defense-in-depth |
| I-4 | Important | SVG `<foreignObject>` could bypass React escaping | T4, T5 | Should prohibit in spec |
| S-1 | Suggestion | Add security note to schema comment blocks | T4, T5 | Recommended |
| S-2 | Suggestion | Patch existing flow_explainer.jsx CTA + console.warning bugs | Out of plan scope | Recommended separate hotfix |
| S-3 | Suggestion | Document React createElement safety in reference docs | T2 | Recommended |
| S-4 | Suggestion | Verify pointer-events:none + aria-hidden in new templates | T4, T5 | Already implied, make explicit |
| S-5 | Suggestion | Validate accentColor hex format | T4 | Low priority, nice-to-have |