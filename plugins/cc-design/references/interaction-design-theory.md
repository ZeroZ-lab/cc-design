# Interaction Design Theory: Human-Computer Interaction Principles

> **Load when:** Interaction design problems, user flow optimization, feedback mechanism design, error handling
> **Skip when:** Static visual design, no interactive elements, pure layout tasks
> **Why it matters:** Provides scientific foundation for interaction design, ensures usability and efficiency
> **Typical failure it prevents:** Awkward interactions, unclear feedback, high error rates, user frustration

Interaction design theory is the theoretical foundation for cc-design Layer 4 (Interaction Layer). It explains "why interactions work this way", based on human factors, cognitive psychology, and HCI research.

---

## Why Interaction Design Theory Matters

### Common Problems

**Awkward Interactions:**
- Buttons too small to click → users miss targets
- Too many choices → users can't decide
- Unclear affordances → users don't know what's clickable

**Poor Feedback:**
- No response after clicking → users don't know if it worked
- Delayed feedback → users click multiple times
- Ambiguous feedback → users don't understand what happened

**High Error Rates:**
- No confirmation for destructive actions → accidental deletions
- No undo mechanism → users afraid to explore
- Poor error messages → users don't know how to fix

### Value of Interaction Design Theory

1. **Predictability**: Users can predict what will happen
2. **Efficiency**: Minimize time and effort to complete tasks
3. **Error prevention**: Design prevents mistakes before they happen
4. **Learnability**: Users can learn quickly without training

---

## Core Theory 1: Fitts's Law

### Theory Source

**Paul Fitts (1954)** - "The information capacity of the human motor system in controlling the amplitude of movement"

**Core Idea:**
- Time to acquire a target = function of distance and size
- Larger targets are faster to click
- Closer targets are faster to click

### The Formula

```
MT = a + b × log₂(D/W + 1)

Where:
MT = Movement Time
D = Distance to target
W = Width of target
a, b = empirically determined constants
```

**Simplified:** Time increases with distance, decreases with size.

### Key Insights

#### 1. Size Matters

**Principle:** Larger targets are easier to click.

**Examples:**
```
✅ Large button (44×44px): Easy to click
❌ Small button (20×20px): Hard to click, especially on mobile
```

**Application:**
- Primary actions: Large buttons (min 44×44px)
- Secondary actions: Medium buttons (min 32×32px)
- Tertiary actions: Small buttons (min 24×24px)

---

#### 2. Distance Matters

**Principle:** Closer targets are easier to reach.

**Examples:**
```
✅ Context menu near cursor: Fast access
❌ Menu in opposite corner: Slow access
```

**Application:**
- Place related actions close together
- Put frequent actions near starting position
- Use contextual menus near interaction point

---

#### 3. Edges and Corners

**Principle:** Screen edges have infinite width (cursor stops at edge).

**Examples:**
```
✅ macOS menu bar at top edge: Easy to hit
✅ Windows Start button in corner: Easy to hit
❌ Button 10px from edge: Harder to hit
```

**Application:**
- Use screen edges for frequent actions
- Corners are prime real estate (4 edges meet)
- Don't waste edge space

---

### Application to Design

**Button Sizing:**
```css
/* ✅ Fitts's Law compliant */
.primary-button {
  min-width: 120px;
  min-height: 44px; /* WCAG touch target minimum */
  padding: 12px 24px;
}

/* ❌ Too small */
.tiny-button {
  width: 20px;
  height: 20px;
}
```

**Action Placement:**
```
✅ Form layout:
[Input field]
[Submit button] [Cancel button]
↑ Buttons close to last input

❌ Form layout:
[Input field]


[Submit button]
↑ Button far from input, slow to reach
```

**Mobile Considerations:**
```
✅ Bottom navigation: Easy to reach with thumb
❌ Top navigation: Hard to reach on large phones
```

---

## Core Theory 2: Hick's Law

### Theory Source

**William Edmund Hick & Ray Hyman (1952)** - "On the rate of gain of information"

**Core Idea:**
- Decision time increases logarithmically with number of choices
- More options = slower decisions
- Simplify choices to speed up decisions

### The Formula

```
RT = a + b × log₂(n + 1)

Where:
RT = Reaction Time
n = Number of choices
a, b = empirically determined constants
```

**Simplified:** Every doubling of choices adds constant time.

### Key Insights

#### 1. Choice Overload

**Principle:** Too many choices paralyze users.

**Examples:**
```
✅ 3 pricing tiers: Easy to choose
❌ 10 pricing tiers: Analysis paralysis
```

**The Jam Study (Sheena Iyengar, 2000):**
- 24 jam varieties: 3% purchase rate
- 6 jam varieties: 30% purchase rate
- 10× improvement by reducing choices

