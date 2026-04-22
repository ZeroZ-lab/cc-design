# Design Philosophy

> **Load when:** All design tasks (Tier 1 - always loaded)
> **Skip when:** Never skip - this is the worldview foundation of cc-design
> **Why it matters:** Establishes the foundation of design judgment, prevents spec stacking and style collage
> **Typical failure it prevents:** Unable to explain design decisions, blindly following trends, lacking design intuition

Design philosophy is the worldview foundation of cc-design. It explains "what design is", "why we do it this way", and "how to build judgment".

---

## The Essence of Design

### Design Is Not Decoration

Design is not about making things "look good". Decoration is superficial and optional; design is structural and essential.

**Decorative Thinking:**
- "Add a gradient to make it cooler"
- "Use this font because it's trendy"
- "Add more animations to look premium"

**Design Thinking:**
- "This gradient guides the eye to the CTA button"
- "This font conveys the brand's professionalism"
- "This animation provides operation feedback"

### Design Is Organized Action with Judgment

Design = Organizing the problem + Making judgments + Getting it right

1. **Organizing the problem**: Understand goals, users, constraints, priorities
2. **Making judgments**: Choose among multiple solutions, based on principles not preferences
3. **Getting it right**: Execute properly, details withstand scrutiny

Organization without judgment = information pile-up  
Judgment without organization = subjective speculation  
Judgment without execution = castles in the air

---

## cc-design's Core Beliefs

### 1. Content Over Form

**Belief:** Form serves content, not the other way around.

**Why:**
- Content is why users come, form is how content is conveyed
- First "what to say", then "how to say it"
- Form without content = empty visual games

**Application:**
- Organize information architecture first, then design visuals
- Don't force content into bento grid if it doesn't fit
- Remove decorative elements that don't carry information

**Exception:** Brand expression designs (art posters, concept showcases) can prioritize form

---

### 2. Problem Definition Over Solutions

**Belief:** Ask "why" first, then "how".

**Why:**
- Without goal definition, there's no real design, only decoration
- Wrong problem definition leads to failure even with correct execution
- Problem definition determines evaluation criteria

**Application:**
- P1 principle: Ask questions in batch for new tasks
- Junior Designer Mode: Write assumptions before building
- Before each design, answer: What problem does this solve? Who is it for?

**Exception:** Clear small changes ("change button to blue") can be executed directly

---

### 3. Context Over Convention

**Belief:** User's design system > general best practices.

**Why:**
- Consistency is more important than "correctness"
- User's existing system is their context
- Cost of breaking consistency > benefit of local optimization

**Application:**
- Read user's codebase first, copy hex/px values
- Follow user's naming conventions and component patterns
- Don't argue with "Material Design says it should be this way"

**Exception:** When user's system clearly violates usability (e.g., 12px body text), suggest improvements

---

### 4. Validation Over Assumptions

**Belief:** Validate with data and testing, don't rely on intuition.

**Why:**
- Designer's "feeling" is often wrong
- Unvalidated assumptions = risk
- Validation is the only way to learn and improve

**Application:**
- P0 principle: Fact validation (brand, product, pricing)
- Three-phase validation: Structure → Visual → Excellence
- Check console errors before screenshots
- Test with real content before delivery

**Exception:** Time-constrained prototyping can assume first, validate later

---

### 5. System Over Local

**Belief:** Overall consistency > local optimization.

**Why:**
- Locally brilliant but globally chaotic = failed design
- System thinking reduces cognitive load
- Consistency builds trust and predictability

**Application:**
- Use spacing scale (4/8/12/16/24/32/48/64), not random values
- Use type scale (1.25 ratio), not arbitrary font sizes
- 2-3 font weights, not 5
- Build design system, don't reinvent every time

**Exception:** Clear visual focus (hero section) can break rules

---

## Three Layers of Design Thinking

Complete design thinking includes three levels:

### Layer 1: Foundational Worldview (Overall Temperament)

**Definition:** Understanding of design essence, determines overall direction.

**Questions:**
- What is design for?
- What is good design?
- How to evaluate design?

**cc-design's Worldview:**
- Design is the process of organizing problems and getting them right
- Good design = clear + effective + consistent + sustainable
- Evaluation criteria = whether it solves the problem

---

### Layer 2: Module Principles (Local Thinking for Each Part)

**Definition:** Guiding principles for specific design domains.

**Questions:**
- How to organize information? (Information design)
- How to build structure? (Structure design)
- How to design interaction? (Interaction design)
- How to express visuals? (Visual design)
- How to embody brand? (Brand design)
- How to run the system? (System design)

**cc-design's Module Principles:**
- 8-layer design framework (see `design-thinking-framework.md`)
- 10 core principles (see `design-principles.md`)
- Theoretical foundations for each domain (see `*-design-theory.md`)

---

### Layer 3: Specific Methodology (Implementation Techniques)

**Definition:** Executable techniques and tools.

**Questions:**
- What tools to use?
- How to implement?
- What patterns exist?

