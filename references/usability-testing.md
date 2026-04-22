# Usability Testing Guide

**Purpose:** Complete guide to testing designs with real users to uncover usability problems, validate decisions, and measure user experience.

**Principle:** Testing with one user early is better than testing with 100 users too late. Usability testing is not optional — it's the difference between guessing and knowing.

---

## 1. Why Usability Testing Matters

### The Business Case

**Principle:** Testing reduces risk, saves money, and creates better products.**

**Impact:**
- **ROI:** Every $1 spent on usability returns $10-100 in benefits
- **Cost savings:** Fixing problems after launch costs 100x more than during design
- **Conversion:** Usability testing can increase conversion rates by 50-100%
- **Support:** Good usability reduces support tickets by 25-40%

**The reality:**
You are not your user. Your team is not your user. Without testing, you're designing based on assumptions — and assumptions are often wrong.

### When to Test

**Test early, test often:**

1. **Discovery (Before Design):** Understand user needs and current pain points
2. **Exploration (During Design):** Validate design directions and prototypes
3. **Validation (Before Launch):** Ensure usability and effectiveness
4. **Iteration (After Launch):** Monitor performance and uncover improvements

**Golden rule:** If you haven't tested, you don't know if it works.

---

## 2. Types of Usability Testing

### Moderated vs. Unmoderated

**Moderated Testing:**
- **What it is:** Facilitator guides participant through tasks in real-time
- **When to use:** Exploratory research, complex tasks, need rich feedback
- **Pros:** Deeper insights, can probe follow-up questions, observe body language
- **Cons:** More expensive, time-consuming, facilitator bias risk
- **Sample size:** 5-8 participants per user group

**Unmoderated Testing:**
- **What it is:** Participant completes tasks alone using online platform
- **When to use:** Large-scale validation, benchmarking, simple tasks
- **Pros:** Scalable, faster, cheaper, geographic flexibility
- **Cons:** Limited insights, no follow-up questions, higher dropout
- **Sample size:** 20+ participants for statistical significance

### In-Person vs. Remote

**In-Person:**
- **Pros:** Rich observational data (body language, facial expressions), controlled environment, can test physical products
- **Cons:** Expensive, geographic limitations, logistics overhead
- **Best for:** Early exploratory research, physical products, sensitive topics

**Remote Moderated:**
- **Pros:** Lower cost, geographic diversity, convenient for participants
- **Cons:** Less observational data, technical issues possible
- **Best for:** Most software testing, iterative validation

**Remote Unmoderated:**
- **Pros:** Highly scalable, fast results, asynchronous
- **Cons:** No probing, surface-level insights, higher no-show rates
- **Best for:** A/B testing, large-sample validation, benchmarking

### Qualitative vs. Quantitative

**Qualitative:**
- **Purpose:** Understand "why" users behave the way they do
- **Output:** Insights, patterns, quotes, video clips
- **Sample size:** 5-10 participants per user group (uncovers 80% of problems)
- **Analysis:** Thematic analysis, affinity diagramming

**Quantitative:**
- **Purpose:** Measure "what" users do at scale
- **Output:** Metrics, percentages, statistical significance
- **Sample size:** 20+ participants for metrics, 100+ for statistical power
- **Analysis:** Descriptive statistics, confidence intervals, significance testing

**Best practice:** Combine both approaches for the sharpest insights.

---

## 3. Planning a Usability Test

### Step 1: Define Research Questions

**Start with clear objectives.**

Good research questions are:
- **Specific:** Not "is it usable?" but "can users complete checkout in under 2 minutes?"
- **Answerable:** Can be answered with the chosen method
- **Actionable:** Results will inform design decisions
- **Focused:** 3-5 questions per study (not 20)

**Examples:**
- ❌ "Is the design good?"
- ✅ "Can new users create an account without help?"
- ✅ "Where do users get stuck in the checkout flow?"
- ✅ "Which navigation structure helps users find products faster?"

### Step 2: Choose the Method

**Match methods to questions:**

| Research Goal | Best Method |
|---------------|--------------|
| Understand why users struggle | Moderated testing (qualitative) |
| Measure task completion rates | Unmoderated testing (quantitative) |
| Compare two designs | A/B testing |
- Explore new product space | Moderated field studies or diary studies
| Benchmark over time | Unmoderated recurring testing |
| Test with many users quickly | Unmoderated large-N study |
| Deep dive into specific issues | Moderated interviews with tasks |

**Consider constraints:**
- Timeline (moderated takes longer)
- Budget (moderated costs more)
- Access to participants (some user groups are hard to recruit)
- Tools and expertise (do you have a lab? testing platform?)

