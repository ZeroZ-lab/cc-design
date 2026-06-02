# UX Writing Guide

**Purpose:** Complete guide to writing clear, concise, and user-centered interface text that guides users through digital products.

**Principle:** Every word serves a purpose. Good UX writing is invisible — users complete tasks without noticing the text.

---

## 1. Why UX Writing Matters

### The Business Impact

**Principle:** Words are the interface. Poor writing = confused users = support tickets + abandoned tasks.**

**Impact:**
- **Task completion:** Clear instructions increase success rates by 30-50%
- **Support reduction:** Well-written help text reduces tickets by 25%
- **Brand perception:** Tone of voice shapes user trust
- **Accessibility:** Clear language helps users with cognitive disabilities

**The reality:**
Users don't read — they scan. If your text requires careful reading, users will miss it. Write for scanning, not comprehension.

---

## 2. Core Principles

### Clarity First

**Principle:** Use simple, direct language. No jargon, no metaphors, no marketing fluff.**

```
❌ Bad: "Leverage our synergistic solution to optimize your workflow"
✅ Good: "Work faster with automated tasks"

❌ Bad: "Please authenticate your credentials to proceed"
✅ Good: "Sign in to continue"
```

**Rules:**
- Write for a 12-year-old reading level (Flesch-Kincaid Grade 6-8)
- Use familiar words (avoid "utilize", "leverage", "facilitate")
- One idea per sentence
- Active voice, not passive

### Conciseness

**Principle:** Delete every word that doesn't add meaning.**

```
❌ Bad: "In order to be able to access your account, you will need to enter your password"
✅ Good: "Enter your password to sign in"

❌ Bad: "Click on the button below in order to submit"
✅ Good: "Submit"
```

**Techniques:**
- Remove "please" (it's not polite, it's noise)
- Remove "in order to" → "to"
- Remove "click on" → just use the action verb
- Remove "that", "very", "really"
- Cut sentence length in half, then cut again

### Conversational But Professional

**Principle:** Write like a human, not a corporation.**

```
❌ Bad: "The system has encountered an unexpected error condition"
✅ Good: "Something went wrong. Try again."

❌ Bad: "Thank you for your patience while we process your request"
✅ Good: "Processing..."
```

**Tone guidelines:**
- Direct: "Save changes" (not "Would you like to save?")
- Human: "We'll email you when it's ready" (not "An email notification will be sent")
- Confident: "Delete" (not "Are you sure you want to delete?")
- Empathetic: "Sorry, we couldn't find that" (not "Error 404")

---

## 3. Writing for Specific UI Elements

### Buttons and CTAs

**Principle:** Start with a verb. Be specific about what happens.**

```
✅ Good: "Create account"
✅ Good: "Download report"
✅ Good: "Save changes"
✅ Good: "Continue to payment"

❌ Bad: "Submit"
❌ Bad: "OK"
❌ Bad: "Click here"
❌ Bad: "Yes"
```

**Button text rules:**
- Use specific action verbs (Create, Download, Save, Continue)
- Match the button text to the result
- Keep it under 15 characters (mobile)
- Title case for major actions, sentence case for minor
- No periods at the end

### Error Messages

**Principle:** Explain what went wrong + how to fix it. Never show technical jargon.**

```
❌ Bad: "Error 404: Resource not found"
❌ Bad: "Validation failed: field.email.format"
❌ Bad: "Invalid input"

✅ Good: "Email must include @ symbol (like you@example.com)"
✅ Good: "Password is too short. Use 8+ characters."
✅ Good: "That email doesn't match our records. Try again or create an account."
```

**Error message structure:**
1. **What happened:** "Password is too short"
2. **Why it matters:** "We need 8+ characters for security"
3. **How to fix:** "Add 3 more characters"

