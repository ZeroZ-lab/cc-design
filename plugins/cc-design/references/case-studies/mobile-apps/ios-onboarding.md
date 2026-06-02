# iOS Onboarding Flow

## Overview
- **Type:** Mobile app (Onboarding screens)
- **Style:** Professional + Excitement
- **Primary color:** System blue or brand color
- **Typography:** SF Pro (iOS system font)

## Why It Works

1. **Progressive disclosure** — Shows one feature per screen. No overwhelming information dumps.
2. **Visual + text balance** — Large illustration/icon (60% of screen), concise text (40%).
3. **Clear progress indicator** — Dots or progress bar shows "3 of 5" so users know how long this takes.
4. **Skip option** — Always provide a way to skip onboarding. Respect user time.

## Key Patterns

### Onboarding Screen Structure
```css
.onboarding-screen {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 60px 32px 40px;
  background: white;
}

.onboarding-visual {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
}

.onboarding-visual img {
  max-width: 280px;
  max-height: 280px;
}

.onboarding-content {
  text-align: center;
}

.onboarding-content h1 {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 12px;
  color: #000;
}

.onboarding-content p {
  font-size: 17px;
  line-height: 1.5;
  color: #666;
  margin-bottom: 32px;
}

.progress-dots {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 24px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ddd;
}

.dot.active {
  background: #007AFF;
}

.btn-primary {
  width: 100%;
  padding: 16px;
  font-size: 17px;
  font-weight: 600;
  color: white;
  background: #007AFF;
  border: none;
  border-radius: 12px;
  margin-bottom: 12px;
}

.btn-skip {
  width: 100%;
  padding: 16px;
  font-size: 17px;
  font-weight: 400;
  color: #007AFF;
  background: transparent;
  border: none;
}
```

## iOS Design Guidelines

- **Touch targets:** Minimum 44x44pt
- **Safe areas:** Respect top notch and bottom home indicator
- **Typography:** SF Pro Text (body), SF Pro Display (large text)
- **Corner radius:** 12-16pt for buttons, 8-12pt for cards
- **Shadows:** Subtle, iOS uses light shadows (0 2px 8px rgba(0,0,0,0.1))

## When to Use
First-time user experience, feature announcements, permission requests.

## Key Takeaway
Mobile onboarding should be fast (3-5 screens max), visual (show don't tell), and skippable (respect user agency).