### Step 3: Write Tasks

**Principle:** Tasks should be realistic, specific, and actionable.**

**Task template:**
```
[Scenario context]
[Action to take]
[Success criteria]
```

**Examples:**

✅ **Good task:**
```
"You're planning a weekend trip to San Francisco.
Find a hotel in downtown San Francisco for under $200/night,
and book it for Friday and Saturday nights."

Success: User completes booking without errors
```

❌ **Bad task:**
```
"Book a hotel"
```
(Too vague — no context, no criteria)

❌ **Bad task:**
```
"Click the 'Search' button, then enter 'San Francisco',
then select the dates from the calendar..."
```
(Too leading — tells user exactly what to do)

**Task best practices:**
- Use realistic scenarios (not "test the search feature")
- Provide context, not instructions
- Avoid leading language ("use the filter to find...")
- Test one thing per task
- Keep tasks under 5 minutes each
- 5-8 tasks per session (60 minutes)

### Step 4: Create Test Materials

**Essential materials:**

1. **Test Plan:**
   - Research questions and objectives
   - Method and timeline
   - Participant criteria (screening)
   - Tasks and scenarios
   - Success metrics

2. **Screening Questionnaire:**
   - Demographics (age, location, role)
   - Experience level (novice vs. expert)
   - Usage patterns (frequency, features used)
   - Technical setup (device, browser, internet)
   - Exclusion criteria (competitors, industry)

3. **Discussion Guide (for moderated):**
   - Introduction (2-3 minutes)
   - Warm-up questions (build rapport)
   - Tasks (30-40 minutes)
   - Debrief questions (10-15 minutes)
   - Closing (2-3 minutes)

4. **Consent Form:**
   - Purpose of research
   - What will be recorded (audio, video, screen)
   - How data will be used
   - Confidentiality guarantees
   - Right to withdraw
   - Contact information

5. **Prototype or Test Environment:**
   - Figma prototype (moderated)
   - Live staging site (unmoderated)
   - Working build (beta testing)
   - Paper sketches (early concept testing)

### Step 5: Recruit Participants

**Principle:** Recruit users who represent your target audience.**

**Recruitment channels:**
- **User database:** Existing customers or users
- **Recruitment agencies:** UserResearch.com, UserInterviews.com
- **Social media:** Targeted ads and posts
- **Referrals:** Current participants refer others
- **Intercept recruiting:** Approaching users in context (website popup)

**Screening criteria:**
- **Demographics:** Age, location, role, income (if relevant)
- **Experience:** Novice vs. expert users
- **Usage patterns:** Frequency, features used, workflows
- **Technical setup:** Device, browser, internet speed
- **Exclusions:** Competitors, industry, recent participants

**Incentives:**
- **Monetary:** $50-150 per session (varies by length and user type)
- **Gift cards:** Amazon, Visa, etc.
- **Product discounts:** Free months, credits
- **Early access:** Beta features, previews
- **Charity donation:** Donate to participant's choice

**Sample size guidance:**
- **Qualitative:** 5 participants per user group (uncovers 80% of problems)
- **Quantitative:** 20+ participants for metrics, 100+ for statistical significance
- **A/B testing:** 1,000+ participants per variant for statistical power
- **Card sorting:** 15-30 participants

**Overschedule:** 20-30% no-show rate is typical. Schedule 6-8 participants to get 5.

---

## 4. Conducting the Test

### Moderated Testing Session

**Session structure (60 minutes):**

1. **Introduction (5 min):**
   - Welcome and build rapport
   - Explain the process
   - Obtain consent
   - Set expectations ("you can't do anything wrong")

2. **Warm-up (5 min):**
   - Background questions
   - Current behaviors/solutions
   - Get comfortable talking

3. **Tasks (40 min):**
   - Present tasks one at a time
   - Use "think-aloud" method
   - Observe behavior, not just words
   - Probe follow-up questions ("why did you click there?")

4. **Debrief (10 min):**
   - Overall impressions
   - Likes and dislikes
   - Suggestions for improvement
   - Rank frustrations

**Facilitator best practices:**
- **Stay neutral:** Don't lead participants to answers
- **Probe deeper:** Ask "why" and "tell me more"
- **Watch body language:** Confusion, frustration, delight
- **Record everything:** Audio, video, notes (with consent)
- **Be flexible:** Follow interesting threads
- **Respect time:** End on schedule, even if tasks aren't finished

**Think-aloud method:**
Ask participants to narrate their thoughts:
> "I'm looking for the search bar... I don't see it... maybe it's in the menu? Oh, there it is. I'll search for 'San Francisco'..."

