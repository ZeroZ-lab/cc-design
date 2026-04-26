# Failure Mode Handling — 失败恢复协议

> **Load when:** Something blocks the current design task — missing assets, verification failure, export error, or user feedback loops.
> **Why it matters:** Without a structured recovery table, agents guess. Guessing makes failures worse.

---

## Structural Failures

| Failure scenario | How to handle |
|---|---|
| Brand/spec fact cannot be verified (P0 failure) | Say "I cannot confirm this — please check the correct value". Never guess. If the task is blocked, document the unknown and continue with labeled placeholders. |
| Design assets fail to load (logo SVG, brand images) | Use a labeled gray placeholder (`[Logo placeholder]`). Report the missing asset. Do not generate fake brand assets. |
| Browser console errors on first render | Read the exact error message. Fix the source. Re-navigate the page. Re-run Phase 1 verification before any visual check. |
| Font CDN is unreachable (Google Fonts, etc.) | Provide the complete CSS fallback chain. Verify the fallback state with a screenshot. Report to the user. |
| Interactive prototype navigation breaks | Check each click handler, state variable, and route individually. Do not assume all paths work because one path works. |
| Template file is missing or corrupted | Do not hand-write the template from memory. Report the issue. Fall back to a known-safe static structure. |

## Iteration Failures

| Failure scenario | How to handle |
|---|---|
| User rejects 3+ design directions | STOP. Do not produce a 4th variation. Enter the Iteration Gate protocol — see `references/workflow.md`. |
| Feedback keeps changing direction each round | The foundation is not settled. Go back to the Understand step (workflow Step 1). Do not build on shifting ground. |
| User says "I do not know what I want" | Provide 2-3 concrete references for them to react to. "Pick the closest" is easier than "describe the ideal". |
| User provides contradictory requirements | Point out the contradiction explicitly (CANON Article 8: Manage Confusion). Let the user choose one direction. |

## Export Failures

| Failure scenario | How to handle |
|---|---|
| PDF export fails | Check `scripts/` dependencies are installed (package.json). Try the alternate export script if available. Report the error. |
| Editable PPTX constraints not met | Fall back to image-mode PPTX. Tell the user which constraint failed. |
| Video export (ffmpeg not available) | Recommend the user install ffmpeg. Offer HTML-only delivery as fallback. |
| Deck slide content overflows | Reduce content volume, not font size. Split the slide. Never shrink text below the minimum body size (24px). |
| Export file is empty or corrupted | Re-run the export script. Check for error output. Verify the output file size > 0 before delivery. |

## UX Failures

| Failure scenario | How to handle |
|---|---|
| Screen real estate is insufficient for content | Recommend reducing scope or changing layout density. Do not force content into cramped space. |
| Accessibility contrast check fails | Adjust colours to meet WCAG AA. Do not argue with the standard. Verify with a contrast checker. |
| Interactive element is not tappable on mobile | Ensure minimum touch target of 44px. Adjust padding if needed. Re-verify. |