---

#### 2. Progressive Disclosure

**Principle:** Show only relevant choices at each step.

**Examples:**
```
✅ Multi-step form:
Step 1: Choose category (3 options)
Step 2: Choose subcategory (4 options)
Step 3: Configure details

❌ Single-step form:
All 50 options at once
```

**Application:**
- Break complex tasks into steps
- Show advanced options only when needed
- Use defaults to reduce decisions

---

#### 3. Categorization

**Principle:** Group choices to reduce cognitive load.

**Examples:**
```
✅ Restaurant menu:
- Appetizers (5 items)
- Main courses (8 items)
- Desserts (4 items)

❌ Restaurant menu:
- 17 items in random order
```

**Application:**
- Group related options
- Use clear category labels
- Limit items per category (7±2)

---

### Application to Design

**Navigation Design:**
```
✅ Primary navigation: 5 main items
Each expands to 3-5 sub-items

❌ Primary navigation: 15 items all visible
```

**Form Design:**
```
✅ Checkout flow:
1. Shipping info (4 fields)
2. Payment info (4 fields)
3. Review & confirm

❌ Checkout form:
All 20 fields on one page
```

**Settings Design:**
```
✅ Settings:
- 6 main categories
- Click to expand options

❌ Settings:
- 50 options in one long list
```

---

## Core Theory 3: Feedback Psychology

### Theory Source

**B.F. Skinner (1938)** - Operant conditioning
**Don Norman (1988)** - "The Design of Everyday Things"

**Core Idea:**
- Users need feedback to know their actions worked
- Immediate feedback reduces anxiety
- Clear feedback builds confidence

### Types of Feedback

#### 1. Immediate Feedback

**Principle:** Respond within 100ms for perceived instant response.

**Timing Guidelines:**
- **0-100ms**: Instant (feels like direct manipulation)
- **100-300ms**: Slight delay (still feels responsive)
- **300-1000ms**: Noticeable delay (needs loading indicator)
- **1000ms+**: Slow (needs progress indicator)

**Examples:**
```
✅ Button click:
- Visual change within 100ms (pressed state)
- Action completes within 300ms

❌ Button click:
- No visual change
- 2-second delay with no indicator
```

---

#### 2. Visual Feedback

**Principle:** Show state changes visually.

**Examples:**
```
✅ Button states:
- Default: Blue background
- Hover: Darker blue
- Active: Even darker blue
- Disabled: Gray background

❌ Button states:
- All states look the same
```

**Application:**
```css
/* ✅ Clear visual feedback */
.button {
  background: #0066cc;
  transition: all 0.15s ease;
}

.button:hover {
  background: #0052a3;
  transform: translateY(-1px);
}

.button:active {
  background: #003d7a;
  transform: translateY(0);
}

.button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}
```

---

#### 3. Auditory Feedback

**Principle:** Sound reinforces visual feedback.

**Examples:**
```
✅ Appropriate sounds:
- Subtle click for button press
- Chime for success
- Alert sound for error

❌ Inappropriate sounds:
- Loud sounds for every action
- Annoying repetitive sounds
- No option to disable
```

**Guidelines:**
- Keep sounds subtle (< 1 second)
- Match sound to action (success = pleasant, error = alert)
- Always provide visual alternative (accessibility)
- Allow users to disable sounds

---

#### 4. Haptic Feedback

**Principle:** Physical feedback on touch devices.

**Examples:**
```
✅ Haptic feedback:
- Light tap for button press
- Stronger tap for important action
- Vibration for error

❌ Haptic feedback:
- Strong vibration for every tap
- No haptic feedback at all
```

**Application:**
```javascript
// ✅ Subtle haptic feedback
button.addEventListener('click', () => {
  if (navigator.vibrate) {
    navigator.vibrate(10); // 10ms light tap
  }
});
```

---

### Application to Design

**Loading States:**
```
✅ Multi-stage feedback:
1. Immediate: Button shows loading spinner (0ms)
2. Short wait: Spinner continues (< 3s)
3. Long wait: Progress bar + estimated time (> 3s)

❌ No feedback:
- Button does nothing
- User clicks multiple times
```

**Form Validation:**
```
✅ Real-time validation:
- Inline error messages
- Green checkmark for valid fields
- Clear error descriptions

❌ Delayed validation:
- No feedback until submit
- Generic error message
- User doesn't know what's wrong
```

**Success Confirmation:**
```
✅ Clear confirmation:
- Success message
- Visual change (checkmark)
- Optional: Redirect after 2s

❌ Unclear confirmation:
- No message
- User unsure if action worked
```

---

