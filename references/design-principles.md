# Design Principles: 10 Core Decision Framework

> **Load when:** Design reviews, principle conflicts, tradeoff decisions, need to explain design reasoning
> **Skip when:** Simple execution, clear specs, no judgment needed
> **Why it matters:** Provides consistent decision framework, resolves principle conflicts, builds design judgment
> **Typical failure it prevents:** Subjective guessing, unable to explain decisions, not knowing how to choose when principles conflict

The 10 core principles are cc-design's decision framework. They are not rules, they are judgment tools. When facing choices, use principles to guide decisions.

---

## cc-design's 10 Core Principles

### 1. Clarity Over Beauty

**Principle:** If you must choose between clarity and beauty, choose clarity.

**Reasoning:**
- Design's primary goal is to convey information, not to decorate
- Users come to complete tasks, not to admire design
- Beautiful but unclear = failed design

**Application:**
- **Font size**: Readability > visual compactness (minimum 14px body text)
- **Contrast**: Information hierarchy > visual harmony (sufficient contrast ratio)
- **Whitespace**: Reading rhythm > space efficiency (prefer more whitespace)
- **Animation**: Functional feedback > visual showmanship (purposeful animation)

**Exception:**
- Brand expression designs (art posters, concept showcases)
- Emotion-priority scenarios (emotional design)
- But even in exceptions, ensure basic readability

**Test:**
- Can users find core information within 3 seconds?
- Is information hierarchy immediately clear?
- Is it still usable without decoration?

---

### 2. Context Over Convention

**Principle:** User's design system > general best practices.

**Reasoning:**
- Consistency is more important than "correctness"
- User's existing system is their context
- Cost of breaking consistency > benefit of local optimization

**Application:**
- **Read codebase first**: Copy user's hex/px values, don't guess
- **Follow naming**: If user calls it `primary-blue`, use that name
- **Keep patterns**: If user uses cards, keep using cards
- **Respect specs**: Don't argue with "Material Design says it should be this way"

**Exception:**
- User's system clearly violates usability (e.g., 12px body text, 3:1 contrast ratio)
- User explicitly requests system improvements
- But suggest first, change only after agreement

**Test:**
- Does this design fit harmoniously into the user's product?
- Can the user recognize this as their style?
- Does it reuse the user's tokens and components?

---

### 3. Problem Definition Over Solutions

**Principle:** Ask "why" first, then "how".

**Reasoning:**
- Without goal definition, there's no real design, only decoration
- Wrong problem definition → correct execution is still failure
- Problem definition determines evaluation criteria

**Application:**
- **P1 principle**: Ask questions in batch for new tasks, don't jump in
- **Junior Designer Mode**: Write assumptions before code
- **Before each design answer**: What problem? For whom? Success criteria?
- **Reject vague briefs**: "Make a nice dashboard" → clarify what data to show

**Exception:**
- Clear small changes ("change button to blue")
- User has provided detailed brief
- But even in exceptions, confirm understanding

**Test:**
- Can you explain the core problem in one sentence?
- Can you describe target users and scenarios?
- Are there clear success metrics?

---

### 4. Validation Over Assumptions

**Principle:** Validate with data and testing, don't rely on intuition.

**Reasoning:**
- Designer's "feeling" is often wrong
- Unvalidated assumptions = risk
- Validation is the only way to learn and improve

**Application:**
- **P0 principle**: Fact validation (brand, product, pricing, technology)
- **Three-phase validation**: Structure → Visual → Excellence
- **Pre-screenshot checks**: Console errors, responsive, real content
- **Pre-delivery testing**: Core flow, edge cases, different devices

