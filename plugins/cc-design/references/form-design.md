# Form Design Guide

**Purpose:** Complete guide to designing forms that are easy to understand, quick to complete, and minimize user errors.

**Principle:** Forms are conversations. Design them to be clear, efficient, and respectful of the user's time.

---

## 1. Form Design Fundamentals

### Why Form Design Matters

**Principle:** Forms are often the primary conversion point — sign up, checkout, contact. Poor form design = lost users.

**Impact:**
- **Checkout forms:** 25%+ abandonment rate with poor design
- **Sign-up forms:** First impression of your product
- **Contact forms:** Lead generation quality depends on clarity

**Goal:** Minimize cognitive load, maximize completion rate.

---

## 2. Form Structure & Layout

### Single Column vs Multiple Columns

**Principle:** Single column is almost always better.**

```
✅ Good: Single column
┌─────────────────┐
│ Name            │
├─────────────────┤
│ Email           │
├─────────────────┤
│ Password        │
└─────────────────┘

❌ Bad: Multiple columns
┌──────────┬──────────┐
│ Name     │ Email    │ ← Scanning pattern disrupted
├──────────┴──────────┤
│ Password            │
└─────────────────────┘
```

**Why single column:**
- Follows natural scanning pattern (top to bottom)
- Works better on mobile
- Reduces cognitive load
- Faster completion

**Exception:** Logical grouping of related short fields (e.g., date: MM | DD | YYYY)

### Grouping Related Fields

**Principle:** Group related information with visual separation.**

```
┌─────────────────────────────┐
│ Personal Information        │
├─────────────────────────────┤
│ Name                        │
│ Email                       │
│ Phone                       │
├─────────────────────────────┤
│ Shipping Address            │
├─────────────────────────────┤
│ Street                      │
│ City                        │
│ State         | Zip         │
└─────────────────────────────┘
```

**Benefits:**
- Creates clear sections
- Makes form feel shorter
- Helps users pace themselves

---

## 3. Label Placement

### Labels Above Fields (Recommended)

**Best practice for most forms (2024+ standard).**

```
✅ Good: Labels above
Name
[__________________]

Email
[__________________]
```

**Benefits:**
- Faster scanning (eye moves straight down)
- Works better on mobile (no horizontal space competition)
- Supports longer labels
- Easier to translate (variable label lengths)

**When to use:**
- Most forms (default choice)
- Mobile forms
- Forms with long labels
- International forms

### Labels to the Left of Fields

**Use sparingly.**

```
⚠️ Use with caution: Labels left
Name    [__________________]
Email   [__________________]
```

**Only use when:**
- All labels are short and similar length
- Desktop-only forms
- Vertical space is extremely limited

**Drawbacks:**
- Slower scanning (eye zig-zags)
- Poor mobile experience
- Long labels break layout

### Floating Labels

**Trendy but problematic.**

```
Floating label:
[Name          ] ← Label floats here when focused
[__________________]
```

**Problems:**
- Labels disappear when user types (memory burden)
- Can be confusing (is it a label or placeholder?)
- Accessibility concerns

**Better alternative:** Static labels above fields.

---

## 4. Field Design

### Input Field Sizing

**Principle:** Field size should hint at expected input.**

```
❌ Bad: All fields same size
Zip Code      [__________________________] ← Too long
Phone        [__________________________] ← Too long

✅ Good: Field size matches input
Zip Code      [_____]          ← 5 characters
Phone        [_________]       ← 10 characters
Address      [__________________________] ← Long
```

**Benefits:**
- Visual cue for expected input
- Reduces errors
- Feels more polished

### Placeholder Text

**Principle:** Placeholders are hints, not replacements for labels.**

```
❌ Bad: Placeholder as label
[Enter your email...]  ← Where's the label?

✅ Good: Label + placeholder
Email
[john@example.com]    ← Hint format
```

