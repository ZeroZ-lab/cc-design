# CEO Scout Feedback: Explainer Extensions v0.2

Date: 2026-05-11
Reviewer: CEO Idea Scout
Input: `01-spec.md` + `external-scan-results.md`

---

## Verdict

**Important** -- The idea is valid and the differentiation is real, but the current v0.2 scope (3 templates simultaneously) is too wide for the evidence available. One template should be prioritized first, the other two deferred until the first proves demand.

---

## Evidence Used

- **local:** cc-design v0.6.0 has a single explainer template (`flow_explainer.jsx`, 1256 lines). No user feedback data on flow_explainer adoption or usage frequency was found in the repo. The `interactive-explainer` taskType currently maps to exactly 1 template, with no indication of how often it is triggered vs. other taskTypes.
- **external:** Baymard (F-03): 72% of e-commerce sites offer comparison, 68% want "differences only" toggle. NN/g (F-04): 5-7 column max, 3-4 optimal. React Flow has 1M+ weekly downloads (F-13). Distill.pub, ciechan.dev, The Pudding are gold-standard explainer references (F-27, F-28, F-25). No existing tool covers "NL input -> structured explainer types -> self-contained HTML" (I-12). Competitive positioning table confirms the gap is real.
- **inferred:** The spec claims 80% infrastructure code reuse. This is plausible given shared animation/dimming/responsive/state-machine frameworks, but the three templates have fundamentally different interaction models (dimension switching vs. path highlighting vs. layer expand/collapse), meaning the "custom" portion per template is significant and non-trivial. The ~3600 line estimate (3 x ~1200 lines, matching flow_explainer) understates the real cost because each template also needs its own layout algorithm, SVG overlay logic, mobile layout transformation, and example data -- none of which are trivially shared.

---

## Findings

### [Blocking] -- None

The idea is not fundamentally flawed. No blocking issues identified.

### [Important]

1. **Problem realness is uneven across the three templates.**
   - Compare Explainer has the strongest evidence: Baymard's 72% e-commerce comparison rate, NN/g cognitive overload research, and the clear pain point of "static tables don't explain why differences matter" (local + external). This is a real, frequent, well-documented need.
   - Decision Tree Explainer has weaker evidence: no UX study on full-tree vs. stepper (U-04), no tree-depth comprehensibility data (U-05), and the pain point ("people get lost in branches") is plausible but unquantified. The external scan found dtreeviz and react-d3-tree exist, but they serve ML practitioners, not the spec's target audience (product teams, GTM, tech writers) (inferred).
   - Layer Explainer has moderate evidence: architecture diagrams are common, the click-to-expand pattern is validated by Structurizr and C4 model (external). But the spec's target (PM explaining microservice architecture) is a narrower persona. No UX study on animated flow lines vs. static arrows (U-07) (inferred). The threshold for "when does a 2-layer diagram not need interaction?" is unknown (U-08).

2. **Priority should be Compare first, not all three simultaneously.**
   - Compare has the highest demand signal (Baymard data + SaaS pricing page ubiquity). It also has the simplest interaction model (dimension switch + hover) and the most direct value proposition ("see why X beats Y, not just what differs").
   - Building Compare first validates the shared framework (entering/ready state machine, dimming, responsive breakpoints) with real users before committing to the more complex interaction models of Decision Tree and Layer.
   - Shipping all three at once doubles the QA surface (19 acceptance criteria across 3 templates), triples the template maintenance burden, and risks a "v0.2 that has breadth but no depth" perception. One well-polished Compare Explainer that users love is worth more than three half-tested templates.

3. **The ~3600 line cost estimate is understated.**
   - flow_explainer.jsx is 1256 lines but its interaction model is simple (step-through with focus sets). Compare adds dimension switching with cross-item connections. Decision Tree adds BFS layout + path highlighting + conclusion display. Layer adds expand/collapse transitions + animated inter-layer flow lines. Each of these adds non-shared complexity.
   - True cost is likely 3 x 1400-1600 lines = 4200-4800 lines of template code, plus updates to 6 existing files (VERSION, load-manifest, SKILL.md, exit-conditions, interaction patterns, node-graph visuals). Total delta: ~5000+ lines across 9 files.
   - For a team of 1-2 maintainers (this is a Claude Code plugin, not a VC-funded startup), the ROI of simultaneous delivery is questionable. Sequential delivery (Compare in v0.2, Decision Tree in v0.3, Layer in v0.4) spreads risk and allows user feedback to shape the subsequent templates.

