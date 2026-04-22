# Design Thinking Framework: 8-Layer Design System

> **Load when:** Complex multi-screen flows, design system creation, architecture decisions, need complete design thinking
> **Skip when:** Simple visual adjustments, single component modifications, clear small changes
> **Why it matters:** Provides complete design decision framework, ensures no critical layers are missed
> **Typical failure it prevents:** Focusing only on visuals while ignoring goals, surface-level work without system thinking, designs that can't be implemented

The 8-layer design framework is cc-design's core methodology. It breaks design into 8 layers, each with clear focus areas, decision methods, and validation criteria.

---

## Why We Need the 8-Layer Framework

### Common Problems

**Only focusing on visuals:**
- "Make a nice-looking dashboard" → Don't know what data to show
- "Reference Apple style" → Don't know why it should look like Apple
- "Add a gradient" → Don't know what problem the gradient solves

**Only focusing on functionality:**
- "Implement these 20 features" → Don't know the priorities
- "Everything is important" → Information overload
- "As long as it works" → Poor experience

**Lacking system thinking:**
- Redesigning from scratch every time → Can't reuse
- Inconsistent style → High cognitive load
- Can't scale → Technical debt accumulates

### Value of the 8-Layer Framework

1. **Completeness**: Covers the full flow from goals to validation
2. **Priority**: Clear layer dependency relationships
3. **Checkable**: Each layer has clear validation criteria
4. **Teachable**: Beginners can learn by following the framework
5. **Diagnostic**: Quickly locate design problems

---

## 8-Layer Design System

### Layer 1: Goal Design (Why)

**Definition:** Clarify the problem to solve, users to serve, and expected changes.

**Key Questions:**
- What problem does this solve?
- Who is it for? (User personas, scenarios)
- What change is expected? (Behavior, cognition, emotion)
- What are the success criteria?
- How to prioritize?

**Thought Keywords:** Problem definition, value hypothesis, success metrics, prioritization

**Why It Matters:**
- Goals determine the direction of all other layers
- No goals = no evaluation criteria
- Wrong goals → correct execution is still failure

**Existing Documents:**
- `junior-designer-mode.md` - Assumptions and questions for new tasks
- `design-context.md` - Context understanding

**Validation Criteria:**
- [ ] Can explain the core problem in one sentence
- [ ] Can describe target users and usage scenarios
- [ ] Has clear success metrics
- [ ] Has clear priority ordering

---

### Layer 2: Information Design (What to Say, How to Say It)

**Definition:** Filter, organize, and sequence information to establish cognitive paths.

**Key Questions:**
- What information must be shown? (Filtering)
- How to group? (Categorization)
- How to sequence? (Priority)
- How to establish hierarchy? (Primary-secondary relationships)
- What is the user's cognitive path? (Reading order)

**Thought Keywords:** Filtering, grouping, sequencing, hierarchy, compression, cognitive path

**Why It Matters:**
- Information overload is the most common design problem
- Good information design = users can quickly find what they need
- Information structure determines page structure

**Theoretical Foundation:**
- Miller's Law: People can only process 7±2 information chunks simultaneously
- Cognitive Load Theory: Reduce unnecessary cognitive consumption
- Chunking: Organize information into meaningful blocks

**Existing Documents:**
- `design-excellence.md` - Hierarchy section
- `content-guidelines.md` - Content rules
- `information-design-theory.md` - Cognitive load theory

**Validation Criteria:**
- [ ] Information has clear primary-secondary relationships
- [ ] No more than 7 items at the same hierarchy level
- [ ] Information grouping has clear logic
- [ ] Users can find core information within 3 seconds

---

### Layer 3: Structure Design (Skeleton)

**Definition:** Build page structure, divide modules, establish layout system.

**Key Questions:**
- How to divide page areas?
- What are the relationships between modules?
- How to design navigation?
- What are the layout system rules?
- How to adapt to different screens?

**Thought Keywords:** Order, relationships, organization, architecture, grid

**Why It Matters:**
- Structure is the skeleton of visuals
- Good structure = clear sense of order
- Structure constrains interaction and visuals

**Theoretical Foundation:**
- Grid system: Establish visual order
- Modularization: Reduce complexity
- Responsive design: Adapt to multiple devices

**Existing Documents:**
- `design-patterns.md` - Classic layout patterns
- `anti-patterns/layout.md` - Layout anti-patterns
- `frontend-design.md` - Frontend layout

**Validation Criteria:**
- [ ] Page has clear area divisions
- [ ] Module relationships are clear
- [ ] Uses consistent grid system
- [ ] Layout works well on different screens

---

### Layer 4: Interaction Design (How People Use It)

**Definition:** Design operation flows, feedback mechanisms, state changes, error handling.