## Core Theory 4: Affordance Theory

### Theory Source

**James J. Gibson (1977)** - "The theory of affordances"
**Don Norman (1988)** - Applied to design

**Core Idea:**
- Affordance = what an object suggests you can do with it
- Good design makes affordances obvious
- Users shouldn't need instructions

### Types of Affordances

#### 1. Perceived Affordance

**Definition:** What users think they can do.

**Examples:**
```
✅ Clear affordances:
- Button looks clickable (raised, shadowed)
- Link is underlined and colored
- Slider has a draggable handle

❌ Unclear affordances:
- Flat text that's actually a button
- Clickable image with no indication
- Draggable element that looks static
```

---

#### 2. Signifiers

**Definition:** Visual cues that indicate affordances.

**Examples:**
```
✅ Good signifiers:
- Underline for links
- Pointer cursor for clickable elements
- Drag handle icon for draggable items
- Chevron for expandable sections

❌ Poor signifiers:
- No visual distinction for interactive elements
- Cursor doesn't change
- No indication of interactivity
```

**Application:**
```css
/* ✅ Clear signifiers */
.clickable {
  cursor: pointer;
  text-decoration: underline;
  color: #0066cc;
}

.draggable {
  cursor: grab;
}

.draggable:active {
  cursor: grabbing;
}

/* ❌ No signifiers */
.clickable {
  /* Looks like regular text */
}
```

---

#### 3. Constraints

**Definition:** Limiting possible actions to prevent errors.

**Types:**
1. **Physical constraints**: Can't do it physically
2. **Semantic constraints**: Meaning prevents it
3. **Cultural constraints**: Convention prevents it
4. **Logical constraints**: Logic prevents it

**Examples:**
```
✅ Good constraints:
- Disabled submit button until form is valid
- Date picker prevents invalid dates
- Drag-and-drop only accepts valid file types

❌ Poor constraints:
- Can submit invalid form
- Can enter invalid data
- No prevention of errors
```

---

### Application to Design

**Button Design:**
```css
/* ✅ Clear affordance */
.button {
  background: #0066cc;
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.15s ease;
}

.button:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  transform: translateY(-1px);
}

/* ❌ Unclear affordance */
.button {
  background: transparent;
  border: none;
  /* Looks like text */
}
```

**Link Design:**
```css
/* ✅ Clear link affordance */
a {
  color: #0066cc;
  text-decoration: underline;
  cursor: pointer;
}

a:hover {
  color: #0052a3;
}

/* ❌ Unclear link affordance */
a {
  color: inherit;
  text-decoration: none;
  /* Looks like regular text */
}
```

**Form Constraints:**
```html
<!-- ✅ Good constraints -->
<input 
  type="email" 
  required 
  pattern="[^@]+@[^@]+\.[^@]+"
  aria-describedby="email-error"
>

<!-- ❌ No constraints -->
<input type="text">
```

---

## Core Theory 5: Error Prevention & Recovery

### Theory Source

**Don Norman (1988)** - "The Design of Everyday Things"
**Jakob Nielsen (1994)** - Usability heuristics

**Core Idea:**
- Prevent errors before they happen
- Make errors easy to recover from
- Never blame the user

### Error Prevention Strategies

#### 1. Constraints

**Principle:** Make it impossible to make errors.

**Examples:**
```
✅ Prevention:
- Date picker (can't enter invalid date)
- Dropdown (can't enter invalid option)
- Disabled button (can't submit invalid form)

❌ No prevention:
- Free text input for date
- No validation
- Can submit anything
```

---

#### 2. Confirmation

**Principle:** Ask before destructive actions.

**Examples:**
```
✅ Confirmation dialog:
"Delete this item?"
[Cancel] [Delete]

❌ No confirmation:
Click delete → item gone forever
```

**Guidelines:**
- Confirm only for destructive actions
- Make consequences clear
- Provide undo option when possible

---

#### 3. Undo Mechanism

**Principle:** Allow users to reverse actions.

**Examples:**
```
✅ Undo options:
- Gmail: "Undo send" (5-second window)
- Trash/Archive instead of delete
- Version history for documents

❌ No undo:
- Immediate permanent deletion
- No way to recover
```

---

### Error Recovery Strategies

#### 1. Clear Error Messages

**Principle:** Tell users what went wrong and how to fix it.

**Examples:**
```
✅ Good error message:
"Email address is invalid. Please use format: name@example.com"

❌ Poor error message:
"Error 422"
```

**Guidelines:**
- Explain what went wrong
- Explain how to fix it
- Use plain language
- Show error near the problem

---

#### 2. Inline Validation

**Principle:** Validate as users type, not just on submit.