**cc-design's Methodology:**
- 42 reference documents (execution guides)
- Design patterns library
- Anti-patterns checklist
- Templates and components

---

## Why Design Thinking Is Needed

### Design Without Thinking = Spec Stacking + Style Collage

**Symptoms:**
- Can say "Material Design specifies 8dp", can't say "why 8dp"
- Can imitate Apple style, can't say "why this feels like Apple"
- Can follow rules, can't make judgments
- Can execute, can't explain

**Consequences:**
- Unable to handle new problems (no rules to follow)
- Unable to make tradeoffs (don't know which is more important)
- Unable to innovate (can only copy)
- Unable to teach (can't pass on knowledge)

---

## How Design Thinking Is Tested

Good design thinking must pass these 4 tests:

### 1. Can Explain the Core Problem

**Test:**
- Can you explain in one sentence what problem this design solves?
- Can you describe who the target users are?
- Can you explain what change is expected?

**Pass:** Clear problem definition, clear users, clear goals  
**Fail:** "Make it look better", "More premium", "Follow trends"

---

### 2. Has Clear Priorities

**Test:**
- If you can only keep 3 elements, which 3?
- If you must sacrifice one aspect, which one?
- Why is A more important than B?

**Pass:** Can rank importance, can explain reasoning  
**Fail:** "Everything is important", "Can't remove anything"

---

### 3. Overall Consistency

**Test:**
- Does every decision serve the same goal?
- Are there contradictory elements?
- If you copy this design 10 times, will it be chaotic?

**Pass:** Unified direction, no contradictions, scalable  
**Fail:** Each part is good but doesn't fit together, style collage

---

### 4. Can Explain Tradeoffs

**Test:**
- Why choose A over B?
- What did you sacrifice?
- What would you change if you did it again?

**Pass:** Clear reasoning, aware of tradeoffs, can iterate  
**Fail:** "Because it looks good", "I just feel this way"

---

## The Value of Design Thinking

### 1. Guides Decisions

When facing choices, thinking provides judgment framework:
- Should I add this element? → Does it serve the goal?
- Should I break consistency? → Is the benefit worth the cost?
- Should I follow this trend? → Does it fit the context?

---

### 2. Builds Intuition

Thinking → Practice → Intuition:
- Beginners need to think through every step
- Experts have internalized thinking into intuition
- But intuition can still be explained with thinking

---

### 3. Teachable and Inheritable

With thinking, design becomes:
- Teachable: Can explain to juniors
- Reviewable: Can critique with criteria
- Inheritable: Team can maintain consistency
- Evolvable: Can improve based on principles

---

### 4. Can Evolve

Thinking is not fixed rules, but evolving framework:
- Principles can be adjusted based on context
- Methods can be optimized based on feedback
- System can grow based on needs
- But core beliefs remain stable

---

## Design Thinking Framework Overview

cc-design's design thinking is embodied in the **8-layer design framework**:

1. **Goal Layer**: Why do it → Problem, users, success criteria
2. **Information Layer**: What to say, how to say it → Filter, group, sequence, hierarchy
3. **Structure Layer**: Skeleton → Page structure, modules, layout system
4. **Interaction Layer**: How people use it → Operation flow, feedback, states, error handling
5. **Visual Layer**: How it looks → Color, typography, layout, contrast, whitespace
6. **Brand Layer**: What it feels like → Temperament, tone, trust, emotion
7. **System Layer**: How it runs long-term → Specs, components, reuse, extension
8. **Validation Layer**: Is it effective → Testing, data, feedback, iteration

**For details see:** `references/design-thinking-framework.md`

---

## How to Apply Design Philosophy

### Three Questions Before Design

1. **Why do it?** → Goal layer
2. **For whom?** → Goal layer + Information layer
3. **How to judge success?** → Validation layer

### Three Questions During Design

1. **What problem does this decision solve?** → Problem definition first
2. **Is it consistent with the whole?** → System first
3. **Is it verifiable?** → Validation first

### Three Questions After Design

1. **Can you explain the reasoning for each decision?** → Thinking test
2. **Are there clear priorities?** → Thinking test
3. **What would you change if you did it again?** → Iterative learning

---

## Relationship to Other Documents

- **design-thinking-framework.md**: Detailed expansion of the 8-layer framework
- **design-principles.md**: Specific application of 10 core principles
- **design-excellence.md**: Execution standards for visual design
- **content-guidelines.md**: Specific rules for content and anti-patterns
- **design-styles.md**: Philosophical foundation for 20 design schools
- **\*-design-theory.md**: Theoretical foundations for each layer

---

## Remember

1. **Design is not decoration**, it's organized action with judgment
2. **5 core beliefs**: Content>Form, Problem>Solution, Context>Convention, Validation>Assumption, System>Local
3. **3 layers of thinking**: Worldview → Module principles → Implementation techniques
4. **4 test criteria**: Core problem, priorities, overall consistency, tradeoff reasoning
5. **Value of thinking**: Guides decisions, builds intuition, teachable, evolvable

**Design philosophy is not rules, it's a judgment framework.**
