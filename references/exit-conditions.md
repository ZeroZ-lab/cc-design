# Exit Conditions — 按任务类型的完成标准

> **Load when:** Approaching the Verify step (workflow Step 7) in any design task.
> **Why it matters:** Generic verification ("looks good") is unreliable. Each task type has specific, checkable completion criteria.

---

For each task type, a deliverable is complete only when **ALL** of these conditions are met.

## ALL task types

- [ ] No console errors (`browser_console_messages` checked)
- [ ] Maker self-check completed (you have rendered the artifact and inspected it)
- [ ] Every touched section inspected individually — not just the hero or first viewport
- [ ] Screenshot captured after final edit

## Landing Page

- [ ] Responsive at desktop + one narrow/mobile viewport
- [ ] Primary CTA is visually prominent
- [ ] Visual hierarchy: value proposition > evidence > action
- [ ] Body font >= 16px

## Slide Deck

- [ ] Every slide has a `[data-screen-label]` attribute (1-indexed)
- [ ] Font size: body >= 24px, headings >= 36px
- [ ] Each slide has exactly one primary focal point
- [ ] `templates/deck_stage.js` used for letterboxed scaling

## Animation / Motion

- [ ] `__ready` signal fires when the animation is ready to play
- [ ] Each phase has a minimum dwell time (>= 3s for text, >= 1s for transitions)
- [ ] Entries use ease-out; exits use ease-in
- [ ] No stacked simultaneous animations without purpose

## Interactive Prototype

- [ ] All navigational paths tested and working
- [ ] No dead-end states — every interaction leads somewhere
- [ ] State transitions are smooth (no jarring visual jumps)

## Brand Style Clone

- [ ] Brand colours extracted from real brand assets (not guessed from memory)
- [ ] Typography matches brand — exact family and weight, not "close enough"
- [ ] Visual tone matches brand personality as described in the reference

## Design Review / Critique

- [ ] Every dimension scored with specific evidence (code/screenshot reference)
- [ ] Each finding references a concrete element (section, colour value, spacing value)
- [ ] Findings graded by severity: Critical / Important / Suggestion / FYI

## Export (PDF, PPTX, Video, etc.)

- [ ] File exported successfully to the target format
- [ ] Exported file was opened and verified (not just assumed correct)
- [ ] Tool dependencies confirmed available (package.json scripts, ffmpeg, playwright, etc.)

## Variation / Direction Exploration

- [ ] Each direction is distinct from the others (not minor colour/typography swaps)
- [ ] Each direction has a rationale linkable to the design brief or brand reference
- [ ] Tweaks panel integrates variants cleanly for side-by-side comparison

## Interactive Explainer -- Flow

- [ ] All steps navigable (keyboard ← → + click prev/next)
- [ ] Hover focus shows detail and highlights connected edges (desktop)
- [ ] Tap-to-inspect works on mobile
- [ ] Entry animation respects prefers-reduced-motion (skip + instant transition + outline for hover)
- [ ] Any user input skips entry animation (click/keydown/touchstart → immediate ready state)
- [ ] Responsive three breakpoints: desktop ≥1024px, tablet 768-1023px, mobile <768px
- [ ] Pulse animation plays limited times then stops (4 iterations)
- [ ] Node colors WCAG AA compliant (all kind colors pass 4.5:1 contrast with text)
- [ ] Schema comment + complete example data present in template
- [ ] No console errors

## Interactive Explainer -- Compare

- [ ] Overview mode correct: entering defaults to overview, verdict badge + diff summary + diff count visible
- [ ] Dimension switching smooth: 4-phase animation sequence correct, items and connections transition without jumps
- [ ] Hover detail correct: hover/tap item → detail overlay + associated connections highlighted + other items dimmed
- [ ] Dual encoding: each item card shows kind color bar + kind icon + kind text simultaneously
- [ ] Score 5-dot visualization: score > 0 shows dots, score = 0 hides dots
- [ ] Mobile degradation: two-column vertical stack + horizontal tab scrolling + tap-to-inspect overlay, no hover-only content
- [ ] WCAG AA: all text >= 4.5:1 contrast, all UI >= 3:1 contrast, kind not reliant on single color
- [ ] URL sanitization: cta.href passes sanitizeUrl filter, javascript: URIs blocked
- [ ] Schema uses cta.href (not cta.target), items have id field

## Interactive Explainer -- Decision Tree

- [ ] Full-tree display correct: all nodes and branches visible simultaneously, BFS layout no overlaps, parent centered over children
- [ ] Hover path highlighting correct: hover any node → entire path highlighted + accent stroke 3px + non-path dimmed
- [ ] Conclusion emphasis: emerald background + shadow (0 2px 8px rgba(16,185,129,0.25)), visually distinct from question/factor
- [ ] Path description text: right panel/bottom overlay shows "Node Label -> Branch Label -> ... -> Conclusion Label" format
- [ ] Unbalanced tree fallback: >5 siblings triggers gap 64px + horizontal scrolling available
- [ ] Mobile degradation: indented vertical list (level * 24px) + tap-to-inspect + sticky overlay
- [ ] WCAG AA: all text >= 4.5:1 contrast, all UI >= 3:1 contrast
- [ ] URL sanitization: cta.href passes sanitizeUrl filter, javascript: URIs blocked
- [ ] Schema uses cta.href (not cta.target), nodes have id field