**Best practices:**
- **Always use labels** (never placeholder-only)
- **Placeholders show format:** john@example.com
- **Don't put critical info in placeholder** (disappears when typing)
- **Don't repeat label in placeholder**

### Required vs Optional Fields

**Principle:** Mark required fields, not optional fields.**

```
✅ Good: Mark required
Name *         [__________________]
Email *        [__________________]
Phone (optional) [__________________]

❌ Bad: Mark optional
Name           [__________________]
Email          [__________________]
Phone (opt.)   [__________________]
```

**Why:**
- Most fields are required
- Reduces visual noise
- Clearer expectations

**Alternative:** No asterisks, just state "All fields required" at top, then mark optional fields.

---

## 5. Form Validation & Error Messages

### Real-Time Validation

**Principle:** Validate immediately after user leaves field (on blur), not on submit.**

```
Timeline:
User types → User tabs away → Validation → Show error (if any)
```

**Benefits:**
- Faster feedback
- Errors fixed in context
- Less frustrating

**What to validate in real-time:**
- Email format
- Phone format
- Password strength
- Required fields

**What to validate on submit:**
- Field dependencies (e.g., password confirmation)
- Server-side validation
- Cross-field validation

### Error Message Design

**Principle:** Errors should be clear, specific, and actionable.**

```
❌ Bad: Generic error
"Invalid input"

❌ Bad: Technical error
"Validation failed: field.email.format"

✅ Good: Specific, actionable
"Email must contain @ symbol (e.g., john@example.com)"
```

**Error message best practices:**
- **Location:** Above field or inline (not popup)
- **Color:** Red + icon (but don't rely on color alone)
- **Text:** What's wrong + how to fix
- **Timing:** Show immediately after validation fails

### Success Messages

**Principle:** Confirm successful actions clearly.**

```
✅ Good: Clear confirmation
"Settings saved successfully"
✓ Your changes have been saved
```

**Best practices:**
- Be specific about what happened
- Use checkmark icon
- Auto-dismiss after 3-5 seconds
- Don't interrupt workflow (no modal for non-critical success)

---

## 6. Multi-Step Forms

### When to Use Multi-Step Forms

**Use when:**
- Form is long (10+ fields)
- Fields fall into logical groups
- User needs to save progress
- Complex decision-making (e.g., configurator)

**Don't use when:**
- Form is short (5-7 fields or fewer)
- All fields are required
- Simple, linear process

### Progress Indicators

**Principle:** Always show progress in multi-step forms.**

```
✅ Good: Step indicator
Step 1 of 3: Account Info
████████████████████░░░░░░  33%

Account Info → Shipping → Review
```

**Best practices:**
- Show total steps (e.g., "Step 2 of 4")
- Show progress bar
- Allow navigation back to previous steps
- Don't show all steps if > 7 (group them)

### Saving Progress

**Principle:** Auto-save progress to prevent frustration.**

```
✅ Good: Auto-save message
"Progress saved automatically"
💾 Your information is saved as you go
```

**When to auto-save:**
- After each step
- After each field (for long forms)
- On blur (for critical data)

---

## 7. Mobile Form Design

### Touch Targets

**Principle:** All interactive elements must be 44×44px minimum.**

```css
input, select, button {
  min-height: 44px;
  min-width: 44px;
}
```

### Input Types

**Use correct HTML5 input types for better mobile keyboards.**

```html
<!-- Brings up numeric keypad -->
<input type="tel" placeholder="Phone number">

<!-- Brings up email keyboard -->
<input type="email" placeholder="Email">

<!-- Brings up number keypad -->
<input type="number" placeholder="Age">

<!-- Date picker (native) -->
<input type="date">
```

### Single Column on Mobile

**Principle:** Always single column on mobile, no exceptions.**

```
Mobile (375px):
┌─────────────┐
│ Name        │
├─────────────┤
│ Email       │
├─────────────┤
│ Password    │
└─────────────┘
```

**Never use multiple columns on mobile.**

---

## 8. Accessibility (A11y)

### Label Association

**Principle:** Every input must have a properly associated label.**

```html
<label for="email">Email</label>
<input type="email" id="email" name="email">
```

**Never use placeholder as label (screen readers ignore placeholders).**

### Error Accessibility

**Principle:** Errors must be announced to screen readers.**

```html
<div role="alert" aria-live="assertive">
  Email must contain @ symbol
</div>
```

### Keyboard Navigation

**Principle:** Entire form must be keyboard accessible.**

```
Tab order: Name → Email → Phone → Submit button
Focus indicators: Visible outline on focused element
```

---

## 9. Common Form Mistakes

### 1. Too Many Fields

**Problem:** Asking for unnecessary information.

**Solution:** Only ask for what you absolutely need. Remove nice-to-have fields.

### 2. Unclear Error Messages

**Problem:** "Invalid input" or "Error 404".

**Solution:** Explain what's wrong and how to fix it.

### 3. Placeholder-Only Labels

**Problem:** No visible label, only placeholder.

**Solution:** Always use visible labels above fields.

### 4. Password Complexity Without Feedback

**Problem:** "Password must be 8+ characters" shown after typing.

**Solution:** Show requirements upfront and check in real-time with strength indicator.

### 5. Hidden Required Fields

**Problem:** User doesn't know what's required until submit.

**Solution:** Mark required fields clearly (* symbol or "All fields required").

### 6. Reset Button

**Problem:** Accidentally clicked, clears entire form.

**Solution:** Don't include reset buttons (they're from 1990s web).