**Best practices:**
- Don't blame the user ("You entered..." → "Email must...")
- Show the error near the problem (inline, not popup)
- Use red + icon for emphasis
- Preserve user input (don't clear forms)

### Success Messages

**Principle:** Confirm what happened + what happens next.**

```
✅ Good: "Settings saved"
✅ Good: "Message sent! We'll reply within 24 hours."
✅ Good: "Your account is ready. Start exploring!"

❌ Bad: "Operation successful"
❌ Bad: "The request has been processed"
```

**Success message rules:**
- Be specific about what happened
- Tell users what's next (if relevant)
- Use checkmark icon
- Auto-dismiss after 3-5 seconds
- Don't interrupt workflow (no modals for non-critical success)

### Empty States

**Principle:** Explain why it's empty + what to do next.**

```
✅ Good:
"No notifications yet"
We'll let you know when something important happens.
[Check back later]

✅ Good:
"No search results"
Try different keywords or clear filters
[Clear filters]
```

**Empty state structure:**
1. **Headline:** Clear, empathetic (not "No results")
2. **Explanation:** Why is it empty?
3. **Action:** What can users do?
4. **Illustration:** Optional, adds personality

### Headlines and Titles

**Principle:** Describe the page/task, not the UI element.**

```
❌ Bad: "Settings Page"
❌ Bad: "Dashboard View"
❌ Bad: "User Profile Form"

✅ Good: "Account settings"
✅ Good: "Your activity"
✅ Good: "Edit your profile"
```

**Headline rules:**
- Use sentence case (not Title Case)
- Focus on user's goal, not the page name
- Keep it under 50 characters
- No punctuation at the end (except ?)

### Labels and Instructions

**Principle:** Labels above fields. Instructions only when needed.**

```
✅ Good:
Password *
[__________________________]
Must be 8+ characters with 1 number

✅ Good:
Search
[__________________________]  🔍
```

**Label rules:**
- Place labels above fields (2024+ standard)
- Use specific nouns (Email, not "Your email")
- Mark required fields with * (or state "All fields required")
- Add format hints in placeholders (you@example.com)
- Don't repeat label in placeholder

---

## 4. Tone of Voice

### Defining Your Brand's Voice

**Principle:** Consistent tone builds trust. Define it, document it, use it.**

**Tone dimensions:**
1. **Formal vs. Casual:** How professional vs. friendly?
2. **Direct vs. Gentle:** How blunt vs. soft?
3. **Serious vs. Playful:** How serious vs. fun?

**Examples:**

| Brand | Formal/Casual | Direct/Gentle | Serious/Playful |
|-------|--------------|--------------|----------------|
| Bank | Formal | Gentle | Serious |
| Startup | Casual | Direct | Playful |
| Healthcare | Semi-formal | Gentle | Serious |
| Gaming app | Casual | Direct | Playful |

**Sample phrases by tone:**

```
Formal: "Please sign in to access your account"
Casual: "Sign in to get started"

Direct: "Delete account"
Gentle: "We're sorry to see you go"

Serious: "Security alert"
Playful: "Oops! Something went wrong"
```

### Consistency Guidelines

**Principle:** Create a style guide and stick to it.**

**Document:**
- Greetings: "Hi [name]" vs "Hello [name]" vs no greeting
- Pronouns: "we" vs "the app" vs passive voice
- Contractions: "don't" vs "do not"
- Exclamation marks: Use sparingly (1-2x per page max)
- Emojis: Only for specific contexts (onboarding, celebrations)

**Example style guide:**
```
Greeting: "Hi [name]"
Pronouns: "we" for actions, "you" for user actions
Contractions: Yes (don't, won't, you're)
Exclamation marks: Only for success states
Emojis: Only in onboarding and celebrations
```

---

## 5. Writing for Different Contexts

### Onboarding

**Principle:** Welcome + value + quick start. Keep it brief.**

```
✅ Good:
"Welcome to [Product]!
Get started in 3 steps:
1. Connect your data
2. Set your preferences
3. Explore insights

[Get started] [Skip tour]
```

**Onboarding rules:**
- Show value immediately (what users can do)
- Keep it under 5 steps
- Always allow skipping
- Use progress indicators
- Celebrate completion

### Notifications

**Principle:** Timely, relevant, actionable.**

```
✅ Good: "Jane mentioned you in #design"
✅ Good: "Your meeting starts in 5 minutes"
✅ Good: "Password expires tomorrow. Update now?"

❌ Bad: "New notification"
❌ Bad: "System message"
```

**Notification rules:**
- Say who/what (Jane mentioned you)
- Say why it matters (in #design)
- Make it actionable (Reply, View)
- Group similar notifications
- Allow dismissal

### Confirmations and Warnings

**Principle:** Distinguish between "ask every time" and "warn once".**

```
✅ Good (Ask every time):
"Delete this item?"
This can't be undone.
[Cancel] [Delete]

✅ Good (Warn once):
"This will delete all items in this group"
[Got it]

❌ Bad: "Are you sure?" (Too vague)
```

**Confirmation rules:**
- Explain consequences clearly
- Use destructive button color for dangerous actions
- Require explicit action (no pre-checked checkboxes)
- Remember user preference for "don't ask again"

### Tooltips and Help Text

**Principle:** Progressive disclosure — show info when needed, not before.**

```
✅ Good:
"What's this?"
[Hover/click for help]
→ "This setting controls who can see your profile"
```

**Help text rules:**
- Hide by default (show on hover/click)
- Keep it under 140 characters
- Link to full documentation if needed
- Don't repeat what's already on screen
- Use "?" icon, not "Help"

---

## 6. Accessibility in Writing

### Cognitive Accessibility

**Principle:** Simple language helps everyone, not just users with disabilities.**

**Guidelines:**
- Write at 6th-8th grade reading level
- Use short sentences (15 words max)
- Avoid abbreviations (use "January" not "Jan")
- Explain acronyms on first use
- Use consistent terminology
- Provide examples for complex concepts

### Screen Reader Compatibility

**Principle:** Screen readers announce text in order. Structure matters.**

```
❌ Bad: "Required field *" (Screen reader: "Required field star")
✅ Good: "Required field" + aria-required="true"

❌ Bad: Icon button with no label
✅ Good: <button aria-label="Close search">✕</button>
```

**Best practices:**
- Use semantic HTML (labels, headings, ARIA)
- Don't rely on visual cues alone (color, icons)
- Write descriptive alt text for images
- Provide text alternatives for icons
- Test with screen reader (NVDA, VoiceOver)

### Multilingual Support

**Principle:** Write for translation from day one.**

**Guidelines:**
- Avoid idioms ("break a leg", "piece of cake")
- Avoid metaphors ("white glove", "silver bullet")
- Avoid culture-specific references
- Keep text short (translation expands 20-30%)
- Use placeholders for dynamic content: "Hi {name}"
- Provide context for translators

**Example:**
```
❌ Bad: "It's raining cats and dogs" (idiom, won't translate)
✅ Good: "It's raining heavily"

❌ Bad: "Save $50!" (symbol, position varies by language)
✅ Good: "Save {amount}" (placeholder)
```

---

## 7. Microcopy Patterns

### Loading States

**Principle:** Show progress + estimated time + something interesting.**

```
✅ Good: "Searching 10,000 items..."
✅ Good: "This usually takes 10 seconds"
✅ Good: "Downloading your data (50%)"

❌ Bad: "Loading..."
❌ Bad: "Please wait"
```

**Loading state tips:**
- Show what's happening (not just "Loading")
- Show progress bar for >3 second operations
- Provide time estimates when possible
- Use skeleton screens for content (better than spinners)
- Add personality for long waits ("Brewing coffee...")

### Progress Indicators

**Principle:** Always show where users are in a process.**

```
✅ Good: "Step 2 of 4: Add payment method"
✅ Good: "50% complete"

❌ Bad: No progress indication
```

**Progress rules:**
- Show total steps (e.g., "Step 2 of 4")
- Show progress bar for multi-step processes
- Allow navigation back to previous steps
- Hide future steps if >7 (group them)

### Calls to Action

**Principle:** Create urgency without pressure.**

```
✅ Good: "Get started — it's free"
✅ Good: "Limited time: 50% off"
✅ Good: "Join 10,000+ users"

❌ Bad: "Sign up now!!!!" (too many exclamation marks)
❌ Bad: "Don't miss out" (vague)
```

**CTA best practices:**
- Lead with benefit, not feature ("Save time" not "Time-saving tool")
- Create urgency when genuine ("Today only" not limited-time fake urgency)
- Show social proof ("Join 10,000+ users")
- Keep it under 25 characters
- Use action verbs (Get, Start, Join, Save)

---

## 8. Common UX Writing Mistakes

### 1. Over-Explaining

**Problem:** Writing paragraphs when 5 words will do.

**Solution:** Cut text by 50%, then cut again.

### 2. Being Too Clever

**Problem:** Using puns, jokes, or references that confuse users.

**Solution:** Clarity > cleverness. Humor is a bonus, not a requirement.

### 3. Blaming the User

**Problem:** "You entered an invalid email"

**Solution:** "Email must include @ symbol" (focus on the problem, not the user)

### 4. Technical Jargon

**Problem:** "Authentication failed", "404 error", "Null pointer exception"

**Solution:** Translate to user language ("Sign in failed", "Page not found", "Something went wrong")

### 5. Vague CTAs

**Problem:** "Submit", "Click here", "Learn more"

**Solution:** Specific actions ("Create account", "Download guide", "See pricing")

### 6. Inconsistent Terminology

**Problem:** "Log in" vs "Sign in" vs "Login"

**Solution:** Create a terminology guide and stick to it.

### 7. Wall of Text

**Problem:** Long paragraphs, no formatting, hard to scan.

**Solution:** Break into bullets, use bolding, keep paragraphs under 3 lines.

---

## 9. Writing Process

### Step 1: Understand the Context

**Ask:**
- What is the user trying to do?
- What do they already know?
- What might confuse them?
- What's the consequence of errors?

### Step 2: Draft Quickly

**Write:**
- Don't edit while drafting
- Focus on getting the message down
- Use plain language
- Write in active voice

### Step 3: Edit Ruthlessly

**Checklist:**
- [ ] Cut word count by 50%
- [ ] Remove jargon and metaphors
- [ ] Use active voice
- [ ] Start buttons with verbs
- [ ] Make errors specific and actionable
- [ ] Check reading grade level (aim for 6-8th)

### Step 4: Test with Users

**Methods:**
- Usability testing: Do users understand the text?
- A/B testing: Which version performs better?
- Readability tests: Flesch-Kincaid grade level
- Accessibility tests: Screen reader compatibility

### Step 5: Iterate

**Monitor:**
- Support tickets (what are users asking about?)
- Error rates (where do users get stuck?)
- Completion rates (do users abandon tasks?)
- Feedback (what do users complain about?)

---

## 10. Quick Reference

### Button Text
- Use specific verbs (Create, Save, Continue)
- Under 15 characters
- No periods
- Title case for major actions

### Error Messages
- What happened + how to fix
- No technical jargon
- Inline, near the problem
- Red + icon

### Success Messages
- What happened + what's next
- Specific, not generic
- Checkmark icon
- Auto-dismiss

### Headlines
- Sentence case
- Describe the task, not the page
- Under 50 characters
- No punctuation

### Tone
- Direct and human
- No corporate speak
- Consistent across product
- Documented in style guide

### Accessibility
- 6th-8th grade reading level
- Short sentences (15 words max)
- Screen reader compatible
- Translation-ready

---

## Further Reading

- **NN/g:** UX Writing Articles: https://www.nngroup.com/articles/ux-writing/
- **Mailchimp:** Content Style Guide: https://styleguide.mailchimp.com/
- **Google Developer Documentation Style Guide:** https://developers.google.com/tech-writing
- **Shopify Polaris:** Content: https://polaris.shopify.com/content/content-guidelines
- **Writing for the Web:** A List Apart: https://alistapart.com/article/writing-for-the-web/

---

**Remember:** Good UX writing is invisible. Users should complete tasks without noticing the words.

**Every word serves a purpose. If it doesn't, delete it.**