4. **Success criteria are verification-friendly but not validation-friendly.**
   - The spec defines clear acceptance criteria (19 items) that verify *functionality works correctly*.
   - But none of the criteria validate *users actually need this*. The schema-follow-rate metric (>= 2/3 across 3 prompts) tests AI generation quality, not user demand. There is no metric for: "how many users chose interactive-explainer taskType this month?" or "what percentage of explainer outputs used Compare vs. flow?" Without demand data, v0.2 could ship 3 templates that nobody uses differently from flow_explainer.
   - MVP north-star should be: "at least N users generate a Compare Explainer that they would not have been able to produce with flow_explainer alone." This requires a qualitative difference that flow_explainer cannot approximate.

5. **Competitive differentiation is real but fragile.**
   - The external scan correctly identifies that no tool covers "NL -> structured explainer types -> single HTML" (I-12). This is cc-design's genuine gap.
   - But the gap exists because cc-design is a Claude Code plugin serving a niche workflow. V0, Bolt.new, and Lovable serve broader markets and could add template types easily if demand emerges. Claude Artifacts is the closest analog and already generates self-contained HTML -- adding "comparison template" detection is a trivial product decision for Anthropic.
   - The differentiation is fragile because it depends on cc-design's Claude Code integration advantage. If Claude Code itself adds structured output templates (which is architecturally simple), cc-design's explainer templates become redundant. This is not a current risk, but it is a strategic dependency that should inform scope restraint: ship less, faster, to establish the pattern before the platform catches up.

### [Suggestion]

1. **Rename v0.2 to focus on Compare only.** Ship `compare_explainer.jsx` as v0.2, with the shared framework refinements (entering/ready state machine generalization, dimming strategy codification). Decision Tree and Layer become v0.3 and v0.4 respectively, each with its own VERSION bump and user feedback cycle.

2. **Add a demand-validation metric to exit conditions.** Before shipping Decision Tree and Layer, require at least 3 user-generated Compare Explainer instances (from different users/prompts) that demonstrate the Compare template solved a problem flow_explainer could not. This is the minimum evidence that the template-type differentiation matters in practice.

3. **The spec's "不做" list is well-disciplined.** The exclusion of timeline, drag editors, dark mode, search/filter, and cross-template composition is correct. Do not let the external scan's rich pattern catalog (P-01 through P-38) inflate scope. The Reject recommendations (R-01 through R-14) are sound -- keep them enforced.

4. **Decision Tree's "full-tree always-visible" design may not be the right default.** The external scan found P-17 (step-through stepper) as a viable alternative, and U-04 notes no UX study compares the two. For the spec's target audience (GTM teams, tech writers), a guided stepper may be more effective than a full tree, because these users want to *walk someone through a decision*, not *browse a tree*. Consider making stepper the primary mode and full-tree the secondary, rather than the spec's current reverse arrangement.

5. **Layer Explainer's "click to expand" interaction is well-chosen but the spec under-specifies the expand/collapse transition.** The 300ms expoOut is noted, but the spec does not address: what happens to inter-layer flow lines when a layer is collapsed? Do they animate out? Do they persist as ghost lines? This interaction detail determines whether the Layer Explainer feels cohesive or jarring. Resolve before implementation.

---

## Spec Impact

- **adopt:**
  - Compare Explainer as the sole v0.2 template
  - Shared framework refinements (state machine, dimming, responsive breakpoints) as part of Compare delivery
  - Demand-validation metric as a gate for v0.3/v0.4
  - The spec's "不做" list and Reject recommendations (R-01 through R-14) -- all well-disciplined, keep them

- **reject:**
  - Simultaneous delivery of all 3 templates in v0.2
  - Decision Tree's "full-tree as primary, stepper as secondary" default (invert for the target audience)
  - The claim of "80% infrastructure code reuse" without evidence -- track actual reuse percentage during Compare implementation

- **ask user:**
  - Has flow_explainer been used by real users since v0.1 shipped? How many instances generated? What feedback received?
  - Is the v0.2 timeline driven by user demand signals or by an internal completeness aspiration?
  - Would the user accept a sequential delivery plan (Compare -> Decision Tree -> Layer) with demand gates between versions?