**Probing questions:**
- "What did you expect to happen?"
- "What are you looking for right now?"
- "Tell me more about that choice."
- "What would make this easier?"

### Unmoderated Testing Setup

**Platform options:**
- **UserTesting.com:** Large participant pool, video recordings
- **Maze:** Prototype testing, easy setup
- **Lookback:** Moderated and unmoderated options
- **Optimal Workshop:** Card sorting, tree testing
- **UserZoom:** Enterprise platform with many question types

**Test setup:**
1. Write tasks (same as moderated, but clearer instructions)
2. Set up the prototype or URL
3. Configure screening questions
4. Write post-task questions (SUS, NPS, open-ended)
5. Launch and monitor (check first 2-3 completions)
6. Close when target sample reached

**Unmoderated best practices:**
- Pilot test first (run through yourself)
- Include screening questions
- Keep tasks simple (no follow-up probing possible)
- Use video recordings (richer data than clicks)
- Include open-ended questions after each task
- Set a fair time limit (don't let participants struggle forever)

---

## 5. Measuring Usability

### Core Metrics

**Task Success Rate:**
```
Task Success Rate = (Number who completed task / Total who attempted) × 100%
```
- **Binary:** Complete vs. incomplete (strict)
- **Success levels:** Complete, partial success, failure (lenient)

**Time on Task:**
```
Average Time = Sum of all task times / Number who completed
```
- Measure from task start to success/failure
- Report median (not mean — outliers skew)
- Compare to expert time or benchmark

**Error Rate:**
```
Error Rate = (Number of errors / Number of opportunities for error) × 100%
```
- Click errors (wrong clicks)
- Recovery errors (couldn't recover from error)
- Task abandonment (gave up)

**Subjective Satisfaction:**
- **SUS (System Usability Scale):** 10-question survey, 0-100 scale
- **NPS (Net Promoter Score):** "How likely to recommend?" 0-10
- **CSAT (Customer Satisfaction):** "How satisfied?" 1-5 scale
- **Custom ratings:** "Easy to use?" 1-5 scale

### Task Success Benchmarks

**Industry benchmarks (percent success):**
| Task Type | Excellent | Good | Acceptable | Poor |
|-----------|-----------|------|------------|------|
| Simple task (1 step) | 100% | 95%+ | 90%+ | <90% |
| Moderate task (2-3 steps) | 95%+ | 85%+ | 75%+ | <75% |
| Complex task (4+ steps) | 85%+ | 70%+ | 50%+ | <50% |

**Time on task benchmarks:**
- Users should complete tasks in ~2x expert time
- If experts take 30 seconds, users should take <60 seconds

**SUS benchmarks:**
- **80+:** Excellent
- **68-80:** Good
- **50-68:** OK (needs improvement)
- **<50:** Poor (major problems)

---

## 6. Analyzing Results

### Quantitative Analysis

**Descriptive statistics:**
- Task success rates (percentage)
- Average time on task (median, range)
- Error rates (percentage)
- Satisfaction scores (mean, distribution)

**Comparative statistics (for A/B tests):**
- **Chi-square:** Compare success rates between designs
- **T-test:** Compare time on task between designs
- **Confidence intervals:** Report 95% CI for all metrics
- **Statistical significance:** p < 0.05 means difference is real, not chance

**Example reporting:**
> "Design A had a 78% success rate (CI: 72-84%) compared to Design B's 65% (CI: 59-71%), a statistically significant difference (χ²=4.2, p<0.05)."

### Qualitative Analysis

**Affinity Diagramming:**
1. Write each observation/quote on a sticky note
2. Group notes by theme (patterns emerge)
3. Label themes with concise descriptors
4. Identify insights and opportunities

**Thematic Analysis:**
1. **Open coding:** Tag data points with codes (e.g., "navigation confusion")
2. **Pattern recognition:** Group codes into themes
3. **Insight synthesis:** Identify "so what?" — what does this mean for design?
4. **Illustrate with quotes:** Support insights with direct quotes

**Common themes to look for:**
- Navigation problems ("I couldn't find...")
- Confusion about terminology ("What does X mean?")
- Missing features ("I wish I could...")
- Workflow issues ("I expected to...")
- Emotional reactions (frustration, delight, surprise)

### Prioritizing Findings

**Impact vs. Effort Matrix:**
```
High Impact, Low Effort → Fix immediately
High Impact, High Effort → Plan for next iteration
Low Impact, Low Effort → Quick wins (if time)
Low Impact, High Effort → Ignore (or deprioritize)
```

**Severity rating for usability issues:**
- **Critical:** Blocks task completion, affects all users
- **Serious:** Causes errors, frustration, workarounds
- **Minor:** Annoying but doesn't block task
- **Cosmetic:** Visual preference, no functional impact

**Frequency × Severity Matrix:**
- Fix issues that are critical + frequent first
- Then fix serious + frequent
- Then consider critical + rare (edge cases)

---

## 7. Reporting Findings

### Report Structure

**1. Executive Summary (1 page):**
- Key findings (3-5 bullet points)
- Recommendations (prioritized list)
- Business impact (metrics, quotes)

**2. Background:**
- Research questions and objectives
- Methods used (moderated vs. unmoderated, N=)
- Participants (who, how many)
- Timeline

**3. Findings:**
- Organized by theme or research question
- Support with data (quotes, metrics, video clips)
- Distinguish between critical and nice-to-have
- Use visuals (screenshots, clips, heatmaps)

**4. Recommendations:**
- Specific, actionable design changes
- Prioritized by impact and effort
- Aligned with business goals
- Include "quick wins" vs. long-term

**5. Appendices:**
- Detailed methodology
- Full transcript excerpts
- Screening criteria
- Test materials (tasks, consent form)

### Presentation Tips

**Start with insights, not methodology.**
- ❌ "We conducted a moderated usability study with 8 participants..."
- ✅ "8 out of 10 users couldn't complete checkout. Here's why..."

**Use video clips and quotes.**
- Show, don't just tell. A 30-second clip of a user struggling is more powerful than any statistic.

**Include stakeholders in analysis.**
- Invite team members to watch sessions
- Co-create recommendations with designers and developers
- Build buy-in through involvement

**Provide clear next steps.**
- What should we do first?
- What will we test next?
- What did we learn that changes our roadmap?

---

## 8. Common Usability Testing Mistakes

### 1. Testing Too Late

**Problem:** Testing after decisions are locked in.

**Solution:** Test early and often. Paper sketches > no testing.

### 2. Testing with the Wrong Users

**Problem:** Testing with colleagues, friends, or non-representative users.

**Solution:** Recruit participants who match your target user profile. Use screening criteria.

### 3. Leading Questions

**Problem:** "Don't you think the blue button is better?"

**Solution:** Use neutral language. "Which button did you prefer? Why?"

### 4. Testing the Script, Not the Design

**Problem:** Step-by-step instructions that tell users exactly what to do.

**Solution:** Provide scenarios, not instructions. Let users figure it out.

### 5. Ignoring Context

**Problem:** Testing in a lab that doesn't reflect real use (quiet, controlled).

**Solution:** Combine lab testing with field studies and remote testing.

### 6. Analysis Paralysis

**Problem:** Collecting data but not analyzing or acting on it.

**Solution:** Start analysis immediately after sessions. Report within 1 week.

### 7. Testing Without Action

**Problem:** Findings sit in reports but don't influence design.

**Solution:** Involve stakeholders in testing. Present actionable recommendations. Track implementation.

---

## 9. A/B Testing

### When to Use A/B Testing

**Principle:** A/B testing compares two designs to measure which performs better.**

**Use A/B testing for:**
- Validating design changes (new vs. old)
- Testing specific elements (headline, CTA, layout)
- Optimizing conversion rates (sign-ups, purchases)
- Settling debates within the team
- Measuring incremental improvements

**Don't use A/B testing for:**
- Exploratory research (use qualitative methods)
- Understanding "why" (use moderated testing)
- Testing radically different concepts (use concept testing)
- Making major strategic decisions (use broader research)

### A/B Testing Process

**1. Define hypothesis:**
```
"If we change the CTA button from green to orange,
then click-through rate will increase by 10%."
```

**2. Determine sample size:**
- Use power analysis calculators
- Typical: 1,000+ participants per variant
- More participants = smaller detectable effect

**3. Random assignment:**
- 50% see Design A, 50% see Design B
- Ensure randomization works (no bias)

**4. Run the test:**
- Run for at least 1-2 weeks (capture weekly patterns)
- Don't stop early (peeking invalidates results)
- Monitor for bugs or unexpected issues

**5. Analyze results:**
- Calculate statistical significance (p < 0.05)
- Calculate confidence intervals
- Report effect size (not just significance)

**6. Make a decision:**
- If significant: Implement winner
- If not significant: Keep current or test something else
- Document learning for future tests

### A/B Testing Best Practices

- **Test one thing at a time:** Don't change headline + CTA + layout all at once
- **Use statistical significance:** Don't make decisions based on noise
- **Run long enough:** Capture weekly patterns (don't run Friday-Monday)
- **Segment your data:** Results may differ by user type, geography, device
- **Document everything:** Hypothesis, sample size, results, learning
- **Don't stop early:** Peeking at results before test ends invalidates statistics

---

## 10. Rapid Testing Methods

### Guerrilla Testing

**What it is:** Quick, informal testing with whoever is available (café, conference, hallway).

**When to use:**
- Early concept validation
- Low-risk design questions
- Extremely limited budget/time
- Exploratory research

**How to do it:**
1. Create a simple prototype (paper, Figma, working build)
2. Go where users are (café, campus, event)
3. Ask 5-10 minutes of their time
4. Offer small incentive (coffee, gift card)
5. Ask 3-5 key questions

**Pros:** Fast, cheap, flexible
**Cons:** Not representative, small sample, no screening

### hallway Testing

**What it is:** Testing with colleagues who are not on the project.

**When to use:**
- Sanity check before user testing
- Catch obvious issues
- Get quick feedback

**How to do it:**
1. Grab someone from a different team
2. Give them a task
3. Watch where they struggle
4. Take notes (don't coach)

**Pros:** Very fast, free, catches major issues
**Cons:** Not representative, biased (too familiar with tech)

### 5-Second Tests

**What it is:** Users see a design for 5 seconds, then answer questions.

**When to use:**
- Test first impressions
- Test clarity of value proposition
- Test visual hierarchy

**How to do it:**
1. Show design for 5 seconds
2. Hide it
3. Ask: "What do you remember?" "What can you do here?"
4. Analyze what stood out

**Pros:** Very fast, tests first impressions
**Cons:** Limited depth, doesn't test interaction

---

## 11. Usability Testing Tools

### Moderated Testing Platforms
- **Zoom/Skype:** Screen sharing + recording (free/cheap)
- **Lookback:** Moderated remote testing with recording
- **UserTesting.com:** Both moderated and unmoderated options

### Unmoderated Testing Platforms
- **UserTesting.com:** Large participant pool, video recordings
- **Maze:** Prototype testing, easy setup
- **UserZoom:** Enterprise platform with many question types
- **TryMyUI:** Smaller platform, good value

### Card Sorting and Tree Testing
- **Optimal Workshop:** Industry standard for card sorting
- **UserZoom:** Includes card sorting and tree testing
- **Maze:** Basic card sorting features

### Analytics and Heatmaps
- **Hotjar:** Heatmaps, session recordings, feedback polls
- **Crazy Egg:** Heatmaps and click tracking
- **FullStory:** Session replay and conversion analytics

### Analysis and Reporting
- **Miro/Lucidchart:** Affinity diagramming
- **Excel/Google Sheets:** Quantitative analysis
- **Dovetail:** Research repository and analysis
- **Notion:** Research planning and documentation

---

## 12. Quick Checklist

### Planning
- [ ] Define clear research questions
- [ ] Choose appropriate method
- [ ] Write realistic tasks
- [ ] Create screening criteria
- [ ] Prepare test plan and materials
- [ ] Create consent forms

### Recruitment
- [ ] Determine sample size (5-8 for qualitative, 20+ for quantitative)
- [ ] Choose recruitment channel
- [ ] Set incentives
- [ ] Schedule participants (overschedule by 20-30%)

### Execution
- [ ] Pilot test materials
- [ ] Conduct test sessions
- [ ] Record sessions (with consent)
- [ ] Take detailed notes

### Analysis
- [ ] Transcribe recordings (if needed)
- [ ] Code and categorize data
- [ ] Calculate metrics (success rate, time on task, satisfaction)
- [ ] Identify patterns and insights
- [ ] Prioritize findings by severity and frequency

### Reporting
- [ ] Create executive summary
- [ ] Illustrate with video clips and quotes
- [ ] Provide actionable recommendations
- [ ] Present to stakeholders
- [ ] Archive research for future reference

---

## Further Reading

- **NN/g:** Usability Testing 101: https://www.nngroup.com/articles/usability-testing-101/
- **Jakob Nielsen:** Why You Only Need to Test with 5 Users: https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/
- **Rolf Molich:** What Does a Usability Test Cost?: https://www.dialogdesign.dk/cost-usability-test/
- **Krug, Steve:** Rocket Surgery Made Easy (Book)
- **Ruby, Laura:** Handbook of Usability Testing (Book)

---

**Remember:** Testing early is better than testing late. Testing with one user is better than testing with none.

**You are not your user. The only way to know if your design works is to test it.**