**Key Questions:**
- How do users complete tasks? (Flow)
- What feedback after operations? (Feedback)
- How to show different states? (States)
- How to handle errors? (Error handling)
- Is the operation cost reasonable? (Efficiency)

**Thought Keywords:** Natural, low friction, predictable, feedback, fault tolerance

**Why It Matters:**
- Interaction determines user experience
- Good interaction = users don't notice the interaction
- Interaction problems lead to task failure

**Theoretical Foundation:**
- Fitts's Law: Larger and closer targets are easier to click
- Hick's Law: More choices slow down decisions
- Feedback psychology: Immediate feedback reduces anxiety
- Affordance: Design hints at how to use

**Existing Documents:**
- `interactive-prototype.md` - Interactive prototypes
- `animation-best-practices.md` - Animation best practices
- `anti-patterns/interaction.md` - Interaction anti-patterns
- `interaction-design-theory.md` - Interaction theory

**Validation Criteria:**
- [ ] Core flow has no more than 3 steps
- [ ] Every operation has immediate feedback
- [ ] State changes are clearly visible
- [ ] Has clear error messages and recovery mechanisms

---

### Layer 5: Visual Design (How It Looks)

**Definition:** Design color, typography, layout, contrast, whitespace, visual rhythm.

**Key Questions:**
- What colors to use? (Color system)
- What fonts to use? (Font selection)
- How to layout? (Layout rules)
- How to establish contrast? (Visual hierarchy)
- How to use whitespace? (Visual breathing)
- How to establish rhythm? (Repetition and variation)

**Thought Keywords:** Contrast, order, rhythm, recognition, atmosphere

**Why It Matters:**
- Visuals are the user's first impression
- Good visuals = clear + beautiful + consistent
- Visuals convey brand and emotion

**Theoretical Foundation:**
- Gestalt psychology: Proximity, similarity, continuity, closure
- Color psychology: Emotional and cultural meanings of colors
- Contrast theory: Size, color, weight, whitespace
- Visual rhythm: Repetition establishes order, variation establishes focus

**Existing Documents:**
- `design-excellence.md` - Visual excellence standards
- `typography-design-system.md` - Typography system
- `typography-spacing-examples.md` - Typography examples
- `anti-patterns/color.md` - Color anti-patterns
- `anti-patterns/typography.md` - Typography anti-patterns
- `visual-design-theory.md` - Visual theory

**Validation Criteria:**
- [ ] Uses consistent color system (2-3 primary colors)
- [ ] Uses type scale (1.25 ratio)
- [ ] Uses spacing scale (4/8/12/16/24/32/48/64)
- [ ] Has clear visual hierarchy
- [ ] Sufficient whitespace, good visual breathing

---

### Layer 6: Brand & Emotion Design (What It Feels Like)

**Definition:** Design temperament, tone, trust, emotional atmosphere, memorable elements.

**Key Questions:**
- What is the brand positioning? (Temperament)
- What tone to use? (Tone of voice)
- How to build trust? (Trust signals)
- What emotion to convey? (Emotional design)
- What are the memorable elements? (Brand recognition)

**Thought Keywords:** Recognition, memory, personality, trust, continuity

**Why It Matters:**
- Brand is long-term value
- Good brand = consistent personality
- Emotion influences decisions

**Theoretical Foundation:**
- Brand personality theory: Sincerity, excitement, competence, sophistication, ruggedness
- Three levels of emotional design: Visceral, behavioral, reflective
- Trust signals: Social proof, authority, scarcity, consistency

**Existing Documents:**
- `design-styles.md` - 20 design schools
- `getdesign-loader.md` - Brand style cloning
- `brand-emotion-theory.md` - Brand emotion theory

**Validation Criteria:**
- [ ] Visual style aligns with brand positioning
- [ ] Tone (copy, animation) is unified
- [ ] Has clear trust signals
- [ ] Emotional atmosphere matches goals

---

### Layer 7: System Design (How It Runs Long-Term)

**Definition:** Establish design specs, component system, reuse mechanisms, extension rules, consistency governance.

**Key Questions:**
- How to establish design specs? (Design tokens)
- How to componentize? (Component library)
- How to reuse? (Pattern library)
- How to extend? (Extension rules)
- How to maintain consistency? (Governance mechanisms)

**Thought Keywords:** Consistency, reuse, constraints, extension, governance

**Why It Matters:**
- Design is a system, not an artwork
- Good system = sustainable, scalable
- Systems reduce long-term costs

**Theoretical Foundation:**
- Constraints enhance creativity: Limiting choices reduces decision costs
- Component thinking: DRY principle
- Token architecture: Separate decisions from implementation