**Exception:**
- Time-constrained prototyping (but label assumptions)
- Exploratory design (but clarify it's exploration)
- But validate assumptions as soon as possible

**Test:**
- Is this design based on facts or assumptions?
- Have assumptions been validated?
- Is there data supporting key decisions?

---

### 5. System Over Local

**Principle:** Overall consistency > local optimization.

**Reasoning:**
- Locally brilliant but globally chaotic = failed design
- System thinking reduces cognitive load
- Consistency builds trust and predictability

**Application:**
- **Spacing scale**: 4/8/12/16/24/32/48/64, not random values
- **Type scale**: 1.25 ratio, not arbitrary font sizes
- **Font weights**: 2-3 weights, not 5
- **Colors**: 2-3 primary colors, not a rainbow
- **Components**: Reuse existing components, don't redesign every time

**Exception:**
- Clear visual focus (hero section) can break rules
- Brand showcase needs special treatment
- But have clear reasoning and document the exception

**Test:**
- Does this design use system tokens?
- Is it consistent with other pages?
- If copied 10 times, would it become chaotic?

---

### 6. Content Over Form

**Principle:** Organize content first, then design form.

**Reasoning:**
- Form serves content, not the other way around
- Content determines structure and visuals
- Form without content = empty visual games

**Application:**
- **Information architecture first**: Filter, group, sequence
- **Then visual design**: Use visuals to express information hierarchy
- **Don't force fit**: Don't break content to fit bento grid
- **No filler content**: No content = no placeholder

**Exception:**
- Brand expression designs (form is the content)
- Visual exploration phase (but fill in real content soon)
- But clarify it's an exception

**Test:**
- Is content organized?
- Does form serve content?
- Does form have meaning without content?

---

### 7. Subtraction Over Addition

**Principle:** Remove what you can, don't pile on.

**Reasoning:**
- Every element adds cognitive load
- Less is more
- Removing is the hardest design decision

**Application:**
- **No filler content**: No actual content = no placeholder
- **Remove decoration**: Elements that don't carry information can be removed
- **Whitespace > filling**: Prefer more whitespace, don't stuff everything in
- **One focus per screen**: Don't try to show everything on one screen

**Exception:**
- Designs requiring richness (e-commerce, media)
- Brand-required decorative elements
- But ensure core information is not affected

**Test:**
- Does every element have a clear purpose?
- Would removing it affect understanding?
- Are there unnecessary decorations?

---

### 8. Natural Over Flashy

**Principle:** Interaction should follow intuition, don't design for cool factor.

**Reasoning:**
- Users don't care about your technology, only about completing tasks
- Natural interaction = users don't notice the interaction
- Flashiness increases learning cost

**Application:**
- **Buttons in expected places**: Don't change basic patterns for innovation
- **Timely clear feedback**: Don't use complex animations to delay feedback
- **Don't overdo animation**: Animation serves function, not showmanship
- **Follow platform norms**: iOS uses iOS patterns, Web uses Web patterns

**Exception:**
- Brand showcase animations (but can't affect core functionality)
- Innovative products (but reduce learning cost)
- But ensure basic usability

**Test:**
- Can a first-time user guess how to operate?
- Does animation have a clear functional purpose?
- Does it follow platform norms?

---

### 9. Consistency Over Innovation

**Principle:** Follow platform norms and user habits.

**Reasoning:**
- Consistency reduces learning cost
- User habits are precious assets
- Innovation needs sufficient justification

**Application:**
- **iOS uses iOS norms**: Don't use Material Design on iOS
- **Web uses Web conventions**: Links are blue and underlined, buttons are solid
- **Don't reinvent navigation**: Users know top-left is back
- **Maintain internal consistency**: Keep consistency within same product

**Exception:**
- Clear brand differentiation needs
- Innovation significantly improves experience
- But reduce learning cost, provide guidance

**Test:**
- Does this design follow platform norms?
- Is it consistent with user habits?
- Does the innovation have sufficient justification?

---

### 10. Scalability Over Perfection

**Principle:** Design should work long-term, not just be perfect now.

**Reasoning:**
- Design is a system, not an artwork
- Perfect but unscalable = technical debt
- Scalability is long-term value

**Application:**
- **Build design system**: Tokens, components, specs
- **Use CSS variables**: Don't hardcode values
- **Component thinking**: Reusable, composable
- **Document**: Record decisions and rules

**Exception:**
- One-off marketing pages (but still consider reuse)
- Quick prototypes (but label temporary solutions)
- But systematize as soon as possible

**Test:**
- Can this design be reused?
- Can it scale to other scenarios?
- Are there clear rules?

---

## Principle Priority

When principles conflict, follow this order:

1. **Clarity** > Beauty
2. **Context** > Convention
3. **Problem Definition** > Solutions
4. **Validation** > Assumptions
5. **System** > Local
6. **Content** > Form
7. **Subtraction** > Addition
8. **Natural** > Flashy
9. **Consistency** > Innovation
10. **Scalability** > Perfection

**Note:** This is not absolute; judge based on specific situations.

---

## Principle Conflict Case Studies

### Case 1: Clarity vs Beauty

**Scenario:** Large title looks beautiful, but information hierarchy is unclear

**Conflict:**
- Beauty: 48px large title has strong visual impact
- Clarity: Title too large, body text relatively too small, hierarchy unclear

**Decision:** Reduce title to 32px, ensure hierarchy clarity

**Reasoning:** Principle 1 (Clarity > Beauty)

---

### Case 2: Context vs Convention

**Scenario:** User's system uses 12px body text, but best practice is 14px

**Conflict:**
- Context: Keep 12px to maintain consistency
- Convention: 14px has better readability

**Decision:** Suggest improvement first; if user insists, keep 12px

**Reasoning:** Principle 2 (Context > Convention), but suggest improvements

---

### Case 3: System vs Local

**Scenario:** 12px works better for this page, but system uses 14px

**Conflict:**
- Local: 12px is more visually compact on this page
- System: 14px is the system standard

**Decision:** Keep 14px, maintain system consistency

**Reasoning:** Principle 5 (System > Local)

---

### Case 4: Brand vs Interaction

**Scenario:** Brand requires special font, but readability is poor

**Conflict:**
- Brand: Special font embodies brand personality
- Interaction: Poor readability affects usage

**Decision:** Use brand font for titles, readable font for body text

**Reasoning:** Principle 1 (Clarity > Beauty) + Principle 8 (Natural > Flashy)

---

### Case 5: Innovation vs Consistency

**Scenario:** Want to use new navigation pattern, but users are accustomed to traditional

**Conflict:**
- Innovation: New pattern is more efficient
- Consistency: Users are familiar with traditional pattern

**Decision:** If new pattern significantly improves experience, innovate but provide guidance

**Reasoning:** Principle 9 (Consistency > Innovation), but has exceptions

---

## Design Decision Framework

When facing design decisions, follow these steps:

### 1. Clarify the Problem

**Ask:** What problem does this decision solve?

**Check:** Principle 3 (Problem Definition > Solutions)

---

### 2. Check Context

**Ask:** Are there contextual constraints?

**Check:**
- User's design system
- Platform norms
- Brand requirements
- Technical limitations

**Apply:** Principle 2 (Context > Convention)

---

### 3. Evaluate Clarity

**Ask:** Is it clear?

**Check:**
- Is information hierarchy clear
- Can users understand quickly
- Is there ambiguity

**Apply:** Principle 1 (Clarity > Beauty)

---

### 4. Check Consistency

**Ask:** Is it consistent?

**Check:**
- Consistent with other parts of the system
- Consistent with platform norms
- Consistent with user habits

**Apply:** Principle 5 (System > Local) + Principle 9 (Consistency > Innovation)

---

### 5. Validate Assumptions

**Ask:** Is it verifiable?

**Check:**
- Based on facts or assumptions
- Have assumptions been validated
- Is there data support

**Apply:** Principle 4 (Validation > Assumptions)

---

### 6. Consider Scalability

**Ask:** Is it scalable?

**Check:**
- Can it be reused
- Can it scale to other scenarios
- Are there clear rules

**Apply:** Principle 10 (Scalability > Perfection)

---

## Conditions for Breaking Principles

Principles are not rules; they can be broken, but must satisfy:

### 1. Goal Layer Explicitly Requires

**Examples:**
- Goal is "brand showcase" → Brand > Interaction
- Goal is "visual impact" → Visual > Information
- Goal is "innovative experience" → Innovation > Consistency

**Prerequisite:** Goal layer has clear justification

---

### 2. Sufficient Reasoning

**Examples:**
- Breaking consistency: Because this scenario is special, consistency would reduce experience
- Breaking system: Because this is a visual focus, needs special treatment
- Breaking convention: Because innovation significantly improves efficiency

**Prerequisite:** Can clearly explain why the break is needed

---

### 3. Understanding Consequences

**Examples:**
- Breaking consistency → Increases learning cost
- Breaking system → Increases maintenance cost
- Breaking convention → Requires user education

**Prerequisite:** After weighing, determined to be worth it

---

### 4. Documenting Why

**Examples:**
- Record in code comments
- Explain in design documentation
- Mark as exception in design system

**Prerequisite:** Let future self and team understand

---

## Relationship to Other Documents

- **design-philosophy.md**: Philosophical foundation of principles
- **design-thinking-framework.md**: Application of principles in the 8-layer framework
- **design-excellence.md**: Embodiment of principles in visual design
- **content-guidelines.md**: Rules of principles in content design
- **SKILL.md P0/P1/P2**: Operationalization of principles

---

## Remember

1. **10 Principles**: Clarity, Context, Problem Definition, Validation, System, Content, Subtraction, Natural, Consistency, Scalability
2. **Priority**: Clarity > Context > Problem Definition > Validation > System > Content > Subtraction > Natural > Consistency > Scalability
3. **Decision Framework**: Problem → Context → Clarity → Consistency → Validation → Scalability
4. **Breaking Conditions**: Goal requires + Sufficient reasoning + Understanding consequences + Documentation
5. **Principles are not rules**: They are judgment tools, not rigid regulations

**Principles guide judgment, judgment builds intuition.**
