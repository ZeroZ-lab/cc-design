# Knowledge Artifact Spec: Cognitive Interaction Framework for Knowledge-Driven Output

> **Scope:** Defines interaction density levels, animation intensity levels, content-type mapping, animation trigger rules, and cognitive quality criteria for knowledge-driven HTML output. Applies when the primary goal is **understanding** rather than **brand/marketing impression**.
>
> **When to load:** `knowledge-artifact` taskType, or any task where content is explanation/architecture/comparison/tutorial/analysis focused.
>
> **Cross-references:** `animation-best-practices.md` (easing, motion grammar), `interaction-design-theory.md` (Fitts/Hick, feedback), `information-design-theory.md` (cognitive load), `explainer-interaction-patterns.md` (state machine, dimming)

---

## 1. Interaction Density Levels

Quantifiable minimum for "how much interaction is enough." Select a level before building.

### Level 0: Static Information Page

- **When:** Extremely short content (< 300 words), data tables, reference lists.
- **Minimum:** No interaction required, but must have clear information hierarchy.
- **May skip JS entirely.**

### Level 1: Light Interaction

- **When:** Short explanations, brief reports, article structuring.
- **Minimum:** 1-2 interactions from: navigation jump, accordion/details, FAQ expand, card detail expand.

### Level 2: Standard Interaction (DEFAULT)

- **When:** Technical proposals, tool comparisons, tutorials, product explanations, reports, architecture walkthroughs.
- **Minimum:** 3-5 interactions, including at least one from each category:
  - **Navigation:** sticky TOC, progress bar, section highlight, back-to-top
  - **Expand:** accordion, card detail, "show mechanism/case/misconception" toggle
  - **Switch:** tabs, perspective toggle (user/system/engineering), mode toggle (simple/pro)
  - **Process:** stepper, timeline highlight, input-process-output chain

### Level 3: High-Interaction Knowledge Application

- **When:** Decision tools, scorecards, architecture analysis, learning path planners, data analysis, complex mechanism explanations.
- **Minimum:** 5+ interactions, including at least one dynamic computation or state change:
  - filter, sort, weight adjustment, score calculation, parameter simulation, recommendation update, dynamic path highlight, state machine toggle, node relationship changes.

---

## 2. Animation Intensity Levels

Select an intensity level based on content complexity. Each level has a minimum set of required components.

### A0: No Animation

- **When:** Extremely short content, simple summaries, information with no dynamic structure.
- **Required:** Nothing. Static layout only.

### A1: State Feedback

- **When:** Standard pages, short explanations.
- **Required:** At least: button active states, expand/collapse transitions, current step highlight, lightweight transitions.

### A2: Process Demonstration (DEFAULT)

- **When:** Workflows, mechanisms, tutorials, architectures.
- **Required (at least one):**
  - Step-by-step progression (Stepper)
  - Path highlighting
  - State change animation
  - Input-output flow
  - Stage switching
  - Current state explanation panel
- **Implementation:** CSS transitions for simple cases; `animations.jsx` (Stage+Sprite) or `flow_explainer.jsx` for complex flows.

### A3: Controllable Simulation

- **When:** Abstract mechanisms, decision reasoning, variable analysis.
- **Required (at least one):**
  - Parameter controls (sliders, inputs)
  - Dynamic computation with result update
  - Result feedback panels
  - Recommendation changes based on input
  - Weight adjustment with live score
  - Scenario switching
- **Implementation:** `flow_explainer.jsx` with custom interaction logic, or custom React components.

### A4: Interactive Explainer

- **When:** Transformer internals, RAG pipelines, database indexing, vector retrieval, complex system architectures, consensus algorithms.
- **Required (ALL of the following):**
  - Text explanation of current state
  - Dynamic diagram that responds to user input
  - User controls (prev/next/pause/reset)
  - State feedback (what changed, why)
  - Parameter variation support
  - Path highlighting
  - Misconception/boundary notes
  - Reset / prev / next navigation
- **Implementation:** `flow_explainer.jsx` as the primary template.

### Default Mapping by Content Type

| Content type | Animation intensity |
|-------------|-------------------|
| Concept explanation | A1-A2 |
| Workflow / process | A2 |
| Technical mechanism | A2-A3 |
| AI internals (Transformer, RAG, Agent) | A3-A4 |
| System architecture | A2-A3 |
| Decision reasoning | A3 |
| Teaching content | A2-A3 |
| Complex abstract concepts | A3-A4 |
| Tool comparison | A2 |
| Report / analysis | A1-A2 |

