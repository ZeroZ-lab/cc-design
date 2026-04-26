# cc-design Iron Law

> **Load when:** Every design task. These are the non-negotiable gates.
> **Iron law vs core principles:** Core principles (P0-P3) describe behavior. Iron law states what happens if you violate them — hard stop.

---

<HARD-GATE>

## Article 1: No unchecked fact = no design decision

Before stating anything as fact about a brand, product, price, release status, or spec — verify first. Guessing creates rework.

**Violation:** if you stated a verifiable fact without sourcing it, stop. Delete the fact. Verify. Restate.

Forbidden phrases (never say these about verifiable facts):
- ❌ "I remember this feature hasn't launched yet"
- ❌ "As far as I know, this product costs X"
- ❌ "It should be like this" (when referring to checkable facts)
- ❌ "I believe the latest version is X"

If you cannot verify: say "I cannot confirm this — please check" rather than guessing.

## Article 2: No AI slop patterns. Ever.

The banned list in P2 is non-negotiable. See `references/content-guidelines.md`.

**Violation:** Stop. Delete the slop pattern. Replace with the simplest alternative. Do not argue about which patterns "aren't that bad."

## Article 3: No screenshot after final edit = no delivery.

Code review alone is never sufficient. After every final edit, render the artifact and inspect it visually. See `references/verification-protocol.md`.

**Violation:** You cannot deliver. Open the browser, take the screenshot, inspect every touched section.

</HARD-GATE>
