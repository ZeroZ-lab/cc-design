# Interaction Anti-Patterns

**Purpose:** Identify interaction mistakes that signal poor design judgment, not provide "correct" interaction patterns.

**Principle:** Interaction is about predictability, feedback, and user control. These anti-patterns break expectations or frustrate users.

---

## 1. Hover-Only Critical Information

**Problem:** Essential information (prices, descriptions, actions) only visible on hover.

**Why it fails:**
- Invisible on mobile (no hover state)
- Users don't know to hover — information feels hidden
- Signals "I'm hiding complexity instead of designing for it"

**Real failure case:** E-commerce site with product prices only visible on hover. Mobile users couldn't see prices at all.

**Boundary:** Hover can reveal secondary information (tooltips, previews). Never hide primary information behind hover.

---

## 2. Disabled Buttons Without Explanation

**Problem:** Submit button is disabled (grayed out) with no indication of why or what's missing.

**Why it fails:**
- Users don't know what to fix
- Creates frustration and abandonment
- Signals lazy validation design

**Real failure case:** Form with disabled submit button. User filled all fields but button stayed disabled because email format was wrong. No error message, no hint.

**Boundary:** If a button is disabled, show inline validation errors explaining what's missing. Or keep the button enabled and show errors on submit.

---

## 3. Surprise Modals

**Problem:** Modals that appear without user action (on page load, after 5 seconds, on scroll).

**Why it fails:**
- Interrupts user's task
- Feels like a pop-up ad
- Users close it immediately without reading

**Real failure case:** Blog with modal appearing 3 seconds after page load asking for email signup. 95% of users closed it instantly.

**Boundary:** Modals should only appear in response to user action (clicking a button, submitting a form). Never auto-trigger.

---

## 4. Tiny Click Targets

**Problem:** Buttons, links, or interactive elements smaller than 44×44px.

**Why it fails:**
- Hard to tap on mobile (Apple HIG and Material Design both specify 44px minimum)
- Frustrating for users with motor impairments
- Signals ignoring accessibility guidelines

**Boundary:** 44×44px minimum for all interactive elements. Increase padding if the visual element is smaller.

---

## 5. Ambiguous Button Labels

**Problem:** Buttons labeled "OK", "Submit", "Continue" without context of what happens next.

**Why it fails:**
- Users don't know the consequence of clicking
- Creates anxiety ("Will this delete my data?")
- Signals lazy copywriting

**Real failure case:** Delete confirmation modal with buttons "OK" and "Cancel". Users clicked "OK" thinking it meant "I understand", not "Yes, delete everything".

**Boundary:** Button labels should describe the action: "Delete Account", "Save Changes", "Send Message". Not generic "OK" or "Submit".

---

## 6. Infinite Scroll Without Escape

**Problem:** Infinite scroll with no way to reach footer or pagination controls.

**Why it fails:**
- Users can't access footer links (contact, privacy policy)
- Impossible to bookmark or share a specific position
- Signals prioritizing engagement metrics over usability

**Real failure case:** Social feed with infinite scroll. Users trying to reach "Contact Us" in footer gave up after scrolling for 2 minutes.

**Boundary:** If using infinite scroll, provide a "Load More" button after initial batch, or use a sticky footer. Always give users control.

---

## 7. Auto-Playing Media

**Problem:** Videos or audio that start playing automatically without user interaction.

**Why it fails:**
- Startles users
- Wastes bandwidth
- Browsers block autoplay anyway (user has to unmute)

**Boundary:** Never autoplay media with sound. Autoplay muted video is acceptable for hero sections, but provide visible play/pause controls.

---

## 8. Hijacked Scrolling

**Problem:** Custom scroll behavior that overrides native scrolling (smooth scroll with easing, horizontal scroll on vertical wheel, snap-to-section).

**Why it fails:**
- Breaks user expectations
- Feels sluggish or unresponsive
- Accessibility nightmare (screen readers, keyboard navigation)

**Real failure case:** Portfolio site with custom smooth scroll. Users on trackpads felt like scrolling through molasses. Bounce rate was 80%.

**Boundary:** Use native scroll. CSS `scroll-behavior: smooth` is acceptable for anchor links. Never hijack scroll with JavaScript unless absolutely necessary (e.g., carousels).

---

## Quick Checklist

Before finalizing interactions, ask:

- **Is critical information visible without hover?** If not, make it visible.
- **Are disabled buttons explained?** If not, add validation messages.
- **Do modals only appear on user action?** If not, remove auto-triggers.
- **Are all click targets at least 44×44px?** If not, increase padding.
- **Are button labels specific?** If not, rewrite them.
- **Can users reach the footer?** If not, fix infinite scroll.
- **Does media autoplay?** If yes, remove autoplay or mute it.
- **Is scrolling native?** If not, remove custom scroll behavior.

**Remember:** Interaction anti-patterns are about what NOT to do. Within these boundaries, you have infinite creative freedom.
