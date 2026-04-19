# Tweaks System

Tweaks let the user toggle in-page controls to adjust design aspects — colors, fonts, spacing, copy, layout variants, etc. You design the Tweaks UI; it lives inside the prototype as a self-contained panel.

## Implementation

The tweaks system is a pure in-page toggle — no parent frame communication needed.

### 1. Floating toggle button

Add a fixed-position button in the bottom-right corner that shows/hides the tweaks panel:

```html
<style>
  #tweaks-toggle {
    position: fixed; bottom: 20px; right: 20px; z-index: 9999;
    width: 44px; height: 44px; border-radius: 50%;
    background: #1a1a1a; color: #fff; border: none;
    font-size: 20px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    display: flex; align-items: center; justify-content: center;
  }
  #tweaks-panel {
    position: fixed; bottom: 74px; right: 20px; z-index: 9998;
    width: 280px; max-height: 60vh; overflow-y: auto;
    background: #1a1a1a; color: #e0e0e0; border-radius: 12px;
    padding: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.4);
    display: none; font-family: system-ui, sans-serif; font-size: 13px;
  }
  #tweaks-panel.visible { display: block; }
  #tweaks-panel label { display: block; margin-bottom: 10px; }
  #tweaks-panel input[type="color"] { width: 40px; height: 28px; border: none; cursor: pointer; }
  #tweaks-panel input[type="range"] { width: 100%; }
  #tweaks-panel select { width: 100%; padding: 4px; }
</style>

<button id="tweaks-toggle" title="Tweaks">⚙</button>
<div id="tweaks-panel">
  <h3 style="margin:0 0 12px; font-size:14px; color:#fff;">Tweaks</h3>
  <!-- Add your tweak controls here -->
</div>
```

### 2. Toggle logic

```js
const toggle = document.getElementById('tweaks-toggle');
const panel = document.getElementById('tweaks-panel');

// Restore visibility from localStorage
const tweaksVisible = localStorage.getItem('cc-tweaks-visible') === 'true';
if (tweaksVisible) panel.classList.add('visible');

toggle.addEventListener('click', () => {
  panel.classList.toggle('visible');
  localStorage.setItem('cc-tweaks-visible', panel.classList.contains('visible'));
});
```

### 3. Default values with persistence

Wrap tweakable defaults in comment markers for easy editing:

```js
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primaryColor": "#D97757",
  "fontSize": 16,
  "dark": false
}/*EDITMODE-END*/;

// Load from localStorage or use defaults
const tweaks = { ...TWEAK_DEFAULTS, ...JSON.parse(localStorage.getItem('cc-tweaks') || '{}') };

function applyTweaks() {
  document.documentElement.style.setProperty('--primary', tweaks.primaryColor);
  document.documentElement.style.setProperty('--font-size', tweaks.fontSize + 'px');
  // Apply other tweaks...
  localStorage.setItem('cc-tweaks', JSON.stringify(tweaks));
}

applyTweaks();
```

The block between `EDITMODE-BEGIN` and `EDITMODE-END` markers **must be valid JSON** (double-quoted keys and strings). The skill uses these markers to find and update default values via the `Edit` tool.

## Tips

- Keep the Tweaks surface small — a compact floating panel
- Hide controls entirely when Tweaks is off; the design should look final
- If the user asks for multiple variants of a single element, use tweaks to cycle through options
- Even if the user doesn't ask for tweaks, add a couple by default — expose interesting possibilities
- Title your panel **"Tweaks"** so the naming is consistent
