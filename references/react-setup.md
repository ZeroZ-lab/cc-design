# React + Babel Project Specifications

Technical specifications that must be followed when prototyping with HTML+React+Babel. Non-compliance will break things.

## Pinned Script Tags (Must Use These Versions)

Place these three script tags in the HTML `<head>`, using **pinned versions + integrity hash**:

```html
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>
```

**Don't** use unpinned versions like `react@18` or `react@latest` — this causes version drift/caching issues.

**Don't** omit `integrity` — this is your defense if the CDN gets hijacked or tampered with.

## File Structure

```
project-name/
├── index.html               # Main HTML
├── components.jsx           # Component file (loaded with type="text/babel")
├── data.js                  # Data file
└── styles.css               # Additional CSS (optional)
```

Loading approach in HTML:

```html
<!-- First React+Babel -->
<script src="https://unpkg.com/react@18.3.1/..."></script>
<script src="https://unpkg.com/react-dom@18.3.1/..."></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/..."></script>

<!-- Then your component files -->
<script type="text/babel" src="components.jsx"></script>
<script type="text/babel" src="pages.jsx"></script>

<!-- Finally main entry point -->
<script type="text/babel">
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App />);
</script>
```

**Don't** use `type="module"` — it conflicts with Babel.

## Three Non-Negotiable Rules

### Rule 1: styles Objects Must Use Unique Naming

**Wrong** (will break with multiple components):
```jsx
// components.jsx
const styles = { button: {...}, card: {...} };

// pages.jsx  ← Same name overwrites!
const styles = { container: {...}, header: {...} };
```

**Correct**: Each component file's styles uses a unique prefix.

```jsx
// terminal.jsx
const terminalStyles = { 
  screen: {...}, 
  line: {...} 
};

// sidebar.jsx
const sidebarStyles = { 
  container: {...}, 
  item: {...} 
};
```

**Or use inline styles** (recommended for small components):
```jsx
<div style={{ padding: 16, background: '#111' }}>...</div>
```

This is **non-negotiable**. Every time you write `const styles = {...}` you must replace it with specific naming, otherwise multi-component loading will cause full-stack errors.

### Rule 2: Scope Is Not Shared, Manual Export Required

**Key understanding**: Each `<script type="text/babel">` is compiled independently by Babel, they **don't share scope**. The `Terminal` component defined in `components.jsx` is **undefined by default** in `pages.jsx`.

**Solution**: At the end of each component file, export shared components/utilities to `window`:

```jsx
// components.jsx end
function Terminal(props) { ... }
function Line(props) { ... }
const colors = { green: '#...', red: '#...' };

Object.assign(window, {
  Terminal, Line, colors,
  // List everything you want to use elsewhere
});
```

Then `pages.jsx` can directly use `<Terminal />`, because JSX will look for `window.Terminal`.

### Rule 3: Don't Use scrollIntoView

`scrollIntoView` pushes the entire HTML container upward, breaking the web harness layout. **Never use it**.

Alternative approach:
```js
// Scroll to a position within the container
container.scrollTop = targetElement.offsetTop;

// Or use element.scrollTo
container.scrollTo({
  top: targetElement.offsetTop - 100,
  behavior: 'smooth'
});
```

## Calling Claude API (Within HTML)

Some native design-agent environments (like Claude.ai Artifacts) have zero-config `window.claude.complete`, but most agent environments (Claude Code / Codex / Cursor / Trae / etc.) locally **don't have it**.

If your HTML prototype needs to call an LLM for demo purposes (like building a chat interface), two options:

### Option A: Don't Actually Call, Use Mock

Recommended for demo scenarios. Write a fake helper that returns preset responses:
```jsx
window.claude = {
  async complete(prompt) {
    await new Promise(r => setTimeout(r, 800)); // Simulate delay
    return "This is a mock response. Replace with real API when deploying.";
  }
};
```

### Option B: Actually Call Anthropic API

Requires API key, users must fill in their own key in the HTML to run. **Never hardcode keys in HTML**.

```html
<input id="api-key" placeholder="Paste your Anthropic API key" />
<script>
window.claude = {
  async complete(prompt) {
    const key = document.getElementById('api-key').value;
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: '[REDACTED]',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await res.json();
    return data.content[0].text;
  }
};
</script>
```

**Note**: Calling Anthropic API directly from browser will encounter CORS issues. If the user's preview environment doesn't support CORS bypass, this route won't work. In that case use Option A mock, or tell the user they need a proxy backend.

### Option C: Use Agent-Side LLM Capability to Generate Mock Data

If it's just for local demonstration, you can temporarily call the agent's LLM capability in the current agent session (or the user's installed multi-model skill) to generate mock response data first, then hardcode it into the HTML. This way the HTML runtime doesn't depend on any API at all.

## Typical HTML Starter Template

Copy this template as the skeleton for React prototypes:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Prototype Name</title>

  <!-- React + Babel pinned -->
  <script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>

  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #f5f5f5;
    }
    #root { min-height: 100vh; }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    function App() {
      return (
        <div style={{ padding: 40 }}>
          <h1>Hello React + Babel</h1>
          <p>Start building your prototype here.</p>
        </div>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>
```

## Common Errors & Debugging

**Blank page, no error in console**
→ JSX syntax error, but Babel didn't report it in console. Temporarily replace `babel.min.js` with `babel.js` uncompressed version for clearer error messages.

**ReactDOM.createRoot is not a function**
→ Wrong version. Confirm you're using react-dom@18.3.1 (not 17 or others).

**`Objects are not valid as a React child`**
→ You rendered an object instead of JSX/string. Usually wrote `{someObj}` instead of `{someObj.name}`.

## How to Split Large Projects

**Single files >1000 lines** are hard to maintain. Splitting approach:

```
project/
├── index.html
├── src/
│   ├── primitives.jsx      # Basic elements: Button, Card, Badge...
│   ├── components.jsx      # Business components: UserCard, PostList...
│   ├── pages/
│   │   ├── home.jsx        # Home page
│   │   ├── detail.jsx      # Detail page
│   │   └── settings.jsx    # Settings page
│   ├── router.jsx          # Simple routing (React state switching)
│   └── app.jsx             # Entry component
└── data.js                 # mock data
```

Load in order in HTML:
```html
<script type="text/babel" src="src/primitives.jsx"></script>
<script type="text/babel" src="src/components.jsx"></script>
<script type="text/babel" src="src/pages/home.jsx"></script>
<script type="text/babel" src="src/pages/detail.jsx"></script>
<script type="text/babel" src="src/pages/settings.jsx"></script>
<script type="text/babel" src="src/router.jsx"></script>
<script type="text/babel" src="src/app.jsx"></script>
```

**At the end of each file** you must `Object.assign(window, {...})` to export shared items.