**Examples:**
```
✅ Inline validation:
[Email: user@example.com] ✓
[Password: ••••••••] ✗ Must be at least 8 characters

❌ Submit-only validation:
User fills entire form → clicks submit → sees errors
```

**Application:**
```javascript
// ✅ Real-time validation
input.addEventListener('input', (e) => {
  const isValid = validateEmail(e.target.value);
  showValidationFeedback(isValid);
});

// ❌ Submit-only validation
form.addEventListener('submit', (e) => {
  // Too late, user already invested time
});
```

---

#### 3. Error Recovery Assistance

**Principle:** Help users fix errors.

**Examples:**
```
✅ Recovery assistance:
- Suggest corrections ("Did you mean: user@gmail.com?")
- Highlight the problem field
- Provide examples of valid input

❌ No assistance:
- Just say "invalid"
- Don't explain what's wrong
```

---

### Application to Design

**Form Validation:**
```html
<!-- ✅ Good error handling -->
<div class="form-group">
  <label for="email">Email</label>
  <input 
    type="email" 
    id="email"
    aria-invalid="true"
    aria-describedby="email-error"
  >
  <span id="email-error" class="error">
    Please enter a valid email address (e.g., name@example.com)
  </span>
</div>

<!-- ❌ Poor error handling -->
<input type="text">
<span class="error">Invalid</span>
```

**Destructive Actions:**
```javascript
// ✅ Confirmation + undo
async function deleteItem(id) {
  // 1. Confirm
  const confirmed = await showConfirmDialog(
    'Delete this item?',
    'This action can be undone within 30 days.'
  );
  
  if (!confirmed) return;
  
  // 2. Soft delete
  await softDelete(id);
  
  // 3. Show undo option
  showToast('Item deleted', {
    action: 'Undo',
    onAction: () => restore(id)
  });
}

// ❌ No confirmation or undo
function deleteItem(id) {
  hardDelete(id);
}
```

---

## Application to cc-design

### Interaction Checklist

Before delivery, verify:

#### Fitts's Law
- [ ] Touch targets ≥ 44×44px (WCAG minimum)
- [ ] Primary actions are large and prominent
- [ ] Related actions are close together
- [ ] Frequent actions are easy to reach

#### Hick's Law
- [ ] No more than 7 choices at once
- [ ] Complex tasks broken into steps
- [ ] Advanced options hidden by default
- [ ] Clear categorization of options

#### Feedback
- [ ] All interactions have immediate feedback (< 100ms)
- [ ] Loading states for operations > 300ms
- [ ] Success/error messages are clear
- [ ] Visual state changes are obvious

#### Affordance
- [ ] Interactive elements look clickable
- [ ] Cursor changes on hover
- [ ] Links are underlined or clearly styled
- [ ] Disabled states are visually distinct

#### Error Prevention
- [ ] Destructive actions require confirmation
- [ ] Form validation is inline
- [ ] Invalid inputs are prevented when possible
- [ ] Undo mechanism for important actions

---

## Relationship to Other Documents

- **design-thinking-framework.md**: Interaction design is Layer 4
- **interactive-prototype.md**: Practical implementation guide
- **animation-best-practices.md**: Feedback through motion
- **anti-patterns/interaction.md**: Common interaction mistakes
- **design-excellence.md**: Interaction quality standards

---

## References

### Core Theory
1. **Fitts, P. M.** (1954). "The information capacity of the human motor system in controlling the amplitude of movement"
2. **Hick, W. E.** (1952). "On the rate of gain of information"
3. **Hyman, R.** (1953). "Stimulus information as a determinant of reaction time"
4. **Gibson, J. J.** (1977). "The theory of affordances"
5. **Norman, D. A.** (1988). "The Design of Everyday Things"

### HCI Research
6. **Card, S. K., Moran, T. P., & Newell, A.** (1983). "The Psychology of Human-Computer Interaction"
7. **Nielsen, J.** (1994). "Usability Engineering"
8. **Shneiderman, B.** (1983). "Direct Manipulation: A Step Beyond Programming Languages"

### Interaction Design
9. **Cooper, A., Reimann, R., & Cronin, D.** (2007). "About Face 3: The Essentials of Interaction Design"
10. **Saffer, D.** (2009). "Designing Gestural Interfaces"

---

## Remember

1. **Fitts's Law**: Larger and closer targets are faster to acquire
2. **Hick's Law**: More choices = slower decisions
3. **Feedback**: Immediate feedback (< 100ms) reduces anxiety
4. **Affordance**: Design should show what's possible
5. **Error Prevention**: Prevent errors before they happen, make recovery easy

**Good interaction design is invisible — users don't think about it, they just use it.**