**Existing Documents:**
- `design-system-creation.md` - Design system creation
- `typography-design-system.md` - Typography system
- `system-design-theory.md` - System theory

**Validation Criteria:**
- [ ] Has clear design tokens (colors, font sizes, spacing)
- [ ] Components are reusable
- [ ] Has clear extension rules
- [ ] Consistency is verifiable

---

### Layer 8: Validation & Iteration Design (Is It Effective)

**Definition:** Validate feasibility, test usage, collect data, gather feedback, continuous optimization.

**Key Questions:**
- Is it technically feasible? (Feasibility)
- Can users complete tasks? (Usability testing)
- Does data support assumptions? (Data validation)
- What is user feedback? (Real feedback)
- How to continuously optimize? (Iteration mechanism)

**Thought Keywords:** Validation, testing, feedback, iteration, results

**Why It Matters:**
- Design is hypothesis, validation is truth
- Good design = validated design
- Iteration is the only way to progress

**Theoretical Foundation:**
- Lean design: Build → Measure → Learn
- A/B testing: Data-driven decisions
- User testing: Observe real behavior

**Existing Documents:**
- `verification-protocol.md` - Verification protocol
- `verification.md` - Verification checklist

**Validation Criteria:**
- [ ] Technically feasible (no console errors)
- [ ] Users can complete core tasks
- [ ] Has data supporting key assumptions
- [ ] Has feedback collection mechanism

---

## Relationships Between Layers

### Dependency Relationships (Top-Down)

```
Layer 1: Goal
   ↓ determines
Layer 2: Information
   ↓ influences
Layer 3: Structure
   ↓ constrains
Layer 4: Interaction
   ↓ requires
Layer 5: Visual
   ↓ embodies
Layer 6: Brand
   ↓ standardizes
Layer 7: System
   ↓ validates
Layer 8: Validation
   ↓ feeds back to
Layer 1: Goal (iteration)
```

**Key Dependencies:**
- Goal layer determines the direction of all other layers
- Information layer influences structure layer (content determines form)
- Structure layer constrains interaction layer (layout determines operations)
- Visual and brand layers must serve the first 4 layers
- System layer standardizes the first 6 layers
- Validation layer feeds back to goal layer forming a closed loop

---

### Conflict Resolution Rules

When layers conflict, priority order:

**Goal > Information > Structure > Interaction > Visual > Brand**

**Examples:**

**Conflict 1: Visual vs Information**
- Problem: Large title looks beautiful, but information hierarchy is unclear
- Decision: Reduce title size, ensure hierarchy clarity
- Reason: Information > Visual

**Conflict 2: Brand vs Interaction**
- Problem: Brand requires special font, but readability is poor
- Decision: Use brand font for titles, readable font for body text
- Reason: Interaction > Brand

**Conflict 3: System Consistency vs Local Optimization**
- Problem: 12px works better for this page, but system uses 14px
- Decision: Keep 14px, maintain system consistency
- Reason: System > Local

**Exception: Can break rules when goal layer explicitly requires**
- If goal is "brand showcase", Brand > Interaction
- If goal is "visual impact", Visual > Information
- But must have clear reasoning and tradeoffs

---

## Complete Design Process

### Standard Process (Top-Down)

1. **Define Goals** → Clarify problem, users, success criteria
2. **User Research** → Understand user needs and scenarios
3. **Organize Information** → Filter, group, sequence, establish hierarchy
4. **Build Structure** → Page structure, module division, layout system
5. **Plan Flow** → Operation flow, feedback, states, error handling
6. **Visual Expression** → Color, typography, layout, contrast, whitespace
7. **Integrate Brand** → Temperament, tone, emotion, memorable elements
8. **Standardize Specs** → Componentization, documentation, systematization
9. **Launch Validation** → Testing, data, feedback
10. **Continuous Optimization** → Iteration, improvement

### Quick Process (Small Changes)

1. **Confirm Goal** → What problem does this change solve?
2. **Check Consistency** → Does it fit the existing system?
3. **Execute** → Implement according to specs
4. **Validate** → Check results

### Diagnostic Process (Problem Fixing)

1. **Locate Layer** → Which layer has the problem?
2. **Check Dependencies** → Are there problems in upstream layers?
3. **Fix** → Start fixing from the root layer
4. **Validate** → Confirm problem is solved

---

## How to Use This Framework

### Pre-Design Checklist

**Layer 1: Goal**
- [ ] What is the core problem?
- [ ] Who are the target users?
- [ ] What are the success criteria?
- [ ] How to prioritize?

**Layer 2: Information**
- [ ] What information must be shown?
- [ ] How to group?
- [ ] How to sequence?
- [ ] Is information hierarchy clear?