### 7. CAPTCHA on Every Form

**Problem:** Frustrating, especially on mobile.

**Solution:** Only use for high-risk forms (login, payment). Use invisible CAPTCHA.

---

## 10. Form Field Best Practices

### Text Inputs

```
✅ Good:
Full Name
[__________________________]

✅ Good (split):
First Name    [_______________]
Last Name     [_______________]
```

**Rule:** Split only if you need first/last separately. Otherwise, use single field.

### Email

```
✅ Good:
Email Address
[__________________________]
```

**Use type="email" for validation and mobile keyboard.**

### Phone

```
✅ Good:
Phone Number
[__________________________]
```

**Use type="tel" for numeric keypad.** Don't auto-format (let user type how they want).

### Password

```
✅ Good:
Password *     [__________________________]  👁️ Show
Confirm *      [__________________________]

Minimum 8 characters, 1 number, 1 symbol
```

**Best practices:**
- Show requirements upfront
- Real-time strength indicator
- Show/Hide toggle
- Confirmation field (for sign-up)

### Dropdowns (Select)

```
✅ Good:
Country
[United States ▼]  ← Clear default selected
```

**Best practices:**
- Always include a default option (not blank)
- Use for < 10 options
- Use radio buttons for 2-5 options
- Use autocomplete for 10+ options

### Checkboxes

```
✅ Good:
☐ I agree to the Terms of Service
☐ Send me weekly updates (optional)
```

**Best practices:**
- Use for optional selections
- Clear label text
- Adequate click target (44×44px minimum)

### Radio Buttons

```
✅ Good:
Gender
○ Male
○ Female
○ Non-binary
○ Prefer not to say
```

**Best practices:**
- Use for mutually exclusive options (2-5 choices)
- One option pre-selected (usually first or most common)
- Stack vertically (not horizontal)

### Textareas

```
✅ Good:
Message
[____________________________________________]
[____________________________________________]
[____________________________________________]
```

**Best practices:**
- 3-5 rows minimum
- Auto-resize (if possible)
- Character count for limits

---

## 11. Submit Buttons

### Button Placement

**Principle:** Submit button should be at bottom of form, right-aligned (LTR).**

```
┌─────────────────────────────┐
│ Name                        │
│ [__________________________] │
├─────────────────────────────┤
│ Email                       │
│ [__________________________] │
├─────────────────────────────┤
│                             │
│              [Cancel] [Submit] ← Right-aligned
└─────────────────────────────┘
```

