# Interactive Prototype

> **Load when:** Building a multi-screen interactive prototype with navigation, state, or transitions
> **Skip when:** Single-screen static design, slide deck, or landing page
> **Why it matters:** Multi-screen prototypes need routing, state management, and transition patterns that single-screen templates don't provide
> **Typical failure it prevents:** Hardcoding all screens visible at once, no navigation, broken state on screen switches, no transition feel

## Delivery Format Decision (Ask First)

Multi-screen app prototypes have two standard delivery formats. **Ask the user which one they want** before starting — don't default to one and build blindly.

| Format | When to use | Implementation |
|--------|-------------|----------------|
| **Overview Tiled** (design review default) | User wants to see full picture / compare layouts / review design consistency / multiple screens side-by-side | **All screens tiled side-by-side**, each in its own independent iPhone frame, content complete, no clickability needed |
| **Flow Demo Single-Device** | User wants to demonstrate a specific user flow (e.g., onboarding, purchase funnel) | Single iPhone, embedded `AppPhone` state manager, tab bar / buttons / annotation points all clickable |

### Routing Keywords

- Task contains "tiled / show all pages / overview / take a look / compare / all screens" → **Overview**
- Task contains "demo flow / user path / walk through / clickable / interactive demo" → **Flow demo**
- Not sure? Ask. Don't default to flow demo (it's more work, not all tasks need it)

### Overview Tiled Skeleton

Each screen is an independent IosFrame side-by-side:

```jsx
<div style={{display: 'flex', gap: 32, flexWrap: 'wrap', padding: 48, alignItems: 'flex-start'}}>
  {screens.map(s => (
    <div key={s.id}>
      <div style={{fontSize: 13, color: '#666', marginBottom: 8, fontStyle: 'italic'}}>{s.label}</div>
      <IosFrame>
        <ScreenComponent data={s} />
      </IosFrame>
    </div>
  ))}
</div>
```

### Flow Demo Skeleton

Single clickable state machine:

```jsx
function AppPhone({ initial = 'today' }) {
  const [screen, setScreen] = React.useState(initial);
  const [modal, setModal] = React.useState(null);
  // Render different ScreenComponent based on screen, pass onEnter/onClose/onTabChange/onOpen props
}
```

Screen components receive callback props (`onEnter`, `onClose`, `onTabChange`, `onOpen`, `onAnnotation`), don't hardcode state. TabBar, buttons, artwork cards get `cursor: pointer` + hover feedback.

## Navigation Patterns

Choose based on the app type. Each pattern includes a React + Babel implementation snippet.

### Tab Bar (mobile apps, 3-5 main sections)

```jsx
function TabBar({ tabs, activeTab, onTabChange }) {
  return React.createElement('nav', {
    style: { display: 'flex', justifyContent: 'space-around', padding: '8px 0', borderTop: '1px solid var(--border)' }
  }, tabs.map((tab, i) =>
    React.createElement('button', {
      key: i, onClick: () => onTabChange(i),
      style: { flex: 1, textAlign: 'center', opacity: activeTab === i ? 1 : 0.5, background: 'none', border: 'none', cursor: 'pointer' }
    }, tab.label)
  ));
}

// Usage: state-driven screen switching
const [activeTab, setActiveTab] = React.useState(0);
```

### Sidebar (desktop apps, dashboards, 5+ sections)

```jsx
function Sidebar({ items, active, onSelect }) {
  return React.createElement('aside', {
    style: { width: '240px', height: '100vh', padding: '16px', background: 'var(--surface)', borderRight: '1px solid var(--border)' }
  }, items.map((item, i) =>
    React.createElement('button', {
      key: i, onClick: () => onSelect(i),
      style: { display: 'block', width: '100%', padding: '12px', textAlign: 'left', background: active === i ? 'var(--accent-light)' : 'none', border: 'none', cursor: 'pointer', borderRadius: '6px', marginBottom: '4px' }
    }, item.label)
  ));
}
```

### Wizard / Step flow (forms, onboarding, checkout)

```jsx
function Wizard({ steps, currentStep, onStepChange }) {
  const total = steps.length;
  return React.createElement('div', null,
    React.createElement('div', {
      style: { display: 'flex', gap: '8px', marginBottom: '24px' }
    }, steps.map((s, i) =>
      React.createElement('div', {
        key: i,
        style: { flex: 1, height: '4px', borderRadius: '2px', background: i <= currentStep ? 'var(--accent)' : 'var(--border)' }
      })
    )),
    steps[currentStep],
    React.createElement('div', { style: { display: 'flex', gap: '12px', marginTop: '24px' } },
      currentStep > 0 && React.createElement('button', { onClick: () => onStepChange(currentStep - 1), style: { padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--border)', cursor: 'pointer' } }, 'Back'),
      currentStep < total - 1 && React.createElement('button', { onClick: () => onStepChange(currentStep + 1), style: { padding: '8px 16px', borderRadius: '6px', background: 'var(--accent)', color: 'var(--surface)', border: 'none', cursor: 'pointer' } }, 'Next')
    )
  );
}
```

## State Management

For prototypes, keep state simple. Use these patterns based on complexity:

| Complexity | Pattern | When to use |
|------------|---------|-------------|
| 2-3 screens | `useState` for active screen index | Tab bar, simple nav |
| 5+ screens | `useReducer` with screen + form state | Wizards, multi-step forms |
| URL sync needed | `hash routing` | When back button should work, or sharing specific screen URLs |

### Hash routing snippet

```js
const [screen, setScreen] = React.useState(location.hash.slice(1) || 'home');
React.useEffect(() => {
  const onHash = () => setScreen(location.hash.slice(1) || 'home');
  window.addEventListener('hashchange', onHash);
  return () => window.removeEventListener('hashchange', onHash);
}, []);
// Navigate: location.hash = '#settings'
```

## Transitions

### Page transition (fade + slide)

```jsx
function PageTransition({ children, direction = 'forward' }) {
  return React.createElement('div', {
    style: {
      animation: direction === 'forward' ? 'slideIn 0.3s ease-out' : 'slideBack 0.3s ease-out',
    }
  }, children);
}

// Add to <style>:
// @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
// @keyframes slideBack { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
```

### Micro-interaction (button press feedback)

```css
.interactive:hover { transform: scale(1.02); transition: transform 0.15s ease; }
.interactive:active { transform: scale(0.98); }
```

## Prototype Structure Template

A complete multi-screen prototype follows this pattern:

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>/* CSS variables + animations */</style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    // Navigation component (tab/sidebar/wizard)
    // Screen components (ScreenA, ScreenB, ScreenC)
    // App component with state management
    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>
```