**Layer 3: Structure**
- [ ] Is page structure clear?
- [ ] Are module relationships clear?
- [ ] Is layout system consistent?

**Layer 4: Interaction**
- [ ] Is core flow smooth?
- [ ] Does every operation have feedback?
- [ ] Are state changes clear?
- [ ] Is there error handling?

**Layer 5: Visual**
- [ ] Is color system consistent?
- [ ] Is typography system standardized?
- [ ] Is visual hierarchy clear?
- [ ] Is whitespace sufficient?

**Layer 6: Brand**
- [ ] Does temperament match positioning?
- [ ] Is tone unified?
- [ ] Are there trust signals?
- [ ] Is emotional atmosphere appropriate?

**Layer 7: System**
- [ ] Are design tokens used?
- [ ] Are components reusable?
- [ ] Are there extension rules?
- [ ] Is consistency verifiable?

**Layer 8: Validation**
- [ ] Is it technically feasible?
- [ ] Can users complete tasks?
- [ ] Is there data support?
- [ ] How to collect feedback?

---

### Diagnosing Design Problems

**Symptom → Layer → Solution Direction**

| Symptom | Problem Layer | Check Focus |
|---------|--------------|-------------|
| "Looks wrong" | Layer 5 (Visual) | Contrast, hierarchy, whitespace, consistency |
| "Feels awkward to use" | Layer 4 (Interaction) | Flow, feedback, states, error handling |
| "Can't find the focus" | Layer 2 (Information) | Filtering, grouping, sequencing, hierarchy |
| "Feels messy" | Layer 3 (Structure) | Page structure, module relationships, grid |
| "Don't know why we're doing this" | Layer 1 (Goal) | Problem definition, users, success criteria |
| "Temperament is off" | Layer 6 (Brand) | Positioning, tone, emotion, memorable elements |
| "Can't scale" | Layer 7 (System) | Tokens, components, specs, governance |
| "Don't know if it's effective" | Layer 8 (Validation) | Testing, data, feedback, iteration |

---

### Layer Mapping: Existing Documents

| Design Layer | Corresponding Documents | Purpose |
|--------------|------------------------|---------|
| Layer 1: Goal | `junior-designer-mode.md`, `design-context.md`, `workflow.md` (Step 1) | Clarify problem, users, success criteria |
| Layer 2: Information | `design-excellence.md`, `content-guidelines.md`, `information-design-theory.md` | Filter, group, prioritize, hierarchy |
| Layer 3: Structure | `design-patterns.md`, `anti-patterns/layout.md`, `frontend-design.md` | Page structure, module division, layout |
| Layer 4: Interaction | `interactive-prototype.md`, `animation-best-practices.md`, `anti-patterns/interaction.md`, `interaction-design-theory.md` | Flow, feedback, states, error handling |
| Layer 5: Visual | `design-excellence.md`, `typography-design-system.md`, `anti-patterns/color.md`, `anti-patterns/typography.md`, `visual-design-theory.md` | Color, typography, layout, contrast |
| Layer 6: Brand | `design-styles.md`, `getdesign-loader.md`, `brand-emotion-theory.md` | Personality, tone, emotion, memory |
| Layer 7: System | `design-system-creation.md`, `typography-design-system.md`, `system-design-theory.md` | Componentization, documentation, systematization |
| Layer 8: Validation | `verification-protocol.md`, `verification.md`, `critique-guide.md`, `principle-review.md`, `design-checklist.md` | Testing, data, feedback, iteration |

**Review Document Mapping:**
- **Quick Review** (daily iteration): `critique-guide.md` (5-dimension scoring)
- **Principle Review** (final delivery): `principle-review.md` (10 principles Pass/Warning/Fail)
- **Automated Check** (every review): `design-checklist.md` (50+ binary checks)

---

## Relationship to Execution Workflow

**8-Layer Framework = Thinking Model** (what to think about)
**workflow.md = Execution Process** (how to execute)

Use them together:
- Follow workflow.md steps during execution
- Use 8-layer framework to check for missing considerations during decision-making
- Use 8-layer framework to locate problem layers during diagnosis
- Use layer priority to resolve conflicts

See the mapping table at the beginning of `workflow.md`.

---

## Remember

1. **8-Layer Framework**: Goal → Information → Structure → Interaction → Visual → Brand → System → Validation
2. **Dependency Relationships**: Upper layers determine lower layers, lower layers serve upper layers
3. **Conflict Resolution**: Goal > Information > Structure > Interaction > Visual > Brand
4. **Complete Process**: Design top-down, validate bottom-up
5. **Diagnostic Method**: Symptom → Locate layer → Check dependencies → Fix root cause

**The 8-layer framework is not a process, it's a thinking model.**
