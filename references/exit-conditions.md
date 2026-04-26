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