---

## 3. Animation Trigger Rules

Aggressive-by-default for knowledge content. Check the following dynamic cognitive structures:

### 3.1 Detection Checklist

Before building, scan content for these 10 structures. If ANY is present, animation is required (minimum A2).

| # | Structure | Examples | Required dynamic expression |
|---|-----------|----------|---------------------------|
| 1 | **Process** | RAG flow, Agent loop, ETL pipeline, user journey | Stepper, stage progression, path flow, I/O animation |
| 2 | **Change** | React state, cache hit/miss, token generation, context window | Before/After, state machine, timeline, current-state panel |
| 3 | **Causation** | Why indexing speeds queries, why agents hallucinate, risk propagation | Node highlight, path tracing, variable adjustment, result feedback |
| 4 | **Hierarchy** | Agent architecture, microservices, permission models, data lakehouse | Layer expand, module click, view switch, data/control/permission flow toggle |
| 5 | **Variables** | Pricing models, architecture trade-offs, learning path parameters | Sliders, weight adjustment, dynamic computation, scenario switching |
| 6 | **Paths** | Decision trees, user flows, navigation flows, branching logic | Path highlight, step progression, branch exploration |
| 7 | **Feedback loops** | Control systems, reinforcement learning, CI/CD pipelines | State feedback panel, result update, loop visualization |
| 8 | **Evolution** | Technology maturity, product lifecycle, concept history | Timeline, stage switching, evolution animation |
| 9 | **State transitions** | Database transactions, request lifecycle, queue states | State machine, current-state panel, transition animation |
| 10 | **Decision trade-offs** | Tech selection, architecture choices, priority planning | Scorecards, filters, recommendation updates, decision matrix |

### 3.2 Decision Flow

```
1. Scan content → hit any structure?
   YES → must use animation (min A2)
   NO  → A0 or A1 is acceptable

2. Identify content type
   → select default intensity from Section 2 mapping

3. Select implementation
   → A0-A1: CSS transition/transform
   → A2: animations.jsx or flow_explainer.jsx
   → A3-A4: flow_explainer.jsx + custom interaction

4. Verify necessity
   → Remove animation → does understanding degrade?
   → If NO → downgrade or remove
   → If YES → animation is justified
```

---

## 4. Static-only Ban

The following content categories MUST NOT use static-only expression (cards, tables, or diagrams without dynamic interaction):

1. AI model mechanism explanations
2. Dynamic mechanisms (Transformer / Attention / RAG / Agent loop)
3. Data flows, control flows, permission flows, workflows
4. Database queries, indexing, transactions, caching, message queues
5. System architecture layering and module collaboration
6. User paths, product flows, business processes
7. Causal analysis, risk propagation, strategy reasoning
8. Learning paths, course modules, teaching demonstrations
9. Tech selection, solution comparison, weight-based decisions
10. Any content containing: process, change, feedback, reasoning, or evolution

If content falls into any of these categories, the output must include at least one dynamic explanation module: Stepper, state progression, path highlighting, module click-to-inspect, parameter simulation, score calculation, animation demonstration, or dynamic feedback.

---

## 5. Content Type → Interaction & Animation Mapping

### Concept Explanation

- **Default density:** Level 2
- **Default animation:** A1-A2
- **Information structure:** Core definition → Mechanism model → Analogy → Common misconceptions → FAQ
- **Required interactions:** Overview/Mechanism/Analogy/Misconceptions tabs + FAQ accordion + concept card expand
- **If mechanism involves change:** add animation or state progression

### Technical Architecture

- **Default density:** Level 2
- **Default animation:** A2-A3
- **Information structure:** System goal → Architecture layers → Module responsibilities → Data flow → Control flow → Trade-offs
- **Required interactions:** Layer switching + module click-to-inspect + data/control/permission flow toggle + trade-off expand + path highlighting + module I/O explanation

### Tool Comparison

- **Default density:** Level 2
- **Default animation:** A2
- **Information structure:** Selection scenario → Core dimensions → Score table → Recommendation → Applicability boundaries
- **Required interactions:** Dimension switching + sort + filter + scorecard + recommendation area + weight adjustment + dynamic recommendation

