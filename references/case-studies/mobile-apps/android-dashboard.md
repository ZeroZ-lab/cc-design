# Android Dashboard (Material Design 3)

## Overview
- **Type:** Mobile app (Analytics / Monitoring dashboard)
- **Style:** Information-dense + Functional
- **Primary color:** Dynamic color seed (e.g. `oklch(0.55 0.15 260)`) via Material You
- **Typography:** Roboto Flex / system sans-serif (weight 400-700)

## Why It Works

1. **Layered density** — KPI cards, charts, and lists coexist without chaos because each layer has its own elevation, shape, and color token.
2. **Touch-first sizing** — Every interactive element meets the 48 dp minimum. Dense data does not mean tiny taps.
3. **Status color coding** — Green / yellow / red indicators convey health at a glance, under one second.
4. **Progressive disclosure** — Filters in the top app bar, more charts on swipe, FAB for the primary action.

## Design Techniques

### Visual Hierarchy
- **KPI headline:** 28-32 dp, bold, dynamic primary color
- **KPI label:** 12-14 dp, medium weight, `on-surface-variant`
- **Chart area:** Elevated surface (2 dp elevation, 16 dp corners)
- **List item:** 16 dp body on `surface-container` background

### Color Usage
- **Surface layers:** `surface-container-lowest` through `surface-container-highest` create depth without shadows
- **Status:** `error` (red), `tertiary` (amber), `primary` (green) for health
- **Dynamic color:** All tokens derive from one seed; hard-coded hex breaks the system
- **Charts:** Use only `primary`, `secondary`, `tertiary` palette slots

### Typography
- **Font:** Roboto Flex with optical sizing
- **Scale:** `displaySmall` for KPI, `titleMedium` for cards, `bodyMedium` for lists
- **Weight:** 400 body / 500 labels / 600 card titles / 700 KPI numbers

### Whitespace / Spacing
- **KPI card gap:** 12 dp in a 2-column grid
- **Section breaks:** 24 dp vertical
- **List items:** 56-72 dp height (two-line text + touch comfort)
- **Card padding:** 16 dp internal

### Interaction Patterns
- **Top app bar:** Search + filter chips, collapses on scroll
- **Material tabs:** Day / week / month chart views
- **FAB:** Primary action bottom-right; **Bottom navigation:** 4 destinations
- **Pull-to-refresh** and **Snackbar** for action feedback

## Reusable Patterns

### Pattern 1: KPI Card Grid

```css
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 0 16px 16px;
}

.kpi-card {
  padding: 16px;
  border-radius: 16px;
  background: oklch(0.97 0.01 260);
  min-height: 120px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.kpi-card .value {
  font-size: 28px;
  font-weight: 700;
  color: oklch(0.15 0.02 260);
}

.status-dot { width: 8px; height: 8px; border-radius: 50%; }
.status-dot.green  { background: oklch(0.65 0.20 145); }
.status-dot.yellow { background: oklch(0.78 0.16 85); }
.status-dot.red    { background: oklch(0.60 0.20 25); }

.delta-badge.up {
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  color: oklch(0.35 0.15 145);
  background: oklch(0.93 0.06 145);
}
```

**When to use:** Dashboards that surface 4+ key metrics above the fold.

### Pattern 2: Status-Aware List Item

```css
.status-item {
  display: flex; align-items: center;
  gap: 16px; padding: 14px 16px; min-height: 56px;
}

.status-icon {
  width: 40px; height: 40px; border-radius: 20px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.status-icon.ok   { background: oklch(0.93 0.06 145); color: oklch(0.35 0.15 145); }
.status-icon.warn { background: oklch(0.94 0.06 85);  color: oklch(0.55 0.15 85); }
.status-icon.err  { background: oklch(0.93 0.06 25);  color: oklch(0.45 0.18 25); }
```

**When to use:** Device lists, alert feeds, or data tables needing inline health indicators.

## Key Code Snippets

### Chart Section with Material Tabs

```css
.chart-section {
  margin: 16px;
  padding: 16px;
  border-radius: 16px;
  background: oklch(0.97 0.01 260);
}

.chart-tabs {
  display: flex; gap: 4px; padding: 4px;
  background: oklch(0.92 0.01 260);
  border-radius: 10px;
  width: fit-content;
  margin-bottom: 16px;
}

.chart-tab {
  padding: 10px 20px;
  font-size: 13px; font-weight: 500;
  border-radius: 8px; border: none;
  background: transparent;
  color: oklch(0.45 0.02 260);
  min-height: 48px; cursor: pointer;
}

.chart-tab.active {
  background: oklch(0.99 0 0);
  color: oklch(0.15 0.02 260);
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}
```

### FAB + Bottom Navigation

```css
.fab {
  position: fixed; bottom: 80px; right: 16px;
  width: 56px; height: 56px; border-radius: 16px; border: none;
  background: oklch(0.55 0.15 260); color: white; font-size: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 21;
}

.bottom-nav {
  position: fixed; bottom: 0; left: 0; right: 0;
  display: flex; justify-content: space-around;
  padding: 8px 0 12px;
  background: oklch(0.99 0 0);
  border-top: 1px solid oklch(0.91 0.01 260);
  z-index: 20;
}

.nav-item {
  display: flex; flex-direction: column;
  align-items: center; gap: 4px;
  min-width: 48px; min-height: 48px;
}

.dashboard-content { padding-bottom: 80px; }
```

## When to Use This Approach

**Perfect for:** Analytics dashboards on Android, IoT device management, DevOps companion apps, any touch-first interface surfacing 4+ data categories, Android 12+ Material You apps.

**Not ideal for:** Simple utilities, content consumption apps, iOS-first products, very small screens under 360 dp without responsive adaptation.