### Button Text

**Principle:** Use specific, action-oriented text.**

```
❌ Bad: Generic
"Submit"
"Send"
"Click here"

✅ Good: Specific
"Create Account"
"Reset Password"
"Subscribe to Newsletter"
"Complete Purchase"
```

### Button States

```
Default:  [Submit]        → Clickable
Hover:    [Submit]        → Slight darkening
Focus:    [Submit]        → Outline indicator
Disabled: [Submit]        → Grayed out, not clickable
Loading:  [⏳ Submit...]  → Spinner + wait text
Success:  [✓ Submitted]  → Green checkmark
```

---

## 12. A/B Testing for Forms

### What to Test

**Common A/B tests:**
- Single column vs multi-column
- Labels above vs left
- Required vs optional marking
- Number of fields (ask less)
- Button text (Submit vs Create Account)
- Progress indicators (show vs hide)
- Real-time validation vs on-submit

### Metrics to Track

**Key metrics:**
- **Completion rate:** % who start form and finish
- **Drop-off rate:** % who abandon at each step
- **Error rate:** % of submissions with errors
- **Time to complete:** Average completion time
- **Field-level abandonment:** Which fields cause drop-off

---

## 13. Form Design Checklist

### Planning Phase

- [ ] Define form purpose and required data
- [ ] Identify optional vs required fields
- [ ] Determine single-step vs multi-step
- [ ] Plan field groupings
- [ ] Choose validation strategy

### Design Phase

- [ ] Single column layout
- [ ] Labels above fields
- [ ] Field size matches expected input
- [ ] Clear required/optional indicators
- [ ] Specific, actionable error messages
- [ ] Mobile-first design
- [ ] Accessible labels and error announcements

### Validation Phase

- [ ] Real-time validation (on blur)
- [ ] Clear error messages
- [ ] Success confirmation
- [ ] Server-side validation
- [ ] Error recovery flow

### Testing Phase

- [ ] Test on mobile (375px)
- [ ] Test on tablet (768px)
- [ ] Test on desktop (1440px)
- [ ] Test with screen reader
- [ ] Test keyboard navigation
- [ ] Test with real users

---

## 14. Form Examples

### Sign-Up Form

```
Create Account
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full Name *
[__________________________]

Email Address *
[__________________________]

Password *
[__________________________]  👁️ Show
Must be 8+ characters with 1 number

[✓] I agree to the Terms of Service

                    [Create Account]
        Already have an account? Log in
```

### Checkout Form

```
Shipping Information
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full Name *
[__________________________]

Street Address *
[__________________________]

City *
[__________________________]

State *    [California ▼]   Zip *
[____________]    [____]

                [Continue to Payment]
```

### Contact Form

```
Get in Touch
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name *
[__________________________]

Email *
[__________________________]

Subject *
[__________________________]

Message *
[____________________________________________]
[____________________________________________]
[____________________________________________]

                    [Send Message]
```

---

## Quick Reference

### Label Placement
- **Default:** Labels above fields
- **Exception:** Labels left (only for short labels, desktop-only)

### Field Sizing
- **Short input:** 20-30% width (Zip, Phone)
- **Medium input:** 40-60% width (Name, Email)
- **Long input:** 80-100% width (Address, Message)

### Validation Timing
- **Real-time:** Format validation (email, phone)
- **On submit:** Required fields, cross-field validation

### Error Messages
- **Location:** Above field or inline
- **Content:** What's wrong + how to fix
- **Style:** Red + icon + clear text

### Mobile
- **Always:** Single column
- **Touch targets:** 44×44px minimum
- **Input types:** Use HTML5 types (tel, email, number)

---

**Remember:** Good form design is invisible. Users should complete forms without thinking about the design — just the task.

**Forms are conversations. Make them clear, efficient, and respectful.**