### Teaching Content

- **Default density:** Level 2
- **Default animation:** A2-A3
- **Information structure:** Learning objectives → Concept ladder → Case demo → Practice tasks → Rubric
- **Required interactions:** Learning path Stepper + case switching + self-test questions + answer expand + rubric dimension expand + current stage feedback

### Strategic Analysis

- **Default density:** Level 3
- **Default animation:** A3
- **Information structure:** Situation assessment → Key variables → Risk map → Strategy paths → Action recommendations
- **Required interactions:** Decision matrix + risk level filter + priority switching + scenario tabs + variable weight simulation + strategy result dynamic update

### Data Analysis

- **Default density:** Level 2
- **Default animation:** A1-A2
- **Information structure:** Core metrics → Key findings → Trend explanation → Anomaly notes → Action recommendations
- **Required interactions:** Metric card switching + sort + filter + metric explanation expand + conclusion/evidence toggle + anomaly highlighting

### Product Explanation

- **Default density:** Level 2
- **Default animation:** A2
- **Information structure:** User pain points → Product mechanism → User path → Value proof → Usage scenarios
- **Required interactions:** User path Stepper + pain/solution/value toggle + scenario card expand + ROI simulation + user path state progression

### Report Page

- **Default density:** Level 2
- **Default animation:** A1
- **Information structure:** Executive summary → Key findings → Evidence chain → Risk assessment → Action recommendations
- **Required interactions:** Sticky TOC + evidence chain expand + key finding filter + action recommendation priority toggle + conclusion/evidence/risk perspective switching

---

## 6. Cognitive Information Structure

Knowledge-driven output should follow this 10-section information flow:

1. **Hero:** Topic + core conclusion + why it matters
2. **Core judgments:** 1-3 most important conclusions
3. **Structural model:** Flow diagram, hierarchy, architecture diagram, relationship graph, or matrix
4. **Layered explanation:** Key concepts, mechanisms, variables, paths
5. **Primary interaction module:** Carries the core explanation task -- NOT decorative. Must help users understand "what is happening and why."
6. **Animation/simulation module:** Presents process, change, causation, feedback, or reasoning
7. **Comparison / table / flow:** Solution differences, priorities, stages, pros/cons
8. **Practical advice:** Steps, strategies, checklists, usage recommendations
9. **Misconceptions / boundaries:** Inapplicable scenarios, risks, misunderstandings, limitations
10. **Summary:** Concise judgments forming a cognitive loop

### Primary Module Principle

The primary interaction/animation module (sections 5-6) is the most important element. It must:

- Carry the core explanation task (not just hover effects or decorative transitions)
- Allow users to understand "what is happening right now and why"
- Include text explanation for every animation state
- Be removable from the page only with loss of understanding (verification test)

---

## 7. Cognitive Quality Checklist

Apply these checks IN ADDITION to cc-design's existing `verification-protocol.md` and `exit-conditions.md`. Only for outputs with interaction or animation components.

### Understanding Effectiveness

- [ ] Hero section communicates topic and core conclusion within 10 seconds
- [ ] Every visual block has information gain (removing it would lose understanding)
- [ ] The page genuinely helps understanding, not just looks good

### Interaction & Animation

- [ ] Interaction density level is determined (Level 0-3) and minimum requirements met
- [ ] Animation intensity level is determined (A0-A4) and minimum components included
- [ ] At least one primary interaction/animation module exists
- [ ] Primary module carries the core explanation task (not decorative)
- [ ] Dynamic cognitive structures in content are identified and matched to appropriate expressions
- [ ] Static-only Ban is not violated

### Animation Quality

- [ ] User can control pace: prev/next/pause/reset available
- [ ] Every animation state has accompanying text explanation
- [ ] Animation expresses relationship, sequence, state, feedback, causation, or spatial change
- [ ] Removing animation would degrade understanding (justification test)

### Accessibility & Resilience

- [ ] Mobile does not depend on hover (tap alternative exists)
- [ ] Core content is readable when JavaScript is disabled
- [ ] `prefers-reduced-motion` is supported
- [ ] Important information is not conveyed by color/motion/graphics alone

### Cognitive Loop

- [ ] Information structure forms: conclusion → structure → mechanism → interactive exploration → practical advice → boundaries → summary
- [ ] Pure static card stacking is avoided (unless content is very short or user explicitly requested)
